import mongoose from "mongoose";
import Book from "../models/book.model.js";

async function deleteBook(req, res) {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid book id",
      });
    }

    const book = await Book.findByIdAndDelete(bookId);

    if (!book) {
      return res.status(404).json({
        status: "failed",
        message: "Book not found",
      });
    }

    return res.json({
      status: "success",
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    return res.status(500).json({
      status: "failed",
      message: "Failed to delete book",
    });
  }
}

async function deleteBooksByBatch(req, res) {
  try {
    const { batchID } = req.params;

    if (!batchID || batchID.trim().length < 3) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid batch ID",
      });
    }

    const result = await Book.deleteMany({ batchID: batchID.trim() });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: "failed",
        message: "No books found with this batch ID",
      });
    }

    return res.json({
      status: "success",
      message: `${result.deletedCount} book(s) deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting books by batch:", error);
    return res.status(500).json({
      status: "failed",
      message: "Failed to delete books by batch",
    });
  }
}

export { deleteBook, deleteBooksByBatch };
