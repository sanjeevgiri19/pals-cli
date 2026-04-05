import fs from "fs/promises";
import path from "path";
import os from "os";

const CONFIG_DIR = path.join(os.homedir(), ".palcli");
const TOKEN_FILE = path.join(CONFIG_DIR, "credentials.json");

export async function getStoredToken() {
  try {
    const data = await fs.readFile(TOKEN_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn("Could not read credentials:", error.message);
    }
    return null;
  }
}

export async function storeToken(token) {
  await fs.mkdir(CONFIG_DIR, { recursive: true });
  const tokenData = {
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    token_type: token.token_type || "Bearer",
    scope: token.scope,
    expires_at: token.expires_in
      ? new Date(Date.now() + token.expires_in * 1000).toISOString()
      : null,
    created_at: new Date().toISOString(),
  };
  await fs.writeFile(TOKEN_FILE, JSON.stringify(tokenData, null, 2), "utf-8");
  return true;
}

export async function clearStoredToken() {
  try {
    await fs.unlink(TOKEN_FILE);
    return true;
  } catch {
    return false;
  }
}

export async function isTokenExpired() {
  const token = await getStoredToken();
  if (!token?.expires_at) return true;
  const expiresAt = new Date(token.expires_at);
  const now = new Date();
  return expiresAt.getTime() - now.getTime() < 5 * 60 * 1000;
}

export function getCredentialsPath() {
  return TOKEN_FILE;
}
