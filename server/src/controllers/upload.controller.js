import Book from "../models/book.model.js";

export const uploadImage = async (req, res) => {
    console.log(req.body);
    try {
        console.log(req.file);
        if (!req.file) {
            return res.status(400).json({
                status: "failed",
                message: "No image file provided",
            });
        }

        const { bookId } = req.body;

        // ✅ If bookId is provided, update the book
        let book = null;
        if (bookId) {
            book = await Book.findById(bookId);
            if (!book) {
                return res.status(404).json({
                    status: "failed",
                    message: "Book not found",
                });
            }
            book.cover_url = req.file.path;
            await book.save();
        }

        return res.status(200).json({
            status: "success",
            message: bookId ? "Image uploaded and book updated successfully" : "Image uploaded successfully",
            data: {
                url: req.file.path,
                public_id: req.file.filename,
                book, // will be null if no bookId provided
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message || "An error occurred while uploading image",
        });
    }
};
