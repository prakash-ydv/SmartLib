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

async function deleteBooksByBatch(req, res) {
    try {
        const { batchID } = req.params;
        const result = await Book.deleteMany({ batchID });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No books found with this batch ID" });
        }
        res.json({ 
            message: `${result.deletedCount} book(s) deleted successfully`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error("Error deleting books by batch:", error);
        res.status(500).json({ message: "Failed to delete books by batch" });
    }
}

export { deleteBook, deleteBooksByBatch };