from fastapi import APIRouter, Response, Request, File, UploadFile, Form
from fastapi.responses import FileResponse
from typing import Optional
import redis

from settings import settings
from db import findOne, save
from models import SignupModel, EmailModel
from utils import saveFile, UPLOAD_DIR

router = APIRouter(tags=["User"])

# Redis 설정 (회원 탈퇴 시 세션 삭제용)
client = redis.Redis(
  host=settings.redis_host,
  port=settings.redis_port,
  db=settings.redis_db,
  decode_responses=True
)

@router.post("/signup")
def signup(model: SignupModel):
  sql = f"insert into test.user (`name`,`email`,`gender`) VALUE ('{model.name}','{model.email}', {model.gender})"
  data = save(sql)
  if data:
    return {"status": True, "msg": "회원 가입을 축하합니다. 로그인 페이지로 이동합니다."}
  return {"status": False, "msg": "가입 중 오류가 발생했습니다."}

@router.post("/checkemail")
def checkemail(model: EmailModel):
  sql = f"SELECT `email` from test.user WHERE `email` = '{model.email}' "
  checkemail = findOne(sql)
  if checkemail:
    return {"status": False, "msg": "중복된 이메일입니다."}
  else:
    return {"status": True, "msg": "사용 가능한 이메일입니다."}

@router.get("/profile")
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

@router.post("/upload")
def upload(name: str = Form(), email: str = Form(), gender: int = Form(), file: Optional[UploadFile] = File(None), fileNo: int = Form()):
  if file:
    fileNo = saveFile(file)
  sql = f'''
    UPDATE test.`user`
    SET `profileNo` = {fileNo}, `name` = '{name}', `gender` = {gender}
    WHERE `email` = '{email}';
    '''
  save(sql)
  return {"status": True, "msg": "회원 정보 수정이 완료되었습니다.", "fileNo": fileNo}

@router.post('/delYn')
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