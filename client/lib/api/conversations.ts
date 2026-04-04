import apiClient from "./client";

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  mode: "chat" | "tool" | "agent";
  lastMessage?: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasMore: boolean;
  };
}

export interface ConversationResponse {
  success: boolean;
  data: Conversation;
}

export const conversationAPI = {
  // Get all conversations
  getConversations: async (params?: PaginationParams) => {
    const response = await apiClient.get<PaginatedResponse<Conversation>>(
      "/api/conversations",
      { params },
    );
    return response.data;
  },

  // Get single conversation
  getConversation: async (id: string) => {
    const response = await apiClient.get<ConversationResponse>(
      `/api/conversations/${id}`,
    );
    return response.data;
  },

  // Create conversation
  createConversation: async (data: {
    title?: string;
    mode?: "chat" | "tool" | "agent";
  }) => {
    const response = await apiClient.post<ConversationResponse>(
      "/api/conversations",
      data,
    );
    return response.data;
  },

  // Update conversation
  updateConversation: async (id: string, data: { title: string }) => {
    const response = await apiClient.put<ConversationResponse>(
      `/api/conversations/${id}`,
      data,
    );
    return response.data;
  },

  // Delete conversation
  deleteConversation: async (id: string) => {
    const response = await apiClient.delete<{
      success: boolean;
      data: { id: string; deleted: boolean };
    }>(`/api/conversations/${id}`);
    return response.data;
  },

  // Get conversation messages
  getConversationMessages: async (
    conversationId: string,
    params?: PaginationParams,
  ) => {
    const response = await apiClient.get<PaginatedResponse<Message>>(
      `/api/conversations/${conversationId}/messages`,
      { params },
    );
    return response.data;
  },
};
