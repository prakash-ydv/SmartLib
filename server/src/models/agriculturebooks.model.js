const mongoose = require("mongoose");

const agriculturebookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  author: {
    type: String,
    required: true,
  },
  accNos: [String],
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
  college: {
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
  year: {
    type: Number,
  },
  bookImage: {
    type: String,
    default: "NEEDS_MANUAL",
  },
  isbnNo: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("agricultureBook", agriculturebookSchema);
