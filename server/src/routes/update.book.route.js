import router from "express";
import { updateBookController, updateBookViewCount } from "../controllers/update.book.controller.js";
import { isAdminLoggedIn } from "../middlewares/checkAdminLogedIn.js";

const updateBookRouter = router();


// update book data by admin
updateBookRouter.patch("/book/:id", isAdminLoggedIn, updateBookController);

// update book view count
updateBookRouter.patch("/book/views/:id", updateBookViewCount);

export default updateBookRouter;
