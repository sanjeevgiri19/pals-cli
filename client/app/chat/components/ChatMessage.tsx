"use client";

import { Marked, marked } from "marked";
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

  const authorInitial = isUser ? "Y" : "A";

  // Configure marked with syntax highlighting
  // Create a small renderer for code blocks that uses highlight.js
  const renderer: Partial<Marked.Renderer> = {
    code(code: string, infostring?: string) {
      const lang = (infostring || "").trim();
      try {
        if (lang) {
          const highlighted = hljs.highlight(code, { language: lang }).value;
          return `<pre class="hljs"><code>${highlighted}</code></pre>`;
        }
        const auto = hljs.highlightAuto(code).value;
        return `<pre class="hljs"><code>${auto}</code></pre>`;
      } catch {
        return `<pre class="hljs"><code>${code}</code></pre>`;
      }
    },
  };

  marked.use({ renderer, gfm: true, breaks: true });

  const htmlContent = marked.parse(message.content);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedContent(text);
    setTimeout(() => setCopiedContent(null), 2000);
  };

  return (
    <div
      className={cn(
        "flex gap-3 mb-4 items-end",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center">
            {authorInitial}
          </div>
        </div>
      )}

      <div
        className={cn(
          "max-w-2xl rounded-lg px-4 py-2.5 relative",
          isUser
            ? "bg-blue-600 text-white rounded-bl-none"
            : "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-br-none",
        )}
      >
        {isStreaming ? (
          <div className="flex items-center gap-2">
            <div className="animate-pulse">{"▌"}</div>
            <span className="inline-block animate-pulse">Thinking...</span>
          </div>
        ) : (
          <div
            className="prose prose-sm dark:prose-invert max-w-none prose-code:bg-gray-900 prose-code:text-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:p-3"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}

        <div className="text-xs mt-1 opacity-70 text-right">
          <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Copy buttons for code blocks */}
      {!isUser && htmlContent.includes("<code>") && (
        <button
          onClick={() => handleCopy(message.content)}
          className="self-end opacity-0 hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Copy message"
        >
          {copiedContent === message.content ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
}
