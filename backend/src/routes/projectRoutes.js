import express from "express";

import {
  archiveProject,
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

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getProjects)
  .post(
    authorizeRoles("ADMIN", "PROJECT_MANAGER"),
    createProject
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

router.patch(
  "/:id/archive",
  authorizeRoles("ADMIN", "PROJECT_MANAGER"),
  archiveProject
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