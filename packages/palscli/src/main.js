import chalk from "chalk";
import { Command } from "commander";

// Remove figlet and eager imports to drastically improve startup time!
async function main() {
  const program = new Command("palscli");

  program
    .name("palscli")
    .version("1.0.5")
    .description(chalk.cyan("PALs CLI — Thin client (hosted API)"));

  program
    .command("chat")
    .description("Start a chat session (creates a conversation on the server)")
    .action(async () => {
      const { startChatFromCli } = await import("./commands/chat-session.js");
      await startChatFromCli();
    });

  program
    .command("login")
    .description("Sign in with GitHub (device flow)")
    .option("--server-url <url>", "PAL API base URL (Better Auth)")
    .option("--client-id <id>", "GitHub OAuth App client ID")
    .action(async (opts) => {
      const { loginAction } = await import("./commands/login.js");
      await loginAction(opts);
    });

  program
    .command("logout")
    .description("Remove saved credentials")
    .action(async () => {
      const { logoutAction } = await import("./commands/login.js");
      await logoutAction();
    });

  program
    .command("whoami")
    .description("Show signed-in user (from API)")
    .option("--server-url <url>", "PAL API base URL")
    .action(async (opts) => {
      const { whoamiAction } = await import("./commands/whoami.js");
      await whoamiAction(opts);
    });

  program
    .command("wakeup")
    .description("Open the PAL menu (chat via API)")
    .action(async () => {
      const { wakeupAction } = await import("./commands/wakeup.js");
      await wakeupAction();
    });

  // For a clean feeling, just show help if no args provided
  program.action(() => {
    program.help();
  });

  await program.parseAsync(process.argv);
}

main().catch((err) => {
  console.error(chalk.red("\n[palscli error] "), err.message || err);
  process.exit(1);
});
