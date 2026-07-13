import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { changePassword, getCurrentUser, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);

router.get("/me", protect, getCurrentUser);

router.patch("/change-password", protect, changePassword);

export default router;