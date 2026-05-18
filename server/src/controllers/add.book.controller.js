import xlsx from "xlsx";
import Book, { FACULTIES, DEPARTMENTS } from "../models/book.model.js";
import { sheetToJson } from "../services/sheetToJson.js";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function generateBatchId(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function cleanString(value) {
  if (value === undefined || value === null) return null;
  const cleaned = String(value).trim();
  return cleaned === "" ? null : cleaned;
}

// String ya Array dono handle karta hai
// "CSE, IT, BCA" → ["CSE", "IT", "BCA"]
function parseArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value.split(/[,;|]/).map((v) => v.trim()).filter(Boolean);
  }
  return [];
}

function normalizeCopies(value) {
  if (value === undefined || value === null || value === "") return [];
  if (Array.isArray(value)) return value.map((c) => String(c).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value.split(/[;,|]/).map((c) => c.trim()).filter(Boolean);
  }
  return null;
}

// ─── ADD ONE BOOK ─────────────────────────────────────────────────────────────
async function addOneBook(req, res) {
  const title   = cleanString(req.body.title);
  const faculty = cleanString(req.body.faculty);
  const copies  = normalizeCopies(req.body.copies);

  // Required fields check
  if (!title || !faculty) {
    return res.status(400).json({
      status: "failed",
      message: "title aur faculty required hain",
    });
  }

  // Faculty valid hai?
  if (!FACULTIES.includes(faculty)) {
    return res.status(400).json({
      status: "failed",
      message: `Invalid faculty. Valid values: ${FACULTIES.join(", ")}`,
    });
  }

  // Departments validate karo (agar diye hain)
  const departments = parseArray(req.body.departments);
  const invalidDepts = departments.filter((d) => !DEPARTMENTS.includes(d));
  if (invalidDepts.length > 0) {
    return res.status(400).json({
      status: "failed",
      message: `Invalid departments: ${invalidDepts.join(", ")}`,
    });
  }

  if (copies === null) {
    return res.status(400).json({
      status: "failed",
      message: "copies must be an array or comma-separated string",
    });
  }

  try {
    const book = await Book.create({
      title,
      faculty,
      departments,
      subjects:     parseArray(req.body.subjects),
      tags:         parseArray(req.body.tags),
      author:       cleanString(req.body.author)      || "",
      isbn:         cleanString(req.body.isbn),
      description:  cleanString(req.body.description) || "",
      publisher:    cleanString(req.body.publisher)   || "",
      edition:      cleanString(req.body.edition)     || "",
      cover_url:    cleanString(req.body.cover_url)   || "",
      language:     cleanString(req.body.language)    || "English",
      copies,
      batchID:      generateBatchId(),
    });

    return res.status(201).json({
      status: "success",
      message: "Book successfully added",
      data: book,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: "failed",
        message: "Is title ya ISBN ki book pehle se exist karti hai",
      });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
    console.error("addOneBook error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
}

// ─── BULK UPLOAD FROM SHEET ───────────────────────────────────────────────────
async function addBulkBookFromSheet(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "failed",
        message: "Please upload a CSV or Excel file.",
      });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      return res.status(400).json({
        status: "failed",
        message: "Uploaded file mein koi sheet nahi hai.",
      });
    }

    const sheet = workbook.Sheets[sheetName];
    const result = await sheetToJson(sheet);

    if (!result.success) {
      return res.status(400).json({
        status: "failed",
        message: result.message || "Bulk import failed",
        report: result,
      });
    }

    return res.status(200).json({
      status: "success",
      message: result.message || "Books imported successfully",
      count: result.inserted + result.updated,
      report: result,
    });
  } catch (error) {
    console.error("Bulk Upload Error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Failed to process sheet",
    });
  }
}

export { addOneBook, addBulkBookFromSheet };