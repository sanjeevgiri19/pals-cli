"use client";

import { useState } from "react";
import { Conversation, Message } from "@/lib/api/conversations";
import {
  downloadMarkdown,
  generateExportFilename,
} from "@/lib/export/markdownExporter";
import { exportAsPDF } from "@/lib/export/pdfExporter";
import { Button } from "@/components/ui/button";
import { X, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ExportDialogProps {
  conversation: Conversation;
  messages: Message[];
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = "markdown" | "pdf";

/**
 * Dialog component for exporting conversations in different formats
 * Allows users to choose between Markdown and PDF formats with options
 * for including metadata and timestamps
 */
export function ExportDialog({
  conversation,
  messages,
  isOpen,
  onClose,
}: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] =
    useState<ExportFormat>("markdown");
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    if (messages.length === 0) {
      toast.error("No messages to export");
      return;
    }

    setIsExporting(true);
    try {
      if (selectedFormat === "markdown") {
        const { exportAsMarkdown } =
          await import("@/lib/export/markdownExporter");
        const content = exportAsMarkdown(conversation, messages, {
          includeMetadata,
          includeTimestamps,
        });
        const filename = generateExportFilename(conversation, "md");
        downloadMarkdown(content, filename);
        toast.success("Conversation exported as Markdown");
      } else if (selectedFormat === "pdf") {
        await exportAsPDF(conversation, messages);
        toast.success("Conversation exported as PDF");
      }
      onClose();
    } catch (error) {
      console.error("Export error:", error);
      toast.error(
        `Failed to export conversation: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Export Conversation</h2>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Format Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">
            Export Format
          </label>
          <div className="space-y-2">
            <label
              className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              style={{
                backgroundColor:
                  selectedFormat === "markdown"
                    ? "rgba(99, 102, 241, 0.1)"
                    : undefined,
                borderColor:
                  selectedFormat === "markdown" ? "#6366f1" : undefined,
              }}
            >
              <input
                type="radio"
                name="format"
                value="markdown"
                checked={selectedFormat === "markdown"}
                onChange={(e) =>
                  setSelectedFormat(e.target.value as ExportFormat)
                }
                disabled={isExporting}
                className="w-4 h-4 cursor-pointer"
              />
              <div className="ml-3">
                <div className="font-medium">Markdown</div>
                <div className="text-sm text-gray-500">
                  Text format with formatting
                </div>
              </div>
            </label>

            <label
              className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              style={{
                backgroundColor:
                  selectedFormat === "pdf"
                    ? "rgba(99, 102, 241, 0.1)"
                    : undefined,
                borderColor: selectedFormat === "pdf" ? "#6366f1" : undefined,
              }}
            >
              <input
                type="radio"
                name="format"
                value="pdf"
                checked={selectedFormat === "pdf"}
                onChange={(e) =>
                  setSelectedFormat(e.target.value as ExportFormat)
                }
                disabled={isExporting}
                className="w-4 h-4 cursor-pointer"
              />
              <div className="ml-3">
                <div className="font-medium">PDF</div>
                <div className="text-sm text-gray-500">
                  Professional formatted document
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Options */}
        <div className="mb-6 space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeMetadata}
              onChange={(e) => setIncludeMetadata(e.target.checked)}
              disabled={isExporting}
              className="w-4 h-4 rounded cursor-pointer"
            />
            <span className="ml-2 text-sm">Include conversation metadata</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeTimestamps}
              onChange={(e) => setIncludeTimestamps(e.target.checked)}
              disabled={isExporting}
              className="w-4 h-4 rounded cursor-pointer"
            />
            <span className="ml-2 text-sm">Include message timestamps</span>
          </label>
        </div>

        {/* Message Count */}
        <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {messages.length} message{messages.length !== 1 ? "s" : ""} will be
            exported
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || messages.length === 0}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isExporting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download size={16} className="mr-2" />
                Export
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
