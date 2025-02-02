const mongoose = require("mongoose");

const resumeSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  motivation: {
    type: String,
    required: true,
  },
  projects: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
  },
  activities: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
  },
  resumes: {
    type: [Buffer],
  },
  portfolios: {
    type: [String],
  },
  awards: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
  },
  certificates: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
  },
  skillSet: {
    type: [String],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
