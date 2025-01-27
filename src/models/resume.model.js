const mongoose = require("mongoose");

const resumeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
