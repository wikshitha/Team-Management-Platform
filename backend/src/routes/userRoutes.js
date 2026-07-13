import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { createUser, deleteUser, getUserById, getUsers, updateUser, updateUserRole, updateUserStatus } from "../controllers/userController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("ADMIN"));

router.route("/").get(getUsers).post(createUser);

router.patch("/:id/status", updateUserStatus);

router.patch("/:id/role", updateUserRole);

router
  .route("/:id")
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

export default router;