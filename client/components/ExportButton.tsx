"use client";

import { useState, useRef } from "react";
import { Conversation, Message } from "@/lib/api/conversations";
import { ExportDialog } from "./ExportDialog";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown } from "lucide-react";

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
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            size="sm"
          >
            <Download size={16} className="mr-2" />
            Export
          </Button>

          {/* Dropdown trigger */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={isDisabled}
            className="px-2 py-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Dropdown menu */}
        {isDropdownOpen && !isDisabled && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-40">
            <button
              onClick={() => handleQuickExport("markdown")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg transition"
            >
              <div className="font-medium">Export as Markdown</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Text format with formatting
              </div>
            </button>
            <button
              onClick={() => handleQuickExport("pdf")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 last:rounded-b-lg transition"
            >
              <div className="font-medium">Export as PDF</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Professional formatted document
              </div>
            </button>
            <button
              onClick={() => {
                setIsDialogOpen(true);
                setIsDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 last:rounded-b-lg transition text-sm text-indigo-600"
            >
              More options...
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
