require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("DB Connected");
  } catch (error) {
    console.error("Connection to DB Failed...", error);
    process.exit(1);
  }
};

module.exports = connectDB;
