import { api } from '@utils/network.js'
import { useState } from "react"
import { useNavigate } from "react-router"

const BoardAdd = () => {
  const nav = useNavigate("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const submitEvent = e => {
    e.preventDefault()
    const board = {"title": title, "content": content}
    api.post('/boardadd', board)
		.then(res => {
      alert(res.data.msg)
      nav("/")
    })
		.catch(res => {
      alert(res.data.msg)
    })
    }


  return (
    <div className="container mt-3">
      <h1 className="display-1 text-center">게시글 작성</h1>
      <form onSubmit={submitEvent} >
        <div className="mb-3 mt-3">
          <label htmlFor="title" className="form-label">제목</label>
          <input type="text" className="form-control" id="title" placeholder="제목을 입력하세요." name="title" 
            value={title} onChange={e => setTitle(e.target.value)}/>
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="content" className="form-label" value={content}>내용</label>
          <textarea type="text" className="form-control h-50" rows="10" placeholder="내용을 입력하세요."
            name="content"  value={content} onChange={e => setContent(e.target.value)}></textarea>
        </div>
        <div className="d-flex">
          <div className="p-2 flex-fill d-grid">
            <button className="btn btn-primary">등록</button>
          </div>
          <div className="p-2 flex-fill d-grid">
            <button onClick={()=>nav("/")} className="btn btn-primary">취소</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default BoardAdd