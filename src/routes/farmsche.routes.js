const express = require("express");
const router = express.Router();
const farmJournalController = require("../controllers/farmsche.controller")
router.get("/", farmJournalController.getJournal);
router.post("/commitData",farmJournalController.saveJournal);

module.exports = router;