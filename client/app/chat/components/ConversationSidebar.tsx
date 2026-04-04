"use client";

import { useState } from "react";
import { useConversations } from "@/hooks/useConversations";
import { Conversation } from "@/lib/api/conversations";
import { Plus, Trash2, Edit2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/api/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ConversationSidebarProps {
  activeId?: string;
  onSelectConversation: (id: string) => void;
  onCreateConversation: () => void;
}

/**
 * Renders the conversations sidebar with controls to create, select, rename, and delete conversations.
 *
 * @param activeId - ID of the currently selected conversation, if any
 * @param onSelectConversation - Called with a conversation ID when a conversation row is selected
 * @param onCreateConversation - Called when the "New Chat" action is triggered
 * @returns The sidebar JSX element that displays the conversations list, inline rename/edit controls, and footer with the conversation count
 */
export function ConversationSidebar({
  activeId,
  onSelectConversation,
  onCreateConversation,
}: ConversationSidebarProps) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useConversations();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const conversations = data?.data || [];

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this conversation?")) {
      try {
        setIsDeleting(id);
        await apiClient.delete(`/api/conversations/${id}`);
        queryClient.invalidateQueries({
          queryKey: ["conversations"],
        });
        toast.success("Conversation deleted");
      } catch (error) {
        toast.error("Failed to delete conversation");
        console.error(error);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleRename = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleSaveRename = async (id: string) => {
    if (editTitle.trim()) {
      try {
        await apiClient.put(`/api/conversations/${id}`, {
          title: editTitle,
        });
        queryClient.invalidateQueries({
          queryKey: ["conversations"],
        });
        setEditingId(null);
        toast.success("Conversation renamed");
      } catch (error) {
        toast.error("Failed to rename conversation");
        console.error(error);
      }
    }
  };

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <Button
          onClick={onCreateConversation}
          className="w-full gap-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-20">
            <Spinner />
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No conversations yet
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "group relative rounded-lg p-3 cursor-pointer transition-colors",
                  activeId === conversation.id
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100",
                )}
                onClick={() => onSelectConversation(conversation.id)}
              >
                {editingId === conversation.id ? (
                  <Input
                    autoFocus
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleSaveRename(conversation.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSaveRename(conversation.id);
                      }
                      if (e.key === "Escape") {
                        setEditingId(null);
                      }
                    }}
                    className="h-8"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {conversation.title}
                        </p>
                        <p className="text-xs opacity-70 truncate line-clamp-2">
                          {conversation.lastMessage || "No messages yet"}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRename(conversation);
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        title="Rename"
                        disabled={isDeleting === conversation.id}
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(conversation.id);
                        }}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600 disabled:opacity-50"
                        title="Delete"
                        disabled={isDeleting === conversation.id}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500">
        <p>Conversations: {conversations.length}</p>
      </div>
    </div>
  );
}
