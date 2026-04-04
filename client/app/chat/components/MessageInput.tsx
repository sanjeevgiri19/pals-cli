"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ChatMode = "chat" | "tool" | "agent";

interface MessageInputProps {
  onSend: (content: string, mode: ChatMode) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const MODES: { value: ChatMode; label: string; description: string }[] = [
  {
    value: "chat",
    label: "Chat",
    description: "Regular conversation with AI",
  },
  {
    value: "tool",
    label: "Tool",
    description: "Use tools and external APIs",
  },
  {
    value: "agent",
    label: "Agent",
    description: "Multi-step reasoning",
  },
];

export function MessageInput({
  onSend,
  isLoading,
  disabled,
}: MessageInputProps) {
  const [content, setContent] = useState("");
  const [mode, setMode] = useState<ChatMode>("chat");
  const [showModes, setShowModes] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modeRef = useRef<HTMLDivElement>(null);

  // Close mode selector on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modeRef.current && !modeRef.current.contains(event.target as Node)) {
        setShowModes(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isLoading) {
      onSend(content, mode);
      setContent("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950"
    >
      {/* Mode Selector */}
      <div className="mb-3 flex gap-2">
        <div className="relative" ref={modeRef}>
          <button
            type="button"
            onClick={() => setShowModes(!showModes)}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
              "hover:bg-gray-200 dark:hover:bg-gray-700",
            )}
          >
            {MODES.find((m) => m.value === mode)?.label}
          </button>

          {showModes && (
            <div className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-48">
              {MODES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => {
                    setMode(m.value);
                    setShowModes(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 text-sm transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0",
                    mode === m.value
                      ? "bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700",
                  )}
                >
                  <div className="font-medium">{m.label}</div>
                  <div className="text-xs opacity-70">{m.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1" />

        <div className="text-xs text-gray-500">
          {mode === "chat" && "💬 Basic chat"}
          {mode === "tool" && "🔧 With tools & APIs"}
          {mode === "agent" && "🤖 Autonomous agent"}
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Shift+Enter for new line)"
          disabled={isLoading || disabled}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={isLoading || disabled || !content.trim()}
          size="sm"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </form>
  );
}
