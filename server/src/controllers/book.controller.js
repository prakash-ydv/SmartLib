import mongoose from "mongoose";
import Book from "../models/book.model.js";

async function getBookById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid book id",
      });
    }

    const book = await Book.findById(id).lean();

    if (!book) {
      return res.status(404).json({
        status: "failed",
        message: "Book not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: book,
    });
  } catch (error) {
    console.error("getBookById:", error);
    return res.status(500).json({
      status: "failed",
      message: "Server Error",
    });
  }
}

export { getBookById };
