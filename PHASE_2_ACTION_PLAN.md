# DETAILED ACTION PLAN - PHASE 2: WEB CHAT INTERFACE

## 📋 OVERVIEW

This phase builds the web UI for chatting, replacing CLI-only experience with a full web application.

**Dependencies:** Must complete Phase 1 first!

---

## TASK 1: Chat Page Layout & Structure

**Time: 1.5 hours**

### What to Create:

- [ ] Main chat page at `app/chat/page.tsx`
- [ ] Chat layout with sidebar and main area
- [ ] Component structure

### File Structure:

```
client/
├── app/
│   ├── chat/
│   │   ├── page.tsx (NEW - main chat page)
│   │   ├── layout.tsx (NEW - layout with sidebar)
│   │   └── components/
│   │       ├── ChatArea.tsx (NEW)
│   │       ├── MessageList.tsx (NEW)
│   │       ├── MessageInput.tsx (NEW)
│   │       ├── ConversationSidebar.tsx (NEW)
│   │       ├── ChatMessage.tsx (NEW)
│   │       └── ModeSelector.tsx (NEW)
```

### Layout Structure:

```
┌─────────────────────────────────────┐
│  Nav (user profile, settings)        │
├──────────────┬──────────────────────┤
│              │                      │
│ Sidebar      │  Chat Messages       │
│ - +New       │  Area                │
│ - Conv 1     │  (streaming text,    │
│ - Conv 2     │   markdown)          │
│ - Conv 3     │                      │
│              │                      │
│  [ Trash ]   ├──────────────────────┤
│              │  Message Input       │
│              │  + Mode Selector     │
│              │  + Settings          │
└──────────────┴──────────────────────┘
```

### Files to Create:

- ✅ Create: `client/app/chat/page.tsx`
- ✅ Create: `client/app/chat/layout.tsx`
- ✅ Modify: `client/app/layout.tsx` (add providers if needed)

---

## TASK 2: Conversation Sidebar

**Time: 2 hours**

### What to Create:

- [ ] Sidebar component showing all conversations
- [ ] New conversation button
- [ ] Delete/rename options
- [ ] Search conversations
- [ ] Active conversation highlight

### Features:

- Load conversations on mount
- Show conversation preview (first message)
- Show timestamp
- Show conversation mode (chat/tool/agent)
- Hover actions (delete, rename, pin)

### Component: `ConversationSidebar.tsx`

```typescript
- Props: conversations[], activeId, onSelect, onCreate, onDelete, onRename
- State: conversations, search, loading
- API Calls: GET /api/conversations
- Features:
  - Real-time conversation list
  - Search by title
  - Click to switch conversations
  - Delete with confirmation
  - Inline rename
```

### Files to Create:

- ✅ Create: `client/app/chat/components/ConversationSidebar.tsx`
- ✅ Create: `client/lib/api/conversations.ts` (API client)
- ✅ Create: `client/hooks/useConversations.ts` (custom hook)

### API Integration:

```typescript
// GET /api/conversations
// GET /api/conversations/:id
// POST /api/conversations
// PUT /api/conversations/:id
// DELETE /api/conversations/:id
```

---

## TASK 3: Chat Message Display

**Time: 2 hours**

### What to Create:

- [ ] Message display component
- [ ] Markdown rendering (use marked library)
- [ ] Code block syntax highlighting
- [ ] User/assistant message styling
- [ ] Streaming message support
- [ ] Copy button on code blocks
- [ ] Loading indicator for pending responses

### Component: `ChatMessage.tsx`

```typescript
Props:
- message: {id, role, content, createdAt}
- isStreaming?: boolean
- onCopy?: (text) => void

Features:
- Render markdown
- Syntax highlight code blocks
- Distinguish user vs assistant
- Show timestamp
- Copy code button
```

### Component: `MessageList.tsx`

```typescript
Props:
- messages[]
- loading
- hasMore (for pagination)
- onLoadMore

Features:
- Auto-scroll to latest message
- Load more button for older messages
- Show loading spinner while streaming
```

### Files to Create:

- ✅ Create: `client/app/chat/components/ChatMessage.tsx`
- ✅ Create: `client/app/chat/components/MessageList.tsx`
- ✅ Modify: `client/package.json` (add syntax highlighting lib)

### Dependencies to Add:

```bash
# Syntax highlighting
npm install highlight.js

# Code copy utility
npm install copy-to-clipboard

# Or use native clipboard API
```

---

## TASK 4: Message Input & Sending

**Time: 1.5 hours**

### What to Create:

- [ ] Message input textarea
- [ ] Mode selector (chat/tool/agent)
- [ ] Send button with loading state
- [ ] File/image upload (optional for Phase 2)
- [ ] Message formatting hints

### Component: `MessageInput.tsx`

```typescript
Props:
- conversationId
- onSend
- onModeChange
- disabled

Features:
- Auto-expand textarea as user types
- Send on Ctrl+Enter or button click
- Show mode selector dropdown
- Character count
- Loading state while sending
- Empty state validation
- Focus management
```

### Component: `ModeSelector.tsx`

```typescript
Props:
- currentMode
- onChange

Modes:
- Chat (simple conversation)
- Tool (with Google Search, Code Exec)
- Agent (code generation)
```

### Files to Create:

- ✅ Create: `client/app/chat/components/MessageInput.tsx`
- ✅ Create: `client/app/chat/components/ModeSelector.tsx`
- ✅ Create: `client/hooks/useChat.ts` (hook for sending messages)

---

## TASK 5: Real-Time Message Streaming

**Time: 2 hours**

### What to Create:

- [ ] Streaming API endpoint integration
- [ ] Real-time message display as it arrives
- [ ] Handle aborted streams gracefully
- [ ] Show "AI is thinking..." indicator

### Implementation:

```typescript
// POST /api/conversations/:id/messages
// Response: Server-Sent Events (text/event-stream)
//
// Events:
// data: {type: 'text', content: 'chunk'}
// data: {type: 'done', totalTokens: 100}
// data: {type: 'error', message: 'error'}
```

### Hook: `useChat.ts`

```typescript
const { sendMessage, loading, error, streaming } = useChat(conversationId);

await sendMessage(content, mode, (chunk) => {
  // Handle streamed chunk
  setMessages((prev) => [
    ...prev.slice(0, -1),
    { ...lastMsg, content: lastMsg.content + chunk },
  ]);
});
```

### Files to Create/Modify:

- ✅ Create: `client/lib/api/chat.ts` (streaming API client)
- ✅ Create: `client/hooks/useChat.ts` (custom hook for messages)
- ✅ Modify: `server/src/routes/messages.js` (add streaming endpoint)

---

## TASK 6: Loading States & Error Handling

**Time: 1 hour**

### What to Create:

- [ ] Loading indicators during API calls
- [ ] Error boundary component
- [ ] Toast notifications for errors
- [ ] Retry mechanism
- [ ] Empty state for no conversations
- [ ] Network error handling

### Components to Update:

- `ConversationSidebar.tsx` - loading skeleton
- `MessageList.tsx` - loading indicator
- `MessageInput.tsx` - disabled state
- Add error boundary wrapper

### Files to Create/Modify:

- ✅ Create: `client/components/ErrorBoundary.tsx`
- ✅ Create: `client/components/LoadingSkeleton.tsx`
- ✅ Modify: All chat components (add error states)

---

## TASK 7: Keyboard Navigation

**Time: 1 hour**

### What to Create:

- [ ] Focus management for accessibility
- [ ] Tab navigation through messages
- [ ] Arrow keys to switch conversations (optional)
- [ ] Escape to close modals

### Implementation:

- Add keyboard event listeners
- Manage focus state
- Scroll to focused element
- Show visual focus indicators

### Files to Modify:

- ✅ Create: `client/hooks/useKeyboardNavigation.ts`
- ✅ Modify: Chat-related components (add keyboard handlers)

---

## TASK 8: Backend Streaming Endpoint

**Time: 1.5 hours**

### What to Create:

- [ ] Streaming endpoint for real-time messages
- [ ] Server-Sent Events (SSE) implementation
- [ ] Handle tool calling and agent responses

### Endpoint:

```
POST /api/conversations/:id/messages
Body: { content, mode }
Response: text/event-stream

Events:
- message_chunk: partial text
- message_complete: final message
- tool_call: tool name + input
- tool_result: tool output
- error: error message
```

### Implementation:

```javascript
// Use aiService.sendMessage with streaming
// Emit events as chunks arrive
// Format messages properly
```

### Files to Create/Modify:

- ✅ Modify: `server/src/controllers/messageController.js` (add streaming)
- ✅ Modify: `server/src/routes/messages.js` (add streaming route)

---

## 📁 FILES STRUCTURE AFTER PHASE 2

```
client/
├── app/
│   ├── chat/
│   │   ├── page.tsx (NEW)
│   │   ├── layout.tsx (NEW)
│   │   └── components/
│   │       ├── ChatArea.tsx (NEW)
│   │       ├── MessageList.tsx (NEW)
│   │       ├── MessageInput.tsx (NEW)
│   │       ├── ConversationSidebar.tsx (NEW)
│   │       ├── ChatMessage.tsx (NEW)
│   │       ├── ModeSelector.tsx (NEW)
│   │       └── StreamingMessage.tsx (NEW)
├── lib/
│   └── api/
│       ├── conversations.ts (NEW)
│       └── chat.ts (NEW)
├── hooks/
│   ├── useConversations.ts (NEW)
│   ├── useChat.ts (NEW)
│   └── useKeyboardNavigation.ts (NEW)
├── components/
│   ├── ErrorBoundary.tsx (NEW)
│   └── LoadingSkeleton.tsx (NEW)

server/
├── src/
│   ├── routes/
│   │   └── messages.js (modified - add streaming)
│   └── controllers/
│       └── messageController.js (modified)
```

---

## 🚀 IMPLEMENTATION ORDER

1. **Create chat layout** (page, layout structure)
2. **Create sidebar** (conversations list, navigation)
3. **Create message display** (ChatMessage, MessageList)
4. **Create message input** (textarea, send button)
5. **Add API integration** (fetch conversations, send messages)
6. **Add error handling** (boundaries, toasts, loading states)
7. **Implement streaming** (SSE, real-time display)
8. **Add keyboard navigation**
9. **Test everything**

---

## ⚠️ IMPORTANT NOTES

### State Management:

- Consider using React Context or Zustand for:
  - Current conversation ID
  - Messages list
  - Conversations list
  - Chat mode selection

### Performance:

- Virtualize message list if > 500 messages
- Memoize expensive components (ChatMessage)
- Lazy load conversation details

### Accessibility:

- Proper aria labels
- Keyboard focus indicators
- Screen reader support
- Color contrast ratios

### Browser Support:

- Use fetch for SSE
- Fallback to polling if needed
- Test on Safari, Chrome, Firefox

---

## ✅ CHECKLIST FOR PHASE 2 COMPLETION

**Backend:**

- [ ] Streaming endpoint implemented
- [ ] SSE events properly formatted
- [ ] Errors handled in streaming

**Frontend:**

- [ ] Chat page at /chat route
- [ ] Sidebar shows conversations
- [ ] Messages display with streaming
- [ ] Mode selector works
- [ ] Can send messages
- [ ] Error handling works
- [ ] Loading states show
- [ ] Keyboard navigation works
- [ ] Mobile responsive

**Testing:**

- [ ] Test on Chrome, Firefox, Safari
- [ ] Test with slow network (DevTools throttle)
- [ ] Test with error scenarios
- [ ] Test long conversations (1000+ messages)
- [ ] Test different modes (chat, tool, agent)

**User Experience:**

- [ ] Fast message sending
- [ ] Smooth scrolling
- [ ] Clear error messages
- [ ] Good loading feedback

---

## ESTIMATED TIME: 10-12 hours (2-3 days)

**Day 1:** Layout, Sidebar, Basic messaging
**Day 2:** Streaming, Error handling, Testing
**Day 3:** Polish, Performance, Responsiveness

---

## NEXT STEPS

Once Phase 2 is complete:

1. Web chat is at feature parity with CLI
2. Users can choose web or CLI
3. Both store data in same database
4. Phase 3 (Export, Shortcuts) can start

**Ready to start Phase 2? Let me know when to begin implementation!** 🚀
