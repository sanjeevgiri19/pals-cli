#!/usr/bin/env node

import dotenv from "dotenv";
import chalk from "chalk";
import figlet from "figlet";
import { Command } from "commander";

dotenv.config();

async function main() {
  //Display Banner

  console.log(
    chalk.red(
      figlet.textSync("Pal Cli", {
        font: "Standard",
        horizontalLayout: "default",
      }),
    ),
  );

  console.log(chalk.gray("A cli based AI tool \n"));

  const program = new Command("palCLI");

  program.version("0.0.1").description("Pal CLI- A CLI based AI Tool");

  //default action shows help
  program.action(() => {
    program.help();
  });

  program.parse();
}

main().catch((err) => {
  console.log(chalk.red("Error running PAL CLI"), err);
  process.exit(1);
});
