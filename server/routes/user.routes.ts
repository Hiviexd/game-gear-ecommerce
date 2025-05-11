// @ts-nocheck
import { Router } from "express";
import { register, login, getCurrentUser } from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, getCurrentUser);

export default router;
