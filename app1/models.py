from pydantic import BaseModel, Field
from typing import Optional

# 인증 관련 모델
class EmailModel(BaseModel):
  email: str

class CodeModel(BaseModel):
  code: str

# 유저 관련 모델
class SignupModel(BaseModel):
    name: str
    email: str
    gender: bool

# 게시판 관련 모델
class boardModel(BaseModel):
    title: str
    content: str

class boardEditModel(BaseModel):
    title: str 
    content: str 

class searchModel(BaseModel):
   search: str

# 댓글 관련 모델
class commentAddModel(BaseModel):
    userEmail : str
    commentCont : str

class commentDelModel(BaseModel):
    commentNo : int

class commentEditModel(BaseModel):
    editCom : str
    commentNo : int