const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// DB 연결 확인용 로그 (비동기 함수 내부에서 실행)
(async () => {
  try {
    const [rows] = await pool.query("SELECT DATABASE() AS db");
    console.log("📌 현재 연결된 DB:", rows[0].db);
    console.log("📄 .env에서 불러온 DB_NAME:", process.env.DB_NAME);
  } catch (err) {
    console.error("❌ DB 연결 확인 중 오류:", err.message);
  }
})();

module.exports = pool;