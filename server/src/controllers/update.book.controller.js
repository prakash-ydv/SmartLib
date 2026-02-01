import bookModel from "../models/book.model.js";
import adminModel from "../models/admin.model.js";

async function updateBookController(req, res) {
    try {
        // check if admin is logged in
        const adminId = req.adminId;

        if (!adminId) {
            return res.status(401).json({
                status: "failed",
                message: "Admin not logged in"
            });
        }

        const admin = await adminModel.findById(adminId);

        if (!admin) {
            return res.status(401).json({
                status: "failed",
                message: "token expired"
            });
        }

        const { id } = req.params;   // one book → id from URL

        console.log("id", id);
        const updates = req.body;    // only changed fields

        const book = await bookModel.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({
                status: "failed",
                message: "Book not found"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Book updated successfully",
            book
        });
    } catch (error) {
        console.log("error in update book", error);
        return res.status(500).json({
            status: "failed",
            message: "Internal server error"
        });
    }
}

async function updateBookViewCount(req, res) {
    try {
        const { id } = req.params;

        console.log("update book ID", id);
        const book = await bookModel.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!book) {
            return res.status(404).json({
                status: "failed",
                message: "Book not found"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Book view count updated successfully",
            book
        });
    } catch (error) {
        console.log("error in update book view count", error);
        return res.status(500).json({
            status: "failed",
            message: "Internal server error"
        });
    }
}

export { updateBookController, updateBookViewCount };
