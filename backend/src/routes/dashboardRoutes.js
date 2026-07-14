import express from "express";

import {
  getAdminDashboard,
  getManagerDashboard,
  getMemberDashboard,
} from "../controllers/dashboardController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

router.get(
  "/admin",
  authorizeRoles("ADMIN"),
  getAdminDashboard
);

router.get(
  "/manager",
  authorizeRoles("PROJECT_MANAGER"),
  getManagerDashboard
);

router.get(
  "/member",
  authorizeRoles("TEAM_MEMBER"),
  getMemberDashboard
);

export default router;