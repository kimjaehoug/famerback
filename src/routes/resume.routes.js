// routes/post.routes.js
const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resume.controller");
const multer = require("multer");
const pdfResumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./pdfResumes");
  },
  filename: function (req, file, cb) {
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    cb(null, file.originalname);
  },
});
// const additionalFilesStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, `./additionalFiles`);
//   },
//   filename: function (req, file, cb) {
//     file.originalname = Buffer.from(file.originalname, "latin1").toString(
//       "utf8"
//     );
//     cb(null, file.originalname);
//   },
// });

// 이력서 CRUD 라우트
router.post("/", resumeController.createResume); // 이력서 생성
router.get("/:id", resumeController.getResumeById); // 특정 이력서 조회
router.get("/user/:authorId", resumeController.getResumesByUser); // 특정 유저 이력서 조회
router.put("/:id", resumeController.updateResume); // 이력서 수정
router.put(
  "/pdfResume/:id",
  multer({ storage: pdfResumeStorage }).single("file"),
  resumeController.uploadPdfResume
); // 이력서 생성
// router.put(
//   "/additionalFiles/:id",
//   multer({ storage: additionalFilesStorage }).array("files"),
//   resumeController.uploadAdditionalFiles
// ); // 이력서 생성
router.delete("/:id", resumeController.deleteResume); // 이력서 삭제

module.exports = router;
