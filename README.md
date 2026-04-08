# PALS CLI

> PALS CLI — an AI assistant for developers with a web chat UI and a CLI interface.

PALs CLI provides an interactive chat experience (web + CLI), integrates with external tools, and exposes an HTTP API backed by a Node/Express server and Prisma for persistence.

---

## What it is

- A developer-focused AI assistant combining:
  - A browser-based chat interface (Next.js + React) with conversations, messages, and streaming support.
  - A command-line client (`palscli`) to run assistant commands from your terminal.
  - A backend API (Express + Prisma) that stores conversations and messages and connects to auth providers.

## Features

- Real-time chat interface with conversation history
- CLI interface to chat and run AI-driven developer commands
- Persistent conversations and messages (Postgres via Prisma)
- Authentication (OAuth / device flow via Better-Auth)
- Extensible agent / tool plugins (Google, GitHub, etc.)
- SSE streaming support for assistant partial outputs

## Tech stack

- Client: Next.js (app router), React, TypeScript, Tailwind CSS, shadcn UI
- State: Zustand (auth), TanStack Query (data fetching)
- Server: Node.js, Express, Prisma (Postgres)
- Auth: better-auth
- Other: highlight.js, marked, axios, commander, figlet, open

## Getting started — Clone

```bash
git clone https://github.com/sanjeevgiri19/palscli.git
cd palscli
```

There are two main workspaces: `server/` and `client/`.

Folder map (what’s in the repo and how it relates to the app)
- `client/` — the web application (Next.js):
  - `app/` — pages and the chat UI. Users interact with pages here (`/chat`, `/device`, `/approve`, `/about`, sign-in routes).
  - `components/` and `app/chat/components/` — UI building blocks: conversation sidebar, message list, message input, chat message renderer.
  - `hooks/` — client-side hooks for conversations and messages.
  - `lib/` and `api/` — client-side helpers and API client utilities used to call the backend.

- `server/` — backend server, CLI, chat agents and APIs:
  - `src/index.js` — HTTP server entry (runs API endpoints).
  - `src/cli/main.js` — CLI entrypoint (palscli command behavior lives here).
  - `src/commands/` — CLI subcommands (auth helpers, agent wakers, etc.). These are the actions operators run from the terminal.
  - `src/chat/` — agent orchestration scripts that show how chat flows combine tools + models.
  - `src/routes/` — API routes that the web client calls (conversations, messages).
  - `src/controllers/` & `src/service/` — higher-level request handling and service logic (the non-UI logic behind responses).
  - `src/lib/` and `src/middleware/` — auth helpers, database helpers, and request middleware for authorization and validation.

- `server/prisma/` — Prisma schema and migrations (database model definitions and migration history).

## Install dependencies

From the project root you can install both sides separately.

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

## Environment variables

Create `.env` (server) and `.env.local` (client) files based on these examples.

Server (`server/.env`) example:

```
# Server - example
PORT=3005
DATABASE_URL=postgresql://user:password@localhost:5432/palscli

# session/secret for your auth plugin
SESSION_SECRET=replace_with_a_secure_value

# OAuth / provider keys
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Google / other integrations
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

Client (`client/.env.local`) example:

```
# Client - example
NEXT_PUBLIC_API_URL=http://localhost:3005
```

Notes:
- Use secure secrets in production. Never commit `.env` files with secrets to source control.
- Adjust `NEXT_PUBLIC_API_URL` to point to your deployed server base URL when not running locally.

## Database (Prisma)

1. Ensure Postgres is running and `DATABASE_URL` is set correctly.
2. Run migrations:

```bash
cd server
npm run prisma:migrate
# or
npx prisma migrate dev --name init
```

## Run in development

Open two terminals (or use a process manager), one for the server and one for the client.

Server

```bash
cd server
npm run dev
```

Client

```bash
cd client
npm run dev
```

The web UI will be available at `http://localhost:3000` and the API at the server port (default `http://localhost:3005`).

## Usage

- Web: open the app in a browser, sign in (via configured provider), create or select conversations, and chat.
- CLI: after installing or linking the CLI (see `client` or `server/cli`), run `palscli chat` to start a terminal chat session.

## Troubleshooting

- If you get 401 responses from `/api/*` endpoints while signed in, confirm:
  - `NEXT_PUBLIC_API_URL` points to the correct server
  - The server has the auth provider configured and secrets set
  - Browser cookies are sent (http-only cookies used for session)

- If the UI redirects to `/sign-in` prematurely, the client may be issuing API requests before the auth sync is initialized. Try:
  - Reloading the page
  - Clearing localStorage (auth persistence) and re-signing in

## Tests

If tests exist for the client or server, run them with the respective package scripts (e.g., `npm test`).

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repo
2. Create a feature branch
3. Make changes and run the app locally
4. Open a pull request with a clear description
