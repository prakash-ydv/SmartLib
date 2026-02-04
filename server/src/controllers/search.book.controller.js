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

async function searchByViews(req, res) {
    try {
        // query params with defaults
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);

        const skip = (page - 1) * limit;

        const [books, total] = await Promise.all([
            Book.find()
                .sort({ views: -1 })
                .skip(skip)
                .limit(limit),
            Book.countDocuments()
        ]);

        return res.status(200).json({
            status: "success",
            pagination: {
                totalItems: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                pageSize: limit
            },
            data: books
        });

    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message
        });
    }
}

async function searchByPage(req, res) {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);

        const skip = (page - 1) * limit;

        const [books, total] = await Promise.all([
            Book.find()
                .skip(skip)
                .limit(limit),
            Book.countDocuments()
        ]);

        return res.status(200).json({
            status: "success",
            pagination: {
                totalItems: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                pageSize: limit
            },
            data: books
        });

    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message
        });
    }
}

async function searchUnAvailbleBooks(req, res) {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);

        const skip = (page - 1) * limit;

        const [books, total] = await Promise.all([
            Book.find({ isAvailable: false })
                .skip(skip)
                .limit(limit),
            Book.countDocuments({ isAvailable: false })
        ]);

        return res.status(200).json({
            status: "success",
            pagination: {
                totalItems: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                pageSize: limit
            },
            data: books
        });

    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message
        });
    }
}

export { searchBookByTitle, searchByViews, searchByPage, searchUnAvailbleBooks };