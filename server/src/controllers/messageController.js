import prisma from "../lib/db.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { ChatService } from "../service/chat.service.js";
import { AIService } from "../cli/ai/google-service.js";

const chatService = new ChatService();
const aiService = new AIService();

/**
 * Send message and get AI response
 * POST /api/conversations/:id/messages
 *
 * Supports both regular response and streaming response
 */
export async function sendMessage(req, res, next) {
  try {
    const userId = req.userId;
    const { id: conversationId } = req.validatedParams || req.params;
    const { content, role = "user", stream = false } = req.body;

    // Validate input
    if (!content || content.trim().length === 0) {
      return res
        .status(400)
        .json(
          sendError("VALIDATION_ERROR", "Message content cannot be empty", 400),
        );
    }

    // Check conversation ownership
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userId },
    });

    if (!conversation) {
      return res
        .status(404)
        .json(sendError("NOT_FOUND", "Conversation not found", 404));
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        conversationId,
        role: "user",
        content,
      },
    });

    // If streaming is requested, use SSE
    if (stream === true || req.headers.accept === "text/event-stream") {
      return handleStreamingResponse(
        req,
        res,
        next,
        conversationId,
        userMessage,
      );
    }

    // Otherwise, get full response and return
    try {
      // Get conversation history
      const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
      });

      // Format for AI
      const aiMessages = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Get AI response
      const aiResponse = await aiService.sendMessage(aiMessages);

      // Save AI response
      const assistantMessage = await prisma.message.create({
        data: {
          conversationId,
          role: "assistant",
          content: aiResponse.content,
        },
      });

      // Update conversation timestamp
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      return res.status(201).json(
        sendSuccess(
          {
            userMessage,
            assistantMessage,
          },
          201,
        ),
      );
    } catch (aiError) {
      console.error("AI Service Error:", aiError);

      // Delete the user message if AI fails
      await prisma.message.delete({
        where: { id: userMessage.id },
      });

      return next(aiError);
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Handle streaming response via Server-Sent Events (SSE)
 */
async function handleStreamingResponse(
  req,
  res,
  next,
  conversationId,
  userMessage,
) {
  try {
    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const sendEvent = (type, data) => {
      res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);
    };

    try {
      // Get conversation history
      const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
      });

      // Format for AI
      const aiMessages = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Track streamed content
      let fullResponse = "";

      // Get streaming response
      const aiResponse = await aiService.sendMessage(aiMessages, (chunk) => {
        fullResponse += chunk;
        sendEvent("message_chunk", { chunk });
      });

      // Save assistant message
      const assistantMessage = await prisma.message.create({
        data: {
          conversationId,
          role: "assistant",
          content: fullResponse || aiResponse.content,
        },
      });

      // Update conversation timestamp
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      // Send completion event
      sendEvent("message_complete", {
        messageId: assistantMessage.id,
        totalTokens: aiResponse.usage?.totalTokens || 0,
      });

      res.end();
    } catch (streamError) {
      console.error("Streaming error:", streamError);

      // Delete user message if stream fails
      await prisma.message.delete({
        where: { id: userMessage.id },
      });

      sendEvent("error", { message: streamError.message });
      res.end();
    }
  } catch (error) {
    console.error("SSE setup error:", error);
    res.status(500).end();
  }
}

/**
 * Delete a message
 * DELETE /api/messages/:id
 */
export async function deleteMessage(req, res, next) {
  try {
    const userId = req.userId;
    const { id } = req.validatedParams || req.params;

    // Get message and verify ownership
    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        conversation: {
          select: { userId: true },
        },
      },
    });

    if (!message) {
      return res
        .status(404)
        .json(sendError("NOT_FOUND", "Message not found", 404));
    }

    if (message.conversation.userId !== userId) {
      return res
        .status(403)
        .json(
          sendError(
            "FORBIDDEN",
            "You don't have permission to delete this message",
            403,
          ),
        );
    }

    // Delete message
    await prisma.message.delete({
      where: { id },
    });

    return res.status(200).json(sendSuccess({ id, deleted: true }, 200));
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single message
 * GET /api/messages/:id
 */
export async function getMessage(req, res, next) {
  try {
    const userId = req.userId;
    const { id } = req.validatedParams || req.params;

    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        conversation: {
          select: { id: true, userId: true },
        },
      },
    });

    if (!message) {
      return res
        .status(404)
        .json(sendError("NOT_FOUND", "Message not found", 404));
    }

    if (message.conversation.userId !== userId) {
      return res
        .status(403)
        .json(
          sendError(
            "FORBIDDEN",
            "You don't have permission to view this message",
            403,
          ),
        );
    }

    const { conversation, ...messageData } = message;
    return res.status(200).json(sendSuccess(messageData, 200));
  } catch (error) {
    next(error);
  }
}
