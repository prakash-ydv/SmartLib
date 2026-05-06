import Router from "express";
import { getBookById } from "../controllers/book.controller.js";

const bookRouter = Router();

bookRouter.get("/:id", getBookById);

export default bookRouter;
