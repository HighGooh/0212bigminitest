import { useEffect, useState } from "react"
import { api } from '@utils/network.js'

const BoardView = () => {
	const styles = { "resize": "none", "overFlow": "hidden" }
	



	return (
		<div className="container mt-3">
			<h1 className="display-1 text-center">게시글 상세</h1>
			<form>
				<div className="mb-3 mt-3">
					<label htmlFor="title" className="form-label">제목</label>
					<input type="text" className="form-control" id="title" name="title" readOnly="readonly" />
				</div>
				<div className="mb-3 mt-3">
					<label htmlFor="name" className="form-label">작성자</label>
					<input type="text" className="form-control" id="name" name="name" readOnly="readonly" />
				</div>
				<div className="mb-3 mt-3">
					<label htmlFor="regDate" className="form-label">작성날짜</label>
					<input type="text" className="form-control" id="regDate" name="regDate" readOnly="readonly" />
				</div>
				<div className="mb-3 mt-3">
					<label htmlFor="content" className="form-label">내용</label>
					<textarea type="text" className="form-control h-50" style={styles} rows="10" id="content" name="content" readOnly="readonly"></textarea>
				</div>
			</form>
			<div className="d-flex">
				<div className="p-2 flex-fill d-grid">
					<a href="./board_edit.html" className="btn btn-primary">수정</a>
				</div>
				<div className="p-2 flex-fill d-grid">
					<a href="../index.html" className="btn btn-primary">삭제</a>
				</div>
				<div className="p-2 flex-fill d-grid">
					<a href="../index.html" className="btn btn-primary">취소</a>
				</div>
			</div>
			<div className="comment-box mb-4">
				<div className="d-flex">
					<div className="profile-img"></div>

					<div className="flex-grow-1 mt-3 position-relative">
						<textarea type="text" className="form-control auto-resize" style={styles} rows="1" id="comment_area" name="comment_area"></textarea>
						<input type="text" className="form-control comment-input" maxLength="3000" placeholder="댓글을 입력하세요" />
					</div>
					<button className="btn btn-success btn-sm bottom-0 start- mx-2 mt-3">
						등록
					</button>
				</div>
			</div>
			<div>
				{/* <!-- 댓글  --> */}
				<div className="comments my-3 w-100 pb-2">
					<div className="d-flex align-items-start">
						{/* <!-- 프로필 이미지 --> */}
						<img src="../img01.jpg" className="rounded-circle me-3" width="50" height="50" alt="profile" />
						{/* <!-- 댓글 내용 --> */}
						<div className="flex-grow-1">
							<div className="d-flex justify-content-between align-items-center">
								<div className="fw-bold">최윤우짱짱맨</div>
								<div>
									<button className="btn btn-outline-secondary btn-sm me-1">수정</button>
									<button className="btn btn-outline-danger btn-sm">삭제</button>
								</div>
							</div>
							<div className="mt-1">
								저는 귀여워요
							</div>
							<div className="text-muted small my-1">
								2026.02.06 16:56
							</div>
						</div>
					</div>
				</div>
				<div className="comments my-3 w-100 pb-2">
					<div className="d-flex align-items-start">
						{/* <!-- 프로필 이미지 --> */}
						<img src="../img01.jpg" className="rounded-circle me-3" width="50" height="50" alt="profile" />
						{/* <!-- 댓글 내용 --> */}
						<div className="flex-grow-1">
							<div className="d-flex justify-content-between align-items-center">
								<div className="fw-bold">최윤우땐씽머씐</div>
								<div>
									<button className="btn btn-outline-secondary btn-sm me-1">수정</button>
									<button className="btn btn-outline-danger btn-sm">삭제</button>
								</div>
							</div>
							<div className="mt-1">
								저는 왕짱깜찍이에용 &gt;&lt; 뿌우 </div>
							<div className="text-muted small my-1">
								2026.02.06 16:56
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default BoardView