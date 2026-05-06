import mongoose from "mongoose";
import bookModel from "../models/book.model.js";
import adminModel from "../models/admin.model.js";

const ALLOWED_BOOK_UPDATE_FIELDS = new Set([
  "title",
  "description",
  "author",
  "department",
  "isbn",
  "publisher",
  "edition",
  "cover_url",
  "copies",
  "isAvailable",
]);

function getSafeBookUpdates(body) {
  const updates = {};

  for (const [key, value] of Object.entries(body || {})) {
    if (ALLOWED_BOOK_UPDATE_FIELDS.has(key)) {
      updates[key] = value;
    }
  }

  if (Object.prototype.hasOwnProperty.call(updates, "cover_url")) {
    if (updates.cover_url === "" || updates.cover_url === null) {
      updates.cover_url = null;
    }
  }

  return updates;
}

async function updateBookController(req, res) {
  try {
    const adminId = req.adminId;

    if (!adminId) {
      return res.status(401).json({
        status: "failed",
        message: "Admin not logged in",
      });
    }

    const admin = await adminModel.findById(adminId);

    if (!admin) {
      return res.status(401).json({
        status: "failed",
        message: "token expired",
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid book id",
      });
    }

    const updates = getSafeBookUpdates(req.body);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: "failed",
        message: "No valid update fields provided",
      });
    }

    const book = await bookModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({
        status: "failed",
        message: "Book not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.log("error in update book", error);
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
}

async function updateBookViewCount(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid book id",
      });
    }

    const book = await bookModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({
        status: "failed",
        message: "Book not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Book view count updated successfully",
      book,
    });
  } catch (error) {
    console.log("error in update book view count", error);
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
}

export { updateBookController, updateBookViewCount };
