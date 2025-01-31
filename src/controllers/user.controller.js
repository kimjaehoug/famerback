const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// 회원가입 (User 생성)
exports.signup = async (req, res) => {
  const { id, password } = req.body;

  const user = await User.findOne({ id });

  if (user) {
    return res.status(400).json({ success: false, error: "ID already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  req.body.password = hashedPassword;

  const newUser = new User(req.body);

  try {
    await newUser.save();
    res.status(200).json({ success: true, newUser });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ success: false, error: "Signup failed", details: err });
  }
};

// 모든 유저 조회
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users", details: err });
  }
};

// useId로 유저 조회
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

// SkillSet으로 유저 조회
exports.getUserBySkillSet = async (req, res) => {
  try {
    const users = await User.find({
      skillSet: req.params.skillSet,
    }).populate("author", "email");
    console.log(
      `Fetched ${users.length} users for skillSet: ${req.params.skillSet}`
    );
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users by skillSet:", error.message); // 에러 메시지 출력
    res.status(500).json({ error: "Failed to fetch users by skillSet" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, skillSet, id, email, dateOfBirth } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { name, skillSet, id, email, dateOfBirth },
      { new: true }
    );
    if (!user) {
      console.log(`User not found with ID: ${req.params.userId}`);
      return res.status(404).json({ error: "User not found" });
    }
    console.log(`Updated user: ${user._id}`);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(400).json({ error: "Failed to update user" });
  }
};

// 로그인
exports.login = async (req, res, next) => {
  const { id, password } = req.body;
  const user = await User.findOne({ id });

  if (!user) {
    return res.status(401).json({ message: "User doesn't exist." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password." });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
  res.json({ token, user });
};

// 유저 삭제
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      console.log(`User not found with ID: ${req.params.userId}`);
      return res.status(404).json({ error: "User not found" });
    }
    console.log(`Deleted user with ID: ${user._id}`); // 삭제된 댓글 ID 출력
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message); // 에러 메시지 출력
    res.status(500).json({ error: "Failed to delete user" });
  }
};
