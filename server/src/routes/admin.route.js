import router from "express";
import { createAdminRoute, loginAdminRoute } from "../controllers/admin.controller.js";

const adminRouter = router();

adminRouter.post("/create", createAdminRoute);
adminRouter.post("/login", loginAdminRoute);


export default adminRouter;