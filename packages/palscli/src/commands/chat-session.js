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

  const spin = yoctoSpinner({ text: "Starting conversation…" }).start();
  let conversation;
  try {
    const created = await apiRequest(baseUrl, tokenGetter, "/api/conversations", {
      method: "POST",
      body: JSON.stringify({ mode }),
    });
    conversation = created?.data;
    if (!conversation?.id) throw new Error("Could not create conversation");
    spin.success("Ready");
  } catch (e) {
    spin.error("Failed");
    throw e;
  }

  console.log(
    boxen(
      `${chalk.bold("Conversation")}: ${conversation.title}\n${chalk.gray("ID: " + conversation.id)}`,
      {
        padding: 1,
        margin: { top: 1, bottom: 1 },
        borderStyle: "round",
        borderColor: "cyan",
        title: "PAL chat",
        titleAlignment: "center",
      },
    ),
  );

  const help = boxen(
    `${chalk.gray("Enter message · exit or quit to leave · Ctrl+C to abort")}`,
    {
      padding: 1,
      margin: { bottom: 1 },
      borderStyle: "round",
      borderColor: "gray",
      dimBorder: true,
    },
  );
  console.log(help);

  let firstExchange = true;

  while (true) {
    const userInput = await text({
      message: chalk.blue("You"),
      placeholder: "Message…",
      validate(value) {
        if (!value || !value.trim()) return "Message cannot be empty";
      },
    });

    if (isCancel(userInput)) {
      console.log(chalk.yellow("Bye."));
      process.exit(0);
    }

    const trimmed = userInput.trim();
    const lower = trimmed.toLowerCase();
    if (lower === "exit" || lower === "quit") break;

    const wait = yoctoSpinner({ text: "Thinking…" }).start();
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
        throw new Error("No assistant reply in response");
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
      console.log(
        boxen(rendered.trim(), {
          padding: 1,
          margin: { left: 0, bottom: 1 },
          borderStyle: "round",
          borderColor: "green",
          title: "Assistant",
          titleAlignment: "left",
        }),
      );
    } catch (e) {
      wait.stop();
      console.log(boxen(chalk.red(e.message), { padding: 1, borderColor: "red" }));
    }
  }

  outro(chalk.green("Session ended."));
}

export async function startChatFromCli() {
  intro(boxen(chalk.bold.cyan("PAL CLI chat"), { padding: 1, borderStyle: "double" }));
  try {
    await runChatSession(getApiUrl(), "chat");
  } catch (e) {
    console.log(boxen(chalk.red(e.message), { padding: 1, borderColor: "red" }));
    process.exit(1);
  }
}
