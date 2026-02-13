import uuid
import shutil
import json
from pathlib import Path
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError

from settings import settings
from db import findOne, add_key

# 업로드 경로 설정
UPLOAD_DIR = Path("uploads")

# 1. JWT 토큰 생성 및 유저 정보 조회
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

# 2. 파일 저장 로직
def saveFile(file):
  UPLOAD_DIR.mkdir(exist_ok=True)
  origin = file.filename
  ext = origin.split(".")[-1].lower()
  id = uuid.uuid4().hex
  newName = f"{id}.{ext}"
  sql = f"""
    insert into test.`profile` (`origin`, `ext`, `fileName`) 
    value ('{origin}','{ext}','{newName}')
  """
  result = add_key(sql)
  if result[0]:
    path = UPLOAD_DIR / newName
    with path.open("wb") as f:
      shutil.copyfileobj(file.file, f)
    return result[1]
  return 0