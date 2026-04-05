import chalk from "chalk";
import { Command } from "commander";
import { select, isCancel, cancel } from "@clack/prompts";
import yoctoSpinner from "yocto-spinner";
import { getApiUrl } from "../config.js";
import { apiRequest } from "../lib/api.js";
import {
  getStoredToken,
  isTokenExpired,
} from "../lib/token-store.js";
import { runChatSession } from "./chat-session.js";

async function getBearer() {
  const token = await getStoredToken();
  if (!token?.access_token || (await isTokenExpired())) {
    console.log(chalk.red("Not signed in. Run: palcli login"));
    process.exit(1);
  }
  return token.access_token;
}

async function wakeupAction() {
  const baseUrl = getApiUrl();
  const spin = yoctoSpinner({ text: "Loading profile…" }).start();
  try {
    const json = await apiRequest(baseUrl, getBearer, "/api/me", {
      method: "GET",
    });
    spin.stop();
    const user = json?.data;
    if (!user) {
      console.log(chalk.red("Unexpected /api/me response"));
      process.exit(1);
    }
    console.log(chalk.green(`\nHi, ${user.name}!\n`));
  } catch (e) {
    spin.stop();
    console.log(chalk.red(e.message));
    process.exit(1);
  }

  const choice = await select({
    message: "What do you want to do?",
    options: [
      { value: "chat", label: "Chat", hint: "Talk to the assistant (uses your hosted API)" },
      {
        value: "tools",
        label: "Tool / agent mode",
        hint: "Use the web app for tool & agent flows for now",
      },
    ],
  });

  if (isCancel(choice)) {
    cancel("Cancelled");
    process.exit(0);
  }

  if (choice === "tools") {
    console.log(
      chalk.yellow(
        "\nTool and agent modes are not exposed in this CLI yet. Use the Next.js app or the in-repo server CLI.\n",
      ),
    );
    process.exit(0);
  }

  await runChatSession(baseUrl, "chat");
}

export const wakeup = new Command("wakeup")
  .description("Open the PAL menu (chat via API)")
  .action(wakeupAction);
