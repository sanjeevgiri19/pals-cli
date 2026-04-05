"use client";

import { PropsWithChildren } from "react";

/**
 * Layout wrapper that provides a full-height, column-oriented container for chat pages.
 *
 * @param children - The content to render inside the chat layout
 * @returns The rendered layout element containing `children`
 */
export default function ChatLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-screen flex flex-col">
      {/* This layout wraps the chat page */}
      {children}
    </div>
  );
}
