import { Conversation, Message } from "@/lib/api/conversations";
import { generateConversationHTML } from "./htmlGenerator";

export async function exportAsPDF(
  conversation: Conversation,
  messages: Message[],
): Promise<void> {
  // Dynamically import html2pdf to avoid bundle size issues
  const html2pdf = (await import("html2pdf.js")).default;
  // Generate HTML content
  const htmlContent = generateConversationHTML(conversation, messages);

  // Create a temporary container for the HTML
  const element = document.createElement("div");
  element.innerHTML = htmlContent;
  document.body.appendChild(element);

  try {
    // PDF options
    const options = {
      margin: 10,
      filename: generatePDFFilename(conversation),
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      },
    };

    // Generate and download PDF
    await html2pdf().set(options).from(element).save();
  } finally {
    // Clean up temporary element
    document.body.removeChild(element);
  }
}

/**
 * Generates a PDF filename based on conversation properties
 * @param conversation - The conversation being exported
 * @returns Filename string
 */
function generatePDFFilename(conversation: Conversation): string {
  const date = new Date(conversation.createdAt).toISOString().split("T")[0];
  const title = conversation.title || "conversation";
  const sanitized = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 50);

  return `${sanitized}_${conversation.id.substring(0, 8)}_${date}.pdf`;
}

/**
 * Checks if html2pdf.js is available in the environment
 * @returns boolean indicating availability
 */
export async function isPDFExportAvailable(): Promise<boolean> {
  try {
    // Try to detect if html2pdf is available
    // This will be true if the library is loaded
    return typeof window.html2pdf !== "undefined";
  } catch {
    return false;
  }
}
