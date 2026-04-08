#!/usr/bin/env node

import dotenv from "dotenv";
import chalk from "chalk";
import figlet from "figlet";
import { Command } from "commander";
import { login, logout, whoami } from "./commands/auth/login.js";
import { wakeup } from "./commands/ai/wakeUp.js";

dotenv.config();

async function main() {
  //Display Banner

  console.log(
    chalk.red(
      figlet.textSync("Pals Cli", {
        font: "Standard",
        horizontalLayout: "default",
      }),
    ),
  );

  console.log(chalk.gray("A cli based AI tool \n"));

  const program = new Command("palscli");

  program
    .version("0.0.1")
    .description("Pals CLI- A CLI based AI Tool")
    .addCommand(login)
    .addCommand(logout)
    .addCommand(whoami)
    .addCommand(wakeup);

  //default action shows help
  program.action(() => {
    program.help();
  });

  program.parse();
}

main().catch((err) => {
  console.log(chalk.red("Error running PALS CLI"), err);
  process.exit(1);
});
