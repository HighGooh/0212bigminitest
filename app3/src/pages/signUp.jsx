import { useNavigate } from "react-router"
import { useAuth } from "@hooks/AuthProvider"
import { useState } from "react"
import { api } from '@utils/network.js'


const SignUp = () => {
  const nav = useNavigate()
  const [checkMail, setCheckMail] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [gender, setGender] = useState(false)
  const submitEvent1 = e => {
    e.preventDefault()
    api.post("/checkemail", { email })
      .then(res => {
        if (res.data.status) {
          alert(res.data.msg)
          setCheckMail(true)
        } else {
          alert(res.data.msg)
        }
      })
      .catch(err => console.log(err))
  }
  const submitEvent2 = e => {
    e.preventDefault()
    if (checkMail) {
      const params = { email, name, gender }
      api.post("/signup", params)
        .then(res => {
          if (res.data.status) {
            alert(res.data.msg)
            nav("/login")
          } else {
            alert(res.data.msg)
          }
        })
        .catch(err => console.log(err))
    } else {
      alert("이메일 중복 확인을 해주세요.")
    }
  }


  return (
    <div className="container mt-3 box_size" >
      <h1 className="display-1 text-center">회원가입</h1>
      <form onSubmit={submitEvent1}>
        <div className="mb-3 mt-3">
          <label htmlFor="email" className="form-label">이메일:</label>
          <div className="d-flex">
            <input type="email" className="form-control" id="email" placeholder="이메일를 입력하세요." name="email" value={email} onChange={(e) => setEmail(e.target.value)} required={true} readOnly={checkMail} />
            <button type="submit" className="btn btn-primary email_btn">중복 확인</button>
          </div>
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="name" className="form-label">이름:</label>
          <input type="text" className="form-control" id="name" placeholder="이름을 입력하세요." name="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="d-flex">
          <div className="p-2 flex-fill">
            <div className="form-check">
              <input type="radio" className="form-check-input" id="radio1" name="gender" defaultChecked onChange={() => setGender(true)} />남성
              <label className="form-check-label" htmlFor="radio1"></label>
            </div>
          </div>
          <div className="p-2 flex-fill">
            <div className="form-check">
              <input type="radio" className="form-check-input" id="radio2" name="gender" onChange={() => setGender(false)} />여성
              <label className="form-check-label" htmlFor="radio2"></label>
            </div>
          </div>
        </div>
      </form>
      <form onSubmit={submitEvent2}>
        <div className="d-flex">
          <div className="p-2 flex-fill d-grid">
            <button type="submit" className="btn btn-primary">가입</button>
          </div>
          <div className="p-2 flex-fill d-grid">
            <button type="button" onClick={() => nav("/")} className="btn btn-primary">취소</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignUp