import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router";
// import { useCookies } from 'react-cookie'
import { api } from '@utils/network.js'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false)
  //const [changeProfile, SetChangeProfile] = useState(false)
  const [profile, setProfile] = useState(0)
  const [profilePath, setProfilePath] = useState(0)
  const path = import.meta.env.VITE_APP_FASTAPI_URL || "http://localhost:8001";

  const navigate = useNavigate()
  // const [cookies, setCookie, removeCookie] = useCookies(['user']);

  // const setAuth = status => {
  //   setIsLogin(status)
  // }

  // const clearAuth = () => {
  //   setIsLogin(false)
  //   navigate("/")
  // }

  const getUrl = (no) => {
    if (no > 0) {
      console.log(no)
      return `${path}/profile?no=${no}`
    }
    else
      return "/img01.jpg"
  }

  const setChangeProfile = (no) => {
    const url = getUrl(no)
    setProfile(no)
    setProfilePath(url)
  }

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

  const checkAuth = () => {
    api.post("/me")
      .then(res => {
        if (res.data.status) {
          setIsLogin(true);
          return res.data.user
        } else {
          return res.data.msg
        }
      })
      .catch(err => console.log(err))
  }

  const changeAuth = () => {
    api.post('/me')
      .then(res => {
        return res.data.userinfo.profileNo
      })
      .catch(err => console.log(err))
    api.post('/change', { email })
      .then(res => {
        setProfile(res.data.userinfo.profileNo)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    checkAuth()
    console.log(isLogin)
  }, [isLogin])

  return (
    <AuthContext.Provider value={{ isLogin, profile, path, setProfile, setChangeProfile, removeAuth, checkAuth, changeAuth, profilePath  }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthProvider