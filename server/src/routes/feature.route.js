import Router from "express";
import changeVisiblityOfBook from "../controllers/feature.controller.js";
import { isAdminLoggedIn } from "../middlewares/checkAdminLogedIn.js";

const router = Router();

router.patch("/change-visiblity/:id", isAdminLoggedIn, changeVisiblityOfBook);

export default router;