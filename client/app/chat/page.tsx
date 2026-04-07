"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useConversations,
  useCreateConversation,
} from "@/hooks/useConversations";
import { useConversationMessages } from "@/hooks/useConversations";
import { useSendMessage } from "@/hooks/useMessages";
import { useSyncAuth } from "@/hooks/useSyncAuth";
import { ConversationSidebar } from "./components/ConversationSidebar";
import { MessageList } from "./components/MessageList";
import { MessageInput } from "./components/MessageInput";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/ExportButton";
import { LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";

type ChatMode = "chat" | "tool" | "agent";

/**
 * Renders the authenticated chat page with a collapsible conversation sidebar, message list, and message input.
 *
 * The component enforces authentication (redirecting to /sign-in when unauthenticated), loads conversations and messages for the active conversation, auto-selects the first conversation when none is selected, and provides handlers to create conversations, send messages, and sign out.
 *
 * @returns The rendered chat page element.
 */
export default function ChatPage() {
  const router = useRouter();
  const { user, session, isPending } = useSyncAuth(); // Use sync hook instead
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);

  // Redirect if not authenticated (wait while auth is pending)
  useEffect(() => {
    if (isPending) return; // wait for auth to resolve
    // if (!session || !user) {
    //   router.push("/sign-in");
    // }
  }, [isPending, session, user, router]);

  const createConversation = useCreateConversation();
  const { data: conversationsData } = useConversations(
    { limit: 100 },
    !!session,
  );

  const { data: messagesData, isLoading: messagesLoading } =
    useConversationMessages(activeConversationId || "", undefined, !!session);

  const sendMessage = useSendMessage(activeConversationId || "");

  // Auto-select first conversation
  useEffect(() => {
    if (!activeConversationId && conversationsData?.data?.length) {
      setActiveConversationId(conversationsData.data[0].id);
    }
  }, [conversationsData, activeConversationId]);

  const handleCreateConversation = async () => {
    try {
      const result = await createConversation.mutateAsync({
        title: "New Chat",
        mode: "chat",
      });
      setActiveConversationId(result.data.id);
      toast.success("Conversation created");
    } catch (error) {
      toast.error("Failed to create conversation");
      console.log("err", error);
    }
  };

  const handleSendMessage = async (content: string, mode: ChatMode) => {
    if (!activeConversationId) {
      toast.error("Please select or create a conversation");
      return;
    }

    try {
      setIsStreaming(true);
      await sendMessage.mutateAsync({
        content,
        role: "user",
        stream: false,
      });
      toast.success("Message sent");
    } catch (error) {
      toast.error("Failed to send message");
      console.log("err", error);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
    } catch (e) {
      console.error("signOut error", e);
    }
    // Clear Zustand and redirect
    try {
      useAuthStore.getState().logout();
    } catch (e) {
      useAuthStore.getState().logout();
    }
    router.push("/sign-in");
  };

  const messages = messagesData?.data || [];

  return (
    <div className="flex h-screen bg-[#0e0e0e] text-white font-sans overflow-hidden">
      {/* Sidebar - Tonal layering: Surface Container Low */}
      <div
        className={cn(
          "bg-[#131313] transition-all duration-300 overflow-hidden",
          sidebarOpen ? "w-72" : "w-0"
        )}
      >
        <ConversationSidebar
          activeId={activeConversationId || ""}
          onSelectConversation={setActiveConversationId}
          onCreateConversation={handleCreateConversation}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Ambient glow in background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(182,160,255,0.05)_0%,transparent_70%)] pointer-events-none -z-0" />

        {/* Header - Glassmorphism */}
        <div className="bg-[#131313]/80 backdrop-blur-xl p-4 flex items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-3 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-white/5 text-[#adaaaa]"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-black tracking-tight text-white m-0">
                PALs <span className="text-[var(--pal-primary)]">CLI</span> Chat
              </h1>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#adaaaa]">
                Session active • {user?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeConversationId && conversationsData?.data && (
              <ExportButton
                conversation={
                  conversationsData.data.find(
                    (c) => c.id === activeConversationId,
                  ) || conversationsData.data[0]
                }
                messages={messages}
                disabled={!activeConversationId || messages.length === 0}
              />
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-[#adaaaa] hover:text-white hover:bg-white/5 rounded-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 relative z-10">
          <MessageList
            messages={messages}
            isLoading={messagesLoading}
            isStreaming={isStreaming}
          />
        </div>

        {/* Input Area */}
        <div className="z-10">
          <MessageInput
            onSend={handleSendMessage}
            isLoading={sendMessage.isPending || isStreaming}
            disabled={!activeConversationId}
          />
        </div>
      </div>
    </div>
  );
}
