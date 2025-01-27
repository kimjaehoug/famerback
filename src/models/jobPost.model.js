const mongoose = require("mongoose");

const jobPostSchema = mongoose.Schema(
  {
    jobType: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    skillSets: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const JobPost = mongoose.model("JobPost", jobPostSchema);

module.exports = JobPost;
