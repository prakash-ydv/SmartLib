import router from "express";
import { searchBookByTitle, searchByViews, searchByPage, searchUnAvailbleBooks,searchBooksWithoutImage } from "../controllers/search.book.controller.js";
import { isAdminLoggedIn } from "../middlewares/checkAdminLogedIn.js";

const searchBookRouter = router();

searchBookRouter.get("/book",isAdminLoggedIn, searchBookByTitle)

// search book by view count
searchBookRouter.get("/most-viewed",isAdminLoggedIn, searchByViews)

// search book by page
searchBookRouter.get("/all-books",isAdminLoggedIn, searchByPage)

// search unavailble books
searchBookRouter.get("/unavailable-books",isAdminLoggedIn, searchUnAvailbleBooks)

// search books without image
searchBookRouter.get("/without-image",isAdminLoggedIn, searchBooksWithoutImage)

export default searchBookRouter;
