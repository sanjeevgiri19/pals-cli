"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/lib/api/conversations";
import { ChatMessage } from "./ChatMessage";
import { Loader2 } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isStreaming?: boolean;
}

/**
 * Render a scrollable list of chat messages with optional loading, pagination, and per-message streaming indicators.
 *
 * Displays a centered spinner when loading with no messages, a "Load more messages" control when older messages are available,
 * an empty-state prompt when there are no messages, and an ordered set of ChatMessage items when messages exist.
 * Automatically scrolls to the bottom whenever `messages` changes.
 *
 * @param messages - Array of conversation messages to render (each must include a stable `id`)
 * @param isLoading - If true, renders loading states and disables the "Load more messages" control
 * @param hasMore - If true, shows a "Load more messages" button to fetch older messages
 * @param onLoadMore - Click handler invoked to request older messages
 * @param isStreaming - If true, marks assistant messages as streaming (applies per-message based on role)
 * @returns A React element representing the message list UI
 */
export function MessageList({
  messages,
  isLoading,
  hasMore,
  onLoadMore,
  isStreaming,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
    >
      {hasMore && (
        <div className="flex justify-center py-4">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Load more messages"}
          </button>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start a conversation by sending a message</p>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isStreaming={isStreaming && message.role === "assistant"}
          />
        ))
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
