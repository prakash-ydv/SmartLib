import mongoose from "mongoose";
import Book from "../models/book.model.js";
import getOrGenerateDescription from "../services/description.service.js";

async function changeVisiblityOfBook(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid book id",
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        status: "failed",
        message: "Book not found",
      });
    }

    book.isAvailable = !book.isAvailable;
    await book.save();

    return res.status(200).json({
      status: "success",
      message: "Book visibility changed successfully",
      data: { isAvailable: book.isAvailable },
    });
  } catch (error) {
    console.error("changeVisiblityOfBook:", error);
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
}

async function getBookDescription(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid book id",
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        status: "failed",
        message: "Book not found",
      });
    }

    const description = await getOrGenerateDescription(book);

    return res.status(200).json({
      status: "success",
      description,
    });
  } catch (error) {
    console.error("getBookDescription:", error.message);
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
}

export { changeVisiblityOfBook, getBookDescription };
