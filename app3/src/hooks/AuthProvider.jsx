import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router";
// import { useCookies } from 'react-cookie'
import { api } from '@utils/network.js'

export const AuthContext = createContext()

const AuthProvider = ({children}) => {
  const [isLogin, setIsLogin] = useState(false)
  const navigate = useNavigate()
  // const [cookies, setCookie, removeCookie] = useCookies(['user']);

  // const setAuth = status => {
  //   setIsLogin(status)
  // }

  // const clearAuth = () => {
  //   setIsLogin(false)
  //   navigate("/")
  // }

  const removeAuth = () => {
    api.post("/logout")
    .then(res => {
      if(res.data.status) {
        setIsLogin(false)
        alert(res.data.msg)
        navigate("/")
      }
    })
    .catch(err => console.error(err))
  }

  const checkAuth = () => {
    api.post("/me")
      .then(res=>{
        if (res.data.status) {
          setIsLogin(true);
          return res.data.user
        } else {
          return res.data.msg
        }
      })
      .catch(err=>console.log(err))
  }

  useEffect(() => {
    checkAuth()
    console.log(isLogin)
  }, [isLogin])

  return (
    <AuthContext.Provider value={{ isLogin, removeAuth, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthProvider