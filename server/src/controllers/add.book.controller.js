import xlsx from "xlsx";
import Book from "../models/book.model.js";
import { sheetToJson } from "../services/sheetToJson.js";

function generateBatchId(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

function cleanOptionalString(value) {
  if (value === undefined || value === null) return null;
  const cleaned = String(value).trim();
  return cleaned === "" ? null : cleaned;
}

function normalizeCopies(value) {
  if (value === undefined || value === null || value === "") return [];

  if (Array.isArray(value)) {
    return value.map((copy) => String(copy).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[;,|]/)
      .map((copy) => copy.trim())
      .filter(Boolean);
  }

  return null;
}

async function addOneBook(req, res) {
  const title = cleanOptionalString(req.body.title);
  const department = cleanOptionalString(req.body.department);
  const copies = normalizeCopies(req.body.copies);

  if (!title || !department) {
    return res.status(400).json({
      status: "failed",
      message: "title and department are required",
    });
  }

  if (!Book.schema.path("department").enumValues.includes(department)) {
    return res.status(400).json({
      status: "failed",
      message: "Invalid department",
    });
  }

  if (copies === null) {
    return res.status(400).json({
      status: "failed",
      message: "copies must be an array or a separated string",
    });
  }

  try {
    const book = await Book.create({
      title,
      author: cleanOptionalString(req.body.author),
      isbn: cleanOptionalString(req.body.isbn),
      department,
      copies,
      description: cleanOptionalString(req.body.description),
      publisher: cleanOptionalString(req.body.publisher),
      edition: cleanOptionalString(req.body.edition),
      cover_url: cleanOptionalString(req.body.cover_url),
      batchID: generateBatchId(6),
    });

    return res.status(201).json({
      status: "success",
      message: "Book added successfully",
      data: book,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: "failed",
        message: "Book with this title or ISBN already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }

    console.error("addOneBook:", error);
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
}

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
        message: "Uploaded file does not contain any sheet.",
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
