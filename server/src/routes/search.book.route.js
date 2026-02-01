import router from "express";
import { searchBookByTitle, searchByViews } from "../controllers/search.book.controller.js";

const searchBookRouter = router();

searchBookRouter.get("/book", searchBookByTitle)

// search book by view count
searchBookRouter.get("/search-by-views", searchByViews)

export default searchBookRouter;
