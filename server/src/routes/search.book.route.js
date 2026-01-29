import router from "express";
import { searchBookByTitle } from "../controllers/search.book.controller.js";

const searchBookRouter = router();

searchBookRouter.get("/book", searchBookByTitle)

export default searchBookRouter;
