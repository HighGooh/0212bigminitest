from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, user, board

# 라우터 등록
app = FastAPI(title="Producer")
app.include_router(auth.router)   # 로그인 관련
app.include_router(user.router)   # 유저/프로필 관련
app.include_router(board.router)  # 게시판 관련

# CORS 설정
origins = [ "http://localhost","http://localhost:5173" ]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
  return {"2team": "zzangzzangman"}