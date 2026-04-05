# `palcli` (npm package)

Thin command-line client for **PAL**: it calls your **hosted** PAL API (`/api/me`, `/api/conversations`, …). It does **not** connect to Postgres or load `GOOGLE_API_KEY` locally—those stay on the server.

## Prerequisites

- **Node.js 20+**
- A running PAL **server** (`server/` in this repo) with Postgres, migrations, and env vars set (see `server/.env.example`).
- A **GitHub OAuth App** with the callback URL matching your server, e.g. `https://your-api.example.com/api/auth/callback/github`, and **Device flow** enabled where GitHub requires it.

## Install from this monorepo (development)

```bash
cd packages/palcli
npm install
npm link
# or: node ./bin/palcli.js --help
```

## Configure before publishing to npm

1. Edit **`src/publish-config.js`**:
   - Set **`PUBLISH_API_URL`** to your public API base URL (same value as server `BETTER_AUTH_URL` / `API_PUBLIC_URL`).
   - Set **`PUBLISH_GITHUB_CLIENT_ID`** to the GitHub OAuth App’s **Client ID** (public). Never put the **client secret** in this file or in the published package.

2. On the **server**, set matching env (see `server/.env.example`):
   - `BETTER_AUTH_URL`, `TRUSTED_ORIGINS`, `CLIENT_APP_URL`, `CORS_ORIGIN`, `GITHUB_*`, `GOOGLE_API_KEY`, `DATABASE_URL`, etc.

3. Optional overrides for testers (no publish needed):
   - `PALCLI_API_URL` — API base URL
   - `PALCLI_GITHUB_CLIENT_ID` — GitHub Client ID

## Publish to npm

```bash
cd packages/palcli
npm whoami   # must be logged in
npm publish
# Scoped (recommended if the name is taken):
# npm publish --access public
# after setting "name": "@your-scope/palcli" in package.json
```

**Private package (invite-only):** use an npm org private package or GitHub Packages; add collaborators in npm UI.

## End-user commands

```bash
palcli login      # device flow; opens browser
palcli whoami     # GET /api/me
palcli chat       # create conversation + chat via POST .../messages
palcli wakeup     # menu → chat
palcli logout     # delete ~/.palcli/credentials.json
```

Credentials are stored under **`~/.palcli/credentials.json`**.

## Security reminders

- Do **not** ship database URLs, Google keys, or GitHub **client secrets** in this package.
- Publishing with real `PUBLISH_API_URL` + `PUBLISH_GITHUB_CLIENT_ID` only tells the world **where** to authenticate; access is still gated by your server and OAuth.
