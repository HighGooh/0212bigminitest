import { useNavigate } from "react-router"
import { useAuth } from "@/hooks/AuthProvider"

const Nav = () => {
	const nav = useNavigate()
	const { removeAuth, isLogin } = useAuth();

	return (
		<nav className="navbar navbar-expand-lg bg-body-tertiary">
			<div className="container-fluid position-relative">
				<a className="navbar-brand" style={{ "cursor": "pointer" }} onClick={() => nav("/")}>TEAM2</a>
				<div className="d-flex">
					{
						isLogin && <img src="./img01.jpg" className="border user_pt_nav01 mt-1 object-fit-cover" />
					}
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
						aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
				</div>
				<div className="collapse navbar-collapse w-100" id="navbarNav">
					<div className="nav_box">
						<ul className="navbar-nav mt-2 me-auto">
							{
								!isLogin &&
								<>
									<li className="nav-item">
										<button type="button" className="nav-link" onClick={() => nav("/login")}>로그인</button>
									</li>
									<li className="nav-item">
										<button type="button" className="nav-link" onClick={() => nav("/signup")}>회원가입</button>
									</li>
								</>
							}
							{
								isLogin &&
								<>
									<li className="nav-item">
										<button type="button" className="nav-link" onClick={() => removeAuth()} >로그아웃</button>
									</li>
									<li className="nav-item">
										<button type="button" className="nav-link" onClick={() => nav("/userview")}>회원정보</button>
									</li>
								</>
							}
						</ul>
						{
							isLogin && <img src="../img01.jpg" className="border user_pt_nav mt-1 object-fit-cover" />
						}
					</div>
				</div>
			</div>
		</nav>
	)
}

export default Nav