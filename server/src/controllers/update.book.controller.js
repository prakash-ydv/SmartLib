import mongoose from "mongoose";
import Book, { FACULTIES, DEPARTMENTS } from "../models/book.model.js";
import adminModel from "../models/admin.model.js";

// ─── ALLOWED UPDATE FIELDS ────────────────────────────────────────────────────
const ALLOWED_FIELDS = new Set([
  "title",
  "description",
  "author",
  "faculty",        // NEW
  "departments",    // NEW (array)
  "subjects",       // NEW (array)
  "tags",           // NEW (array)
  "language",       // NEW
  "isbn",
  "publisher",
  "edition",
  "cover_url",
  "copies",
  "isAvailable",
]);

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function parseArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value.split(/[,;|]/).map((v) => v.trim()).filter(Boolean);
  }
  return [];
}

function getSafeUpdates(body) {
  const updates = {};

  for (const [key, value] of Object.entries(body || {})) {
    if (!ALLOWED_FIELDS.has(key)) continue;

    // Array fields
    if (["departments", "subjects", "tags", "copies"].includes(key)) {
      updates[key] = parseArray(value);
      continue;
    }

    // cover_url empty → null
    if (key === "cover_url") {
      updates[key] = value === "" || value === null ? null : value;
      continue;
    }

    updates[key] = value;
  }

  return updates;
}

// ─── UPDATE BOOK ──────────────────────────────────────────────────────────────
async function updateBookController(req, res) {
  try {
    const adminId = req.adminId;

    if (!adminId) {
      return res.status(401).json({ status: "failed", message: "Admin not logged in" });
    }

    const admin = await adminModel.findById(adminId);
    if (!admin) {
      return res.status(401).json({ status: "failed", message: "Token expired" });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "failed", message: "Invalid book id" });
    }

    const updates = getSafeUpdates(req.body);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: "failed",
        message: "Koi valid update field nahi diya",
      });
    }

    // Faculty validate karo agar update ho rahi hai
    if (updates.faculty && !FACULTIES.includes(updates.faculty)) {
      return res.status(400).json({
        status: "failed",
        message: `Invalid faculty: ${updates.faculty}`,
      });
    }

    // Departments validate karo agar update ho rahe hain
    if (updates.departments) {
      const invalid = updates.departments.filter((d) => !DEPARTMENTS.includes(d));
      if (invalid.length > 0) {
        return res.status(400).json({
          status: "failed",
          message: `Invalid departments: ${invalid.join(", ")}`,
        });
      }
    }

    const book = await Book.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ status: "failed", message: "Book not found" });
    }

    return res.status(200).json({
      status: "success",
      message: "Book successfully updated",
      book,
    });
  } catch (error) {
    console.error("updateBookController error:", error);
    return res.status(500).json({ status: "failed", message: "Internal server error" });
  }
}

// ─── UPDATE VIEW COUNT ────────────────────────────────────────────────────────
async function updateBookViewCount(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "failed", message: "Invalid book id" });
    }

    const book = await Book.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ status: "failed", message: "Book not found" });
    }

    return res.status(200).json({
      status: "success",
      message: "View count updated",
      book,
    });
  } catch (error) {
    console.error("updateBookViewCount error:", error);
    return res.status(500).json({ status: "failed", message: "Internal server error" });
  }
}

export { updateBookController, updateBookViewCount };