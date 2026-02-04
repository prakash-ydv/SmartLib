import Book from "../models/book.model.js";

async function deleteBook(req, res) {
    try {
        const { bookId } = req.params;
        const book = await Book.findByIdAndDelete(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Failed to delete book" });
    }
}

export default deleteBook;