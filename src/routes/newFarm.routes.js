const express = require("express");
const router = express.Router();
const newFarmController = require("../controllers/newFarm.controller");

router.post("/newfarm", newFarmController.makeNewFarm);
router.get("/farms", newFarmController.getFarms); // query 방식: ?userId=
router.delete("/delete", newFarmController.deleteFarms);

module.exports = router; // ✅ 반드시 이렇게!