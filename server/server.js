import app from "./src/app.js";
import connectDB from "./src/config/connectDB.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // ✅ WAIT for DB connection (MOST IMPORTANT FIX)
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server Started http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();