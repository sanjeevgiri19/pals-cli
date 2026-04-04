import prisma from "../lib/db.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/response.js";
import { getPaginationParams, formatPagination } from "../lib/pagination.js";

/**
 * Get all conversations for user
 * GET /api/conversations
 */
export async function getConversations(req, res, next) {
  try {
    const userId = req.userId;
    const {
      page = 1,
      limit = 50,
      sort = "desc",
    } = req.validatedQuery || req.query;

    // Get pagination params
    const { skip, take } = getPaginationParams(page, limit);

    // Get total count
    const total = await prisma.conversation.count({
      where: { userId },
    });

    // Get conversations
    const conversations = await prisma.conversation.findMany({
      where: { userId },
      select: {
        id: true,
        userId: true,
        title: true,
        mode: true,
        createdAt: true,
        updatedAt: true,
        messages: {
          select: { content: true },
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: sort === "asc" ? "asc" : "desc" },
      skip,
      take,
    });

    // Format response with pagination
    const formatted = conversations.map((conv) => ({
      ...conv,
      lastMessage: conv.messages[0]?.content || null,
      messages: undefined,
    }));

    const response = sendPaginated(formatted, total, page, limit, 200);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * Get single conversation
 * GET /api/conversations/:id
 */
export async function getConversation(req, res, next) {
  try {
    const userId = req.userId;
    const { id } = req.validatedParams || req.params;

    const conversation = await prisma.conversation.findFirst({
      where: { id, userId },
      include: {
        messages: {
          select: {
            id: true,
            role: true,
            content: true,
            createdAt: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return res
        .status(404)
        .json(sendError("NOT_FOUND", "Conversation not found", 404));
    }

    return res.status(200).json(sendSuccess(conversation, 200));
  } catch (error) {
    next(error);
  }
}

/**
 * Create new conversation
 * POST /api/conversations
 */
export async function createConversation(req, res, next) {
  try {
    const userId = req.userId;
    const { title, mode = "chat" } = req.validated;

    const conversation = await prisma.conversation.create({
      data: {
        userId,
        title: title || `New ${mode} conversation`,
        mode,
      },
    });

    return res.status(201).json(sendSuccess(conversation, 201));
  } catch (error) {
    next(error);
  }
}

/**
 * Update conversation (rename, update mode, etc)
 * PUT /api/conversations/:id
 */
export async function updateConversation(req, res, next) {
  try {
    const userId = req.userId;
    const { id } = req.validatedParams || req.params;
    const { title } = req.validated;

    // Check ownership
    const conversation = await prisma.conversation.findFirst({
      where: { id, userId },
    });

    if (!conversation) {
      return res
        .status(404)
        .json(sendError("NOT_FOUND", "Conversation not found", 404));
    }

    // Update conversation
    const updated = await prisma.conversation.update({
      where: { id },
      data: { title },
    });

    return res.status(200).json(sendSuccess(updated, 200));
  } catch (error) {
    next(error);
  }
}

/**
 * Delete conversation
 * DELETE /api/conversations/:id
 */
export async function deleteConversation(req, res, next) {
  try {
    const userId = req.userId;
    const { id } = req.validatedParams || req.params;

    // Check ownership
    const conversation = await prisma.conversation.findFirst({
      where: { id, userId },
    });

    if (!conversation) {
      return res
        .status(404)
        .json(sendError("NOT_FOUND", "Conversation not found", 404));
    }

    // Delete conversation (cascade deletes messages)
    await prisma.conversation.delete({
      where: { id },
    });

    return res.status(200).json(sendSuccess({ id, deleted: true }, 200));
  } catch (error) {
    next(error);
  }
}

/**
 * Get conversation messages with pagination
 * GET /api/conversations/:id/messages
 */
export async function getConversationMessages(req, res, next) {
  try {
    const userId = req.userId;
    const { id } = req.validatedParams || req.params;
    const {
      page = 1,
      limit = 50,
      sort = "desc",
    } = req.validatedQuery || req.query;

    // Check conversation ownership
    const conversation = await prisma.conversation.findFirst({
      where: { id, userId },
    });

    if (!conversation) {
      return res
        .status(404)
        .json(sendError("NOT_FOUND", "Conversation not found", 404));
    }

    // Get pagination params
    const { skip, take } = getPaginationParams(page, limit);

    // Get total count
    const total = await prisma.message.count({
      where: { conversationId: id },
    });

    // Get messages
    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      select: {
        id: true,
        conversationId: true,
        role: true,
        content: true,
        createdAt: true,
      },
      orderBy: { createdAt: sort === "asc" ? "asc" : "desc" },
      skip,
      take,
    });

    const response = sendPaginated(messages, total, page, limit, 200);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
