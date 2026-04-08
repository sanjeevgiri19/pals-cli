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
import { cn } from "@/lib/utils";

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-[#131313] rounded-[32px] shadow-2xl p-8 max-w-md w-full mx-4 border border-white/5 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--pal-primary)]/10 blur-[80px] rounded-full pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white m-0">Export Context</h2>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#adaaaa] mt-1">Configure your extraction</p>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#adaaaa] hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Format Selection */}
        <div className="mb-8 relative z-10">
          <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#555] mb-4">
            Engine Format
          </label>
          <div className="space-y-3">
            <label
              className={cn(
                "flex items-center p-4 rounded-2xl cursor-pointer transition-all border",
                selectedFormat === "markdown" 
                    ? "bg-[var(--pal-primary)]/5 border-[var(--pal-primary)]/30" 
                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
              )}
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
                className="sr-only"
              />
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                selectedFormat === "markdown" ? "border-[var(--pal-primary)]" : "border-[#333]"
              )}>
                {selectedFormat === "markdown" && <div className="w-2 h-2 rounded-full bg-[var(--pal-primary)]" />}
              </div>
              <div className="ml-4">
                <div className={cn("text-sm font-bold transition-colors", selectedFormat === "markdown" ? "text-white" : "text-[#adaaaa]")}>Markdown (.md)</div>
                <div className="text-[10px] font-mono text-[#555] mt-0.5">Recommended for developers</div>
              </div>
            </label>

            <label
              className={cn(
                "flex items-center p-4 rounded-2xl cursor-pointer transition-all border",
                selectedFormat === "pdf" 
                    ? "bg-[var(--pal-primary)]/5 border-[var(--pal-primary)]/30" 
                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
              )}
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
                className="sr-only"
              />
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                selectedFormat === "pdf" ? "border-[var(--pal-primary)]" : "border-[#333]"
              )}>
                {selectedFormat === "pdf" && <div className="w-2 h-2 rounded-full bg-[var(--pal-primary)]" />}
              </div>
              <div className="ml-4">
                <div className={cn("text-sm font-bold transition-colors", selectedFormat === "pdf" ? "text-white" : "text-[#adaaaa]")}>PDF Document</div>
                <div className="text-[10px] font-mono text-[#555] mt-0.5">High-fidelity editorial print</div>
              </div>
            </label>
          </div>
        </div>

        {/* Options */}
        <div className="mb-8 p-6 bg-black/40 rounded-2xl space-y-4 relative z-10">
          <label className="flex items-center cursor-pointer group">
            <div className="relative">
                <input
                    type="checkbox"
                    checked={includeMetadata}
                    onChange={(e) => setIncludeMetadata(e.target.checked)}
                    disabled={isExporting}
                    className="sr-only"
                />
                <div className={cn(
                    "w-10 h-5 rounded-full transition-colors",
                    includeMetadata ? "bg-[var(--pal-primary)]" : "bg-[#333]"
                )} />
                <div className={cn(
                    "absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform",
                    includeMetadata ? "translate-x-5" : "translate-x-0"
                )} />
            </div>
            <span className="ml-3 text-[11px] font-bold text-[#adaaaa] group-hover:text-white transition-colors">Include conversation metadata</span>
          </label>

          <label className="flex items-center cursor-pointer group">
            <div className="relative">
                <input
                    type="checkbox"
                    checked={includeTimestamps}
                    onChange={(e) => setIncludeTimestamps(e.target.checked)}
                    disabled={isExporting}
                    className="sr-only"
                />
                <div className={cn(
                    "w-10 h-5 rounded-full transition-colors",
                    includeTimestamps ? "bg-[var(--pal-primary)]" : "bg-[#333]"
                )} />
                <div className={cn(
                    "absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform",
                    includeTimestamps ? "translate-x-5" : "translate-x-0"
                )} />
            </div>
            <span className="ml-3 text-[11px] font-bold text-[#adaaaa] group-hover:text-white transition-colors">Include message timestamps</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 relative z-10">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isExporting}
            className="flex-1 rounded-2xl h-12 text-[#adaaaa] hover:bg-white/5 font-bold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || messages.length === 0}
            className="flex-1 rounded-2xl h-12 bg-gradient-to-br from-[#b6a0ff] to-[#7e51ff] text-black font-black shadow-[0_0_30px_rgba(182,160,255,0.3)] hover:shadow-[0_0_50px_rgba(182,160,255,0.4)] transition-all active:scale-95"
          >
            {isExporting ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Download size={18} className="mr-2" />
                Extract
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
