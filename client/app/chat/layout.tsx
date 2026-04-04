"use client";

import { PropsWithChildren } from "react";

export default function ChatLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-screen flex flex-col">
      {/* This layout wraps the chat page */}
      {children}
    </div>
  );
}
