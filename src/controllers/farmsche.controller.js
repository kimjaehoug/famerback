const db = require("../db");

exports.getJournal = async (req, res) => {
  const userId = req.query.userId;
  const farmName = req.query.farmName;
  const date = req.query.date;

  console.log("📘 일지 조회 요청:", { userId, farmName, date });

  if (!userId || !farmName || !date) {
    return res.status(400).json({ message: "❌ 필수 파라미터 누락" });
  }

  try {
    const [results] = await db.query(
      `
        SELECT note, pestNote
        FROM farm_journal
        WHERE user_id = ? AND farm_name = ? AND date = ?
      `,
      [userId, farmName, date]
    );

    if (results.length === 0) {
      console.log("ℹ️ 일지 없음 (빈 응답 반환)");
      return res.status(200).json({ note: "", pestNote: "" });
    }

    const journal = results[0];
    console.log("✅ 일지 조회 성공:", journal);

    res.status(200).json({
      note: journal.note || "",
      pestNote: journal.pestNote || ""
    });
  } catch (err) {
    console.error("❌ 일지 조회 실패:", err);
    res.status(500).json({ message: "서버 오류", details: err.message });
  }
};

  exports.saveJournal = async (req, res) => {
    const { userId, farmName, date, note, pestNote } = req.body;
    console.log("✅ saveJournal 호출됨:", req.body);
  
    // 필수 값 확인
    if (!userId || !farmName || !date) {
      return res.status(400).json({ success: false, error: "필수 항목 누락" });
    }
  
    try {
      const checkSql = `
        SELECT * FROM farm_journal
        WHERE user_id = ? AND farm_name = ? AND date = ?
      `;
      const insertSql = `
        INSERT INTO farm_journal (user_id, farm_name, date, note, pestNote)
        VALUES (?, ?, ?, ?, ?)
      `;
      const updateSql = `
        UPDATE farm_journal
        SET note = ?, pestNote = ?
        WHERE user_id = ? AND farm_name = ? AND date = ?
      `;
  
      // 📌 기존 일지 있는지 확인
      console.log("🔍 checkSql 실행 중:", [userId, farmName, date]);
      const [rows] = await db.query(checkSql, [userId, farmName, date]);
  
      if (rows.length > 0) {
        // ✅ 수정 (이미 존재하는 경우)
        await db.query(updateSql, [note, pestNote, userId, farmName, date]);
        console.log("✏️ 일지 수정 완료");
        return res.status(200).json({ success: true, message: "일지 수정 완료" });
      } else {
        // ✅ 삽입 (신규 작성)
        await db.query(insertSql, [userId, farmName, date, note, pestNote]);
        console.log("🆕 일지 저장 완료");
        return res.status(201).json({ success: true, message: "일지 저장 완료" });
      }
    } catch (err) {
      console.error("❌ saveJournal 오류 발생:", err);
      return res.status(500).json({ success: false, error: "DB 오류", details: err });
    }
  };

  
  
  