import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  conversationAPI,
  Conversation,
  PaginationParams,
  PaginatedResponse,
  ConversationResponse,
} from "@/lib/api/conversations";

const CONVERSATIONS_KEY = "conversations";

// Get all conversations
export const useConversations = (
  params?: PaginationParams,
  enabled = true,
): UseQueryResult<PaginatedResponse<Conversation>> =>
  useQuery({
    queryKey: [CONVERSATIONS_KEY, params],
    queryFn: () => conversationAPI.getConversations(params),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

// Get single conversation
export const useConversation = (
  id: string,
): UseQueryResult<ConversationResponse> =>
  useQuery({
    queryKey: [CONVERSATIONS_KEY, id],
    queryFn: () => conversationAPI.getConversation(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

// Create conversation
export const useCreateConversation = (): UseMutationResult<
  ConversationResponse,
  Error,
  { title?: string; mode?: "chat" | "tool" | "agent" }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: conversationAPI.createConversation,
    onSuccess: (data) => {
      // Invalidate conversations list
      queryClient.invalidateQueries({
        queryKey: [CONVERSATIONS_KEY],
      });
      // Add to cache
      queryClient.setQueryData([CONVERSATIONS_KEY, data.data.id], data);
    },
  });
};

// Update conversation
export const useUpdateConversation = (
  id: string,
): UseMutationResult<ConversationResponse, Error, { title: string }> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => conversationAPI.updateConversation(id, data),
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData([CONVERSATIONS_KEY, id], data);
      // Invalidate list to update preview
      queryClient.invalidateQueries({
        queryKey: [CONVERSATIONS_KEY],
      });
    },
  });
};

// Delete conversation
export const useDeleteConversation = (
  id: string,
): UseMutationResult<any, Error, void> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => conversationAPI.deleteConversation(id),
    onSuccess: () => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: [CONVERSATIONS_KEY, id],
      });
      // Invalidate list
      queryClient.invalidateQueries({
        queryKey: [CONVERSATIONS_KEY],
      });
    },
  });
};

// Get conversation messages
export const useConversationMessages = (
  conversationId: string,
  params?: PaginationParams,
  enabled = true,
) =>
  useQuery({
    queryKey: [CONVERSATIONS_KEY, conversationId, "messages", params],
    queryFn: () =>
      conversationAPI.getConversationMessages(conversationId, params),
    enabled: !!conversationId && enabled,
    staleTime: 1000 * 60, // 1 minute
  });
