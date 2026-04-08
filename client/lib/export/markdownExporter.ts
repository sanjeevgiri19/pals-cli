import { Conversation, Message } from "@/lib/api/conversations";

export interface ExportOptions {
  includeMetadata?: boolean;
  includeTimestamps?: boolean;
}


export function exportAsMarkdown(
  conversation: Conversation,
  messages: Message[],
  options: ExportOptions = { includeMetadata: true, includeTimestamps: true },
): string {
  const lines: string[] = [];

  // Header with conversation title
  lines.push(`# ${conversation.title || "Untitled Conversation"}`);
  lines.push("");

  // Metadata section
  if (options.includeMetadata) {
    lines.push("---");
    lines.push(`**Mode:** ${conversation.mode}`);
    lines.push(`**Started:** ${formatDate(new Date(conversation.createdAt))}`);
    lines.push(
      `**Last Updated:** ${formatDate(new Date(conversation.updatedAt))}`,
    );
    lines.push(`**Total Messages:** ${messages.length}`);
    lines.push("---");
    lines.push("");
  }

  // Messages section
  if (messages.length > 0) {
    lines.push("## Messages");
    lines.push("");

    messages.forEach((message) => {
      const isUser = message.role === "user";
      const role = isUser ? "User" : "Assistant";

      lines.push(`### ${role}`);

      if (options.includeTimestamps) {
        const time = new Date(message.createdAt).toLocaleTimeString();
        lines.push(`*${time}*`);
        lines.push("");
      }

      // Preserve the message content as-is (it may contain markdown)
      lines.push(message.content);
      lines.push("");
    });
  } else {
    lines.push("No messages in this conversation yet.");
    lines.push("");
  }

  // Footer
  lines.push("---");
  lines.push(`*Exported on ${new Date().toLocaleString()} using PALS CLI*`);

  return lines.join("\n");
}

/**
 * Triggers a download of the markdown content to the user's device
 * @param content - The markdown content to download
 * @param filename - The filename for the downloaded file
 */
export function downloadMarkdown(
  content: string,
  filename: string = "conversation.md",
): void {
  downloadFile(content, filename, "text/markdown");
}

/**
 * Generic file download utility
 * @param content - The content to download
 * @param filename - The filename for the download
 * @param mimeType - The MIME type of the file
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = "text/plain",
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates a descriptive filename for the export based on the conversation
 * @param conversation - The conversation being exported
 * @param format - The file format (md, pdf, etc.)
 * @returns A sanitized filename
 */
export function generateExportFilename(
  conversation: Conversation,
  format: string = "md",
): string {
  const date = new Date(conversation.createdAt).toISOString().split("T")[0];
  const title = conversation.title || "conversation";
  // Sanitize title for use in filename
  const sanitized = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 50);

  return `${sanitized}_${conversation.id.substring(0, 8)}_${date}.${format}`;
}

/**
 * Formats a date in a human-readable way
 * @param date - The date to format
 * @returns Formatted date string
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
