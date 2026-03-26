import Router from "express";
import { changeVisiblityOfBook, getBookDescription } from "../controllers/feature.controller.js";
import { isAdminLoggedIn } from "../middlewares/checkAdminLogedIn.js";

const router = Router();

// ─── EXISTING ROUTE — NOT TOUCHED ─────────────────────────────────────────────
router.patch("/change-visiblity/:id", isAdminLoggedIn, changeVisiblityOfBook);

// ─── NEW ROUTE — DESCRIPTION ──────────────────────────────────────────────────
router.get("/description/:id", getBookDescription);

export default router;