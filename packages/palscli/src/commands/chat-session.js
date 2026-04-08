import { intro, isCancel, outro, text } from "@clack/prompts";
import chalk from "chalk";
import boxen from "boxen";
import yoctoSpinner from "yocto-spinner";
import { getApiUrl } from "../config.js";
import { apiRequest } from "../lib/api.js";
import { renderMarkdown } from "../lib/markdown.js";
import {
  getStoredToken,
  isTokenExpired,
} from "../lib/token-store.js";

async function getBearer() {
  const token = await getStoredToken();
  if (!token?.access_token || (await isTokenExpired())) {
    throw new Error("Not signed in. Run: palscli login");
  }
  return token.access_token;
}

/**
 * @param {string} baseUrl
 * @param {string} mode
 */
export async function runChatSession(baseUrl, mode = "chat") {
  const tokenGetter = getBearer;
  const palPrimary = chalk.hex("#b6a0ff");

  const spin = yoctoSpinner({ text: chalk.dim("Initializing encrypted session…") }).start();
  let conversation;
  try {
    const created = await apiRequest(baseUrl, tokenGetter, "/api/conversations", {
      method: "POST",
      body: JSON.stringify({ mode }),
    });
    conversation = created?.data;
    if (!conversation?.id) throw new Error("Session negotiation failed");
    spin.success(chalk.dim("Secure channel established\n"));
  } catch (e) {
    spin.error(chalk.red("Network error during handshake"));
    throw e;
  }

  console.log(`  ${palPrimary.bold("CONTEXT:")} ${chalk.white(conversation.title)}`);
  console.log(`  ${palPrimary.bold("SESSION:")} ${chalk.dim(conversation.id)}\n`);

  console.log(`  ${chalk.dim("Type 'exit' or 'quit' to terminate • Ctrl+C to force close")}\n`);

  let firstExchange = true;

  while (true) {
    const userInput = await text({
      message: palPrimary.bold("USER"),
      placeholder: "Ask anything…",
      validate(value) {
        if (!value || !value.trim()) return "Message body required";
      },
    });

    if (isCancel(userInput)) {
      console.log(chalk.dim("\n  Closing PAL terminal context…"));
      outro(palPrimary.bold(" SESSION OFFLINE "));
      process.exit(0);
    }

    const trimmed = userInput.trim();
    const lower = trimmed.toLowerCase();
    if (lower === "exit" || lower === "quit") break;

    const wait = yoctoSpinner({ text: chalk.dim("Consulting PAL assistant Engine…") }).start();
    try {
      const res = await apiRequest(
        baseUrl,
        tokenGetter,
        `/api/conversations/${conversation.id}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ content: trimmed, role: "user" }),
        },
      );
      wait.stop();

      const assistantContent = res?.data?.assistantMessage?.content;
      if (assistantContent == null) {
        throw new Error("Assistant did not produce a valid token stream");
      }

      // Display tool execution if any
      if (res.data.toolCalls && Array.isArray(res.data.toolCalls) && res.data.toolCalls.length > 0) {
        console.log(`  ${chalk.dim("●")}  ${chalk.dim(`Tools invoked: ${res.data.toolCalls.map(tc => tc.toolName).join(', ')}`)}`);
      }

      if (firstExchange) {
        firstExchange = false;
        const title =
          trimmed.slice(0, 50) + (trimmed.length > 50 ? "…" : "");
        try {
          await apiRequest(
            baseUrl,
            tokenGetter,
            `/api/conversations/${conversation.id}`,
            {
              method: "PUT",
              body: JSON.stringify({ title }),
            },
          );
        } catch {
          /* title update is best-effort */
        }
      }

      const rendered = renderMarkdown(assistantContent);
      console.log(`\n  ${palPrimary.bold("PALS ASSISTANT")}\n`);
      console.log(rendered.trim().split('\n').map(line => `  ${line}`).join('\n'));
      console.log("");

    } catch (e) {
      wait.stop();
      console.log(`\n  ${chalk.red("!")}  ${chalk.red(e.message)}\n`);
    }
  }

  outro(palPrimary.bold(" SESSION CLOSED "));
}

export async function startChatFromCli() {
  const palPrimary = chalk.hex("#b6a0ff");
  intro(palPrimary.bold(" PALS CHAT • SECURE SESSION "));
  try {
    await runChatSession(getApiUrl(), "chat");
  } catch (e) {
    console.log(`\n  ${chalk.red("✖")}  ${chalk.red(e.message)}\n`);
    process.exit(1);
  }
}
