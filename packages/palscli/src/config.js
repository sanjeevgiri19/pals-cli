import {
  PUBLISH_API_URL,
  PUBLISH_GITHUB_CLIENT_ID,
} from "./publish-config.js";

/** @returns {string} */
export function getApiUrl() {
  const fromEnv = process.env.PALSCLI_API_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return PUBLISH_API_URL.replace(/\/$/, "");
}

/** @returns {string} */
export function getGithubClientId() {
  return process.env.PALSCLI_GITHUB_CLIENT_ID || PUBLISH_GITHUB_CLIENT_ID;
}
