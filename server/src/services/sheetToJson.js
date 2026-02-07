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
};

function normalizeKey(value) {
    return value.toString().trim().toLowerCase().replace(/\s+/g, "_");
}

function normalizeDepartment(rawDepartment) {
    if (!rawDepartment) return "AGRICULTURE";
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

    return undefined;
}

function parseCopies(rawValue) {
    if (rawValue === undefined || rawValue === null || rawValue === "") return [];

    return rawValue
        .toString()
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
        const rawData = xlsx.utils.sheet_to_json(sheet, { defval: "" });
        report.totalRows = rawData.length;

        if (!rawData.length) {
            report.success = false;
            report.message = "Sheet is empty";
            return report;
        }

        const booksMap = new Map();

        rawData.forEach((row, index) => {
            const rowNumber = index + 2;
            const title = getValueFromRow(row, "title")?.toString().trim();

            if (!title) {
                report.skipped += 1;
                report.errors.push(`Row ${rowNumber}: title is required`);
                return;
            }

            const departmentRaw = getValueFromRow(row, "department");
            const department = normalizeDepartment(departmentRaw || "AGRICULTURE");

            if (!allowedDepartments.has(department)) {
                report.skipped += 1;
                report.errors.push(`Row ${rowNumber}: invalid department "${departmentRaw}"`);
                return;
            }

            const book = {
                title,
                description: getValueFromRow(row, "description")?.toString().trim() || "",
                author: getValueFromRow(row, "author")?.toString().trim() || "Unknown",
                department,
                isbn: getValueFromRow(row, "isbn")?.toString().trim() || undefined,
                publisher: getValueFromRow(row, "publisher")?.toString().trim() || "",
                edition: getValueFromRow(row, "edition")?.toString().trim() || "",
                cover_url: getValueFromRow(row, "cover_url")?.toString().trim() || "",
                copies: parseCopies(getValueFromRow(row, "acc")),
            };

            const key = title.toLowerCase();
            if (booksMap.has(key)) {
                booksMap.set(key, mergeBooks(booksMap.get(key), book));
            } else {
                booksMap.set(key, book);
            }
            report.validRows += 1;
        });

        for (const book of booksMap.values()) {
            try {
                const existing = await Book.findOne({ title: book.title });

                if (!existing) {
                    await Book.create(book);
                    report.inserted += 1;
                    continue;
                }

                if (book.isbn && existing.isbn && book.isbn !== existing.isbn) {
                    report.skipped += 1;
                    report.errors.push(`Title "${book.title}" skipped: conflicting ISBN`);
                    continue;
                }

                const mergedCopies = Array.from(
                    new Set([...(existing.copies || []), ...(book.copies || [])])
                );

                existing.description = book.description || existing.description;
                existing.author = book.author || existing.author;
                existing.department = book.department || existing.department;
                existing.isbn = existing.isbn || book.isbn;
                existing.publisher = book.publisher || existing.publisher;
                existing.edition = book.edition || existing.edition;
                existing.cover_url = book.cover_url || existing.cover_url;
                existing.copies = mergedCopies;
                existing.updatedAt = new Date();

                await existing.save();
                report.updated += 1;
            } catch (error) {
                report.skipped += 1;
                report.errors.push(`Title "${book.title}": ${error.message}`);
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
