import Router from "express";
import getDashboardStatController from "../controllers/dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.get("/stats", getDashboardStatController);


export default dashboardRouter;