import { Router } from "express";
import {
  getConversations,
  getConversation,
  createConversation,
  updateConversation,
  deleteConversation,
  getConversationMessages,
} from "../controllers/conversationController.js";
import { sendMessage } from "../controllers/messageController.js";
import {
  authMiddleware,
  ownershipMiddleware,
} from "../middleware/authMiddleware.js";
import {
  validateBody,
  validateQuery,
  validateParams,
} from "../middleware/validateRequest.js";
import {
  conversationSchemas,
  querySchemas,
  messageSchemas,
} from "../validation/schemas.js";
import z from "zod";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /api/conversations
 * List all conversations for authenticated user
 */
router.get(
  "/",
  validateQuery(querySchemas.conversationsList),
  getConversations,
);

/**
 * POST /api/conversations
 * Create new conversation
 */
router.post(
  "/",
  validateBody(conversationSchemas.createConversation),
  createConversation,
);

/**
 * GET /api/conversations/:id
 * Get single conversation with all messages
 */
router.get(
  "/:id",
  validateParams(z.object({ id: z.string() })),
  ownershipMiddleware,
  getConversation,
);

/**
 * PUT /api/conversations/:id
 * Update conversation (rename, etc.)
 */
router.put(
  "/:id",
  validateParams(z.object({ id: z.string() })),
  validateBody(conversationSchemas.updateConversation),
  ownershipMiddleware,
  updateConversation,
);

/**
 * DELETE /api/conversations/:id
 * Delete conversation and all its messages
 */
router.delete(
  "/:id",
  validateParams(z.object({ id: z.string() })),
  ownershipMiddleware,
  deleteConversation,
);

/**
 * GET /api/conversations/:id/messages
 * Get messages for a conversation with pagination
 */
router.get(
  "/:id/messages",
  validateParams(z.object({ id: z.string() })),
  validateQuery(querySchemas.conversationMessages),
  getConversationMessages,
);

/**
 * POST /api/conversations/:id/messages
 * Send message and get AI response
 * Supports both regular and streaming responses
 */
router.post(
  "/:id/messages",
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

export default router;
