"use client";

import { useState, useRef } from "react";
import { Conversation, Message } from "@/lib/api/conversations";
import { ExportDialog } from "./ExportDialog";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportButtonProps {
  conversation: Conversation;
  messages: Message[];
  disabled?: boolean;
}

/**
 * Export button with dropdown menu for exporting conversations
 * Integrates with ExportDialog for format selection and options
 */
export function ExportButton({
  conversation,
  messages,
  disabled = false,
}: ExportButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;
  const isDisabled = disabled || !hasMessages;

  const handleQuickExport = async (format: "markdown" | "pdf") => {
    if (format === "markdown") {
      const { exportAsMarkdown, downloadMarkdown, generateExportFilename } =
        await import("@/lib/export/markdownExporter");
      const content = exportAsMarkdown(conversation, messages, {
        includeMetadata: true,
        includeTimestamps: true,
      });
      const filename = generateExportFilename(conversation, "md");
      downloadMarkdown(content, filename);
    } else if (format === "pdf") {
      const { exportAsPDF } = await import("@/lib/export/pdfExporter");
      await exportAsPDF(conversation, messages);
    }
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <div className="flex gap-1">
          {/* Main button */}
          <Button
            onClick={() => setIsDialogOpen(true)}
            disabled={isDisabled}
            title={
              hasMessages ? "Export conversation" : "No messages to export"
            }
            className="bg-[#262626] hover:bg-[#2c2c2c] text-[var(--pal-primary)] border border-white/5 rounded-full transition-all active:scale-95"
            size="sm"
          >
            <Download size={16} className="mr-2" />
            Export
          </Button>

          {/* Dropdown trigger */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={isDisabled}
            className="px-2 py-2 text-[#adaaaa] hover:text-white hover:bg-white/5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronDown size={16} className={cn("transition-transform duration-200", isDropdownOpen && "rotate-180")} />
          </button>
        </div>

        {/* Dropdown menu - Glassmorphism */}
        {isDropdownOpen && !isDisabled && (
          <div className="absolute right-0 mt-3 w-56 bg-[#262626]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2 border-b border-white/5 bg-white/5">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#adaaaa] px-2">Quick Export</span>
            </div>
            <button
              onClick={() => handleQuickExport("markdown")}
              className="w-full text-left px-4 py-3 hover:bg-white/5 transition-all text-white group"
            >
              <div className="text-xs font-bold group-hover:text-[var(--pal-primary)]">Markdown (.md)</div>
              <div className="text-[10px] font-mono text-[#555] mt-0.5">
                Optimized for technical docs
              </div>
            </button>
            <button
              onClick={() => handleQuickExport("pdf")}
              className="w-full text-left px-4 py-3 hover:bg-white/5 transition-all text-white group"
            >
              <div className="text-xs font-bold group-hover:text-[var(--pal-primary)]">PDF Document</div>
              <div className="text-[10px] font-mono text-[#555] mt-0.5">
                Professional editorial layout
              </div>
            </button>
            <button
              onClick={() => {
                setIsDialogOpen(true);
                setIsDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-3 border-t border-white/5 hover:bg-white/5 transition-all text-[10px] font-mono uppercase tracking-widest text-[var(--pal-primary)]"
            >
              Advanced configuration...
            </button>
          </div>
        )}
      </div>

      {/* Export dialog for detailed options */}
      <ExportDialog
        conversation={conversation}
        messages={messages}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
