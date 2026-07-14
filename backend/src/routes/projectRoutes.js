import express from "express";

import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../controllers/projectController.js";

import {
  addProjectMember,
  getProjectMembers,
  removeProjectMember,
} from "../controllers/projectMemberController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getProjectTasks } from "../controllers/taskController.js";
import { getAvailableProjectMembers } from "../controllers/teamMemberController.js";
import { getProjectStatistics } from "../controllers/projectStatisticsController.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getProjects)
  .post(
    authorizeRoles("ADMIN", "PROJECT_MANAGER"),
    createProject
  );

router.get(
  "/:projectId/available-members",
  authorizeRoles("ADMIN", "PROJECT_MANAGER"),
  getAvailableProjectMembers
);

router.get("/:projectId/tasks", getProjectTasks);

router.get(
  "/:id/statistics",
  authorizeRoles("ADMIN", "PROJECT_MANAGER"),
   getProjectStatistics
  );

router
  .route("/:id/members")
  .get(getProjectMembers)
  .post(
    authorizeRoles("ADMIN", "PROJECT_MANAGER"),
    addProjectMember
  );

router.delete(
  "/:id/members/:userId",
  authorizeRoles("ADMIN", "PROJECT_MANAGER"),
  removeProjectMember
);

router
  .route("/:id")
  .get(getProjectById)
  .patch(
    authorizeRoles("ADMIN", "PROJECT_MANAGER"),
    updateProject
  )
  .delete(authorizeRoles("ADMIN"), deleteProject);

export default router;