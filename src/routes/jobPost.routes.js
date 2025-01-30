// routes/post.routes.js
const express = require("express");
const router = express.Router();
const jobPostController = require("../controllers/jobPost.controller");

// 게시글 CRUD 라우트
router.post("/", jobPostController.createJobPost); // 게시글 생성
router.get("/", jobPostController.getAllJobPosts); // 모든 게시글 조회
router.get("/:id", jobPostController.getJobPostById); // 특정 게시글 조회
router.get("/company/:companyId", jobPostController.getJobPostsByCompany); // 특정 게시글 조회
router.get("/skillSet/:skillSet", jobPostController.getJobPostsBySkillSet); // 특정 게시글 조회
router.put("/:id", jobPostController.updateJobPost); // 게시글 수정
router.delete("/:id", jobPostController.deleteJobPost); // 게시글 삭제

module.exports = router;
