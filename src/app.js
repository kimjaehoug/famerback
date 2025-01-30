require("dotenv").config(); // 환경 변수 로드

const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport"); // 패스포트
const cookieSession = require("cookie-session");
const companyRoutes = require("./routes/company.routes"); // 기업 유저 라우트
const jobPostRoutes = require("./routes/jobPost.routes"); // 채용 공고 라우트
const resumeRoutes = require("./routes/resume.routes"); // 이력서 라우트
const reviewRoutes = require("./routes/review.routes"); // 리뷰 라우트
const userRoutes = require("./routes/user.routes"); // 유저 라우트
const app = express();
const cookieEncryptionKey = "aaaa";
require("dotenv").config();

app.use(
  cookieSession({
    name: "cookie-session-name",
    keys: [cookieEncryptionKey],
  })
);

// register regenerate & save after the cookieSession middleware initialization
app.use(function (request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb();
    };
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

const allowedOrigins = ["http://localhost:3000", "https://ojakgyo.vercel.app"]; // 허용할 출처

// CORS 설정
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS", // 허용할 HTTP 메서드
  allowedHeaders: "Content-Type,Authorization", // 허용할 헤더
};

// CORS 미들웨어 설정 (한 번만 적용)
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight 요청 처리

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static(path.join(__dirname, "public")));

// DB username, pw, uri from .env
const username = process.env.DB_USERNAME;
const password = process.env.DB_PW;
const baseUri = process.env.SERVER_URI;

// MongoDB 연결
const uri = baseUri
  .replace("<username>", username)
  .replace("<password>", password);

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

app.use("/company", companyRoutes); // 기업 회원 라우트 추가
app.use("/jobPost", jobPostRoutes); // 채용 공고 라우트 추가
app.use("/resume", userRoutes); // 이력서 라우트 추가
app.use("/review", reviewRoutes); // 리뷰 라우트 추가
app.use("/user", userRoutes); // 유저 라우트 추가

// 404 에러 처리
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports = app;
