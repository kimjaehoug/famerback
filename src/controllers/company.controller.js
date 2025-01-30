const Company = require("../models/company.model");
const passport = require("passport"); // 패스포트
const jwt = require("jsonwebtoken");

// 회원가입 (User 생성)
exports.signup = async (req, res) => {
  req.body.token = "";
  const company = new Company(req.body);

  try {
    await company.save();
    res.status(200).json({ success: true, company });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ success: false, error: "Signup failed", details: err });
  }
};

// 모든 유저 조회
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch companies", details: err });
  }
};

// useId로 유저 조회
exports.getCompanyById = async (req, res) => {
  const { companyId } = req.params;

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json(company);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch company", details: err });
  }
};

exports.getCompanyByName = async (req, res) => {
  const { companyName } = req.params;

  try {
    const company = await Company.find({
      name: companyName,
    });
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json(company);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch company", details: err });
  }
};

// 로그인
exports.login = async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).json({ msg: info });
    }

    req.logIn(user, async (err) => {
      if (err) {
        return next(err);
      }

      const accessToken = jwt.sign(
        {
          email: user.email,
        },
        process.env.JWT_KEY,
        { expiresIn: "15s", issuer: "weather", subject: "user_info" }
      );

      const refreshToken = jwt.sign({}, process.env.JWT_KEY, {
        expiresIn: "1d",
        issuer: "weather",
        subject: "user_info",
      });

      // user.token = refreshToken;
      // user.save();

      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   maxAge: 24 * 60 * 60 * 1000,
      // });

      return res.status(200).json({
        success: true,
        user: { _id: user._id, email: user.email },
        accessToken,
      });
    });
  })(req, res, next);
};
