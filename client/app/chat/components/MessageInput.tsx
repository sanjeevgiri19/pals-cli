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

/**
 * Render a message composer with a selectable mode and submit controls.
 *
 * The component lets the user type a message, choose a chat mode (`chat`, `tool`, `agent`), and submit the message.
 * Submitting (form submit or pressing Enter without Shift) calls `onSend` with the current content and mode, then clears
 * and refocuses the input. The input and submit button are disabled when `isLoading` or `disabled` are true.
 *
 * @param onSend - Called when the user submits a non-empty message; receives `(content, mode)`
 * @param isLoading - When true, disables input and shows a loading indicator on the submit button
 * @param disabled - When true, disables the input and submit button (external control)
 * @returns The MessageInput React element
 */
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
      className="px-6 py-2 bg-[#0e0e0e] relative"
    >
      {/* Container with Glassmorphism */}
      <div className="bg-[#131313]/50 backdrop-blur-2xl border border-white/5 rounded-3xl p-2 shadow-2xl">
        {/* Mode Selector Row */}
        <div className="flex items-center gap-2 mb-2 px-2">
            <div className="relative" ref={modeRef}>
                <button
                    type="button"
                    onClick={() => setShowModes(!showModes)}
                    className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all",
                    "bg-[#262626] text-[var(--pal-primary)] border border-white/5",
                    "hover:bg-[#2c2c2c] hover:border-[var(--pal-primary)]/30"
                    )}
                >
                    {MODES.find((m) => m.value === mode)?.label}
                </button>

                {showModes && (
                    <div className="absolute bottom-full mb-4 left-0 bg-[#262626] border border-white/10 rounded-2xl shadow-2xl z-50 min-w-56 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
                    <div className="p-2 border-b border-white/5 bg-white/5">
                        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#adaaaa] px-2">Select Engine</span>
                    </div>
                    {MODES.map((m) => (
                        <button
                        key={m.value}
                        type="button"
                        onClick={() => {
                            setMode(m.value);
                            setShowModes(false);
                        }}
                        className={cn(
                            "w-full text-left px-4 py-3 transition-all",
                            mode === m.value
                            ? "bg-[var(--pal-primary)]/10 text-[var(--pal-primary)]"
                            : "text-[#adaaaa] hover:bg-white/5 hover:text-white"
                        )}
                        >
                        <div className="text-xs font-bold">{m.label}</div>
                        <div className="text-[10px] opacity-60 leading-tight mt-0.5">{m.description}</div>
                        </button>
                    ))}
                    </div>
                )}
            </div>

            <div className="h-4 w-[1px] bg-white/10 mx-1" />

            <div className="text-[10px] font-mono uppercase tracking-widest text-[#555]">
                {mode === "chat" && "Optimized for speed"}
                {mode === "tool" && "API integration active"}
                {mode === "agent" && "Multi-step reasoning"}
            </div>
        </div>

        {/* Input Row */}
        <div className="flex items-center gap-2">
            <div className="flex-1 relative">
                <input
                    ref={inputRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isLoading ? "PAL is thinking..." : "Ask your assistant anything..."}
                    // disabled={isLoading || disabled}
                    className={cn(
                        "w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 text-white placeholder:text-[#555] px-4 py-3",
                        "font-mono text-sm leading-relaxed"
                    )}
                />
            </div>
            
            <button
                type="submit"
                disabled={isLoading || disabled || !content.trim()}
                className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-90",
                    content.trim() && !isLoading 
                        ? "bg-gradient-to-br from-[#b6a0ff] to-[#7e51ff] text-black shadow-[0_0_20px_rgba(182,160,255,0.4)]" 
                        : "bg-white/5 text-[#333]"
                )}
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Send className={cn("w-5 h-5", content.trim() ? "translate-x-0.5 -translate-y-0.5" : "")} />
                )}
            </button>
        </div>
      </div>
      
      {/* <div className="mt-4 flex justify-center">
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#333]">
              End-to-End Encrypted Session
          </p>
      </div> */}
    </form>
  );
}
