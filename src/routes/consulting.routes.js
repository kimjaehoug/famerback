const express = require("express");
const router = express.Router();
const consultingController = require("../controllers/consulting.controller");

// 기업 관련 라우트
router.post("/", consultingController.consult);

module.exports = router;
