import prisma from "../lib/db.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { ChatService } from "../service/chat.service.js";
import { AIService } from "../cli/ai/google-service.js";

const chatService = new ChatService();
const aiService = new AIService();

/**
 * Create a user message for a conversation and produce an assistant reply via the AI service, supporting both immediate JSON responses and Server-Sent Events streaming.
 *
 * Validates that `content` is non-empty, verifies the conversation belongs to the authenticated user, persists the user message, and then:
 * - If streaming is requested (`req.body.stream === true` or `Accept: text/event-stream`), delegates to the streaming handler which streams incremental AI chunks, persists the final assistant message, and emits completion/error events.
 * - Otherwise, loads conversation history, requests a full AI response, persists the assistant message, updates the conversation's `updatedAt`, and returns both stored messages with HTTP 201.
 *
 * On AI generation failure in the non-streaming flow, deletes the previously created user message and forwards the error to `next`.
 *
 * @param {import('express').Request} req - Express request; expects `req.userId` (authenticated user), `req.validatedParams?.id || req.params.id` (conversation id), and `req.body` containing `content` (string), optional `role` (ignored for persistence), and optional `stream` (boolean).
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next middleware for error forwarding.
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

      // Set up tools based on conversation mode
      let tools = undefined;
      if (conversation.mode === "agent" || conversation.mode === "tool") {
        const { availableTools } = await import("../config/tool.config.js");
        tools = {};
        for (const toolConfig of availableTools) {
          try {
             tools[toolConfig.id] = toolConfig.getTool();
          } catch (e) {
             console.error(`Failed to init tool ${toolConfig.id}:`, e.message);
          }
        }
      }

      // Get AI response
      const aiResponse = await aiService.sendMessage(
        aiMessages, 
        undefined, // onChunk
        tools
      );

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
            toolCalls: aiResponse.toolCalls,
            toolResults: aiResponse.toolResults
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
 * Stream AI-generated assistant content to the client over Server-Sent Events (SSE), persist the final assistant message, and update the conversation's timestamp.
 *
 * Emits SSE events:
 * - `message_chunk` for each incremental content chunk with payload `{ chunk }`.
 * - `message_complete` when streaming finishes with payload `{ messageId, totalTokens }`.
 * - `error` if streaming fails with payload `{ message }`.
 *
 * @param {string} conversationId - ID of the conversation to which the assistant message will belong.
 * @param {Object} userMessage - The previously persisted user message object; must include `id` so it can be deleted if streaming fails.
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
      // Get conversation details to check mode
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { mode: true }
      });

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

      // Set up tools based on conversation mode
      let tools = undefined;
      if (conversation?.mode === "agent" || conversation?.mode === "tool") {
        const { availableTools } = await import("../config/tool.config.js");
        tools = {};
        for (const toolConfig of availableTools) {
           try {
             tools[toolConfig.id] = toolConfig.getTool();
           } catch (e) {
             console.error(`Failed to init tool ${toolConfig.id}:`, e.message);
           }
        }
      }

      // Track streamed content
      let fullResponse = "";

      // Get streaming response
      const aiResponse = await aiService.sendMessage(
        aiMessages, 
        (chunk) => {
          fullResponse += chunk;
          sendEvent("message_chunk", { chunk });
        },
        tools,
        (toolCall) => {
          sendEvent("tool_call", { toolCall });
        }
      );

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
 * Deletes a message by id if it belongs to the authenticated user.
 *
 * Sends HTTP responses:
 * - 200 with { id, deleted: true } when deletion succeeds.
 * - 404 if the message does not exist.
 * - 403 if the message exists but the conversation is not owned by the authenticated user.
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
 * Retrieve a single message by ID if it belongs to the authenticated user.
 *
 * Responds with HTTP 200 and the message object (conversation field omitted) when found
 * and owned by the requester. Responds with HTTP 404 if the message does not exist,
 * HTTP 403 if the message exists but belongs to a different user, and forwards other
 * errors to the next middleware.
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
