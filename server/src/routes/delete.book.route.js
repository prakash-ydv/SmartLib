import Router from "express";
const deleteRouter = Router();

import { deleteBook, deleteBooksByBatch } from "../controllers/delete.book.controller.js";
import { isAdminLoggedIn } from "../middlewares/checkAdminLogedIn.js";

deleteRouter.delete("/:bookId", isAdminLoggedIn, deleteBook);
deleteRouter.delete("/batch/:batchID", isAdminLoggedIn, deleteBooksByBatch);

export default deleteRouter;
