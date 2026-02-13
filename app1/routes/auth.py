import json
import uuid
import redis
from fastapi import APIRouter, Response, Request
from kafka import KafkaProducer
from jose import jwt

from settings import settings
from db import findOne
from models import EmailModel, CodeModel
from utils import set_token

router = APIRouter(tags=["Auth"])

# Kafka 설정
pd = KafkaProducer(
  bootstrap_servers=settings.kafka_server,
  value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

# Redis 설정
client = redis.Redis(
  host=settings.redis_host,
  port=settings.redis_port,
  db=settings.redis_db,
  decode_responses=True
)

@router.post("/login")
def producer(model: EmailModel):
  sql = f"SELECT `no`, `name` FROM test.user WHERE `email` = '{model.email}' and `delYn` = 0"
  data = findOne(sql)
  if data :
    pd.send(settings.kafka_topic, dict(model))
    pd.flush()
    return {"status": True, "msg": "이메일의 인증코드를 확인해주세요."}
  else: 
    return {"status": False, "msg": "이메일을 확인해주세요."}
  
@router.post("/code")
def code(model: CodeModel, response: Response):
  result = client.get(model.code)
  if result:
    data = set_token(result)
    if data:
      client.delete(model.code) # model에 있는 데이터 삭제
      id = uuid.uuid4().hex
      client.setex(id, 60*30, data["token"])
      response.set_cookie(
        key="user",
        value=id,
        max_age=1800,        
        expires=1800,        
        path="/",
        secure=False,
        httponly=True,
        samesite="lax",
      )
      return {"status": True, "msg": f"{data["name"]}님 환영합니다."}
  return {"status": False,"msg":"이메일 코드를 확인해주세요."}

@router.post("/me")
def me(request : Request):
  id = request.cookies.get("user") # id값은 uuid
  if id :
    token = client.get(id)
    data = jwt.decode(token,settings.secret_key,algorithms=settings.algorithm)
    sql = f'''
            SELECT  u.`no`, u.`name`, u.`email`, u.`gender`, u.`delYn`,
            DATE_FORMAT(u.regDate, '%Y-%m-%d') as regDate, 
            DATE_FORMAT(u.modDate, '%Y-%m-%d %H:%i:%s') as modDate,
            ifnull(u.profileNo, 0) AS profileNo
            FROM `test`.user AS u
            where u.`no` = '{data["sub"]}'
            and u.`delYn` = 0;
    '''
    userInfo = findOne(sql)
    return {"status": True, "user" : userInfo}
  return {"status": False, "msg" : "로그인을 확인해주세요."}

@router.post("/logout")
def logout(response: Response, request: Request):
    id = request.cookies.get("user")
    client.delete(id)
    response.delete_cookie(
        key="user",
        path="/",
        secure=False,  
        httponly=True,
        samesite="lax",
    )
    return {"status": True, "msg": "로그아웃 완료"}