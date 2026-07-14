import express from "express";

import {
  createTask,
  deleteTask,
  getMyTasks,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskStatus,
} from "../controllers/taskController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getTasks)
  .post(
    authorizeRoles("ADMIN", "PROJECT_MANAGER"),
    createTask
  );

router.get(
  "/my",
  authorizeRoles("TEAM_MEMBER"),
   getMyTasks
  );

router.patch("/:id/status", updateTaskStatus);

router
  .route("/:id")
  .get(getTaskById)
  .patch(
    authorizeRoles("ADMIN", "PROJECT_MANAGER"),
    updateTask
  )
  .delete(
    authorizeRoles("ADMIN", "PROJECT_MANAGER"),
    deleteTask
  );

export default router;