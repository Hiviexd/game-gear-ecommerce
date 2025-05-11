// @ts-nocheck
import { Router } from "express";
import { getItems, getItemById, getUserItems, createItem } from "../controllers/item.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getItems);
router.get("/mine", isAuthenticated, getUserItems);
router.get("/:id", getItemById);
router.post("/", isAuthenticated, createItem);

export default router;
