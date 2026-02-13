import redis
from fastapi import APIRouter, Request
from jose import jwt, JWTError

from settings import settings
from db import findOne, findAll, save
from models import ( boardModel, boardEditModel, searchModel, commentAddModel, commentDelModel, commentEditModel )

router = APIRouter(tags=["Board"])

# Redis 설정 (토큰 확인용)
client = redis.Redis(
  host=settings.redis_host,
  port=settings.redis_port,
  db=settings.redis_db,
  decode_responses=True
)

### --- 게시글 관련 API --- ###

@router.get("/getList/{no}")
def read_root(no:int):
    print(no)
    sql = f'''
    select b.no, b.title, u.name, b.regDate
    from test.board as b
    inner Join test.user as u
    on(b.userEmail = u.email)
    where b.delYn = 0
    ORDER by regDate ASC
    Limit 5 OFFSET {5*no};
    '''
    data = findAll(sql)

    sql2 = f'''
    SELECT CEIL(COUNT(no)/5) AS cnt
    FROM test.board
    WHERE delYn = 0;
    '''
    data2 = findOne(sql2)
    result = data2['cnt']
    return {"status": True, "boardList" : data, "pageLen": result}

@router.post("/boardadd")
def boardadd(boardmodel:boardModel, request:Request):
        id = request.cookies.get("user")
        try:
              if id :
                token = client.get(id)
                data = jwt.decode(token,settings.secret_key,algorithms=settings.algorithm)
                sql = f'''
                SELECT * FROM `test`.user where `no` = '{data["sub"]}'
                '''
                userInfo = findOne(sql)
                sql =  f"""
                  INSERT INTO test.board (`userEmail`,`title`,`content`)
                  VALUES ('{userInfo["email"]}','{boardmodel.title}','{boardmodel.content}');
                  """
                save(sql)
                return {"status" : True, "msg":"게시글이 작성되었습니다."}
        except JWTError as e :
          print(f"실패원인: {e}")
        return {"status": False, "msg": "로그인을 확인해주세요."}

@router.post("/boardview/{no}")
def boardview(no: int, req: Request):
    sql = f'''
    select b.`title`, u.`name`, b.`content`, b.`userEmail`
    from `test`.`board` as b
    inner Join `test`.`user` as u
    on(b.`userEmail` = u.email)
    where (b.`no` = {no});
    '''
    data = findOne(sql)
    return {"status": True, "boardData": data}

@router.post("/boardedit/{no}")
def boardedit(item:boardEditModel, no:int):
    sql = f'''
    UPDATE `test`.`board`
    SET `title` = '{item.title}', `content` = '{item.content}'
    where (`no` = {no});
    '''
    print(item.title)
    save(sql)
    return {"status": True}

@router.post("/boarddel/{no}")
def boardDel(no:int):
    sql = f'''
    UPDATE `test`.`board`
    SET `delYn` = 1
    where (`no` = {no});
    '''
    save(sql)

@router.post("/search/{no}")
def read_root(txt:searchModel, no:int):
    print(no)
    sql = f'''
    select b.no, b.title, b.regDate ,u.name
    from test.board as b
    inner Join test.user as u
    on(b.userEmail = u.email)
    where b.delYn = 0
    and b.title like "%{txt.search}%"
    ORDER by regDate ASC
    Limit 5 OFFSET {5*no};
    '''
    data = findAll(sql)

    sql2 = f'''
    SELECT CEIL(COUNT(no)/5) AS cnt
    FROM test.board
    WHERE delYn = 0
    and title like "%{txt.search}%";
    '''
    data2 = findOne(sql2)
    result = data2['cnt']

    print(result)

    return {"status": True, "boardList" : data, "pageLen": result}

### --- 댓글 관련 API --- ###

@router.post("/comment/{no}")
def read_root(no:int):
    sql = f'''
    select c.*, u.`name`, u.`profileNo`
    from `test`.`comment` as c
    join `test`.`user` as u
    ON c.`userEmail` = u.`email`
    WHERE   c.`boardNo` = {no} AND c.`delYn` = 0
    ORDER BY `regDate` ASC;
    '''
    data = findAll(sql)
    return {"status" : True, "commentData": data}

@router.post("/commentadd/{no}")
def boardDel(no:int, model : commentAddModel):
    sql = f'''
    INSERT INTO `test`.`comment` (`boardNo`,`userEmail`,`comment`) value ('{no}', '{model.userEmail}','{model.commentCont}')
    '''
    save(sql)

@router.post("/commentdel/{no}")
def boardDel(no:int, model : commentDelModel):
    sql = f'''
    UPDATE `test`.`comment`
    SET `delYn` = 1
    where `no` = {model.commentNo} and `boardNo` = {no};
    '''
    save(sql)

@router.post("/commentedit")
def boardedit(model:commentEditModel,):
    sql = f'''
    UPDATE `test`.`comment`
    SET `comment` = '{model.editCom}'
    where `no` = {model.commentNo};
    '''
    save(sql)
    return {"status": True}