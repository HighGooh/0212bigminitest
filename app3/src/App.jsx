
import '@/styles/App.css'
import { Routes, Route } from "react-router";
import NotFound from '@pages/NotFound.jsx'
import Nav from '@pages/nav.jsx'
import Home from '@pages/home.jsx'
import Login from '@pages/Login.jsx'
import SignUp from '@pages/signUp.jsx'
import UserView from '@pages/userView.jsx'
import UserEdit from '@pages/userEdit.jsx'
import BoardAdd from '@pages/boardAdd.jsx'
import BoardView from '@pages/boardView.jsx'
import BoardEdit from '@pages/boardEdit.jsx'

function App() {
   const paths = [
    {path: "/", element: <Home />},
    {path: "/login", element: <Login />},
    {path: "/signup", element: <SignUp />},
    {path: "/userview", element: <UserView />},
    {path: "/useredit", element: <UserEdit />},
    {path: "/boardadd", element: <BoardAdd />},
    {path: "/boardview/:no", element: <BoardView />},
    {path: "/boardedit/:no", element: <BoardEdit />},
    {path: "*", element: <NotFound />},
  ]
  return (
    <>
      <Nav />
      <Routes>
        { paths?.map((v, i) => <Route key={i} path={v.path} element={v.element} />) }
      </Routes>
    </>
  )
}

export default App
