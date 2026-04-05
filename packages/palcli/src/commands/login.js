import { cancel, confirm, intro, isCancel, outro } from "@clack/prompts";
import { createAuthClient } from "better-auth/client";
import { deviceAuthorizationClient } from "better-auth/client/plugins";
import chalk from "chalk";
import { Command } from "commander";
import open from "open";
import yoctoSpinner from "yocto-spinner";
import * as z from "zod";
import { getApiUrl, getGithubClientId } from "../config.js";
import {
  getCredentialsPath,
  getStoredToken,
  isTokenExpired,
  storeToken,
} from "../lib/token-store.js";

async function pollForToken(authClient, deviceCode, clientId, initialInterval) {
  let pollingInterval = initialInterval;
  const spinner = yoctoSpinner({ text: "", color: "cyan" });
  let dots = 0;

  return new Promise((resolve, reject) => {
    const poll = async () => {
      dots = (dots + 1) % 4;
      spinner.text = chalk.gray(
        `Polling for authorization${".".repeat(dots)}${" ".repeat(3 - dots)}`,
      );
      if (!spinner.isSpinning) spinner.start();

      try {
        const { data, error } = await authClient.device.token({
          grant_type: "urn:ietf:params:oauth:grant-type:device_code",
          device_code: deviceCode,
          client_id: clientId,
          fetchOptions: {
            headers: { "user-agent": "palcli" },
          },
        });

        if (data?.access_token) {
          spinner.stop();
          resolve(data);
          return;
        }

        if (error) {
          switch (error.error) {
            case "authorization_pending":
              break;
            case "slow_down":
              pollingInterval += 5;
              break;
            case "access_denied":
              spinner.stop();
              reject(new Error("Access denied"));
              return;
            case "expired_token":
              spinner.stop();
              reject(new Error("Device code expired"));
              return;
            default:
              spinner.stop();
              reject(
                new Error(error.error_description || error.error || "Token error"),
              );
              return;
          }
        }
      } catch (err) {
        spinner.stop();
        reject(err);
        return;
      }

      setTimeout(poll, pollingInterval * 1000);
    };

    setTimeout(poll, pollingInterval * 1000);
  });
}

export async function loginAction(opts) {
  const options = z
    .object({
      serverUrl: z.string().optional(),
      clientId: z.string().optional(),
    })
    .parse(opts);

  const serverUrl = options.serverUrl || getApiUrl();
  const clientId = options.clientId || getGithubClientId();

  intro(chalk.bold("PAL CLI — sign in"));

  if (!clientId) {
    console.log(
      chalk.red(
        "GitHub OAuth Client ID is not configured.\nThe package maintainer must set PUBLISH_GITHUB_CLIENT_ID in src/publish-config.js before publish,\nor set PALCLI_GITHUB_CLIENT_ID for local use.",
      ),
    );
    process.exit(1);
  }

  const existingToken = await getStoredToken();
  if (existingToken && !(await isTokenExpired())) {
    const again = await confirm({
      message: "Already signed in. Sign in again?",
      initialValue: false,
    });
    if (isCancel(again) || !again) {
      cancel("Cancelled");
      process.exit(0);
    }
  }

  const authClient = createAuthClient({
    baseURL: serverUrl,
    plugins: [deviceAuthorizationClient()],
  });

  const spinner = yoctoSpinner({ text: "Requesting device authorization" });
  spinner.start();

  try {
    const { data, error } = await authClient.device.code({
      client_id: clientId,
      scope: "openid profile email",
    });

    spinner.stop();

    if (error || !data) {
      console.log(
        chalk.red(
          error?.error_description || error?.message || "Device code request failed",
        ),
      );
      if (error?.status === 404) {
        console.log(chalk.yellow("Is the server running at " + serverUrl + "?"));
      }
      process.exit(1);
    }

    const {
      device_code,
      user_code,
      verification_uri,
      verification_uri_complete,
      interval = 5,
      expires_in,
    } = data;

    console.log("");
    console.log(chalk.cyan("Device sign-in"));
    console.log(
      chalk.white("Open: ") +
        chalk.underline.blue(verification_uri_complete || verification_uri),
    );
    console.log(chalk.white("Code: ") + chalk.bold.green(user_code));
    console.log("");

    const shouldOpen = await confirm({
      message: "Open browser automatically?",
      initialValue: true,
    });

    if (!isCancel(shouldOpen) && shouldOpen) {
      await open(verification_uri_complete || verification_uri);
    }

    console.log(
      chalk.gray(
        `Waiting (expires in ~${Math.floor(expires_in / 60)} min)…`,
      ),
    );

    const token = await pollForToken(
      authClient,
      device_code,
      clientId,
      interval,
    );

    await storeToken(token);

    const { data: session } = await authClient.getSession({
      fetchOptions: {
        headers: { Authorization: `Bearer ${token.access_token}` },
      },
    });

    outro(
      chalk.green(
        `Signed in as ${session?.user?.name || session?.user?.email || "user"}`,
      ),
    );
    console.log(chalk.gray(`Credentials: ${getCredentialsPath()}\n`));
  } catch (err) {
    spinner.stop();
    console.error(chalk.red("Login failed:"), err.message);
    process.exit(1);
  }
}

export async function logoutAction() {
  intro(chalk.bold("Sign out"));
  const token = await getStoredToken();
  if (!token) {
    console.log(chalk.yellow("Not signed in."));
    process.exit(0);
  }
  const ok = await confirm({
    message: "Clear saved credentials?",
    initialValue: true,
  });
  if (isCancel(ok) || !ok) {
    cancel("Cancelled");
    process.exit(0);
  }
  await clearStoredToken();
  outro(chalk.green("Signed out."));
}

export const login = new Command("login")
  .description("Sign in with GitHub (device flow)")
  .option("--server-url <url>", "PAL API base URL (Better Auth)")
  .option("--client-id <id>", "GitHub OAuth App client ID")
  .action(loginAction);

export const logout = new Command("logout")
  .description("Remove saved credentials")
  .action(logoutAction);
