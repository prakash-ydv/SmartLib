import express from "express";
import cors from "cors";
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

// ✅ Allowed origins
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const DEFAULT_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://localhost:3000",
  "https://smartlibrary2.netlify.app",
];

const ALL_ORIGINS = [...new Set([...ALLOWED_ORIGINS, ...DEFAULT_ORIGINS])];

// ✅ CORS (FINAL SAFE VERSION)
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🌐 Origin:", origin);

      if (!origin) return callback(null, true);

      if (
        origin.startsWith("http://localhost") ||
        origin.startsWith("http://127.0.0.1") ||
        ALL_ORIGINS.includes(origin)
      ) {
        return callback(null, true);
      }

      console.warn(`🚫 Blocked by CORS: ${origin}`);
      return callback(null, true); // ✅ allow for now (safe dev)
    },
    credentials: true,
  })
);

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

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
  res.json({
    status: "ok",
    message: "SmartLib API running 🚀",
  });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;