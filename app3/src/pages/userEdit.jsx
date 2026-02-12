const UserEdit = () => {


  return (
    <div className="container mt-3">
		<h1 className="display-1 text-center">회원정보 수정</h1>
    <form>
			<img src="../img01.jpg" className="border user_pt" />
		</form>
    <div className="mb-2 text-center">
      <div className="d-flex justify-content-center">
        <img className="d-block rounded-circle img-thumbnail mt-3 border user_pt" src="../img01.jpg" alt="logo" id="preview" onClick={()=>{}} />
      </div>
   </div>
		<form>
			<div className="mb-3 mt-3">
				<label htmlFor="name" className="form-label">이름</label>
				<input type="text" className="form-control" id="name" placeholder="이름을 입력하세요." name="name" onChange={()=>{true}} />
			</div>
			<div className="mb-3 mt-3">
				<label htmlFor="email" className="form-label">이메일</label>
				<input type="email" className="form-control" id="email" placeholder="이메일를 입력하세요." name="email" onChange={()=>{true}} />
			</div>
			<div className="mb-3 mt-3">
				<label htmlFor="regDate" className="form-label">가입일</label>
				<input type="text" className="form-control" id="regDate" placeholder="YYYY-MM-DD" name="regDate" disabled />
			</div>
			<div className="d-flex">
				<div className="p-2 flex-fill">
					<div className="form-check">
						<input type="radio" className="form-check-input" id="radio1" name="gender" value="1" /*checked*//>남성
						<label className="form-check-label" htmlFor="radio1"></label>
					</div>
				</div>
				<div className="p-2 flex-fill">
					<div className="form-check">
						<input type="radio" className="form-check-input" id="radio2" name="gender" value="2" />여성
						<label className="form-check-label" htmlFor="radio2"></label>
					</div>
				</div>
			</div>
		</form>
		<div className="d-flex">
			<div className="p-2 flex-fill d-grid">
				<button className="btn btn-primary">저장</button>
			</div>
			<div className="p-2 flex-fill d-grid">
				<button className="btn btn-primary">취소</button>
			</div>
		</div>
	</div>
  )
}

export default UserEdit