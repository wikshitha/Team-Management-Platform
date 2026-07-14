import express from "express";

import {
  getTeamMembers,
} from "../controllers/teamMemberController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

router.get(
  "/",
  authorizeRoles("ADMIN", "PROJECT_MANAGER"),
  getTeamMembers
);

export default router;