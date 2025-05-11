// @ts-nocheck
import { Router } from "express";
import { checkout, getOrders } from "../controllers/order.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.post("/checkout", isAuthenticated, checkout);
router.get("/", isAuthenticated, getOrders);

export default router;
