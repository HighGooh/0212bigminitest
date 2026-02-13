import { useEffect, useState } from "react"
import { api } from '@utils/network.js'
import { useParams } from "react-router"
import { useNavigate } from "react-router"

const BoardEdit = () => {

	const nav = useNavigate()

	const [title, setTitle] = useState("")
	const [content, setContent] = useState("")

	// boardview로 넘어가기 위한 param
	const param = useParams().no

	// DB에서 게시글 불러오기
	useEffect(() => {
		api.post(`/boardview/${param}`).then(res => {
			setTitle(res.data.boardData.title)
			setContent(res.data.boardData.content)
		}).catch(err => console.log(err))
	}, [])

	// DB에 게시글 수정내역 Update
	const submitEvent = (e) => {
		e.preventDefault()
		const paramData = { "title": title, "content": content }
		api.post(`/boardedit/${param}`, paramData)
			.catch(err => console.log(err))
		alert("수정되었습니다")
		nav(`/boardview/${param}`)
	}

	return (
		<div className="container mt-3">
			<h1 className="display-1 text-center">게시글 수정</h1>
			<form onSubmit={submitEvent}>
				<div className="mb-3 mt-3">
					<label htmlFor="title" className="form-label">제목</label>
					<input type="text" className="form-control" id="title" value={title} placeholder="제목을 입력하세요." name="title" onChange={e => setTitle(e.target.value)} />
				</div>
				<div className="mb-3 mt-3">
					<label htmlFor="content" className="form-label">내용</label>
					<textarea type="text" className="form-control h-50" rows="10" placeholder="내용을 입력하세요." name="content" value={content} onChange={e => setContent(e.target.value)}></textarea>
				</div>
				<div className="d-flex">
					<div className="p-2 flex-fill d-grid">
						<button type="submit" className="btn btn-primary">저장</button>
					</div>
					<div className="p-2 flex-fill d-grid">
						<button type="button" onClick={() => nav('/')} className="btn btn-primary">취소</button>
					</div>
				</div>
			</form>
		</div>
	)
}

export default BoardEdit