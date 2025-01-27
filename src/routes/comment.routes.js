const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");

// 댓글 CRUD 및 추가 기능 라우트
router.post("/", commentController.createComment); // 댓글 생성
router.get("/:postId", commentController.getCommentsByPost); // 특정 게시물의 댓글 조회
router.get("/comment/:commentId", commentController.getCommentById); // 특정 댓글 조회
router.put("/:commentId", commentController.updateComment); // 댓글 수정
router.delete("/:commentId", commentController.deleteComment); // 댓글 삭제
router.get("/count/:postId", commentController.getCommentCountByPost); // 댓글 개수 조회

module.exports = router;
