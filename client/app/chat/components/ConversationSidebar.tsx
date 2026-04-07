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
    <div className="w-full bg-[#131313] flex flex-col h-full font-sans">
      {/* Header */}
      <div className="p-6">
        <Button
          onClick={onCreateConversation}
          className="w-full gap-2 bg-gradient-to-br from-[#b6a0ff] to-[#7e51ff] text-black font-bold rounded-full hover:shadow-[0_0_20px_rgba(182,160,255,0.3)] transition-all active:scale-95"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-20 opacity-50">
            <Spinner />
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center text-[10px] font-mono uppercase tracking-widest text-[#adaaaa] opacity-40">
            No active sessions
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "group relative rounded-xl p-4 cursor-pointer transition-all duration-200 border border-transparent",
                  activeId === conversation.id
                    ? "bg-[#262626] border-white/5 shadow-lg"
                    : "hover:bg-white/[0.03]"
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
                    className="h-8 bg-black/50 border-white/10 text-white rounded-lg focus:border-[var(--pal-primary)]"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        activeId === conversation.id ? "bg-[var(--pal-primary)] text-black" : "bg-white/5 text-[#adaaaa]"
                      )}>
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-bold text-sm truncate m-0",
                          activeId === conversation.id ? "text-white" : "text-[#adaaaa] group-hover:text-white"
                        )}>
                          {conversation.title}
                        </p>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[#555] mt-1 truncate">
                          {conversation.lastMessage || "Empty session"}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRename(conversation);
                        }}
                        className="p-1.5 hover:bg-white/10 rounded-full text-[#adaaaa]"
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
                        className="p-1.5 hover:bg-red-500/20 rounded-full text-red-400 disabled:opacity-50"
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
      <div className="p-6 bg-black/20">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-[#adaaaa] opacity-40">
            <span>SESSIONS</span>
            <span>{conversations.length.toString().padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}
