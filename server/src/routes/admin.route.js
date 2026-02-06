import router from "express";
import { createAdminRoute, loginAdminRoute, getCurrentAdmin, logoutAdmin } from "../controllers/admin.controller.js";
import {isAdminLoggedIn} from "../middlewares/checkAdminLogedIn.js";

const adminRouter = router();

adminRouter.post("/create", createAdminRoute);
adminRouter.post("/login", loginAdminRoute);
adminRouter.post("/logout", logoutAdmin);
adminRouter.get("/me", isAdminLoggedIn, getCurrentAdmin);


export default adminRouter;