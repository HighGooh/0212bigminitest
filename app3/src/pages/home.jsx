import { useEffect, useState } from "react"
import { api } from '@utils/network.js'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const nav = useNavigate()
    const [list, setList] = useState([])
    const [page, setPage] = useState(0)
    const [pageLen, setPageLen] = useState(0)
    const [search, setSearch] = useState("")
    const [isSearch, setIsSearch] = useState('')
    useEffect(() => {
        api.get(`/getList/0`).then(res => {
            setPageLen(res.data.pageLen)
            setList([...res.data.boardList])
        })
    }, [])
    console.log(pageLen)
    // list[0].map((v,i)=> console.log(v))
    const searchEvent = (e) => {
        e.preventDefault()
        if (search) {
            const Params = { "search": search }
            api.post('/search/0', Params)
                .then(res => {
                    setPageLen(res.data.pageLen)
                    console.log(res.data)
                    if (res.data.status) setList([...res.data.boardList])
                })
            setIsSearch(search)
        } else {
            api.get('/getList/0').then(res => {
                if (res.data.status) setList([...res.data.boardList])
            })
        }
    }

    const pageChange = (index) => {
        const Params = { "search": search }
        if (isSearch) {
            api.post(`/search/${index}`, Params).then(res => {
                setPageLen(res.data.pageLen)
                setList([...res.data.boardList])
            })
           
        } else {
            api.get(`/getList/${index}`).then(res => {
                setPageLen(res.data.pageLen)
                setList([...res.data.boardList])
            })
        }
    }

    return (
        <>
            <div className="container mt-3">
                <h1 className="display-1 text-center">게시판</h1>
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <div className="btn-group">
                        <button type="button" onClick={() => nav("/boardadd")} className="btn btn-primary">게시글 작성</button>
                    </div>
                    <form className="d-flex" style={{ maxWidth: "300px" }} onSubmit={searchEvent}>
                        <input className="form-control me-2" type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="검색어를 입력하세요" />
                        <button className="btn btn-outline-dark" type="submit">Search</button>
                    </form>
                </div>
                <table className="table table-hover mt-3 text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>no</th>
                            <th>게시글</th>
                            <th>작성날짜</th>
                            <th>작성자</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            list.map((v, i) =>
                                <tr className="cursor-pointer" key={i} onClick={() => nav(`/boardview/${v.no}`)}>
                                    <td>{i + 1}</td>
                                    <td>{v.title}</td>
                                    <td>{v.regDate.split("T")[0]}</td>
                                    <td>{v.name}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>

                {/* <!-- Pagination 영역  --> */}
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center mt-4">
                        <li className="page-item">
                            <button className="page-link" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </button>
                        </li>
                        {
                            Array.from({ length: pageLen }, (_, i) => <li className="page-item" key={i}><button className="page-link" onClick={() => {
                                pageChange(i)
                            }}>{i + 1}</button></li>)
                        }
                        <li className="page-item">
                            <button className="page-link" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    )
}

export default Home
