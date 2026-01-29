import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
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
        enum: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "MBA", "MCA", "BBA", "BCA", "B.COM", "B.SC", "B.PHARM", "B.ARCH", "B.DES", "B.ED", "B.LLB", "B.PT", "B.HM", "B.MS", "B.AS", "B.FA", "B.FT"]
    },
    isbn: {
        type: String,
        unique: true
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
    }

});

const Book = mongoose.model("Book", bookSchema);

export default Book;