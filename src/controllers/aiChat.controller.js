const db = require("../db");
const axios = require("axios");

// AI 서버에 요청 + 결과 저장
exports.askAIAndSave = async (req, res) => {
  const { question } = req.body;
  const userId = req.user?.id || req.body.userId; // JWT에서 가져오거나 fallback

  if (!userId || !question) {
    return res.status(400).json({ success: false, error: "userId와 question은 필수입니다." });
  }

  try {
    console.log("🤖 AI 요청 시작:", question);

    // AI 서버에 POST 요청
    const aiResponse = await axios.post("http://210.117.143.172:5371/ask", {
      query: question
    });

    const answer = aiResponse.data.answer;

    // DB에 저장
    const [result] = await db.query(
      "INSERT INTO aichat_history (user_id, question, answer) VALUES (?, ?, ?)",
      [userId, question, answer]
    );

    console.log("✅ 채팅 저장 완료:", result.insertId);
    res.status(200).json({
      success: true,
      chatId: result.insertId,
      answer: answer
    });

  } catch (err) {
    console.error("❌ AI 요청/저장 실패:", err);
    res.status(500).json({
      success: false,
      error: "AI 처리 중 오류 발생",
      details: err.message
    });
  }
};

// ✅ 유저별 채팅 내역 조회
exports.getChatHistory = async (req, res) => {
    const userId = req.query.userId;
  
    if (!userId) {
      return res.status(400).json({ error: "userId가 필요합니다." });
    }
  
    try {
      const [rows] = await db.query(
        "SELECT * FROM aichat_history WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
      );
  
      console.log(`📄 ${rows.length}개의 채팅 내역 조회됨`);
      res.status(200).json({ success: true, history: rows });
    } catch (err) {
      console.error("❌ 채팅 내역 조회 실패:", err);
      res.status(500).json({ error: "Chat history fetch failed", details: err.message });
    }
  };