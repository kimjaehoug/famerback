const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// 회원가입
exports.signup = async (req, res) => {
  const { id, password, name,dateOfBirth,email,introduction,phoneNumber } = req.body;

  try {
    // 중복 확인
    const [existingUsers] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, error: "ID already exists" });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 유저 생성
    const [result] = await db.query(
      "INSERT INTO users (id, password, name,email,phoneNumber,dateOfBirth,introduction) VALUES (?, ?, ?,?,?,?,?)",
      [id, hashedPassword,name,email,phoneNumber,dateOfBirth,introduction]
    );

    res.status(200).json({ success: true, id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: "Signup failed", details: err });
  }
};

// 전체 유저 조회
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users", details: err });
  }
};

// userId로 유저 조회
exports.getUserById = async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [req.params.userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(users[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user", details: err });
  }
};


// 유저 업데이트
exports.updateUser = async (req, res) => {
  const userId = req.params.userId;
  const fields = req.body;

  try {
    const [result] = await db.query("UPDATE users SET ? WHERE id = ?", [fields, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(400).json({ error: "Failed to update user" });
  }
};

// 로그인
exports.login = async (req, res) => {
  const { id, password } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [id]);

    if (users.length === 0) {
      return res.status(401).json({ message: "User doesn't exist." });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY);
    res.json({ token, user });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Login failed" });
  }
};

// 유저 삭제
exports.deleteUser = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [req.params.userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Failed to delete user" });
  }
};