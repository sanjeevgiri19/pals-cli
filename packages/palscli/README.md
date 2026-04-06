# `palscli` (npm package)

Thin command-line client for **PAL**: it calls your **hosted** PAL API (`/api/me`, `/api/conversations`, …). It does **not** connect to Postgres or load `GOOGLE_API_KEY` locally—those stay on the server.

**Package name:** the unscoped name `palscli` is blocked by npm (too close to the existing package `palscli`). This package is published as **`palscli`**. To use your own scope, change the `name` field in `package.json` to `@your-npm-username/palscli` before publishing.

## Prerequisites

- **Node.js 20+**
- A running PAL **server** (`server/` in this repo) with Postgres, migrations, and env vars set (see `server/.env.example`).
- A **GitHub OAuth App** with the callback URL matching your server, e.g. `https://your-api.example.com/api/auth/callback/github`, and **Device flow** enabled where GitHub requires it.

## Global command name: `palscli`

The npm **binary** is **`palscli`** (with a hyphen), not `palscli`. That avoids a common **Windows** problem: the server package exposes **`palscli`**, and on a case-insensitive filesystem `palscli` and `palscli` are treated as the same global shim, so `npm link` can hit **EEXIST** and `palscli` in your PATH may run the **wrong** CLI.

## Install from this monorepo (development)

```bash
cd packages/palscli
npm install
node ./bin/palscli.js --help
```

### `npm link` on Windows (EEXIST)

1. See what is using the name (often the server CLI): `npm ls -g --depth=0`
2. Unlink the old tool if needed: `npm unlink -g server` (or whatever package installed the conflicting bin)
3. Remove stale shims if they remain, e.g. delete `palscli`, `palscli.cmd`, `palscli`, `palscli.cmd` under `%AppData%\Roaming\npm\` **only if** you know they are leftovers
4. Link this package: `npm link` (creates **`palscli`** globally)
5. Run: `palscli --help`

If npm still complains, use **`npm link --force`** after backing up/removing the conflicting file it names in the error.

## Configure before publishing to npm

1. Edit **`src/publish-config.js`**:
   - Set **`PUBLISH_API_URL`** to your public API base URL (same value as server `BETTER_AUTH_URL` / `API_PUBLIC_URL`).
   - Set **`PUBLISH_GITHUB_CLIENT_ID`** to the GitHub OAuth App’s **Client ID** (public). Never put the **client secret** in this file or in the published package.

2. On the **server**, set matching env (see `server/.env.example`):
   - `BETTER_AUTH_URL`, `TRUSTED_ORIGINS`, `CLIENT_APP_URL`, `CORS_ORIGIN`, `GITHUB_*`, `GOOGLE_API_KEY`, `DATABASE_URL`, etc.

3. Optional overrides for testers (no publish needed):
   - `PALSCLI_API_URL` — API base URL
   - `PALSCLI_GITHUB_CLIENT_ID` — GitHub Client ID

## Publish to npm

The package is **scoped** (`palscli`) so it does not collide with the existing **`palscli`** package on the registry.

```bash
cd packages/palscli
npm whoami   # must be logged in; scope must match your npm user/org
npm publish
# publishConfig.access is already "public" in package.json
```

### `403 Forbidden` — “Two-factor authentication … is required to publish”

npm now requires **either**:

- **2FA on your account** with **“Authorization and publishing”** (not “Auth only”), then publish again with `npm publish` (you may be prompted for an OTP), **or**
- A **granular access token** with permission to **write/publish** packages (and “bypass 2FA” if your org policy requires it), then:  
  `npm config set //registry.npmjs.org/:_authToken=YOUR_TOKEN`

Configure this at [npmjs.com](https://www.npmjs.com/) → **Access Tokens** / **Two-Factor Authentication**.

Optional: run `npm pkg fix` in this folder if `npm publish` warns about `package.json`.

**Private package (invite-only):** use an npm org private package or GitHub Packages; add collaborators in npm UI.

## Device login and `localhost:3000`

`palscli login` opens the **web app** URL (usually `http://localhost:3000/device?...`) so you can enter the device code. That page is **Next.js** (`client/`), not Express. If Edge shows **connection refused**, start the client:

```bash
cd client
npm run dev
```

Keep the **API** running on port 3005 (`cd server && npm run dev`) and set the client’s API base URL (e.g. `NEXT_PUBLIC_*` / `auth-client` `baseURL`) to match.

## End-user commands

```bash
palscli login     # device flow; opens browser
palscli whoami    # GET /api/me
palscli chat      # create conversation + chat via POST .../messages
palscli wakeup    # menu → chat
palscli logout    # delete ~/.palscli/credentials.json
```

After `npm install -g palscli`, the command is still **`palscli`** (see `package.json` → `bin`).

Credentials are stored under **`~/.palscli/credentials.json`**.

## Security reminders

- Do **not** ship database URLs, Google keys, or GitHub **client secrets** in this package.
- Publishing with real `PUBLISH_API_URL` + `PUBLISH_GITHUB_CLIENT_ID` only tells the world **where** to authenticate; access is still gated by your server and OAuth.
