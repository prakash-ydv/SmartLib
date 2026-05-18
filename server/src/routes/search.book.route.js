import Book, { FACULTIES, DEPARTMENTS } from "../models/book.model.js";
import xlsx from "xlsx";

// ─── BATCH ID ─────────────────────────────────────────────────────────────────
function generateBatchId(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ─── FIELD ALIASES ────────────────────────────────────────────────────────────
// Excel column names → schema field mapping
const FIELD_ALIASES = {
  title:       ["title", "tittle", "book_title", "name"],
  description: ["description", "desc", "about"],
  author:      ["author", "auther", "writer"],
  faculty:     ["faculty", "faculty_name"],                          // NEW
  departments: ["departments", "department", "dept", "branch"],      // NEW (array)
  subjects:    ["subjects", "subject"],                              // NEW
  tags:        ["tags", "tag", "keywords"],                          // NEW
  language:    ["language", "lang"],                                 // NEW
  isbn:        ["isbn", "isbn13", "book_isbn"],
  publisher:   ["publisher", "publication"],
  edition:     ["edition", "ed"],
  cover_url:   ["cover_url", "cover", "coverurl", "image", "image_url"],
  acc:         ["acc", "accession", "accession_no", "accession_number", "copy", "copies"],
};

// ─── FACULTY ALIASES ──────────────────────────────────────────────────────────
// Excel mein alag spelling ho sakti hai
const FACULTY_ALIASES = {
  "ENGINEERING":              "Engineering & Technology",
  "ENGINEERING & TECHNOLOGY": "Engineering & Technology",
  "ENGG":                     "Engineering & Technology",
  "COMPUTER APPLICATIONS":    "Computer Applications",
  "CA":                       "Computer Applications",
  "MANAGEMENT":               "Management & Commerce",
  "MANAGEMENT & COMMERCE":    "Management & Commerce",
  "COMMERCE":                 "Management & Commerce",
  "SCIENCE":                  "Science",
  "AGRICULTURE":              "Agriculture",
  "AGRI":                     "Agriculture",
  "PHARMACY":                 "Pharmacy",
  "PHARMA":                   "Pharmacy",
  "MEDICAL":                  "Medical & Allied Health",
  "MEDICAL & ALLIED HEALTH":  "Medical & Allied Health",
  "ALLIED HEALTH":            "Medical & Allied Health",
  "LAW":                      "Law",
  "ARCHITECTURE":             "Architecture & Planning",
  "ARCH":                     "Architecture & Planning",
  "ARTS":                     "Arts & Humanities",
  "ARTS & HUMANITIES":        "Arts & Humanities",
  "HUMANITIES":               "Arts & Humanities",
  "COMPETITIVE":              "Competitive Exams",
  "COMPETITIVE EXAMS":        "Competitive Exams",
  "RESEARCH":                 "Research & Reference",
  "RESEARCH & REFERENCE":     "Research & Reference",
  "NON-ACADEMIC":             "Non-Academic",
  "NON ACADEMIC":             "Non-Academic",
  "GENERAL":                  "Non-Academic",
};

// ─── UTILS ────────────────────────────────────────────────────────────────────
function normalizeKey(value) {
  return value.toString().trim().toLowerCase().replace(/\s+/g, "_");
}

function cleanValue(rawValue) {
  if (rawValue === null || rawValue === undefined) return null;
  const str = rawValue.toString().trim();
  if (str === "" || str.toLowerCase() === "none") return null;
  return str;
}

function getValueFromRow(row, field) {
  const aliases = FIELD_ALIASES[field] || [field];
  const rowEntries = Object.entries(row);

  for (const alias of aliases) {
    const match = rowEntries.find(([key]) => normalizeKey(key) === normalizeKey(alias));
    if (match && match[1] !== undefined && match[1] !== null && match[1] !== "") {
      return match[1];
    }
  }
  return null;
}

// "CSE, IT, BCA" → ["CSE", "IT", "BCA"]
function parseArrayField(rawValue) {
  const cleaned = cleanValue(rawValue);
  if (!cleaned) return [];
  return cleaned.split(/[;,|]/).map((v) => v.trim()).filter(Boolean);
}

function parseCopies(rawValue) {
  return parseArrayField(rawValue);
}

// Faculty normalize karo
function normalizeFaculty(rawFaculty) {
  if (!rawFaculty) return null;
  const upper = rawFaculty.toString().trim().toUpperCase();
  return FACULTY_ALIASES[upper] || null;
}

function mergeBooks(base, incoming) {
  return {
    ...base,
    description: base.description || incoming.description,
    author:      base.author      || incoming.author,
    isbn:        base.isbn        || incoming.isbn,
    publisher:   base.publisher   || incoming.publisher,
    edition:     base.edition     || incoming.edition,
    cover_url:   base.cover_url   || incoming.cover_url,
    language:    base.language    || incoming.language,
    departments: Array.from(new Set([...(base.departments || []), ...(incoming.departments || [])])),
    subjects:    Array.from(new Set([...(base.subjects    || []), ...(incoming.subjects    || [])])),
    tags:        Array.from(new Set([...(base.tags        || []), ...(incoming.tags        || [])])),
    copies:      Array.from(new Set([...(base.copies      || []), ...(incoming.copies      || [])])),
  };
}

// ─── MAIN FUNCTION ────────────────────────────────────────────────────────────
export async function sheetToJson(sheet) {
  const report = {
    success:   true,
    message:   "Import completed",
    totalRows: 0,
    validRows: 0,
    inserted:  0,
    updated:   0,
    skipped:   0,
    errors:    [],
  };

  const batchID = generateBatchId();

  try {
    const rawData = xlsx.utils.sheet_to_json(sheet);
    report.totalRows = rawData.length;

    if (!rawData.length) {
      report.success = false;
      report.message = "Sheet is empty";
      return report;
    }

    const booksMap = new Map();

    rawData.forEach((row, index) => {
      const rowNumber = index + 2;

      // Title required
      const title = cleanValue(getValueFromRow(row, "title"));
      if (!title) {
        report.skipped++;
        report.errors.push(`Row ${rowNumber}: title is required`);
        return;
      }

      // Faculty required
      const facultyRaw = getValueFromRow(row, "faculty");
      const faculty = normalizeFaculty(facultyRaw);

      if (!faculty || !FACULTIES.includes(faculty)) {
        report.skipped++;
        report.errors.push(
          `Row ${rowNumber}: invalid/missing faculty "${facultyRaw || "EMPTY"}" — valid values: ${FACULTIES.join(", ")}`
        );
        return;
      }

      // Departments (optional - validate jo diye hain)
      const departmentsRaw = getValueFromRow(row, "departments");
      const departments = parseArrayField(departmentsRaw).filter((d) => {
        if (DEPARTMENTS.includes(d)) return true;
        report.errors.push(`Row ${rowNumber}: unknown department "${d}" ignored`);
        return false;
      });

      const book = {
        title,
        faculty,
        departments,
        subjects:    parseArrayField(getValueFromRow(row, "subjects")),
        tags:        parseArrayField(getValueFromRow(row, "tags")),
        description: cleanValue(getValueFromRow(row, "description")) || "",
        author:      cleanValue(getValueFromRow(row, "author"))      || "",
        isbn:        cleanValue(getValueFromRow(row, "isbn")),
        publisher:   cleanValue(getValueFromRow(row, "publisher"))   || "",
        edition:     cleanValue(getValueFromRow(row, "edition"))     || "",
        cover_url:   cleanValue(getValueFromRow(row, "cover_url"))   || "",
        language:    cleanValue(getValueFromRow(row, "language"))    || "English",
        copies:      parseCopies(getValueFromRow(row, "acc")),
        batchID,
      };

      const key = title.toLowerCase();
      booksMap.set(key, booksMap.has(key) ? mergeBooks(booksMap.get(key), book) : book);
      report.validRows++;
    });

    // ── DB mein save karo ────────────────────────────────────────────
    for (const book of booksMap.values()) {
      try {
        const existing = await Book.findOne({ title: book.title });

        if (!existing) {
          await Book.create(book);
          report.inserted++;
          continue;
        }

        // ISBN conflict check
        if (book.isbn && existing.isbn && book.isbn !== existing.isbn) {
          report.skipped++;
          report.errors.push(
            `"${book.title}" skipped: conflicting ISBN (existing: ${existing.isbn}, new: ${book.isbn})`
          );
          continue;
        }

        // Merge aur update
        existing.description = book.description || existing.description;
        existing.author      = book.author      || existing.author;
        existing.faculty     = book.faculty     || existing.faculty;
        existing.departments = Array.from(new Set([...(existing.departments || []), ...(book.departments || [])]));
        existing.subjects    = Array.from(new Set([...(existing.subjects    || []), ...(book.subjects    || [])]));
        existing.tags        = Array.from(new Set([...(existing.tags        || []), ...(book.tags        || [])]));
        existing.isbn        = existing.isbn || book.isbn;
        existing.publisher   = book.publisher || existing.publisher;
        existing.edition     = book.edition   || existing.edition;
        existing.cover_url   = book.cover_url || existing.cover_url;
        existing.language    = book.language  || existing.language;
        existing.copies      = Array.from(new Set([...(existing.copies || []), ...(book.copies || [])]));
        existing.batchID     = existing.batchID || book.batchID;

        await existing.save();
        report.updated++;

      } catch (error) {
        report.skipped++;
        if (error.code === 11000) {
          const field = Object.keys(error.keyPattern || {})[0] || "unknown";
          report.errors.push(`"${book.title}": duplicate ${field}`);
        } else {
          report.errors.push(`"${book.title}": ${error.message}`);
        }
      }
    }

    if (report.inserted === 0 && report.updated === 0) {
      report.success = false;
      report.message = "Koi book import nahi hui";
    }

    return report;
  } catch (error) {
    return {
      ...report,
      success: false,
      message: "Sheet process karne mein error",
      errors:  [error.message],
    };
  }
}