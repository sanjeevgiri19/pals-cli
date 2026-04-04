import { Router } from "express";
import {
  sendMessage,
  deleteMessage,
  getMessage,
} from "../controllers/messageController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateBody, validateParams } from "../middleware/validateRequest.js";
import { messageSchemas } from "../validation/schemas.js";
import z from "zod";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * POST /api/conversations/:id/messages
 * Send message and get AI response
 * Supports both regular and streaming responses
 */
router.post(
  "/conversations/:id/messages",
  validateParams(z.object({ id: z.string() })),
  validateBody(
    z.object({
      content: z.string().min(1).max(10000),
      role: z.enum(["user", "assistant"]).default("user"),
      stream: z.boolean().optional(),
    }),
  ),
  sendMessage,
);

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
