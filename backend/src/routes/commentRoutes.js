import express from "express";

import {
  createTaskComment,
  deleteComment,
  getTaskComments,
  updateComment,
} from "../controllers/commentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/tasks/:taskId/comments")
  .get(getTaskComments)
  .post(createTaskComment);

router
  .route("/comments/:id")
  .patch(updateComment)
  .delete(deleteComment);

export default router;