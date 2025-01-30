const express = require("express");
const router = express.Router();
const companyController = require("../controllers/company.controller");

// 기업 관련 라우트
router.post("/signup", companyController.signup); // 기업 회원가입
router.post("/login", companyController.login); // 기업 로그인
router.get("/", companyController.getAllCompanies); // 모든 기업 조회
router.get("/:companyId", companyController.getCompanyById); // 특정 기업 조회

module.exports = router;
