import Book from "../models/book.model.js";
import xlsx from "xlsx";

const FIELD_ALIASES = {
    title: ["title", "tittle", "book_title", "name"],
    description: ["description", "desc", "about"],
    author: ["author", "auther", "writer"],
    department: ["department", "departement", "dept"],
    isbn: ["isbn", "isbn13", "book_isbn"],
    publisher: ["publisher", "publication"],
    edition: ["edition", "ed"],
    cover_url: ["cover_url", "cover", "coverurl", "image", "image_url"],
    acc: ["acc", "accession", "accession_no", "accession_number", "copy", "copies"],
};

const DEPARTMENT_ALIASES = {
    CS: "CSE",
    CSE: "CSE",
    IT: "IT",
    ECE: "ECE",
    EEE: "EEE",
    EE: "EEE",
    ME: "MECH",
    MECH: "MECH",
    MECHANICAL: "MECH",
    CIVIL: "CIVIL",
    CE: "CIVIL",
    MBA: "MBA",
    MCA: "MCA",
    BBA: "BBA",
    BCA: "BCA",
    BCOM: "B.COM",
    "B.COM": "B.COM",
    BSC: "B.SC",
    "B.SC": "B.SC",
    BPHARM: "B.PHARM",
    "B.PHARM": "B.PHARM",
    BARCH: "B.ARCH",
    "B.ARCH": "B.ARCH",
    BDES: "B.DES",
    "B.DES": "B.DES",
    BED: "B.ED",
    "B.ED": "B.ED",
    BLLB: "B.LLB",
    "B.LLB": "B.LLB",
    BPT: "B.PT",
    "B.PT": "B.PT",
    BHM: "B.HM",
    "B.HM": "B.HM",
    BMS: "B.MS",
    "B.MS": "B.MS",
    BAS: "B.AS",
    "B.AS": "B.AS",
    BFA: "B.FA",
    "B.FA": "B.FA",
    BFT: "B.FT",
    "B.FT": "B.FT",
    AGRICULTURE: "AGRICULTURE",
    AGRI: "AGRICULTURE",
    AG: "AGRICULTURE",
};

function normalizeKey(value) {
    return value.toString().trim().toLowerCase().replace(/\s+/g, "_");
}

function normalizeDepartment(rawDepartment) {
    if (!rawDepartment) return null;
    
    const compact = rawDepartment
        .toString()
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "")
        .replace(/_/g, "")
        .replace(/-/g, "")
        .replace(/\./g, "");

    return DEPARTMENT_ALIASES[compact] || rawDepartment.toString().trim().toUpperCase();
}

function getValueFromRow(row, field) {
    const aliases = FIELD_ALIASES[field] || [field];
    const rowEntries = Object.entries(row);

    for (const alias of aliases) {
        const normalizedAlias = normalizeKey(alias);
        const match = rowEntries.find(([key]) => normalizeKey(key) === normalizedAlias);
        if (match && match[1] !== undefined && match[1] !== null && match[1] !== "") {
            return match[1];
        }
    }

    return null;
}

// ✅ FIX: Properly handle null, undefined, empty strings, and "None" text
function cleanValue(rawValue) {
    if (rawValue === null || rawValue === undefined) return null;
    
    const stringValue = rawValue.toString().trim();
    
    // Handle "None" text from Excel
    if (stringValue === "" || stringValue.toLowerCase() === "none") return null;
    
    return stringValue;
}

function parseCopies(rawValue) {
    const cleaned = cleanValue(rawValue);
    if (!cleaned) return [];

    return cleaned
        .split(/[;,|]/)
        .map((copy) => copy.trim())
        .filter(Boolean);
}

function mergeBooks(base, incoming) {
    return {
        title: base.title,
        description: base.description || incoming.description,
        author: base.author || incoming.author,
        department: base.department || incoming.department,
        isbn: base.isbn || incoming.isbn,
        publisher: base.publisher || incoming.publisher,
        edition: base.edition || incoming.edition,
        cover_url: base.cover_url || incoming.cover_url,
        copies: Array.from(new Set([...(base.copies || []), ...(incoming.copies || [])])),
    };
}

export async function sheetToJson(sheet) {
    const report = {
        success: true,
        message: "Import completed",
        totalRows: 0,
        validRows: 0,
        inserted: 0,
        updated: 0,
        skipped: 0,
        errors: [],
    };

    const allowedDepartments = new Set(Book.schema.path("department").enumValues);

    try {
        // ✅ FIX: Remove defval to properly handle empty cells
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
            
            // ✅ FIX: Use cleanValue for proper null handling
            const titleRaw = getValueFromRow(row, "title");
            const title = cleanValue(titleRaw);

            if (!title) {
                report.skipped += 1;
                report.errors.push(`Row ${rowNumber}: title is required`);
                return;
            }

            const departmentRaw = getValueFromRow(row, "department");
            const department = normalizeDepartment(departmentRaw);

            if (!department || !allowedDepartments.has(department)) {
                report.skipped += 1;
                report.errors.push(`Row ${rowNumber}: invalid or missing department "${departmentRaw || 'N/A'}"`);
                return;
            }

            // ✅ FIX: Clean all values and handle ISBN as null instead of undefined
            const descriptionRaw = getValueFromRow(row, "description");
            const authorRaw = getValueFromRow(row, "author");
            const isbnRaw = getValueFromRow(row, "isbn");
            const publisherRaw = getValueFromRow(row, "publisher");
            const editionRaw = getValueFromRow(row, "edition");
            const coverUrlRaw = getValueFromRow(row, "cover_url");
            const accRaw = getValueFromRow(row, "acc");

            const book = {
                title,
                description: cleanValue(descriptionRaw) || "",
                author: cleanValue(authorRaw) || "",
                department,
                isbn: cleanValue(isbnRaw), // ✅ null if empty (sparse index handles it)
                publisher: cleanValue(publisherRaw) || "",
                edition: cleanValue(editionRaw) || "",
                cover_url: cleanValue(coverUrlRaw) || "",
                copies: parseCopies(accRaw),
            };

            const key = title.toLowerCase();
            if (booksMap.has(key)) {
                booksMap.set(key, mergeBooks(booksMap.get(key), book));
            } else {
                booksMap.set(key, book);
            }
            report.validRows += 1;
        });

        // ✅ FIX: Process merged books with better error handling
        for (const book of booksMap.values()) {
            try {
                const existing = await Book.findOne({ title: book.title });

                if (!existing) {
                    // ✅ Insert new book
                    await Book.create(book);
                    report.inserted += 1;
                    continue;
                }

                // ✅ FIX: Handle ISBN conflict properly (both must have ISBN to conflict)
                if (book.isbn && existing.isbn && book.isbn !== existing.isbn) {
                    report.skipped += 1;
                    report.errors.push(`Title "${book.title}" skipped: conflicting ISBN (existing: ${existing.isbn}, new: ${book.isbn})`);
                    continue;
                }

                // ✅ Merge copies
                const mergedCopies = Array.from(
                    new Set([...(existing.copies || []), ...(book.copies || [])])
                );

                // ✅ FIX: Only update if new data exists (preserve existing data)
                existing.description = book.description || existing.description;
                existing.author = book.author || existing.author;
                existing.department = book.department || existing.department;
                existing.isbn = existing.isbn || book.isbn; // ✅ Keep existing ISBN if present
                existing.publisher = book.publisher || existing.publisher;
                existing.edition = book.edition || existing.edition;
                existing.cover_url = book.cover_url || existing.cover_url;
                existing.copies = mergedCopies;
                existing.updatedAt = new Date();

                await existing.save();
                report.updated += 1;
            } catch (error) {
                report.skipped += 1;
                
                // ✅ FIX: Better error messages
                if (error.code === 11000) {
                    // Duplicate key error
                    const field = Object.keys(error.keyPattern || {})[0] || 'unknown';
                    report.errors.push(`Title "${book.title}": duplicate ${field} value`);
                } else {
                    report.errors.push(`Title "${book.title}": ${error.message}`);
                }
            }
        }

        if (report.inserted === 0 && report.updated === 0) {
            report.success = false;
            report.message = "No books were imported";
        }

        return report;
    } catch (error) {
        return {
            ...report,
            success: false,
            message: "Failed to process sheet",
            errors: [error.message],
        };
    }
}