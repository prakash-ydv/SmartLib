import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    author: {
        type: String
    },
    department: {
        type: String,
        required: true,
        enum: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "MBA", "MCA", "BBA", "BCA", "B.COM", "B.SC", "B.PHARM", "B.ARCH", "B.DES", "B.ED", "B.LLB", "B.PT", "B.HM", "B.MS", "B.AS", "B.FA", "B.FT", "AGRICULTURE"]
    },
    isbn: {
        type: String,
        unique: true,
        sparse: true  // ✅ FIX: Allows multiple null/undefined ISBN values
    },
    publisher: {
        type: String,
    },
    edition: {
        type: String,
    },
    cover_url: {
        type: String,
    },
    copies: {
        type: [String],
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    batchID : {
        type : String,
        default : () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
        }
    }
});

const Book = mongoose.model("Book", bookSchema);

export default Book;