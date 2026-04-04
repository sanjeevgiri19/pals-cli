# PAL CLI - API TESTING GUIDE

## Overview

This document contains all test cases for Phase 1 API endpoints. Use Postman, Thunder Client, or curl to test.

---

## 🔑 Authentication

All endpoints (except `/api/auth/*`) require authentication via:

### Option 1: Session Token (Recommended)

```bash
Authorization: Bearer <session-token>
```

Get token from: `~/.better-auth/token.json` (after login with `palcli login`)

### Option 2: Better-Auth Session

The `/api/auth/*` endpoints handle OAuth automatically.

---

## 📋 CONVERSATION ENDPOINTS

### 1. List All Conversations

```
GET /api/conversations
Headers:
  Authorization: Bearer <token>

Query Params:
  ?page=1&limit=50&sort=desc

Expected Response: 200
{
  "success": true,
  "data": [
    {
      "id": "cly...",
      "userId": "user123",
      "title": "My Chat",
      "mode": "chat",
      "lastMessage": "Hello...",
      "createdAt": "2026-04-04T...",
      "updatedAt": "2026-04-04T..."
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 50,
    "pages": 1,
    "hasMore": false
  }
}
```

### 2. Get Single Conversation

```
GET /api/conversations/:id
Headers:
  Authorization: Bearer <token>

Expected Response: 200
{
  "success": true,
  "data": {
    "id": "cly...",
    "userId": "user123",
    "title": "My Chat",
    "mode": "chat",
    "createdAt": "2026-04-04T...",
    "updatedAt": "2026-04-04T...",
    "messages": [
      {
        "id": "msg123",
        "role": "user",
        "content": "Hello",
        "createdAt": "2026-04-04T..."
      }
    ]
  }
}
```

### 3. Create Conversation

```
POST /api/conversations
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "title": "New Chat",
  "mode": "chat"
}

Expected Response: 201
{
  "success": true,
  "data": {
    "id": "cly...",
    "userId": "user123",
    "title": "New Chat",
    "mode": "chat",
    "createdAt": "2026-04-04T...",
    "updatedAt": "2026-04-04T..."
  }
}
```

### 4. Update Conversation (Rename)

```
PUT /api/conversations/:id
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "title": "Updated Title"
}

Expected Response: 200
{
  "success": true,
  "data": {
    "id": "cly...",
    "title": "Updated Title",
    ...
  }
}
```

### 5. Delete Conversation

```
DELETE /api/conversations/:id
Headers:
  Authorization: Bearer <token>

Expected Response: 200
{
  "success": true,
  "data": {
    "id": "cly...",
    "deleted": true
  }
}
```

### 6. Get Conversation Messages (Paginated)

```
GET /api/conversations/:id/messages
Headers:
  Authorization: Bearer <token>

Query Params:
  ?page=1&limit=50&sort=desc

Expected Response: 200
{
  "success": true,
  "data": [
    {
      "id": "msg123",
      "conversationId": "conv123",
      "role": "user",
      "content": "Hello",
      "createdAt": "2026-04-04T..."
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 50,
    "pages": 1,
    "hasMore": false
  }
}
```

---

## 💬 MESSAGE ENDPOINTS

### 1. Send Message & Get Response

```
POST /api/conversations/:id/messages
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "content": "What is the weather?",
  "role": "user",
  "stream": false
}

Expected Response: 201
{
  "success": true,
  "data": {
    "userMessage": {
      "id": "msg123",
      "conversationId": "conv123",
      "role": "user",
      "content": "What is the weather?",
      "createdAt": "2026-04-04T..."
    },
    "assistantMessage": {
      "id": "msg124",
      "conversationId": "conv123",
      "role": "assistant",
      "content": "I don't have real-time weather data...",
      "createdAt": "2026-04-04T..."
    }
  }
}
```

### 2. Send Message with Streaming

```
POST /api/conversations/:id/messages
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
  Accept: text/event-stream

Body:
{
  "content": "Explain quantum computing",
  "role": "user",
  "stream": true
}

Expected Response: 200 (SSE Stream)
data: {"type":"message_chunk","chunk":"Quantum..."}
data: {"type":"message_chunk","chunk":" computing..."}
data: {"type":"message_complete","messageId":"msg124","totalTokens":150}
```

### 3. Get Single Message

```
GET /api/messages/:id
Headers:
  Authorization: Bearer <token>

Expected Response: 200
{
  "success": true,
  "data": {
    "id": "msg123",
    "conversationId": "conv123",
    "role": "user",
    "content": "Hello",
    "createdAt": "2026-04-04T..."
  }
}
```

### 4. Delete Message

```
DELETE /api/messages/:id
Headers:
  Authorization: Bearer <token>

Expected Response: 200
{
  "success": true,
  "data": {
    "id": "msg123",
    "deleted": true
  }
}
```

---

## ❌ ERROR SCENARIOS & EXPECTED RESPONSES

### 1. Unauthorized (Missing Token)

```
GET /api/conversations
(no Authorization header)

Expected Response: 401
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  },
  "statusCode": 401,
  "timestamp": "2026-04-04T..."
}
```

### 2. Validation Error (Invalid Input)

```
POST /api/conversations
Body: { "title": "" }

Expected Response: 400
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": "title: String must contain at least 1 character"
  },
  "statusCode": 400,
  "timestamp": "2026-04-04T..."
}
```

### 3. Not Found (Invalid ID)

```
GET /api/conversations/invalid-id

Expected Response: 404
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Conversation not found"
  },
  "statusCode": 404,
  "timestamp": "2026-04-04T..."
}
```

### 4. Unauthorized Access (Other User's Conversation)

```
DELETE /api/conversations/other-user-conv-id

Expected Response: 404 (for security, don't say "forbidden")
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Conversation not found"
  },
  "statusCode": 404,
  "timestamp": "2026-04-04T..."
}
```

---

## 🧪 TEST CASES TO RUN

### Basic Functionality

- [ ] Create conversation
- [ ] List conversations (page 1)
- [ ] List conversations (page 2 with limit=1)
- [ ] Get single conversation
- [ ] Update conversation title
- [ ] Get messages in conversation
- [ ] Send message
- [ ] Delete message
- [ ] Delete conversation

### Authentication

- [ ] Request without token → 401
- [ ] Request with invalid token → 401
- [ ] Request with valid token → 200

### Validation

- [ ] Create with empty title → 400
- [ ] Create with title > 200 chars → 400
- [ ] Send message with empty content → 400
- [ ] Send message with content > 10000 chars → 400
- [ ] Invalid pagination (page=0) → 400
- [ ] Invalid pagination (limit=101) → 400

### Pagination

- [ ] Get first page
- [ ] Get second page
- [ ] Get last page
- [ ] hasMore flag is correct
- [ ] total count is correct

### Edge Cases

- [ ] Delete non-existent conversation → 404
- [ ] Delete non-existent message → 404
- [ ] Access other user's conversation → 404
- [ ] Stream message → SSE events
- [ ] Create conversation with AI response → Check message is saved

---

## 📝 POSTMAN COLLECTION

Import this into Postman as a collection:

```json
{
  "info": {
    "name": "PAL CLI API",
    "version": "1.0"
  },
  "item": [
    {
      "name": "Conversations",
      "item": [
        {
          "name": "List Conversations",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/conversations?page=1&limit=50",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ]
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3005"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## 🚀 TESTING WITH CURL

### List Conversations

```bash
curl -X GET "http://localhost:3005/api/conversations?page=1&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Conversation

```bash
curl -X POST "http://localhost:3005/api/conversations" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Chat", "mode": "chat"}'
```

### Send Message

```bash
curl -X POST "http://localhost:3005/api/conversations/CONV_ID/messages" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello!", "role": "user"}'
```

### Test Streaming

```bash
curl -X POST "http://localhost:3005/api/conversations/CONV_ID/messages" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{"content": "Tell me a story", "stream": true}' \
  -N  # Unbuffered output
```

---

## 📊 PERFORMANCE TARGETS

After running tests, check:

- [ ] List conversations: < 100ms
- [ ] Get single conversation: < 100ms
- [ ] Send message: < 2000ms (includes AI response)
- [ ] Pagination with 1000+ messages: < 200ms
- [ ] Streaming response: starts < 500ms

---

## ✅ PHASE 1 VALIDATION CHECKLIST

- [ ] All endpoints respond with correct status codes
- [ ] Error responses have standardized format
- [ ] Pagination works with multiple pages
- [ ] Authentication is enforced on all endpoints
- [ ] User can only access their own conversations
- [ ] Messages can be created, read, deleted
- [ ] Database indexes are performant
- [ ] Streaming responses work correctly
- [ ] All error scenarios handled gracefully

---

## 🐛 DEBUGGING

If tests fail:

1. **Check server logs** - Look for error messages
2. **Verify auth token** - Make sure it's valid
3. **Check database connection** - Run `npx prisma db push`
4. **Validate request format** - Match the schema exactly
5. **Check timestamps** - Ensure database has correct time

---

## 📞 COMMON ISSUES

### Issue: 401 Unauthorized

**Solution:**

- Get token from CLI: `~/.better-auth/token.json`
- Use the `access_token` value
- Make sure it's not expired

### Issue: 404 Not Found

**Solution:**

- Verify conversation ID is correct
- Check that you created the conversation first
- Make sure it's your conversation (not another user's)

### Issue: 400 Validation Error

**Solution:**

- Check request body matches schema
- Ensure all required fields are present
- Validate field lengths and types

---

Made for PAL CLI Phase 1 Testing ✅
