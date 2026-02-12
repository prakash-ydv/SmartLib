import express from "express";
import multer from "multer";
import upload from "../middlewares/upload.js";
import { uploadImage } from "../controllers/upload.controller.js";
import { isAdminLoggedIn } from "../middlewares/checkAdminLogedIn.js";

const uploadRouter = express.Router();

// Upload a single image
uploadRouter.post("/image", isAdminLoggedIn, upload.single("file"), uploadImage);

// Error handling for Multer
uploadRouter.use((error, req, res, next) => {
    console.log(error);
    if (error instanceof multer.MulterError) {
        return res.status(400).json({
            status: "failed",
            message: error.message,
        });
    } else if (error) {
        return res.status(500).json({
            status: "error",
            message: error.message || "An unknown error occurred during upload.",
        });
    }
    next();
});

export default uploadRouter;
