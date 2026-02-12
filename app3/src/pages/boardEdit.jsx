const BoardEdit = () => {
  return (
    <div className="container mt-3">
		<h1 className="display-1 text-center">게시글 수정</h1>
		<form>
			<div className="mb-3 mt-3">
				<label htmlFor="title" className="form-label">제목</label>
				<input type="text" className="form-control" id="title" placeholder="제목을 입력하세요." name="title"/>
			</div>
			<div className="mb-3 mt-3">
				<label htmlFor="name" className="form-label">작성자</label>
				<input type="text" className="form-control" id="name" name="name" disabled/>
			</div>
			<div className="mb-3 mt-3">
				<label htmlFor="content" className="form-label">내용</label>
				<textarea type="text" className="form-control h-50" rows="10" placeholder="내용을 입력하세요."
					name="content"></textarea>
			</div>
			<div className="d-flex">
				<div className="p-2 flex-fill d-grid">
					<button className="btn btn-primary">저장</button>
				</div>
				<div className="p-2 flex-fill d-grid">
					<button className="btn btn-primary">취소</button>
				</div>
			</div>
		</form>
	</div>
  )
}

export default BoardEdit