import xlsx from "xlsx";
import Book from "../models/book.model.js";
import { sheetToJson } from "../services/sheetToJson.js";

async function addOneBook(req, res) {

    const isbn = req.body.isbn ?? null;
    const title = req.body.title ?? null;
    const author = req.body.author ?? null;
    const department = req.body.department ?? null;
    const copies = req.body.copies ?? null;
    const description = req.body.description ?? null;
    const publisher = req.body.publisher ?? null;
    const edition = req.body.edition ?? null;
    const cover_url = req.body.cover_url ?? null;

    // validate required fields
    if (!title || !department) {
        return res.status(400).json({
            status: "failed",
            message: "title and department are required",
        });
    }

    try {
        // add record
        const book = await Book.create({
            title,
            author,
            isbn,
            department,
            copies,
            description,
            publisher,
            edition,
            cover_url
        });

        console.log("One Book Added");

        return res.status(201).json({
            status: "success",
            message: "Book added successfully",
            data: book
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: "failed",
            message: "Internal server error",
            error: error.message
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
            error: error.message
        });
    }
}

export { addOneBook, addBulkBookFromSheet };
