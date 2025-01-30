// routes/post.routes.js
const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resume.controller");

// 이력서 CRUD 라우트
router.post("/", resumeController.createResume); // 이력서 생성
router.get("/:id", resumeController.getResumeById); // 특정 이력서 조회
router.get("/user/:authorId", resumeController.getResumesByUser); // 특정 유저 이력서 조회
router.put("/:id", resumeController.updateResume); // 이력서 수정
router.delete("/:id", resumeController.deleteResume); // 이력서 삭제

module.exports = router;
