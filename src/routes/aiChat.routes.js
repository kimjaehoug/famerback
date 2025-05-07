const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiChat.controller");

router.post("/ask",aiController.askAIAndSave);
router.get("/getChat",aiController.getChatHistory);
module.exports = router;