import express from "express";

import {
  searchBookByTitle,
  searchByViews,
  searchByPage,
  searchUnAvailbleBooks,
  searchBooksWithoutImage,
  getFacultyMeta,
} from "../controllers/search.book.controller.js";

const router = express.Router();

// MAIN SEARCH + ALL BOOKS
// /search/all-books?page=1&limit=24
router.get("/all-books", searchByPage);

// FACULTY META
// /search/faculty-meta
router.get("/faculty-meta", getFacultyMeta);

// SEARCH BY TITLE
// /search/title?title=java
router.get("/title", searchBookByTitle);

// MOST VIEWED BOOKS
// /search/views
router.get("/views", searchByViews);

// UNAVAILABLE BOOKS
// /search/unavailable
router.get("/unavailable", searchUnAvailbleBooks);

// BOOKS WITHOUT IMAGE
// /search/no-image
router.get("/no-image", searchBooksWithoutImage);

export default router;