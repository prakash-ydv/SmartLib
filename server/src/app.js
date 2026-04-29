// src/app.js

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

// ✅ Parse allowed origins from environment variable
// In production .env: ALLOWED_ORIGINS=https://smartlibrary2.netlify.app
// In development .env: ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// ✅ Fallback origins always included (covers common dev ports)
const DEV_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
];

const ALL_ORIGINS = [
  ...new Set([
    ...ALLOWED_ORIGINS,
    ...(process.env.NODE_ENV !== "production" ? DEV_ORIGINS : []),
    "https://smartlibrary2.netlify.app", // always allow production frontend
  ]),
];

// ✅ CORS must come BEFORE all routes and BEFORE express.json()
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests (no origin header) and Postman
      if (!origin) return callback(null, true);

      if (ALL_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`🚫 CORS blocked: ${origin}`);
      return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
    optionsSuccessStatus: 200, // ✅ Fix for older browsers/clients
  })
);

// ✅ Handle preflight for ALL routes explicitly
app.options("*", cors());

app.use(express.json());
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
app.use("/admin", adminRouter);

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "SmartLib API running 🚀" });
});

// ✅ Global error handler (catches CORS errors too)
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.message);
  const status = err.status || 500;
  res.status(status).json({ success: false, message: err.message });
});

export default app;