const PdfResume = require("../models/pdfResume.model");
const Resume = require("../models/resume.model"); // Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "REGION" });
// Create S3 service object
var s3 = new AWS.S3({ apiVersion: "2006-03-01" });

// 이력서 생성
exports.createResume = async (req, res) => {
  try {
    const resume = await Resume.create(req.body);
    console.log(`Resume created: ${resume.title}`);
    res.status(201).json(resume);
  } catch (error) {
    console.error("Error creating resume:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// 특정 이력서 조회
exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id).populate(
      "author",
      "id"
    );
    if (!resume) {
      console.log(`Resume not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: "Resume not found" });
    }
    console.log(`Fetched resume: ${resume.title}`);
    res.status(200).json(resume);
  } catch (error) {
    console.error("Error fetching post:", error.message);
    res.status(500).json({ error: "Failed to fetch resume" });
  }
};

// 게시글 수정
exports.updateResume = async (req, res) => {
  try {
    console.log(req.body);
    const resume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!resume) {
      console.log(`Resume not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: "Resume not found" });
    }
    console.log(`Updated resume: ${resume.title}`);
    res.status(200).json(resume);
  } catch (error) {
    console.error("Error updating resume:", error.message);
    res.status(400).json({ error: "Failed to update resume" });
  }
};

exports.uploadPdfResume = async (req, res) => {
  try {
    const resumeId = req.params.id;
    const fileName = req.file.filename;

    const pdfResume = await PdfResume.find({ resumeId: resumeId });
    console.log(pdfResume);
    console.log(pdfResume.length);

    if (pdfResume.length) {
      await PdfResume.findByIdAndUpdate(
        pdfResume._id,
        { fileName },
        { new: true }
      );
    } else {
      await PdfResume.create({ resumeId, fileName });
    }

    res.status(200);
  } catch (error) {
    console.error("Error updating pdf resume:", error.message);
    res.status(400).json({ error: "Failed to update pdf resume" });
  }
};

exports.getPdfResume = async (req, res) => {
  try {
    const pdfResume = await PdfResume.find({ resumeId: req.params.id });
    console.log(pdfResume);
    if (!pdfResume) {
      console.log(`Pdf resume not found for resume ID: ${req.params.id}`);
      return res.status(404).json({ error: "Pdf resume not found" });
    }

    res.status(200).send(pdfResume);
  } catch {}
};

exports.getResumesByUser = async (req, res) => {
  try {
    const resumes = await Resume.find({
      author: req.params.authorId,
    }).populate("author", "id");
    console.log(
      `Fetched ${resumes.length} resumes for author ID: ${req.params.resumeId}`
    );
    res.status(200).json(resumes);
  } catch (error) {
    console.error("Error fetching resumes by user:", error.message); // 에러 메시지 출력
    res.status(500).json({ error: "Failed to fetch resumes by user" });
  }
};

// 게시글 삭제
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      console.log(`Resume not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: "Resume not found" });
    }
    await PdfResume.findOneAndDelete({ resumeId: req.params.id });
    console.log(`Deleted resume: ${resume.title}`);
    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume:", error.message);
    res.status(500).json({ error: "Failed to delete resume" });
  }
};
