import z from "zod";

/**
 * Conversation Schemas
 */
export const conversationSchemas = {
  createConversation: z.object({
    title: z.string().min(1).max(200).optional(),
    mode: z.enum(["chat", "tool", "agent"]).default("chat"),
  }),

  updateConversation: z.object({
    title: z.string().min(1).max(200),
  }),

  deleteConversation: z.object({
    id: z.string().min(1),
  }),
};

/**
 * Message Schemas
 */
export const messageSchemas = {
  sendMessage: z.object({
    content: z.string().min(1).max(10000),
    role: z.enum(["user", "assistant"]).default("user"),
    conversationId: z.string().min(1),
  }),

  deleteMessage: z.object({
    id: z.string().min(1),
  }),
};

/**
 * Pagination Schema
 */
export const paginationSchema = z.object({
  page: z
    .string()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, "Page must be greater than 0"),
  limit: z
    .string()
    .default("50")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100"),
  sort: z.enum(["asc", "desc"]).default("desc"),
});

/**
 * Query Validation Schemas
 */
export const querySchemas = {
  conversationMessages: paginationSchema,
  conversationsList: paginationSchema,
};
