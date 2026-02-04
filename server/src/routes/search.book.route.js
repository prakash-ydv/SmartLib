import router from "express";
import { searchBookByTitle, searchByViews, searchByPage, searchUnAvailbleBooks } from "../controllers/search.book.controller.js";

const searchBookRouter = router();

searchBookRouter.get("/book", searchBookByTitle)

// search book by view count
searchBookRouter.get("/search-by-views", searchByViews)

// search book by page
searchBookRouter.get("/all-books", searchByPage)

// search unavailble books
searchBookRouter.get("/unavailable-books", searchUnAvailbleBooks)

export default searchBookRouter;
