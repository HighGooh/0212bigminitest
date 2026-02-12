from fastapi import FastAPI, Depends, HTTPException, status, Response, Request
from kafka import KafkaProducer
from settings import settings
from pydantic import EmailStr, BaseModel
import json
import redis
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError, ExpiredSignatureError
from db import findOne, findAll, save, add_key
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import uuid
from pathlib import Path

# security = HTTPBearer()

class EmailModel(BaseModel):
  email: str

class CodeModel(BaseModel):
  code: str


def set_token(email: str):
  try:
    sql = f"SELECT `no`, `name` FROM test.user WHERE `email` = '{email}' and `delYn` = 0"
    data = findOne(sql)
    if data:
      iat = datetime.now(timezone.utc)
      exp = iat + (timedelta(minutes=settings.access_token_expire_minutes))
      data = {
        "name": data["name"],
        "iss": "EDU",
        "sub": str(data["no"]),
        "iat": iat,
        "exp": exp
      }
      return { "token": jwt.encode(data, settings.secret_key, algorithm=settings.algorithm), "name": data["name"]}
  except JWTError as e:
    print(f"JWT ERROR : {e}")
  return None

# def get_payload(credentials: HTTPAuthorizationCredentials = Depends(security)):
#   if credentials.scheme == "Bearer":
#     try:
#       payload = jwt.decode(credentials.credentials, settings.secret_key, algorithms=settings.algorithm)
#       exp = payload.get("exp")

#       now = datetime.now(timezone.utc).timestamp()
#       minutes, remaining_seconds = divmod(int(exp - now), 60)
#       return payload
#     except ExpiredSignatureError as e:
#       raise HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Token expired",
#       )
#     except JWTError as e:
#       raise HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Invalid token",
#       )
#   return None

app = FastAPI(title="Producer")

kafka_server=settings.kafka_server
kafka_topic=settings.kafka_topic

pd = KafkaProducer(
  bootstrap_servers=kafka_server,
  value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

client = redis.Redis(
  host=settings.redis_host,
  port=settings.redis_port,
  db=settings.redis_db,
  decode_responses=True
)

origins = [ "http://localhost","http://localhost:5173" ]

UPLOAD_DIR = Path("uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
  return {"Hello": "World"}

@app.post("/login")
def producer(model: EmailModel):
  sql = f"SELECT `no`, `name` FROM test.user WHERE `email` = '{model.email}' and `delYn` = 0"
  data = findOne(sql)
  if data :
    pd.send(settings.kafka_topic, dict(model))
    pd.flush()
    return {"status": True, "msg": "이메일의 인증코드를 확인해주세요."}
  else: 
    return {"status": False, "msg": "이메일을 확인해주세요."}
  

@app.post("/code")
def code(model: CodeModel, response: Response):
  result = client.get(model.code)
  if result:
    data = set_token(result)
    if data:
      # model에 있는 데이터 삭제
      client.delete(model.code)
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

# @app.post("/me")
# def me(payload = Depends(get_payload)):
#   if payload:
#     print(payload)
#     return {"status": True}
#   return {"status": False}

@app.post("/me")
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

@app.post("/logout")
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

@app.get("/profile")
def profile(no: str):
  sql = f"select `fileName` from `test`.`profile` where `no` = {no}"
  result = findOne(sql)
  if result:
    fileName = result["fileName"]
  if fileName:
    UPLOAD_DIR.mkdir(exist_ok=True)
    path = UPLOAD_DIR / fileName
    return FileResponse(path=path)
  return {"status": False}

@app.post('/delYn')
def delYn(model: EmailModel, response:Response, request: Request):
    id = request.cookies.get("user")
    client.delete(id)
    response.delete_cookie(
        key="user",
        path="/",
        secure=False,  
        httponly=True,
        samesite="lax",
    )
    sql = f'''
    UPDATE test.`user`
    SET user.`delYn` = 1
    WHERE `email` = '{model.email}';
    '''
    data = save(sql)
    if data:
      return {"status": True, "msg": "탈퇴가 완료되었습니다."}
    return {"status":False, "msg":"다시 시도해주세요."}