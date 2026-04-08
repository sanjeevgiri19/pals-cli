import chalk from "chalk";
import { Command } from "commander";
import { intro, select, isCancel, cancel } from "@clack/prompts";
import yoctoSpinner from "yocto-spinner";
import { getApiUrl } from "../config.js";
import { apiRequest } from "../lib/api.js";
import {
  getStoredToken,
  isTokenExpired,
} from "../lib/token-store.js";
import { runChatSession } from "./chat-session.js";
import { runAgentSession } from "./agent-session.js";

async function getBearer() {
  const token = await getStoredToken();
  if (!token?.access_token || (await isTokenExpired())) {
    console.log(chalk.red("Not signed in. Run: palscli login"));
    process.exit(1);
  }
  return token.access_token;
}

export async function wakeupAction() {
  const baseUrl = getApiUrl();
  const palPrimary = chalk.hex("#b6a0ff");
  
  intro(palPrimary.bold(" PALS PROMPT • TERMINAL v1.0.5 "));
  
  const spin = yoctoSpinner({ text: chalk.dim("Retrieving secure profile…") }).start();
  let user;
  try {
    const json = await apiRequest(baseUrl, getBearer, "/api/me", {
      method: "GET",
    });
    spin.stop();
    user = json?.data;
    if (!user) throw new Error("Could not decrypt API profile response");
    
    console.log(`\n  ${chalk.green("●")}  ${chalk.bold("Authenticated as:")} ${palPrimary(user.name)} ${chalk.dim("(" + user.email + ")")}\n`);
  } catch (e) {
    spin.stop();
    console.log(`\n  ${chalk.red("✖")}  ${chalk.red(e.message)}\n`);
    process.exit(1);
  }

  const choice = await select({
    message: chalk.bold("Select Operation Context"),
    options: [
      { 
        value: "chat", 
        label: palPrimary("Start Chat"), 
        hint: "Contextual assistant session (hosted API)" 
      },
      {
        value: "tools",
        label: chalk.dim("Cloud Tools / Agents"),
        hint: "Requires web dashboard for complex reasoning"
      },
      {
        value: "whoami",
        label: "Sync Profile Info",
        hint: "Validate local keychain vs API"
      }
    ],
  });

  if (isCancel(choice)) {
    cancel(chalk.dim("Session aborted. Safe wake."));
    process.exit(0);
  }

  if (choice === "tools") {
    await runAgentSession();
    process.exit(0);
  }

  if (choice === "whoami") {
    const { whoamiAction } = await import("./whoami.js");
    await whoamiAction();
    process.exit(0);
  }

  await runChatSession(baseUrl, "chat");
}

export const wakeup = new Command("wakeup")
  .description("Open the PAL menu (chat via API)")
  .action(wakeupAction);
