from fastapi import APIRouter, Request
from jose import jwt, JWTError

from src.core.settings import settings
from src.core.redis_client import redis_client
from src.db.mariadb_crud import findOne, findAll, save
from src.models.models import ( boardModel, boardEditModel, searchModel, commentAddModel, commentDelModel, commentEditModel )

router = APIRouter(tags=["Board"])

### --- 게시글 관련 API --- ###

@router.get("/getlist/{no}")
def getList(no:int):
    print(no)
    sql = f'''
    select b.`no`, b.`title`, u.`name`, b.`regDate`
    from `test`.`board` as b
    inner Join `test`.`user` as u
    on(b.`userEmail` = u.`email`)
    where b.`delYn` = 0
    ORDER by `regDate` DESC
    Limit 5 OFFSET {5*no};
    '''
    data = findAll(sql)

    sql2 = f'''
    SELECT CEIL(COUNT(`no`)/5) AS cnt
    FROM `test`.`board`
    WHERE `delYn` = 0;
    '''
    data2 = findOne(sql2)
    result = data2['cnt']
    return {"status": True, "boardList" : data, "pageLen": result}

@router.post("/boardadd")
def boardAdd(boardmodel:boardModel, request:Request):
        id = request.cookies.get("user")
        try:
              if id :
                token = redis_client.get(id)
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
def boardView(no: int, req: Request):
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
def boardEdit(item:boardEditModel, no:int):
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
def search(txt:searchModel, no:int):
    print(no)
    sql = f'''
    select b.no, b.title, b.regDate ,u.name
    from test.board as b
    inner Join test.user as u
    on(b.userEmail = u.email)
    where b.delYn = 0
    and b.title like "%{txt.search}%"
    ORDER by `regDate` DESC
    Limit 5 OFFSET {5*no};
    '''
    data = findAll(sql)

    sql2 = f'''
    SELECT CEIL(COUNT(`no`)/5) AS cnt
    FROM `test`.`board`
    WHERE `delYn` = 0
    and title like "%{txt.search}%";
    '''
    data2 = findOne(sql2)
    result = data2['cnt']

    print(result)

    return {"status": True, "boardList" : data, "pageLen": result}

### --- 댓글 관련 API --- ###

@router.post("/comment/{no}")
def comment(no:int):
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
def commentAdd(no:int, model : commentAddModel):
    sql = f'''
    INSERT INTO `test`.`comment` (`boardNo`,`userEmail`,`comment`) value ('{no}', '{model.userEmail}','{model.commentCont}')
    '''
    save(sql)

@router.post("/commentdel/{no}")
def commentDel(no:int, model : commentDelModel):
    sql = f'''
    UPDATE `test`.`comment`
    SET `delYn` = 1
    where `no` = {model.commentNo} and `boardNo` = {no};
    '''
    save(sql)

@router.post("/commentedit")
def commentEdit(model:commentEditModel,):
    sql = f'''
    UPDATE `test`.`comment`
    SET `comment` = '{model.editCom}'
    where `no` = {model.commentNo};
    '''
    save(sql)
    return {"status": True}