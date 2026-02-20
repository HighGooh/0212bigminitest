import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { api } from '@utils/network.js'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false)
  // 대기 상태 화면 처리용 함수
  const [isPending, setIsPending] = useState(false)
  const [profile, setProfile] = useState(0)
  const [profilePath, setProfilePath] = useState(0)
  // 프로필 이미지 No를 path로 바꾸기 위함
  const path = import.meta.env.VITE_APP_FASTAPI_URL || "http://localhost:8001"

  const navigate = useNavigate()

  // 프로필 이미지 번호 불러오는 함수
  const getUrl = (no) => {
    if (no > 0) {
      return `${path}/profile?no=${no}`
    }
    else
      return "/img01.jpg"
  }
  // 프로필 변경 시 DB의 profileNo 업데이트
  const setChangeProfile = (no) => {
    const url = getUrl(no)
    setProfile(no)
    setProfilePath(url)
  }
  // 로그아웃 함수
  const removeAuth = () => {
    api.post("/logout")
      .then(res => {
        if (res.data.status) {
          setIsLogin(false)
          alert(res.data.msg)
          navigate("/")
        }
      })
      .catch(err => console.error(err))
  }
  // 로그인 상태 확인 함수
  const checkAuth = () => {
    api.post("/me")
      .then(res => {
        if (res.data.status) {
          setIsLogin(true)
        }
        setIsPending(true)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    checkAuth()
  }, [isLogin])

  return (
    <AuthContext.Provider value={{ isLogin, isPending, profile, path, setProfile, setChangeProfile, removeAuth, checkAuth, profilePath, getUrl }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthProvider