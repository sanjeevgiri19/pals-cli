import prisma from "../lib/db.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/response.js";
import { getPaginationParams, formatPagination } from "../lib/pagination.js";

/**
 * Retrieve paginated conversations for the authenticated user, including each conversation's most recent message.
 *
 * Extracts `page`, `limit`, and `sort` from `req.validatedQuery` (or `req.query`), queries conversations owned by `req.userId`,
 * maps the most recent message content to `lastMessage`, and sends a paginated JSON response.
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
 * Retrieve a single conversation belonging to the authenticated user, including its messages.
 *
 * If the conversation exists and is owned by the requester, responds with HTTP 200 and the conversation
 * object with its messages ordered by `createdAt` ascending. If no matching conversation is found,
 * responds with HTTP 404 and an error payload.
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
 * Create a new conversation for the authenticated user.
 *
 * If `title` is not provided, assigns `New <mode> conversation`. Uses `mode` from the request and defaults it to `"chat"`.
 * @param {import('express').Request} req - Express request; expects `req.userId` and `req.validated` containing optional `title` and optional `mode`.
 * @param {import('express').Response} res - Express response.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} The created conversation object.
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
 * Update the title (and other updatable fields) of a conversation owned by the authenticated user.
 *
 * If the conversation does not exist or does not belong to the user, responds with a 404 error; on success responds with the updated conversation and HTTP 200.
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
 * Delete a conversation belonging to the authenticated user.
 *
 * Sends a 404 response when the conversation does not exist or is not owned by the user.
 * Sends a 200 response with `{ id, deleted: true }` when deletion succeeds.
 *
 * @param {import('express').Request} req - Express request; expects authenticated `req.userId` and route param `id` (or `req.validatedParams.id`).
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
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
 * Retrieve paginated messages for a user's conversation.
 *
 * Ensures the conversation identified by `req.validatedParams?.id || req.params.id` belongs to `req.userId`, then returns messages paginated by `page` and `limit` (taken from `req.validatedQuery || req.query`) and ordered by `sort`. Responds with HTTP 200 and a paginated payload on success, or HTTP 404 when the conversation is not found.
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
