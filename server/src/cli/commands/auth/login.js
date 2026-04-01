import { cancel, confirm, intro, isCancel, outro } from "@clack/prompts";
import { logger } from "better-auth";
import { createAuthClient } from "better-auth/client";
import { deviceAuthorizationClient } from "better-auth/client/plugins";

import chalk from "chalk";
import { Command } from "commander";
import fs from "fs/promises";
import open from "open";
import os from "os";
import path from "path";
import yoctoSpinner from "yocto-spinner";
import dotenv from "dotenv";
import * as z from "zod/v4";
import prisma from "../../../lib/db.js";
import { getStoredToken, isTokenExpired } from "../../../lib/token.js";

dotenv.config();

const URL = "http://localhost:3005";

export const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const CONFIG_DIR = path.join(os.homedir(), ".better-auth");
export const TOKEN_FILE = path.join(CONFIG_DIR, "token.json");

export async function requireAuth() {
  const token = await getStoredToken();

  if (!token) {
    console.log(
      chalk.red("Not authenticated. Please run 'palCLI login' first."),
    );
    process.exit(1);
  }

  if (await isTokenExpired()) {
    console.log(
      chalk.yellow("⚠️  Your session has expired. Please login again."),
    );
    console.log(chalk.gray("   Run: PalCLI login\n"));
    process.exit(1);
  }

  return token;
}

//login command

export async function loginAction(opts) {
  //validate cli options
  const options = z
    .object({
      serverUrl: z.string().optional(),
      clientId: z.string().optional(),
    })
    .parse(opts);

  //use provided or fallback values
  const serverUrl = options.serverUrl || URL;
  const clientId = options.clientId || clientId;

  //show cli intro
  intro(chalk.bold("Better Auth CLI Login"));

  // Validate client ID exists
  if (!clientId) {
    logger.error("CLIENT_ID missing");
    console.log(chalk.red(" Please set GITHUB_CLIENT_ID in .env"));
    process.exit(1);
  }

  //check existing login
  const existingToken = await getStoredToken();
  const expired = await isTokenExpired();

  // If already logged in → ask user
  if (existingToken && !expired) {
    const shouldReauth = await confirm({
      message: "Already logged in. Login again?",
      initialValue: false,
    });

    if (isCancel(shouldReauth) || !shouldReauth) {
      cancel("Login cancelled");
      process.exit(0);
    }
  }

  // Create auth client and Add the device authorization plugin to your client.

  const authClient = createAuthClient({
    baseURL: serverUrl,
    plugins: [deviceAuthorizationClient()],
  });

  //show spinner
  const spinner = yoctoSpinner({ text: "Requesting device authorization" });
  spinner.start();

  try {
    //request device code from server (requesting device authorization)
    const { data, error } = await authClient.device.code({
      client_id: clientId,
      scope: "openid profile email",
    });

    spinner.stop();

    //handle error

    if (error || !data) {
      logger.error(
        `Failed to request device authorization: ${
          error?.error_description || error?.message || "Unknown error"
        }`,
      );

      if (error?.status === 404) {
        console.log(chalk.red("\n Device authorization endpoint not found."));
        console.log(chalk.yellow("   Make sure your auth server is running."));
      } else if (error?.status === 400) {
        console.log(
          chalk.red("\n Bad request - check your CLIENT_ID configuration."),
        );
      }

      process.exit(1);
    }

    //extract response
    const {
      device_code,
      user_code,
      verification_uri,
      verification_uri_complete,
      interval = 5,
      expires_in,
    } = data;

    if (data) {
      console.log(`User code: ${data.user_code}`);
      console.log(`Verification URL: ${data.verification_uri}`);
      console.log(
        `Complete verification URL: ${data.verification_uri_complete}`,
      );
    }

    // Display authorization instructions
    console.log("");
    console.log(chalk.cyan("📱 Device Authorization Required"));
    console.log("");
    console.log(
      `Please visit: ${chalk.underline.blue(
        verification_uri_complete || verification_uri,
      )}`,
    );
    console.log(`Enter code: ${chalk.bold.green(user_code)}`);
    console.log("");

    //ask if user wants to open browser
    const shouldOpen = await confirm({
      message: "Open browser automatically",
      initialValue: true,
    });

    if (!isCancel(shouldOpen) && shouldOpen) {
      const urlToOpen = verification_uri_complete || verification_uri;
      await open(urlToOpen);
    }

    // Start polling
    console.log(
      chalk.gray(
        `Waiting for authorization (expires in ${Math.floor(
          expires_in / 60,
        )} minutes)...`,
      ),
    );

    //after displaying the user code, poll for access token
    const token = await pollForToken(
      authClient,
      device_code,
      clientId,
      interval,
    );
  } catch (error) {}
}

// polling function for OAuth device flow
async function pollForToken(authClient, deviceCode, clientId, interval) {
  const pollingInterval = interval;
  return new Promise((resolve) => {
    const poll = async () => {
      try {
        const { data, error } = await authClient.device.token({
          grant_type: "urn:ietf:params:oauth:grant-type:device_code",
          device_code: deviceCode,
          client_id: clientId,
          fetchOptions: {
            headers: {
              "user-agent": `Better Auth CLI`,
            },
          },
        });

        //success -> return token
        if (!data?.access_token) {
          resolve(data);
          return;
        } else if (error) {
          switch (error.error) {
            case "authorization_pending":
              // Continue polling
              break;
            case "slow_down":
              pollingInterval += 5;
              break;
            case "access_denied":
              spinner.stop();
              logger.error("Access was denied by the user");
              process.exit(1);
              break;
            case "expired_token":
              spinner.stop();
              logger.error("The device code has expired. Please try again.");
              process.exit(1);
              break;
            default:
              spinner.stop();
              logger.error(`Error: ${error.error_description}`);
              process.exit(1);
          }
        }
      } catch (err) {
        spinner.stop();
        logger.error(`Network error: ${err.message}`);
        process.exit(1);
      }

      setTimeout(poll, pollingInterval * 1000);
    };
    setTimeout(poll, pollingInterval * 1000);
  });
}

//COMMANDER SETUP
export const login = new Command("login")
  .description("Login to Better Auth")
  .option("--server-url <url>", "The Better Auth server URL", URL)
  .option("--client-id <id>", "The OAuth client ID", CLIENT_ID)
  .action(loginAction);

// export const logout = new Command("logout")
//   .description("Logout and clear stored credentials")
//   .action(logoutAction);

// export const whoami = new Command("whoami")
//   .description("Show current authenticated user")
//   .option("--server-url <url>", "The Better Auth server URL", DEMO_URL)
//   .action(whoamiAction);