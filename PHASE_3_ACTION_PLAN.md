# DETAILED ACTION PLAN - PHASE 3: ENHANCEMENT & POLISH

## 📋 OVERVIEW

Final phase adds powerful features for exporting conversations and improving productivity with keyboard shortcuts.

**Dependencies:** Must complete Phase 1 & 2 first!

---

## FEATURE 1: CONVERSATION EXPORT (PDF & MARKDOWN)

**Time: 3 hours**

### What to Create:

- [ ] Export button in conversation header
- [ ] Export to Markdown functionality
- [ ] Export to PDF functionality
- [ ] File download handling
- [ ] Export dialog/modal

---

### TASK 1.1: Export to Markdown

**Time: 1 hour**

### Implementation:

```markdown
# Conversation Title

**Mode:** Chat  
**Started:** April 4, 2026  
**Messages:** 15

---

## Summary

[Optional auto-generated summary]

---

## Messages

### User (2:30 PM)

Your first message here

### Assistant (2:31 PM)

AI response here

...more messages...

---

**Exported:** April 4, 2026 at 10:45 AM using PAL CLI
```

### Files to Create:

- ✅ Create: `client/lib/export/markdownExporter.ts`
- ✅ Create: `client/components/ExportButton.tsx`
- ✅ Create: `client/components/ExportDialog.tsx`

### Implementation:

```typescript
// markdownExporter.ts
export function exportAsMarkdown(
  conversation: Conversation,
  messages: Message[],
): string {
  // Build markdown string
  // Include title, metadata, messages
  // Format code blocks properly
  return markdown;
}

// Usage
const markdown = exportAsMarkdown(conversation, messages);
downloadFile(markdown, "conversation.md", "text/markdown");
```

### Features:

- Include conversation metadata
- Preserve markdown formatting from responses
- Code blocks with language identifiers
- Timestamps for each message
- User-friendly filenames

---

### TASK 1.2: Export to PDF

**Time: 1.5 hours**

### Libraries:

```bash
npm install html2pdf.js
# or
npm install pdfkit
# Recommendation: html2pdf.js (simpler)
```

### Implementation:

```typescript
// pdfExporter.ts
export async function exportAsPDF(
  conversation: Conversation,
  messages: Message[],
): Promise<Blob> {
  // Create HTML representation
  const html = createHTMLForPDF(conversation, messages);

  // Convert to PDF
  const pdf = await html2pdf(html);

  return pdf;
}
```

### PDF Features:

- Professional layout
- Page breaks for large conversations
- Code blocks with syntax highlighting
- Proper spacing and typography
- Cover page with metadata
- Code snippets render nicely
- Timestamps included

### Files to Create:

- ✅ Create: `client/lib/export/pdfExporter.ts`
- ✅ Create: `client/lib/export/htmlGenerator.ts` (convert messages to HTML)

### Styling for PDF:

```css
/* Print-friendly styles */
.pdf-container {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

.message {
  page-break-inside: avoid;
  margin-bottom: 1rem;
}

.code-block {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  font-family: "Courier New", monospace;
}
```

---

### TASK 1.3: Export Dialog & Button

**Time: 0.5 hours**

### Component: `ExportDialog.tsx`

```typescript
Props:
- conversation: Conversation
- messages: Message[]
- onClose: () => void

Features:
- Radio buttons for format (Markdown, PDF)
- Include/exclude metadata checkbox
- Include/exclude timestamps checkbox
- Export button
- Show downloading state
- Success message after download
```

### Component: `ExportButton.tsx`

```typescript
Props:
- conversation: Conversation
- messages: Message[]

Features:
- Menu dropdown (Markdown, PDF)
- Click to export
- Disabled when no messages
- Toast confirmation when done
```

### Files to Create:

- ✅ Modify: `client/app/chat/components/ChatArea.tsx` (add export button)
- ✅ Create: `client/components/ExportDialog.tsx`

### File Naming:

```
Format: conversation_[id]_[date].md
Example: conversation_abc123_2026-04-04.md
         conversation_abc123_2026-04-04.pdf
```

---

### TASK 1.4: Backend Export Endpoint (Optional)

**Time: 1 hour**

### Endpoint:

```
POST /api/conversations/:id/export
Body: { format: 'md' | 'pdf', includeMetadata: boolean }
Response: File binary or blob
```

### Files to Create/Modify:

- ✅ Create: `server/src/routes/export.js`
- ✅ Create: `server/src/controllers/exportController.js`
- ✅ Modify: `server/src/index.js` (register export routes)

### Benefits of backend export:

- Server can access all data reliably
- PDF generation more consistent
- User doesn't wait for client-side processing
- Larger conversations handled better

---

## FEATURE 2: KEYBOARD SHORTCUTS

**Time: 2 hours**

### What to Create:

- [ ] Keyboard shortcut registry
- [ ] Mode switching shortcuts
- [ ] Navigation shortcuts
- [ ] Action shortcuts
- [ ] Shortcut help dialog
- [ ] Settings to customize shortcuts

---

### TASK 2.1: Shortcut Registry

**Time: 0.5 hours**

### Default Shortcuts:

```
// Mode Switching
Ctrl/Cmd + 1  → Chat mode
Ctrl/Cmd + 2  → Tool mode
Ctrl/Cmd + 3  → Agent mode

// Navigation
Ctrl/Cmd + /  → Focus message input
Ctrl/Cmd + K  → Command palette (search conversations)
Ctrl/Cmd + N  → New conversation
Ctrl/Cmd + L  → Focus sidebar

// Quick Actions
Ctrl/Cmd + E  → Export conversation
Ctrl/Cmd + ?  → Show shortcuts help
Escape        → Close dialogs/modals

// Message Editing (Future)
Ctrl/Cmd + U  → Edit message
Ctrl/Cmd + D  → Delete message
```

### Files to Create:

- ✅ Create: `client/lib/shortcuts/keyboardShortcuts.ts`
- ✅ Create: `client/hooks/useKeyboardShortcuts.ts`
- ✅ Create: `client/types/shortcuts.ts`

### Implementation:

```typescript
// keyboardShortcuts.ts
export const DEFAULT_SHORTCUTS = {
  CHAT_MODE: { keys: ["ctrl", "1"], description: "Switch to chat mode" },
  TOOL_MODE: { keys: ["ctrl", "2"], description: "Switch to tool mode" },
  AGENT_MODE: { keys: ["ctrl", "3"], description: "Switch to agent mode" },
  FOCUS_INPUT: { keys: ["ctrl", "/"], description: "Focus message input" },
  NEW_CONVERSATION: {
    keys: ["ctrl", "n"],
    description: "Create new conversation",
  },
  EXPORT: { keys: ["ctrl", "e"], description: "Export conversation" },
  HELP: { keys: ["ctrl", "?"], description: "Show keyboard shortcuts" },
};

// hooks/useKeyboardShortcuts.ts
export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Match shortcuts and call handlers
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}
```

---

### TASK 2.2: Shortcut Implementation

**Time: 1 hour**

### Files to Modify:

- ✅ Modify: `client/app/chat/page.tsx` (register all shortcuts)
- ✅ Create: `client/components/ShortcutHelp.tsx` (help dialog)
- ✅ Create: `client/lib/shortcuts/shortcutManager.ts`

### Implementation in Chat Page:

```typescript
// In useEffect
useKeyboardShortcuts({
  CHAT_MODE: () => setMode("chat"),
  TOOL_MODE: () => setMode("tool"),
  AGENT_MODE: () => setMode("agent"),
  FOCUS_INPUT: () => inputRef.current?.focus(),
  NEW_CONVERSATION: () => handleNewConversation(),
  EXPORT: () => setShowExportDialog(true),
  HELP: () => setShowShortcutHelp(true),
});
```

### Shortcut Help Dialog:

```typescript
// ShortcutHelp.tsx
<Dialog open={showHelp} onOpenChange={setShowHelp}>
  <DialogHeader>Keyboard Shortcuts</DialogHeader>
  <div className="shortcuts-list">
    {SHORTCUTS.map(shortcut => (
      <div key={shortcut.id} className="shortcut-item">
        <kbd>{shortcut.keys.join(' + ')}</kbd>
        <span>{shortcut.description}</span>
      </div>
    ))}
  </div>
</Dialog>
```

---

### TASK 2.3: Settings for Custom Shortcuts

**Time: 0.5 hours**

### Component: `ShortcutSettings.tsx`

```typescript
Features:
- Show all available shortcuts
- Allow remapping
- Validate key combinations
- Reset to defaults
- Save to localStorage
- Warn about conflicts
```

### Files to Create:

- ✅ Create: `client/components/ShortcutSettings.tsx`
- ✅ Create: `client/hooks/useShortcutSettings.ts`

### Storage:

```javascript
// localStorage
{
  "shortcuts": {
    "CHAT_MODE": ["ctrl", "1"],
    "TOOL_MODE": ["ctrl", "2"],
    ...
  }
}
```

---

### TASK 2.4: Global App-Level Shortcuts

**Time: 0.5 hours**

### Files to Create/Modify:

- ✅ Create: `client/hooks/useGlobalShortcuts.ts`
- ✅ Modify: `client/app/layout.tsx` (add global shortcut handler)

### Global Shortcuts (everywhere in app):

```
Ctrl/Cmd + ?  → Help
Ctrl/Cmd + K  → Quick search (all conversations)
```

---

## BONUS FEATURES (Optional for Phase 3)

### If Time Permits:

#### 1. Conversation Search

```
Ctrl/Cmd + K → Open search modal
- Search by title
- Search by content
- Show recent conversations
- Search results in modal/dropdown
```

#### 2. Message Reactions/Bookmarks

```
- Star/bookmark important messages
- View bookmarked messages
- Save snippets
```

#### 3. Quick Copy

```
Ctrl/Cmd + C on code → Auto-copy code block
Shift + Click code → Copy that block
```

---

## 📁 FILES STRUCTURE AFTER PHASE 3

```
client/
├── app/
│   ├── chat/
│   │   └── components/
│   │       └── (existing + ChatArea with export)
├── lib/
│   ├── export/
│   │   ├── markdownExporter.ts (NEW)
│   │   ├── pdfExporter.ts (NEW)
│   │   └── htmlGenerator.ts (NEW)
│   └── shortcuts/
│       ├── keyboardShortcuts.ts (NEW)
│       └── shortcutManager.ts (NEW)
├── hooks/
│   ├── useKeyboardShortcuts.ts (NEW)
│   ├── useShortcutSettings.ts (NEW)
│   └── useGlobalShortcuts.ts (NEW)
├── components/
│   ├── ExportDialog.tsx (NEW)
│   ├── ExportButton.tsx (NEW)
│   ├── ShortcutHelp.tsx (NEW)
│   └── ShortcutSettings.tsx (NEW)
└── types/
    └── shortcuts.ts (NEW)

server/
├── src/
│   ├── routes/
│   │   └── export.js (NEW)
│   └── controllers/
│       └── exportController.js (NEW)
```

---

## 🚀 IMPLEMENTATION ORDER

### Export Feature (3 hours):

1. Create Markdown exporter
2. Create PDF exporter
3. Create export dialog
4. Create export button
5. Test exports

### Keyboard Shortcuts (2 hours):

1. Create shortcut registry
2. Create shortcut hook
3. Register shortcuts in chat page
4. Create shortcut help dialog
5. Create shortcut settings (optional)
6. Test shortcuts

---

## ⚠️ IMPORTANT NOTES

### Export:

- Test with conversations containing code, tables, lists
- Ensure formatting is preserved
- Handle special characters properly
- Create unique filenames to avoid overwrites
- Consider file size limits

### Keyboard Shortcuts:

- Test on Mac (Cmd) and Windows (Ctrl)
- Avoid conflicting with browser shortcuts
- Document all shortcuts
- Allow customization
- Show hints in UI
- Consider accessibility (don't rely only on shortcuts)

### Browser Support:

- Test SSE and keyboard events
- Ensure compatibility with major browsers
- Handle mobile (no keyboard shortcuts)

---

## ✅ CHECKLIST FOR PHASE 3 COMPLETION

**Export Feature:**

- [ ] Markdown export works
- [ ] PDF export works
- [ ] Files download with correct names
- [ ] Formatting preserved in exports
- [ ] Tested with large conversations
- [ ] Export button visible and accessible

**Keyboard Shortcuts:**

- [ ] Mode switching works (Ctrl+1, Ctrl+2, Ctrl+3)
- [ ] Navigation shortcuts work
- [ ] Help dialog shows all shortcuts
- [ ] Settings allow customization
- [ ] Custom shortcuts save to localStorage
- [ ] Help accessible from anywhere
- [ ] No conflicts with browser shortcuts
- [ ] Works on Mac and Windows
- [ ] Shortcuts documented

**Testing:**

- [ ] Test with different conversation sizes
- [ ] Test PDF with code blocks
- [ ] Test markdown with tables
- [ ] Test shortcuts with different keyboards
- [ ] Test on different browsers
- [ ] Test mobile experience
- [ ] Performance testing

---

## ESTIMATED TIME: 5-6 hours (1 day)

- **Export Feature:** 3 hours
- **Keyboard Shortcuts:** 2 hours
- **Testing & Polish:** 1 hour

---

## FINAL COMPLETION CHECKLIST

Once all three phases complete:

- [ ] Web chat at feature parity with CLI
- [ ] Full REST API for conversations
- [ ] Message pagination
- [ ] Conversation export (MD/PDF)
- [ ] Keyboard shortcuts for productivity
- [ ] Error handling throughout
- [ ] All features tested
- [ ] Performance optimized
- [ ] Documentation complete

---

## 🎉 PROJECT COMPLETION

**Total Development Time: 15-20 hours (3-4 weeks)**

After Phase 3:

- PAL CLI ready for broader release
- Feature-complete web and CLI interfaces
- Professional workflow for power users
- Good UX for casual users
- Extensible architecture for future features

---

## NEXT STEPS

**When ready to start Phase 3, I will:**

1. Set up export functionality
2. Add keyboard shortcuts system
3. Integrate with chat UI
4. Test everything
5. Create documentation

**Confirm when you want to begin Phase 1 implementation!** 🚀
