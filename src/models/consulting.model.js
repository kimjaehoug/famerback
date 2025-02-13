const mongoose = require("mongoose");

const consultingSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  districtType: {
    type: String,
    required: true,
  },
  industries: {
    type: [String],
    required: true,
  },
  infras: {
    type: [String],
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
});

const Consulting = mongoose.model("Consulting", consultingSchema);

module.exports = Consulting;
