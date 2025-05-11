const db = require("../db");

// 필터 조건 생성 유틸리티
const buildWhereClause = (region, crop, farmName) => {
  let whereClause = "";
  const values = [];

  if (region && crop) {
    whereClause = "WHERE region = ? AND crop = ?";
    values.push(region, crop);
  } else if (farmName) {
    whereClause = "WHERE FARM_NM = ?";
    values.push(farmName);
  }

  return { whereClause, values };
};

// 1. 요일별 평균 가격
exports.getAverageByWeekday = async (req, res) => {
  const { region, crop, farmName } = req.query;
  const { whereClause, values } = buildWhereClause(region, crop, farmName);

  try {
    const [rows] = await db.query(
      `
      SELECT weekday, ROUND(AVG(weekday_avg_price), 2) AS avg_price
      FROM eda_result
      ${whereClause}
      GROUP BY weekday
      ORDER BY weekday
      `,
      values
    );

    const weekdayLabels = ["월", "화", "수", "목", "금", "토", "일"];
    const labels = rows.map(row => weekdayLabels[row.weekday]);
    const data = rows.map(row => row.avg_price);

    res.json({
      labels,
      datasets: [
        {
          label: "요일별 평균 가격",
          data,
          borderColor: "#3b82f6",
          backgroundColor: "#93c5fd",
          tension: 0.4,
        },
      ],
    });
  } catch (error) {
    console.error("📛 요일별 평균 가격 오류:", error);
    res.status(500).json({ error: "요일별 평균 가격 조회 실패" });
  }
};

// 2. 일일 가격 증감율
exports.getDailyChange = async (req, res) => {
  const { region, crop, farmName } = req.query;
  const { whereClause, values } = buildWhereClause(region, crop, farmName);

  try {
    const [rows] = await db.query(
      `
      SELECT PRCE_REG_YMD, price_pct_change
      FROM eda_result
      ${whereClause}
      ORDER BY PRCE_REG_YMD
      `,
      values
    );

    const labels = rows.map(row => row.PRCE_REG_YMD);
    const data = rows.map(row => row.price_pct_change);

    res.json({
      labels,
      datasets: [
        {
          label: "일일 가격 증감율 (%)",
          data,
          borderColor: "#f97316",
          backgroundColor: "#fdba74",
          tension: 0.4,
        },
      ],
    });
  } catch (error) {
    console.error("📛 가격 증감율 오류:", error);
    res.status(500).json({ error: "일일 가격 증감율 조회 실패" });
  }
};

// 3. 가격 분포 - 히스토그램 bin 처리
exports.getPriceDistribution = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT PDLT_PRCE FROM eda_result ORDER BY PRCE_REG_YMD DESC`);
    const prices = rows.map(r => r.PDLT_PRCE).slice(0, 1000);

    const binSize = 50;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const binCount = Math.ceil((max - min) / binSize);

    const bins = Array(binCount).fill(0);
    prices.forEach(p => {
      const index = Math.min(Math.floor((p - min) / binSize), binCount - 1);
      bins[index]++;
    });

    const labels = Array(binCount)
      .fill()
      .map((_, i) => `${min + i * binSize}-${min + (i + 1) * binSize}`);

    res.json({
      labels,
      datasets: [
        {
          label: "가격 분포",
          data: bins,
          backgroundColor: "rgba(59, 130, 246, 0.6)",
          borderColor: "#2563eb",
          borderWidth: 1,
        },
      ],
    });
  } catch (error) {
    console.error("📛 가격 분포 오류:", error);
    res.status(500).json({ error: "가격 분포 조회 실패" });
  }
};

// 4. 이동 평균 (7일, 14일)
exports.getMovingAverage = async (req, res) => {
  const { region, crop, farmName } = req.query;
  const { whereClause, values } = buildWhereClause(region, crop, farmName);

  try {
    const [rows] = await db.query(
      `
      SELECT PRCE_REG_YMD, MA_7, MA_14
      FROM eda_result
      ${whereClause}
      AND MA_7 IS NOT NULL AND MA_14 IS NOT NULL
      ORDER BY PRCE_REG_YMD
      `,
      values
    );

    const labels = rows.map(row => row.PRCE_REG_YMD);
    const data7 = rows.map(row => row.MA_7);
    const data14 = rows.map(row => row.MA_14);

    res.json({
      labels,
      datasets: [
        {
          label: "7일 이동 평균",
          data: data7,
          borderColor: "#6366f1",
          backgroundColor: "#c7d2fe",
          tension: 0.4,
        },
        {
          label: "14일 이동 평균",
          data: data14,
          borderColor: "#f97316",
          backgroundColor: "#fde68a",
          tension: 0.4,
        },
      ],
    });
  } catch (error) {
    console.error("📛 이동 평균 오류:", error);
    res.status(500).json({ error: "이동 평균 조회 실패" });
  }
};

// 5. 예측 결과 (과거 + 미래) - 날짜 밀림 문제 해결
exports.getPrediction = async (req, res) => {
  const { region, crop, farmName } = req.query;
  const { whereClause, values } = buildWhereClause(region, crop, farmName);

  try {
    const [rows] = await db.query(
      `
      SELECT DATE_FORMAT(PRCE_REG_YMD, '%Y-%m-%d') AS date, PDLT_PRCE AS price
      FROM eda_result
      ${whereClause}
      AND PDLT_PRCE IS NOT NULL

      UNION ALL

      SELECT DATE_FORMAT(Date, '%Y-%m-%d') AS date, Predicted_Price AS price
      FROM prediction_result
      WHERE region = ? AND crop = ?

      ORDER BY date ASC
      `,
      [...values, region, crop]
    );

    const labels = rows.map(row => row.date);
    const data = rows.map(row => row.price);

    res.json({
      labels,
      datasets: [
        {
          label: "예측 가격 (과거 + 미래)",
          data,
          borderColor: "#ef4444",
          backgroundColor: "#fecaca",
          tension: 0.4,
        },
      ],
    });
  } catch (error) {
    console.error("📛 예측 결과 오류:", error);
    res.status(500).json({ error: "예측 결과 조회 실패" });
  }
};
