import Book from "../models/book.model.js";

async function getDashboardStatController(req, res) {
    try {
        const totalBooks = await Book.countDocuments();
        const availableBooks = await Book.countDocuments({ isAvailable: true });
        const unavailableBooks = totalBooks - availableBooks;

        return res.status(200).json({
            status: "success",
            data: {
                totalBooks,
                availableBooks,
                unavailableBooks
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export default getDashboardStatController;