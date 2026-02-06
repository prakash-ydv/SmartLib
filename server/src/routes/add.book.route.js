import router from "express";
import multer from 'multer';
import { addBulkBookFromSheet, addOneBook } from "../controllers/add.book.controller.js";
import {isAdminLoggedIn} from "../middlewares/checkAdminLogedIn.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const addBookRouter = router();

addBookRouter.post("/one", isAdminLoggedIn, addOneBook);

addBookRouter.post("/bulk/excel", isAdminLoggedIn, upload.single("file"), addBulkBookFromSheet);

export default addBookRouter;