import express from "express";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import addBookRouter from "./routes/add.book.route.js";
import adminRouter from "./routes/admin.route.js";
import searchBookRouter from "./routes/search.book.route.js";
import updateBookRouter from "./routes/update.book.route.js";
import deleteBookRouter from "./routes/delete.book.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import featureRouter from "./routes/feature.route.js";
import uploadRouter from "./routes/upload.route.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://smartlibrary2.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ❌ REMOVE THIS LINE (important)
// app.options("/*", cors());

app.use(cookieParser());

// ✅ Connect DB
connectDB();

// ✅ Routes
app.use("/add", addBookRouter);
app.use("/search", searchBookRouter);
app.use("/update", updateBookRouter);
app.use("/delete", deleteBookRouter);
app.use("/dashboard", dashboardRouter);
app.use("/feature", featureRouter);
app.use("/upload", uploadRouter);

// ✅ Admin routes
app.use("/admin", adminRouter);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

export default app;