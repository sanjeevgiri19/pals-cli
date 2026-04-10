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
        <Loader2 className="w-8 h-8 animate-spin text-(--pal-primary) opacity-50" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar"
    >
      {hasMore && (
        <div className="flex justify-center py-4">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="text-[10px] font-mono uppercase tracking-widest text-[#adaaaa] hover:text-white transition-colors disabled:opacity-50"
          >
            {isLoading ? "Fetching history..." : "Load more messages"}
          </button>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-(--pal-primary) opacity-20" />
            </div>
            <p className="text-2xl font-black tracking-tight text-white m-0">No active context</p>
            <p className="text-sm font-mono uppercase tracking-[0.2em] text-[#adaaaa]">Start a secure session below</p>
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

      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
}
