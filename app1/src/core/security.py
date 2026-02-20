from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError

from src.core.settings import settings
from src.db.mariadb_crud import findOne

# JWT 토큰 생성 및 유저 정보 조회
def setToken(email: str):
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