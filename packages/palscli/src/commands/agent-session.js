import chalk from "chalk";
import { text, isCancel, cancel, intro, outro, confirm } from "@clack/prompts";
import yoctoSpinner from "yocto-spinner";
import path from "path";
import { promises as fs } from "fs";
import { apiRequest } from "../lib/api.js";
import { getApiUrl } from "../config.js";
import { getStoredToken, isTokenExpired } from "../lib/token-store.js";

async function getBearer() {
  const token = await getStoredToken();
  if (!token?.access_token || (await isTokenExpired())) {
    throw new Error("Not signed in. Run: palscli login");
  }
  return token.access_token;
}

/**
 * Manifest files to local disk
 */
async function manifestProject(baseDir, folderName, files) {
  const appDir = path.resolve(baseDir, folderName);
  
  await fs.mkdir(appDir, { recursive: true });
  console.log(`\n  ${chalk.cyan("📁 Created root:")} ${chalk.bold(folderName)}/`);
  
  for (const file of files) {
    const filePath = path.resolve(appDir, file.path);
    // Security check
    if (!filePath.startsWith(appDir)) {
      throw new Error(`Security Violation: Path traversal detected in payload for ${file.path}`);
    }

    const fileDir = path.dirname(filePath);
    await fs.mkdir(fileDir, { recursive: true });
    await fs.writeFile(filePath, file.content, 'utf8');
    console.log(`  ${chalk.green("✓")} ${chalk.dim(file.path)}`);
  }
  
  return appDir;
}

export async function runAgentSession() {
  const palPrimary = chalk.hex("#b6a0ff");
  const baseUrl = getApiUrl();
  
  intro(palPrimary.bold(" PALS AGENT • AUTONOMOUS GENERATOR "));

  const helpHint = chalk.dim("Describe your app (e.g., 'React Todo app', 'Express API')");
  console.log(`\n  ${chalk.magenta("🤖")} ${helpHint}\n`);

  while (true) {
    const description = await text({
      message: palPrimary.bold("What should I build?"),
      placeholder: "Project prompt...",
      validate(value) {
        if (!value || value.trim().length < 5) return "Please provide a more detailed description";
      },
    });

    if (isCancel(description)) {
      cancel(chalk.dim("Agent offline."));
      return;
    }

    const spin = yoctoSpinner({ text: "Agent is architecting your project…" }).start();
    
    try {
      const response = await apiRequest(baseUrl, getBearer, "/api/agent/generate", {
        method: "POST",
        body: JSON.stringify({ prompt: description }),
      });
      
      spin.stop();
      const project = response?.data;
      
      if (!project || !project.files) {
        throw new Error("Architecture phase failed: No files received");
      }

      console.log(`\n  ${chalk.green("✨")} ${chalk.bold("Project Blueprint Ready:")} ${palPrimary(project.folderName)}`);
      console.log(`  ${chalk.dim("Generated files: " + project.files.length)}\n`);

      const proceed = await confirm({
        message: chalk.yellow(`Construct these files in ./${project.folderName}?`),
        initialValue: true,
      });

      if (isCancel(proceed) || !proceed) {
        console.log(chalk.dim("Construction aborted. Ready for next blueprint.\n"));
        continue;
      }

      const constructSpin = yoctoSpinner({ text: "Constructing local filesystem…" }).start();
      const finalPath = await manifestProject(process.cwd(), project.folderName, project.files);
      constructSpin.success(chalk.green("Hardware manifesting complete"));

      console.log(`\n  ${chalk.cyan("📁 Location:")} ${chalk.bold(finalPath)}`);
      
      if (project.setupCommands?.length > 0) {
        console.log(`\n  ${chalk.bold("NEXT STEPS:")}`);
        project.setupCommands.forEach(cmd => console.log(`  ${chalk.dim("➜ ")} ${chalk.white(cmd)}`));
      }
      
      console.log("");
      break;

    } catch (e) {
      spin.stop();
      console.log(`\n  ${chalk.red("✖")}  ${chalk.red(e.message)}\n`);
      const retry = await confirm({ message: "Try another architect phase?", initialValue: true });
      if (isCancel(retry) || !retry) break;
    }
  }

  outro(palPrimary.bold(" AGENT SESSION COMPLETE "));
}
