import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  messageAPI,
  SendMessageRequest,
  SendMessageResponse,
  MessageResponse,
} from "@/lib/api/messages";

const MESSAGES_KEY = "messages";
const CONVERSATIONS_KEY = "conversations";

// Send message
export const useSendMessage = (
  conversationId: string,
): UseMutationResult<SendMessageResponse, Error, SendMessageRequest> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => messageAPI.sendMessage(conversationId, data),
    onSuccess: (data) => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({
        queryKey: [CONVERSATIONS_KEY, conversationId, "messages"],
      });
    },
  });
};

// Get single message
export const useMessage = (id: string) =>
  useQuery({
    queryKey: [MESSAGES_KEY, id],
    queryFn: () => messageAPI.getMessage(id),
    enabled: !!id,
  });

// Delete message
export const useDeleteMessage = (messageId: string, conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => messageAPI.deleteMessage(messageId),
    onSuccess: () => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({
        queryKey: [CONVERSATIONS_KEY, conversationId, "messages"],
      });
    },
  });
};

// Send message with streaming
export const useSendMessageStream = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      messageAPI.sendMessageStream(conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONVERSATIONS_KEY, conversationId, "messages"],
      });
    },
  });
};
