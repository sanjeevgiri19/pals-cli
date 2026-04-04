# DETAILED ACTION PLAN - PHASE 1: FOUNDATION & API LAYER

## 📋 OVERVIEW

This phase establishes the backend API infrastructure that all frontend features will depend on.

---

## TASK 1: Global Error Handling Middleware

**Time: 30 minutes**

### What to Create:

- [ ] Error handler middleware in `server/src/middleware/errorHandler.js`
- [ ] Standardized error response format
- [ ] Error logging system

### Implementation Steps:

1. Create error handler middleware
2. Catch all error types (validation, database, API)
3. Return consistent JSON error format
4. Log errors to console (upgrade to Winston later)

### Standardized Error Response:

```javascript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "User-friendly error message",
    "details": "Additional technical details (optional)"
  },
  "statusCode": 400,
  "timestamp": "2026-04-04T10:00:00Z"
}
```

### Files to Modify:

- ✅ Create: `server/src/middleware/errorHandler.js`
- ✅ Modify: `server/src/index.js` (add middleware)

---

## TASK 2: Input Validation Schema

**Time: 45 minutes**

### What to Create:

- [ ] Zod validation schemas for all inputs
- [ ] Validation middleware

### Implementation Steps:

1. Create `server/src/validation/schemas.js`
2. Define schemas for:
   - Create conversation
   - Send message
   - Update conversation
   - Delete conversation
3. Create validation middleware helper

### Schemas to Define:

```javascript
// Conversation
- createConversation: { title?, mode }
- updateConversation: { title }
- deleteConversation: { id }

// Message
- sendMessage: { conversationId, content, role }
- pagination: { page, limit }
```

### Files to Create:

- ✅ Create: `server/src/validation/schemas.js`
- ✅ Create: `server/src/middleware/validateRequest.js`

---

## TASK 3: Conversation REST API Endpoints

**Time: 2 hours**

### What to Create:

- [ ] Full REST API for conversations and messages
- [ ] Proper HTTP methods (GET, POST, PUT, DELETE)
- [ ] Authentication checks on all endpoints

### Endpoints to Implement:

#### Conversations

```
GET    /api/conversations                 # List all user conversations
POST   /api/conversations                 # Create new conversation
GET    /api/conversations/:id             # Get conversation with messages
PUT    /api/conversations/:id             # Update conversation (rename)
DELETE /api/conversations/:id             # Delete conversation

Optional:
PATCH  /api/conversations/:id             # Partial update
```

#### Messages

```
GET    /api/conversations/:id/messages    # Get messages with pagination
POST   /api/conversations/:id/messages    # Send message & get streaming response
DELETE /api/messages/:id                  # Delete message
PUT    /api/messages/:id                  # Edit message (optional)
```

### Files to Create/Modify:

- ✅ Create: `server/src/routes/conversations.js`
- ✅ Create: `server/src/routes/messages.js`
- ✅ Create: `server/src/controllers/conversationController.js`
- ✅ Create: `server/src/controllers/messageController.js`
- ✅ Modify: `server/src/index.js` (register routes)

### Key Implementation Details:

- Add user ID validation from session
- Add pagination query params (page, limit, default: page=1, limit=50)
- Add sorting options (createdAt: asc|desc)
- Return proper status codes (200, 201, 400, 404, 500)

---

## TASK 4: Message Pagination in Database

**Time: 1.5 hours**

### What to Create:

- [ ] Database indexes for performance
- [ ] Pagination helper function
- [ ] Cursor-based or offset pagination

### Implementation Steps:

1. Add composite index: `conversationId + createdAt`
2. Create pagination helper in `server/src/lib/pagination.js`
3. Update ChatService to support pagination
4. Test with 1000+ messages

### Composite Index (SQL):

```sql
-- Add to Prisma migration
model Message {
  id             String   @id @default(cuid())
  conversationId String
  role           String
  content        String   @db.Text
  createdAt      DateTime @default(now())

  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  @@index([conversationId, createdAt])  // Composite index
}
```

### Pagination Function:

```javascript
// Input: page=2, limit=50
// Output: skip=50, take=50
// Response: {data: [], total: 500, page: 2, pages: 10}
```

### Files to Create/Modify:

- ✅ Create: `server/src/lib/pagination.js`
- ✅ Create: `server/prisma/migrations/[timestamp]_add_message_index/`
- ✅ Modify: `server/src/service/chat.service.js` (add pagination methods)

---

## TASK 5: API Response Standardization

**Time: 30 minutes**

### What to Create:

- [ ] Response wrapper utility
- [ ] Consistent success/error response format

### Files to Create:

- ✅ Create: `server/src/utils/response.js`

### Response Format:

```javascript
// Success
{
  "success": true,
  "data": { /* actual data */ },
  "statusCode": 200
}

// Error
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  },
  "statusCode": 400
}

// List with pagination
{
  "success": true,
  "data": [],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 50,
    "pages": 2
  },
  "statusCode": 200
}
```

### Usage:

```javascript
res.json(sendSuccess(data, 200));
res.status(400).json(sendError("VALIDATION_ERROR", "Invalid input", 400));
```

---

## TASK 6: Authentication Middleware

**Time: 30 minutes**

### What to Create:

- [ ] Middleware to check user from token
- [ ] Middleware to check conversation ownership

### Files to Create/Modify:

- ✅ Create: `server/src/middleware/authMiddleware.js`
- ✅ Create: `server/src/middleware/ownershipMiddleware.js`

### Implementation:

```javascript
// authMiddleware: Extract user from token/session
// ownershipMiddleware: Verify user owns the conversation
```

---

## TASK 7: Testing & Validation

**Time: 1 hour**

### Testing Approach:

**1. Manual Testing (Postman/Thunder Client)**

```
- Create conversation
- Send message
- List conversations
- Pagination (page 1, page 2)
- Error handling (invalid IDs)
- Auth validation (without token)
```

**2. Database Verification**

```
- Check indexes created
- Query performance < 100ms
- Pagination limits working
```

**3. Error Scenarios**

```
- Invalid conversation ID
- Missing required fields
- Unauthenticated requests
- Unauthorized access (other user's data)
```

### Files to Create:

- ✅ Create: `server/API_TESTING.md` (test cases documentation)

---

## 📁 FILES STRUCTURE AFTER PHASE 1

```
server/
├── src/
│   ├── index.js (modified - add middleware & routes)
│   ├── middleware/
│   │   ├── errorHandler.js (NEW)
│   │   ├── validateRequest.js (NEW)
│   │   ├── authMiddleware.js (NEW)
│   │   └── ownershipMiddleware.js (NEW)
│   ├── routes/
│   │   ├── conversations.js (NEW)
│   │   └── messages.js (NEW)
│   ├── controllers/
│   │   ├── conversationController.js (NEW)
│   │   └── messageController.js (NEW)
│   ├── validation/
│   │   └── schemas.js (NEW)
│   ├── lib/
│   │   ├── pagination.js (NEW)
│   │   └── db.js (existing)
│   ├── utils/
│   │   └── response.js (NEW)
│   └── service/
│       └── chat.service.js (modified)
├── prisma/
│   ├── schema.prisma (modified - indexes)
│   └── migrations/
│       └── [timestamp]_add_message_index/
└── API_TESTING.md (NEW)
```

---

## 🚀 IMPLEMENTATION ORDER

1. **Create middleware** (errorHandler, validation)
2. **Create controllers** (conversationController, messageController)
3. **Create routes** (conversations, messages)
4. **Update index.js** (register all middleware & routes)
5. **Create database migrations** (add indexes)
6. **Test all endpoints** (Postman)
7. **Handle errors** (ensure error middleware catches all cases)

---

## ⚠️ IMPORTANT NOTES

- All endpoints should require authentication
- All endpoints should validate user owns the conversation
- All responses should use the standardized format
- Pagination should default to: page=1, limit=50
- Database queries should use Prisma select() to avoid N+1
- Error messages should be user-friendly

---

## ✅ CHECKLIST FOR PHASE 1 COMPLETION

- [ ] Error handler middleware implemented
- [ ] Input validation schemas created
- [ ] All conversation endpoints implemented
- [ ] All message endpoints implemented
- [ ] Pagination works with 100+ messages
- [ ] Database indexes created
- [ ] Response format standardized
- [ ] Authentication middleware working
- [ ] All endpoints tested in Postman
- [ ] Error handling tested (400, 404, 500)
- [ ] API documentation created (API_TESTING.md)

**ESTIMATED TIME: 6-8 hours (can be done in 1-2 days)**

---

## NEXT STEPS

Once Phase 1 is complete:

1. Frontend team can use API immediately
2. Phase 2 (Web Chat UI) can start in parallel
3. No changes needed to Phase 1 code for Phase 2

Confirm when ready to proceed! 🚀
