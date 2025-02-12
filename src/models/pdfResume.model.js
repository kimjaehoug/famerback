const mongoose = require("mongoose");

const pdfResumeSchema = new mongoose.Schema({
  resumeId: String,
  fileName: String,
  url: String,
});

const PdfResume = mongoose.model("PdfResume", pdfResumeSchema);

module.exports = PdfResume;
