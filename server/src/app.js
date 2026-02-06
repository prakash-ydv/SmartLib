import express from "express";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import cookieParser from "cookie-parser";

const app = express();

import dotenv from 'dotenv';


import addBookRouter from "./routes/add.book.route.js";
import adminRouter from "./routes/admin.route.js";
import searchBookRouter from "./routes/search.book.route.js";
import updateBookRouter from "./routes/update.book.route.js";
import deleteBookRouter from "./routes/delete.book.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import featureRouter from "./routes/feature.route.js";

dotenv.config();

// middleware
app.use(express.json());
app.use(cors({
    origin: true, // ✅ Allows any origin (dynamically reflects request origin) and supports credentials
    credentials: true
}));
app.use(cookieParser());

// connect DB
connectDB()

// routes
app.use("/add", addBookRouter);
app.use("/search", searchBookRouter);
app.use("/update", updateBookRouter);
app.use("/delete", deleteBookRouter);
app.use("/dashboard", dashboardRouter);
app.use("/feature", featureRouter);

// admin routes
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
    res.send("API running 🚀");
});

export default app;