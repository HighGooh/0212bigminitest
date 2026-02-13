import { useEffect, useState } from "react"
import { api } from '@utils/network.js'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from "@hooks/AuthProvider"

const BoardView = () => {
	const nav = useNavigate()

	const [title, setTitle] = useState("")
	const [content, setContent] = useState("")
	const param = useParams().no
	const [boardEmail, setBoardEmail] = useState('')
	const [userEmail, setUserEmail] = useState('')
	const [commentList, setCommentList] = useState([])
	const [reset, setReset] = useState(false)
	const [commentCont, setCommentCont] = useState('')
	const [clickCom, setClickCom] = useState('')
	const [editCom, setEditCom] = useState('')

	const { path } = useAuth()
	const styles = { "resize": "none", "overFlow": "hidden" }
	const mode = (userEmail === boardEmail)

	// 댓글 user profile사진 불러오는 함수
	const getUrl = (profileNo) => {
		if (profileNo > 0)
			return `${path}/profile?no=${profileNo}`
		else
			return "/img01.jpg"
	}
	
	//이건 지환이가 알려줄것임(～￣▽￣)～
	const onload = () => {
		document.querySelectorAll(".auto-resize").forEach(textarea => {
			textarea.addEventListener("input", function () {
				this.style.height = "auto";
				this.style.height = this.scrollHeight + "px";
			});
		});
	}

	// 게시물 삭제시 DB수정 및 HOME으로 이동
	const boardDelClick = () => {
		api.post(`/boarddel/${param}`)
		alert("삭제되었습니다")
		nav('/')
	}
	// 게시물 삭제시 DB수정 및 reset상태변경
	const commentDelClick = (commentNo) => {
		api.post(`/commentdel/${param}`, { commentNo })
		alert("삭제되었습니다")
		setReset(!reset)
	}

	// 댓글 추가시 DB에 추가 및 reset상태변경
	const addComment = () => {
		api.post(`/commentadd/${param}`, { userEmail, commentCont })
		alert("댓글이 등록되었습니다")
		setReset(!reset)
		setCommentCont('')
	}

	// 댓글 수정시 DB에 추가 및 reset상태변경
	const commentEdit = (commentNo) => {
		if (editCom) {
			api.post(`/commentedit`, { editCom, commentNo })
			alert("댓글이 수정되었습니다")
			setEditCom('')
		}
		setReset(!reset)
	}

	// 댓글 변경시 boardview 다시 세팅
	useEffect(() => {
		api.post(`/boardview/${param}`).then(res => {
			setTitle(res.data.boardData["title"])
			setContent(res.data.boardData["content"])
			setBoardEmail(res.data.boardData["userEmail"])
		})
		api.post('/me').then(res => {
			if (res.data.status) {
				setUserEmail(res.data.user["email"])
			}
		})
		api.post(`/comment/${param}`).then(res => {
			setCommentList(res.data.commentData)
		})
		setClickCom('')
	}, [reset])


	return (
		<div className="container mt-3">
			<h1 className="display-1 text-center">게시글 상세</h1>
			<form>
				<div className="mb-3 mt-3">
					<label htmlFor="title" className="form-label">제목</label>
					<input type="text" className="form-control" id="title" name="title" readOnly="readOnly" value={title} />
				</div>
				<div className="mb-3 mt-3">
					<label htmlFor="content" className="form-label">내용</label>
					<textarea type="text" className="form-control h-50" rows="10" id="content" name="content" readOnly="readOnly" value={content} ></textarea>
				</div>
			</form>
			{
				mode &&
				<div className="d-flex">
					<div className="p-2 flex-fill d-grid">
						<button type="button" onClick={() => nav(`/boardedit/${param}`)} className="btn btn-primary">수정</button>
					</div>
					<div className="p-2 flex-fill d-grid">
						<button type="button" onClick={() => boardDelClick()} className="btn btn-primary">삭제</button>
					</div>
					<div className="p-2 flex-fill d-grid">
						<button type="button" onClick={() => nav('/')} className="btn btn-primary">취소</button>
					</div>
				</div>
			}
			{
				!mode &&
				<div className="d-flex">
					<div className="p-2 flex-fill d-grid">
						<button type="button" onClick={() => nav('/')} className="btn btn-primary">목록</button>
					</div>
				</div>
			}
			<div className="comment-box mb-4" onLoad={onload()}>
				<div className="d-flex">
					<div className="profile-img"></div>

					<div className="flex-grow-1 mt-3 position-relative">
						<textarea type="text" className="form-control auto-resize" style={styles} rows="1" id="comment_area" name="comment_area" value={commentCont} onChange={e => setCommentCont(e.target.value)}></textarea>
					</div>
					<button className="btn btn-success btn-sm bottom-0 start- mx-2 mt-3" onClick={() => addComment()}>
						등록
					</button>
				</div>
			</div>
			<div>

				{/* <!-- 댓글  --> */}
				{
					commentList.map((v, i) =>
						<div className="comments my-3 w-100 pb-2" key={i}>
							<div className="d-flex align-items-start">
								{/* <!-- 프로필 이미지 --> */}
								<img src={getUrl(v.profileNo)} className="rounded-circle me-3" width="50" height="50" alt="profile" />	 {/* <!-- v.profileNo --> */}
								{/* <!-- 댓글 내용 --> */}
								<div className="flex-grow-1">
									<div className="d-flex justify-content-between align-items-center">
										<div className="fw-bold">{v.name}</div>
										{
											v.userEmail == userEmail &&
											<div>
												{
													clickCom !== i &&
													<div>
														<button className="btn btn-outline-secondary btn-sm me-1" onClick={() => {
															setClickCom(i)
															setEditCom(v.comment)
														}}>수정</button>
														<button className="btn btn-outline-danger btn-sm" type="button" onClick={() => commentDelClick(v.no)}>삭제</button>
													</div>
												}
												{
													clickCom === i &&
													<div>
														<button className="btn btn-outline-secondary btn-sm me-1" onClick={() => {
															setClickCom('')
															commentEdit(v.no)
														}}>저장</button>
														<button className="btn btn-outline-danger btn-sm" type="button" onClick={() => {
															setReset(!reset)
															setEditCom('')
														}}>취소</button>
													</div>
												}

											</div>
										}
									</div>
									{
										clickCom !== i &&
										<div className="mt-1">
											{v.comment}
										</div>
									}
									{
										clickCom === i &&
										<div className="flex-grow-1 mt-3 position-relative">
											<textarea type="text" className="form-control auto-resize" style={styles} rows="1" id="comment_area" name="comment_area" value={editCom} onChange={e => setEditCom(e.target.value)}></textarea>
										</div>
									}
									<div className="text-muted small my-1">
										{v.modDate.split('T')[0]} {v.modDate.split('T')[1]}
									</div>
								</div>
							</div>
						</div>)

				}
			</div>
		</div>
	)
}

export default BoardView