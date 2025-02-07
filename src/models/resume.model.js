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
  jobExperience: [
    {
      name: {
        type: String,
        required: true,
      },
      period: {
        type: String,
        required: true,
      },
      details: {
        type: String,
        required: true,
      },
    },
  ],
  projects: [
    {
      name: {
        type: String,
        required: true,
      },
      period: {
        type: String,
        required: true,
      },
      details: {
        type: String,
        required: true,
      },
    },
  ],
  activities: [
    {
      name: {
        type: String,
        required: true,
      },
      period: {
        type: String,
        required: true,
      },
      details: {
        type: String,
        required: true,
      },
    },
  ],
  portfolioLinks: [
    {
      name: {
        type: String,
        required: true,
      },
      period: {
        type: String,
        required: true,
      },
      details: {
        type: String,
        required: true,
      },
    },
  ],
  pdfResume: {
    type: Buffer,
  },
  awards: [
    {
      name: {
        type: String,
        required: true,
      },
      period: {
        type: String,
        required: true,
      },
      details: {
        type: String,
        required: true,
      },
    },
  ],
  certificates: [
    {
      name: {
        type: String,
        required: true,
      },
      period: {
        type: String,
        required: true,
      },
      details: {
        type: String,
        required: true,
      },
    },
  ],
});

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
