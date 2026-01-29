const express = require("express");
const cors = require("cors");
const bookRouter = require("./routes/books.routes");
const connectDB = require("./db/db.connect");
const excelToJSON = require("./utils/excelToJSON");
const agriculturebookSchema = require("./models/agriculturebooks.model");

const app = express();

// DB
connectDB();

// Core middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/books", bookRouter);

// Health Check
app.get("/health", (req, res) => {
  res.status(500).json({
    status: "running",
  });
});

app.get("/excel", async (req, res) => {
  try {
    const convertedBooks = excelToJSON("./books.xlsx");
    if (convertedBooks) {
      const books = await agriculturebookSchema.insertMany(convertedBooks);

      if (books) {
        return res.json({
          status: "success",
          message: "converted successfully",
          books,
        });
      }
    } else {
      return res.json({
        message: "gadbad hai re baba",
      });
    }
  } catch (error) {
    return res.json({
      status: "failed",
      message: error,
    });
  }
});

app.get("/get/books/agriculture", async (req, res) => {
  const books = await agriculturebookSchema.find({});

  if (books) {
    return res.json({
      status: "success",
      data: books,
    });
  } else {
    return res.json({
      status: "failed",
      message: "failed to fetch",
    });
  }
});

app.get("/book/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const book = await agriculturebookSchema.findOne({ _id: id });

  if (book) {
    return res.json({
      status: "success",
      data: book,
    });
  } else {
    return res.json({
      status: "failed",
      message: "failed to fetch",
    });
  }
});

module.exports = app;
