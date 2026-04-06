import { deviceAuthorizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:3005" : "");

if (!apiBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is required in production");
}

export const authClient = createAuthClient({
  baseURL: apiBaseUrl,
  plugins: [deviceAuthorizationClient()],
});
