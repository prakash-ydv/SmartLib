import router from "express";
import multer from 'multer';
import { addBulkBookFromSheet, addOneBook } from "../controllers/add.book.controller.js";
import {isAdminLoggedIn} from "../middlewares/checkAdminLogedIn.js";

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedExtensions = [".csv", ".xlsx", ".xls"];
        const fileName = file.originalname.toLowerCase();
        const isAllowed = allowedExtensions.some((ext) => fileName.endsWith(ext));

        if (!isAllowed) {
            return cb(new Error("Only .csv, .xlsx and .xls files are allowed"));
        }
        cb(null, true);
    },
});

const addBookRouter = router();

addBookRouter.post("/one", isAdminLoggedIn, addOneBook);

addBookRouter.post("/bulk/excel", isAdminLoggedIn, upload.single("file"), addBulkBookFromSheet);
addBookRouter.post("/bulk/upload", isAdminLoggedIn, upload.single("file"), addBulkBookFromSheet);

addBookRouter.use((error, req, res, next) => {
    if (!error) return next();
    if (error instanceof multer.MulterError) {
        return res.status(400).json({
            status: "failed",
            message: error.message,
        });
    }
    return res.status(400).json({
        status: "failed",
        message: error.message || "Invalid upload request",
    });
});

export default addBookRouter;
