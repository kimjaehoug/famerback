const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");

// 댓글 CRUD 및 추가 기능 라우트
router.post("/", reviewController.createReview); // 댓글 생성
router.get("/:reviewId", reviewController.getReviewById); // 특정 게시물의 댓글 조회
router.put("/:reviewId", reviewController.updateReview); // 댓글 수정
router.delete("/:reviewId", reviewController.deleteReview); // 댓글 삭제
router.get("/company/:companyId", reviewController.getReviewsByCompany); // 댓글 개수 조회

module.exports = router;
