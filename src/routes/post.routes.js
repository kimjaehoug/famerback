// routes/post.routes.js
const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");

// 게시글 CRUD 라우트
router.post("/", postController.createPost); // 게시글 생성
router.get("/", postController.getAllPosts); // 모든 게시글 조회
router.get("/:id", postController.getPostById); // 특정 게시글 조회
router.put("/:id", postController.updatePost); // 게시글 수정
router.delete("/:id", postController.deletePost); // 게시글 삭제

module.exports = router;
