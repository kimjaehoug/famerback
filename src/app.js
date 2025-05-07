require("dotenv").config(); // 환경 변수 로드

const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db"); // MySQL 연결
const companyRoutes = require("./routes/company.routes");
const jobPostRoutes = require("./routes/jobPost.routes");
const resumeRoutes = require("./routes/resume.routes");
const reviewRoutes = require("./routes/review.routes");
const userRoutes = require("./routes/user.routes");
const naverRoutes = require("./routes/naver.routes");
const consultingRoutes = require("./routes/consulting.routes");
const farmRoutes = require("./routes/newFarm.routes");
const chatRoutes = require("./routes/aiChat.routes");
const farmJournalRoutes = require("./routes/farmsche.routes");
const app = express();

const allowedOrigins = ["*", "http://localhost:3000"];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static(path.join(__dirname, "public")));

// MySQL 연결 테스트
db.getConnection()
  .then((conn) => {
    console.log("MySQL connected successfully");
    conn.release();
  })
  .catch((err) => {
    console.error("MySQL connection error:", err);
  });

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

app.use("/company", companyRoutes);
app.use("/jobPost", jobPostRoutes);
app.use("/resume", resumeRoutes);
app.use("/resume", express.static("pdfResumes"));
app.use("/review", reviewRoutes);
app.use("/user", userRoutes);
app.use("/naver", naverRoutes);
app.use("/consulting", consultingRoutes);
app.use("/farm", farmRoutes);
app.use("/aichat", chatRoutes);
app.use("/farmJournal", farmJournalRoutes);
// 404 에러 처리
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports = app;