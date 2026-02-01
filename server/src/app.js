import express from "express";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import addBookRouter from "./routes/add.book.route.js";
import adminRouter from "./routes/admin.route.js";
const app = express();

import dotenv from 'dotenv';
import searchBookRouter from "./routes/search.book.route.js";
dotenv.config();

// middleware
app.use(express.json());
app.use(cors());

// connect DB
connectDB()

// routes
app.use("/add", addBookRouter);
app.use("/search", searchBookRouter);
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
    res.send("API running 🚀");
});

export default app;