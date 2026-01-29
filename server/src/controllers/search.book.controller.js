import Book from "../models/book.model.js";

async function searchBookByTitle(req, res) {
    const { title } = req.query;
    console.log("searching book for", title)
    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }

    try {

        const book = await Book.find({ title: { $regex: title, $options: "i" } });

        if (book) {
            return res.status(200).json({ status: "success", data: book });
        }

    } catch (error) {
        return res.status(500).json({ status: "failed", message: error.message });
    }
}

export { searchBookByTitle };