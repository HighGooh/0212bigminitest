import { useNavigate } from "react-router"
import { useAuth } from "@hooks/AuthProvider"
import { useEffect, useState } from "react"
import { api } from '@utils/network.js'

const UserView = () => {

	const nav = useNavigate()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [regDate, setRegDate] = useState('')
	const [modDate, setModDate] = useState('')
	const [gender, setGender] = useState('')
	const [profile, setProfile] = useState(0)
	const {removeAuth}=useAuth()
	const path = import.meta.env.VITE_APP_FASTAPI_URL || "http://localhost:8001";

	useEffect(()=> {
		api.post("/me")
			.then(res=>{
				console.log(res.data)
				setName(res.data.user.name)
				setEmail(res.data.user.email)
				setRegDate(res.data.user.regDate)
				setModDate(res.data.user.modDate)
				setGender(res.data.user.gender)
				setProfile(res.data.user.profileNo)
			})
	},[])

	const getUrl = () => {
		if ( profile > 0 )
		return `${path}/profile?no=${profile}`
		else 
		return "/img01.jpg"
	}
	const delYn = ()=>{
		removeAuth()
		// sql delYn =1
	}
	return (
		<div className="container mt-3 position-relative">
			<h1 className="display-1 text-center">회원정보</h1>
			<div>
				<img src={getUrl()} className="border user_pt" />
				{/* 처음엔 기본이미지, 수정하면 마지막 이미지 불러오기 */}
			</div>
			<form>
				<div>
					<div className="mb-3 mt-3">
						<label htmlFor="name" className="form-label">이름</label>
						<input type="text" className="form-control" id="name" name="name" readOnly="readonly" defaultValue={name} />
					</div>
					<div className="mb-3 mt-3">
						<label htmlFor="email" className="form-label">이메일</label>
						<input type="email" className="form-control" id="email" name="email" readOnly="readonly" defaultValue={email} />
					</div>
					<div className="mb-3 mt-3">
						<label htmlFor="regDate" className="form-label">가입일</label>
						<input type="text" className="form-control" id="regDate" name="regDate" readOnly="readonly" defaultValue={regDate} />
					</div>
					<div className="mb-3 mt-3">
						<label htmlFor="modDate" className="form-label">회원정보 수정일</label>
						<input type="text" className="form-control" id="modDate" name="modDate" readOnly="readonly" defaultValue={modDate} />
					</div>
					<div className="d-flex">
						<div className="p-2 flex-fill">
							<div className="form-check">
								<input type="radio" className="form-check-input" id="radio1" name="gender" value="1" checked={gender === 1} readOnly={true} />남성
								<label className="form-check-label" htmlFor="radio1"></label>
							</div>
						</div>
						<div className="p-2 flex-fill">
							<div className="form-check">
								<input type="radio" className="form-check-input" id="radio2" name="gender" value="2" checked={gender === 0} readOnly={true} />여성
								<label className="form-check-label" htmlFor="radio2"></label>
							</div>
						</div>
					</div>
				</div>
				<div className="d-flex">
					<div className="p-2 flex-fill d-grid">
						<button type="button" onClick={() => nav("/")} className="btn btn-primary">취소</button>
					</div>
					<div className="p-2 flex-fill d-grid">
						<button type="button" onClick={() => nav("/useredit")} className="btn btn-primary">수정</button>
					</div>
					<div className="p-2 flex-fill d-grid">
						<button type="button" onClick={()=>delYn()} className="btn btn-primary">탈퇴</button>
					</div>
				</div>
			</form>
		</div>
	)
}

export default UserView