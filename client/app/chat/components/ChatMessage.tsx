"use client";

import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { Message } from "@/lib/api/conversations";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const [copiedContent, setCopiedContent] = useState<string | null>(null);
  const isUser = message.role === "user";

  // Configure marked with syntax highlighting
  const renderer = {
    code(code: string, infostring?: string) {
      const lang = (infostring || "").trim();
      try {
        if (lang) {
          const highlighted = hljs.highlight(code, { language: lang }).value;
          return `<pre class="hljs terminal-code"><code>${highlighted}</code></pre>`;
        }
        const auto = hljs.highlightAuto(code).value;
        return `<pre class="hljs terminal-code"><code>${auto}</code></pre>`;
      } catch {
        return `<pre class="hljs terminal-code"><code>${code}</code></pre>`;
      }
    },
  };

  marked.use({ renderer, gfm: true, breaks: true });

  const htmlContent = marked.parse(message.content) as string;

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedContent(text);
    setTimeout(() => setCopiedContent(null), 2000);
  };

  return (
    <div
      className={cn(
        "flex gap-4 mb-8 items-start group font-sans animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      {/* Avatar Section */}
      <div className="shrink-0 pt-1">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-[#0e0e0e] shadow-xl",
            isUser
              ? "bg-gradient-to-br from-[#b6a0ff] to-[#7e51ff] text-black"
              : "bg-white/5 text-[var(--pal-primary)] ring-1 ring-white/10",
          )}
        >
          {isUser ? "USER" : "PAL"}
        </div>
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "max-w-[85%] sm:max-w-xl flex flex-col",
          isUser ? "items-end" : "items-start",
        )}
      >
        {/* Label and Time */}
        <div className="flex items-center gap-2 px-1 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#adaaaa] opacity-60">
            {isUser ? "You" : "PAL Assistant"}
          </span>
          <span className="text-[8px] font-mono text-[#555]">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div
          className={cn(
            "relative rounded-2xl px-5 py-3.5 shadow-2xl transition-all",
            isUser
              ? "bg-[#262626] text-white rounded-tr-none border border-white/5"
              : "bg-[#131313] text-[#adaaaa] rounded-tl-none border border-white/5",
          )}
        >
          {isStreaming ? (
            <div className="flex items-center gap-3 py-1">
              <div className="w-1.5 h-4 bg-[var(--pal-primary)] animate-pulse rounded-full" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--pal-primary)] animate-pulse">
                Thinking...
              </span>
            </div>
          ) : (
            <div
              className={cn(
                "prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed",
                "prose-pre:bg-black prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-4",
                "prose-code:text-[var(--pal-primary)] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none",
                !isUser && "prose-p:text-[#adaaaa] prose-strong:text-white",
              )}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          )}

          {/* Inline Action Bar (only visible on hover for assistant) */}
          {!isUser && !isStreaming && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all">
              <button
                onClick={() => handleCopy(message.content)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/20 text-[#adaaaa] hover:text-white transition-all backdrop-blur-md border border-white/10"
                title="Copy message"
              >
                {copiedContent === message.content ? (
                  <Check className="w-3 h-3 text-[var(--pal-primary)]" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
