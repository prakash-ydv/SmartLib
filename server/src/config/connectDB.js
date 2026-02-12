import mongoose from "mongoose";
import { fixISBNIndex } from "../utlis/fixIndex.js";

const connectDB = async () => {
    try {
        // ✅ Step 1: Connect to MongoDB (SAME AS BEFORE)
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
        
        // ✅ Step 2: Fix ISBN index (SAFE - won't break connection)
        // This runs in background, won't affect existing connection
        try {
            await fixISBNIndex();
        } catch (indexError) {
            // ⚠️ If index fix fails, connection still works
            console.log("⚠️ Index fix skipped:", indexError.message);
            console.log("✅ App will continue normally");
        }
        
    } catch (error) {
        // ❌ Only fails if MongoDB connection fails (same as before)
        console.log(error);
    }
};

export default connectDB;