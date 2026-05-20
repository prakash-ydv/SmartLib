import express from "express";
import Book from "../models/book.model.js";

const router = express.Router();

// GET /search?q=java
router.get("/", async (req, res) => {
  try {
    const query = req.query.q || "";

    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { subjects: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("Search Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;