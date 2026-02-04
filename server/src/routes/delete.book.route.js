import Router from "express";
const deleteRouter = Router();

import deleteBook from "../controllers/delete.book.controller.js";

deleteRouter.delete("/:bookId", deleteBook);

export default deleteRouter;
