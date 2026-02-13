import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { api } from '@utils/network.js'
import { useAuth } from "@hooks/AuthProvider"

const UserView = () => {
	const nav = useNavigate()
	
	const { profilePath } = useAuth()

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [regDate, setRegDate] = useState('')
	const [modDate, setModDate] = useState('')
	const [gender, setGender] = useState('')
	const [profile, setProfile] = useState(0)

	// 초기값 불러오기
	useEffect(() => {
			api.post("/me")
				.then(res => {
					setName(res.data.user.name)
					setEmail(res.data.user.email)
					setRegDate(res.data.user.regDate)
					setModDate(res.data.user.modDate)
					setGender(res.data.user.gender)
					setProfile(res.data.user.profileNo)
				})
	}, [])

	// 탈퇴시 DB수정 함수
	const delYn = () => {
		api.post('/delYn', { email })
			.then(res => {
				if (res.data.status) {
					alert(res.data.msg)
					nav("/")
				} else {
					alert(res.data.msg)
				}
			})
	}

	return (
		<div className="container mt-3 position-relative">
			<h1 className="display-1 text-center">회원정보</h1>
			<div>
				<img src={profilePath} className="border user_pt_view" />
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
						<button type="button" onClick={() => delYn()} className="btn btn-primary">탈퇴</button>
					</div>
				</div>
			</form>
		</div>
	)
}

export default UserView