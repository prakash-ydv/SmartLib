import express from "express";
import {
  searchBookByTitle,
  searchByViews,
  searchByPage,
  searchUnAvailbleBooks,
  searchBooksWithoutImage,
} from "../controllers/search.book.controller.js";

const searchBookRouter = express.Router();

// search book by title
searchBookRouter.get("/book", searchBookByTitle);

// search book by view count
searchBookRouter.get("/most-viewed", searchByViews);

// search all books (pagination)
searchBookRouter.get("/all-books", searchByPage);

// search unavailable books
searchBookRouter.get("/unavailable-books", searchUnAvailbleBooks);

// search books without image
searchBookRouter.get("/without-image", searchBooksWithoutImage);

export default searchBookRouter;