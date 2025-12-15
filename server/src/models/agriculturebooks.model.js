const mongoose = require("mongoose");

const agriculturebookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  accNo: {
    type: String,
    required: true,
    unique: true,
  },
  publisher: {
    type: String,
  },
  supplier: {
    type: String,
  },
  edition: {
    type: String,
  },
  language: {
    type: String,
  },
  library: {
    type: String,
    default: "iesuniversity",
  },
  department: {
    type: String,
    default: "agriculture",
  },
  branch: {
    type: String,
  },
  subBranch: {
    type: String,
  },
  bookImage: {
    type: String,
    default: "NEEDS_MANUAL",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("agricultureBook", agriculturebookSchema);
