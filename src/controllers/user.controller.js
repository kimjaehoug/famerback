const User = require("../models/users.model");
const passport = require("passport"); // 패스포트
const jwt = require("jsonwebtoken");

// 회원가입 (User 생성)
exports.signup = async (req, res) => {
  req.body.token = "";
  const user = new User(req.body);

  try {
    await user.save();
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ success: false, error: "Signup failed", details: err });
  }
};

// 모든 유저 조회 (Optional)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users", details: err });
  }
};

// 특정 유저 조회 (Optional)
exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user", details: err });
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
