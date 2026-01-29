const bookRouter = require("express").Router();
const { getAllBooks } = require("../controllers/books.controller");

bookRouter.get("/all", getAllBooks);

module.exports = bookRouter;
