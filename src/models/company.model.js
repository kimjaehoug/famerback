const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfFoundation: {
    type: String,
    required: true,
    format: /^\d{4}\/\d{2}\/\d{2}$/,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  introduction: {
    type: String,
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
  jobPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost",
    },
  ],
  token: {
    type: String,
  },
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
