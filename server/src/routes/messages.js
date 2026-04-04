import { Router } from "express";
import { deleteMessage, getMessage } from "../controllers/messageController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateParams } from "../middleware/validateRequest.js";
import z from "zod";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /api/messages/:id
 * Get a single message
 */
router.get("/:id", validateParams(z.object({ id: z.string() })), getMessage);

/**
 * DELETE /api/messages/:id
 * Delete a message
 */
router.delete(
  "/:id",
  validateParams(z.object({ id: z.string() })),
  deleteMessage,
);

export default router;
