import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { api } from '@utils/network.js'
import { useAuth } from "@hooks/AuthProvider"

const UserEdit = () => {
	const [preview, setPreview] = useState(null)
	const [file, setFile] = useState(null) 
	const config = {
		headers: {
			"Content-Type": "multipart/form-data"
		}
	}
	const nav = useNavigate()
	const {setChangeProfile, profilePath, profile } = useAuth()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [regDate, setRegDate] = useState('')
	const [modDate, setModDate] = useState('')
	const [gender, setGender] = useState('')

	const imgEvent = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			setFile(selectedFile); // 나중에 저장 버튼 누를 때 사용

			// 브라우저 내 임시 URL 생성 (미리보기용)
			const objectUrl = URL.createObjectURL(selectedFile);
			setPreview(objectUrl);

		}
	};

	const submitEvent = e => {
		e.preventDefault()
		const formData = new FormData();
		if (file !== null) 
		formData.append("file", file);
		formData.append("fileNo", profile)
		formData.append("name", name);
		formData.append("email", email);
		formData.append("gender", gender);
		api.post("/upload", formData, config)
			.then(res => {
				if (res.data.status) {
					alert(res.data.msg)
					setChangeProfile(res.data.fileNo)
				}
			})
			.catch(err => console.error(err))
		nav("/userview")	
	}

	useEffect(() => {
			api.post("/me")
				.then(res => {
					setName(res.data.user.name)
					setEmail(res.data.user.email)
					setRegDate(res.data.user.regDate)
					setModDate(res.data.user.modDate)
					setGender(res.data.user.gender)
					setChangeProfile(res.data.user.profileNo)
				})
		} 
	, [])
	// modData를 날려도 될 것인가?

	return (
		<div className="container mt-3">
			<h1 className="display-1 text-center">회원정보 수정</h1>
			<div className="mb-2 text-center">
				{/* 이미지 */}
				<label htmlFor="fileInput" className="user_label d-flex justify-content-center rounded-circle mt-3" style={{ cursor: 'pointer' }}>
					<img
						className="d-block rounded-circle img-thumbnail border user_pt"
						src={preview || profilePath}
						alt="logo"
					/>
				</label>

				{/* 실제로 파일을 받는 input */}
				<input
					id="fileInput"
					type="file"
					accept="image/*"
					style={{ display: 'none' }}
					onChange={imgEvent}
				/>
			</div>

			<form onSubmit={submitEvent}>
				<div className="mb-3 mt-3">
					<label htmlFor="name" className="form-label">이름</label>
					<input type="text" className="form-control" id="name" placeholder="이름을 입력하세요." name="name" value={name} onChange={e => setName(e.target.value)} />
				</div>
				<div className="mb-3 mt-3">
					<label htmlFor="email" className="form-label">이메일</label>
					<input type="email" className="form-control" id="email" placeholder="이메일를 입력하세요." name="email" value={email} disabled />
				</div>
				<div className="mb-3 mt-3">
					<label htmlFor="regDate" className="form-label">가입일</label>
					<input type="text" className="form-control" id="regDate" placeholder="YYYY-MM-DD" name="regDate" value={regDate} disabled />
				</div>
				<div className="d-flex">
					<div className="p-2 flex-fill">
						<div className="form-check">
							<input type="radio" className="form-check-input" id="radio1" name="gender" value="1" checked={gender == 1} onChange={e => setGender(e.target.value)} />남성
							<label className="form-check-label" htmlFor="radio1"></label>
						</div>
					</div>
					<div className="p-2 flex-fill">
						<div className="form-check">
							<input type="radio" className="form-check-input" id="radio2" name="gender" value="0" checked={gender == 0} onChange={e => setGender(e.target.value)} />여성
							<label className="form-check-label" htmlFor="radio2"></label>
						</div>
					</div>
				</div>
				<div className="d-flex">
					<div className="p-2 flex-fill d-grid">
						<button className="btn btn-primary">저장</button>
					</div>
					<div className="p-2 flex-fill d-grid">
						<button type="button" onClick={() => nav("/userview")} className="btn btn-primary">취소</button>
					</div>
				</div>
			</form>
		</div>
	)
}

export default UserEdit