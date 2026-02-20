import uuid
import shutil
from pathlib import Path
from jose import jwt, JWTError

from src.db.mariadb_crud import addKey

# 업로드 경로 설정
UPLOAD_DIR = Path("uploads")

# 프로필 사진 파일 저장 로직
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
  result = addKey(sql)
  if result[0]:
    path = UPLOAD_DIR / newName
    with path.open("wb") as f:
      shutil.copyfileobj(file.file, f)
    return result[1]
  return 0