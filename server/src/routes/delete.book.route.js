import Router from "express";
const deleteRouter = Router();

import deleteBook from "../controllers/delete.book.controller.js";
import { isAdminLoggedIn } from "../middlewares/checkAdminLogedIn.js";

deleteRouter.delete("/:bookId", isAdminLoggedIn, deleteBook);

export default deleteRouter;
