# palscli

A lightweight and fast command-line interface for PAL.

## Installation

You can install `palscli` globally using npm:

```bash
npm install -g palscli
```

*Note: Requires Node.js 20 or higher.*

## Usage

After installation, simply run `palscli` in your terminal to access the tool.

```bash
palscli
```

### Commands

| Command | Description |
| :--- | :--- |
| `login` | Sign in using your GitHub account (device flow). |
| `chat`  | Start an interactive chat session with your PAL assistant. |
| `wakeup`| Open the general interactive interface. |
| `whoami`| Show the currently authenticated user profile. |
| `logout`| Clear saved local credentials and sign out. |

## Quick Start

1. **Login:** Authenticate via device flow to connect to your remote API.
   ```bash
   palscli login
   ```
2. **Chat:** Once authenticated, you can start conversing right away.
   ```bash
   palscli chat
   ```

## Configuration (Advanced)

`palscli` acts as a thin client against your remote PAL API and does not manage local databases or secret keys (besides your own short-lived session). 

If you are a developer testing a custom backend endpoint, you can override the target targets by passing flags to `palscli login`:

- `--server-url <url>` Override the PAL API base URL.
- `--client-id <id>` Override the GitHub OAuth Client ID.

*(You can also use environment variables `PALSCLI_API_URL` and `PALSCLI_GITHUB_CLIENT_ID`)*.

---
<!-- **License:** ISC -->
