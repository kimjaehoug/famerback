const express = require("express");
const router = express.Router();
const edaController = require("../controllers/eda.controller");

router.get("/average-by-weekday", edaController.getAverageByWeekday);
router.get("/daily-change", edaController.getDailyChange);
router.get("/distribution", edaController.getPriceDistribution);
router.get("/moving-average", edaController.getMovingAverage);
router.get("/prediction", edaController.getPrediction);

module.exports = router;