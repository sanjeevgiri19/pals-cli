import chalk from "chalk";
import figlet from "figlet";
import { Command } from "commander";
import { login, logout } from "./commands/login.js";
import { whoami } from "./commands/whoami.js";
import { wakeup } from "./commands/wakeup.js";
import { startChatFromCli } from "./commands/chat-session.js";

async function main() {
  console.log(
    chalk.cyan(
      figlet.textSync("PAL CLI", {
        font: "Standard",
        horizontalLayout: "default",
      }),
    ),
  );
  console.log(chalk.gray("Thin client — your API holds secrets & data.\n"));

  const program = new Command("palscli");

  program
    .name("palscli")
    .version("1.0.2")
    .description("PAL command-line client (hosted API)");

  program
    .command("chat")
    .description("Start a chat session (creates a conversation on the server)")
    .action(() => startChatFromCli());

  program.addCommand(login);
  program.addCommand(logout);
  program.addCommand(whoami);
  program.addCommand(wakeup);

  program.action(() => {
    program.help();
  });

  await program.parseAsync(process.argv);
}

main().catch((err) => {
  console.error(chalk.red("palscli error:"), err);
  process.exit(1);
});
