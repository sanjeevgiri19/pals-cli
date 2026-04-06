import chalk from "chalk";
import { Command } from "commander";
import { getApiUrl } from "../config.js";
import { apiRequest } from "../lib/api.js";
import {
  getStoredToken,
  isTokenExpired,
} from "../lib/token-store.js";

async function getBearer() {
  const token = await getStoredToken();
  if (!token?.access_token || (await isTokenExpired())) {
    console.log(chalk.red("Not signed in. Run: palscli login"));
    process.exit(1);
  }
  return token.access_token;
}

export async function whoamiAction(opts) {
  const baseUrl = opts.serverUrl || getApiUrl();
  try {
    const json = await apiRequest(baseUrl, getBearer, "/api/me", {
      method: "GET",
    });
    const user = json?.data;
    if (!user) {
      console.log(chalk.red("Unexpected response from /api/me"));
      process.exit(1);
    }
    console.log(
      chalk.bold.green(`\n${user.name}\n`) +
        chalk.gray(`email: ${user.email}\nid:   ${user.id}\n`),
    );
  } catch (e) {
    console.log(chalk.red(e.message));
    process.exit(1);
  }
}

export const whoami = new Command("whoami")
  .description("Show signed-in user (from API)")
  .option("--server-url <url>", "PAL API base URL")
  .action(whoamiAction);
