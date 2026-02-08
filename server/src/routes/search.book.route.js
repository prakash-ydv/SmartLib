import router from "express";
import { searchBookByTitle, searchByViews, searchByPage, searchUnAvailbleBooks,searchBooksWithoutImage } from "../controllers/search.book.controller.js";

const searchBookRouter = router();

searchBookRouter.get("/book", searchBookByTitle)

// search book by view count
searchBookRouter.get("/most-viewed", searchByViews)

// search book by page
searchBookRouter.get("/all-books", searchByPage)

// search unavailble books
searchBookRouter.get("/unavailable-books", searchUnAvailbleBooks)

// search books without image
searchBookRouter.get("/without-image", searchBooksWithoutImage)

export default searchBookRouter;
