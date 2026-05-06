import mongoose from "mongoose";
import { fixISBNIndex } from "../utlis/fixIndex.js";

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");

  try {
    await fixISBNIndex();
  } catch (indexError) {
    console.log("Index fix skipped:", indexError.message);
    console.log("App will continue normally");
  }
};

export default connectDB;
