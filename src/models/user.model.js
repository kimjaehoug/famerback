const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  skillSet: {
    type: [String],
  },
  dateOfBirth: {
    type: String,
    required: true,
    format: /^\d{4}\/\d{2}\/\d{2}$/,
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
    format: /^\d{3}-\d{4}-\d{4}$/,
  },
  degrees: [
    {
      type: {
        type: String,
        required: true,
      },
      institution: {
        type: String,
        required: true,
      },
      major: {
        type: String,
        required: true,
      },
      GPA: {
        type: String,
        required: true,
      },
      gradStatus: {
        type: String,
        required: true,
      },
      gradYearMonth: {
        type: String,
        required: true,
      },
    },
  ],
  foreignLanguages: [
    {
      name: {
        type: String,
        required: true,
      },
      period: {
        type: String,
        required: true,
      },
      score: {
        type: String,
        required: true,
      },
    },
  ],
  email: {
    type: String,
    unique: true,
    required: true,
  },
  id: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minLength: 8,
    required: true,
  },
  introduction: {
    type: String,
  },
  applications: [
    {
      jobPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobPost",
      },
      resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume",
      },
    },
  ],
  token: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
