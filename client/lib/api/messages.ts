import apiClient from "./client";
import { Message } from "./conversations";

export interface SendMessageRequest {
  content: string;
  role?: "user" | "assistant";
  stream?: boolean;
}

export interface SendMessageResponse {
  success: boolean;
  data: {
    userMessage: Message;
    assistantMessage: Message;
  };
}

export interface MessageResponse {
  success: boolean;
  data: Message;
}

export const messageAPI = {
  // Send message
  sendMessage: async (conversationId: string, data: SendMessageRequest) => {
    const response = await apiClient.post<SendMessageResponse>(
      `/api/conversations/${conversationId}/messages`,
      data,
    );
    return response.data;
  },

  // Send message with streaming
  sendMessageStream: async (conversationId: string, content: string) => {
    const response = await apiClient.post(
      `/api/conversations/${conversationId}/messages`,
      {
        content,
        stream: true,
      },
    );
    return response.data;
  },

  // Get single message
  getMessage: async (id: string) => {
    const response = await apiClient.get<MessageResponse>(
      `/api/messages/${id}`,
    );
    return response.data;
  },

  // Delete message
  deleteMessage: async (id: string) => {
    const response = await apiClient.delete<{
      success: boolean;
      data: { id: string; deleted: boolean };
    }>(`/api/messages/${id}`);
    return response.data;
  },
};
