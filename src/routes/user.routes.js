const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// 유저 관련 라우트
router.post("/signup", userController.signup); // 회원가입
router.post("/login", userController.login); // 로그인
router.get("/", userController.getAllUsers); // 모든 유저 조회 (Optional)
router.get("/:userId", userController.getUserById); // 특정 유저 조회 (Optional)
router.get("/skillset/:skillSet", userController.getUserBySkillSet); // 특정 유저 조회 (Optional)
router.put("/:userId", userController.updateUser); // 유저 정보 수정 (Optional)
router.delete("/:userId", userController.deleteUser); //

module.exports = router;
