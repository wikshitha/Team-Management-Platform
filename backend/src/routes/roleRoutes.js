import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getRoles } from "../controllers/roleController.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("ADMIN"), getRoles);

export default router;