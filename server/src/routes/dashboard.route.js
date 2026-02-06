import Router from "express";
import getDashboardStatController from "../controllers/dashboard.controller.js";
import { isAdminLoggedIn } from "../middlewares/checkAdminLogedIn.js";

const dashboardRouter = Router();

dashboardRouter.get("/stats", isAdminLoggedIn, getDashboardStatController);

export default dashboardRouter;