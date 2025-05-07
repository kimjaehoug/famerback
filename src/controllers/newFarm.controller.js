const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// ✅ 농장 생성
exports.makeNewFarm = async (req, res) => {
  
  const { author, id, name, address, crop, size, method } = req.body;
  console.log("💥 makeNewFarm 요청:", req.body);
  console.log("id:", id)
  console.log("📌 name:", name);
  // 필수 입력값 확인
  if (!author || !name) {
    return res.status(400).json({ success: false, error: "author와 name은 필수입니다." });
  }

  try {
    console.log("📌 농장 생성 요청:", req.body);

    // 중복 확인
    const [existingFarm] = await db.query(
      "SELECT * FROM farmlist WHERE id = ? AND name = ?",
      [id, name]
    );

    if (existingFarm.length > 0) {
      console.warn("🚫 중복 농장 발견:", existingFarm);
      return res.status(400).json({
        success: false,
        error: "같은 이름의 농장이 이미 존재합니다.",
      });
    }

    // 농장 추가
    const [result] = await db.query(
      "INSERT INTO farmlist (id, name, address, crop, size, method) VALUES (?, ?, ?, ?, ?, ?)",
      [id, name, address, crop, size, method]
    );

    console.log("✅ 농장 생성 완료, ID:", result.insertId);
    res.status(200).json({
      success: true,
      message: "Farm created successfully",
      farmId: result.insertId,
    });
  } catch (err) {
    console.error("❌ Farm creation error:", err);
    res.status(500).json({ success: false, error: "Farm add failed", details: err.message });
  }
};

// ✅ 농장 조회
exports.getFarms = async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "userId가 필요합니다." });
  }

  try {
    console.log("📦 농장 조회 요청, userId:", userId);

    const [farms] = await db.query(
      "SELECT * FROM farmlist WHERE id = ?",
      [userId]
    );

    console.log(`✅ ${farms.length}개의 농장 조회됨`);
    res.status(200).json(farms);
  } catch (err) {
    console.error("❌ Farm fetch error:", err);
    res.status(500).json({ message: "농장 조회 실패", details: err.message });
  }
};

exports.deleteFarms = async (req, res) => {
  const userId = req.query.userId;
  const name = req.query.name;

  if (!userId || !name) {
    return res.status(400).json({ error: "userId와 name은 필수입니다." });
  }

  try {
    console.log("🗑️ 농장 삭제 요청:", { userId, name });

    const [result] = await db.query(
      "DELETE FROM farmlist WHERE id = ? AND name = ?",
      [userId, name]
    );

    if (result.affectedRows === 0) {
      console.log("⚠️ 삭제할 농장이 없습니다.");
      return res.status(404).json({ message: "삭제할 농장이 없습니다." });
    }

    console.log(`✅ 농장 '${name}' 삭제 완료`);
    res.status(200).json({ message: "삭제 성공" });
  } catch (err) {
    console.error("❌ 농장 삭제 실패:", err);
    res.status(500).json({ message: "서버 오류", details: err.message });
  }
};