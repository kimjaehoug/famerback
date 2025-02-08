// routes/post.routes.js
const express = require("express");
const router = express.Router();
const naverController = require("../controllers/naver.controller");

// 게시글 CRUD 라우트
router.get("/news", naverController.getNews);

module.exports = router;
