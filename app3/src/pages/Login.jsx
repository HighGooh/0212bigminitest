import { useNavigate } from "react-router"
import { useState, useEffect } from "react"
import { useAuth } from "@hooks/AuthProvider"
import { api } from '@utils/network.js'

const Login = () => {
  const nav = useNavigate()
  const { checkAuth } = useAuth()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState("")
  const [checkEmail, setCheckEmail] = useState(false)
  const submitEvent1 = (e) => {
    e.preventDefault()
    api.post("/login", { email })
      .then(res => {
        if (res.data.status) {
          alert(res.data.msg)
          setCheckEmail(true)
        } else {
          alert(res.data.msg)
        }
      })
  }
  const submitEvent2 = (e) => {
    e.preventDefault()
    api.post("/code", { code })
      .then(res => {
        if (res.data.status) {
          alert(res.data.msg)
          checkAuth()
          nav("/")          
        } else {
          alert(res.data.msg)
        }
      })
  }

  return (
    <div className="container mt-3 box_size">
      <h1 className="display-1 text-center">로그인</h1>
      <form onSubmit={submitEvent1}>
        <div className="mb-3 mt-3">
          <label htmlFor="email" className="form-label">이메일</label>
          <input type="email" className="form-control" id="email" placeholder="이메일를 입력하세요." name="email" value={email} onChange={(e) => setEmail(e.target.value)} required={true} readOnly={checkEmail} />
        </div>
        <div className="d-flex mb-4">
          <div className="p-2 flex-fill d-grid">
            <button type="submit" className="btn btn-primary">메일 발송</button>
          </div>
          <div className="p-2 flex-fill d-grid ">
            <button type="button" onClick={() => nav("/")} className="btn btn-primary">취소</button>
          </div>
        </div>
      </form>
      {
        checkEmail &&
        <form onSubmit={submitEvent2}>
          <div className="mb-3 d-flex">
            <input type="txt" className="form-control" id="code" placeholder="인증번호를 입력하세요" name="code" value={code} onChange={(e) => setCode(e.target.value)} required={true} />
            <button type="submit" className="w-25 btn btn-primary">인증</button>
          </div>
        </form>
      }
    </div>
  )
}

export default Login