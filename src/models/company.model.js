const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
  email: {
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

companySchema.methods.comparePassword = function (plainPassword, cb) {
  if (plainPassword === this.password) {
    cb(null, true);
  } else {
    cb(null, false);
  }
  return cb({ error: "error" });
};

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
