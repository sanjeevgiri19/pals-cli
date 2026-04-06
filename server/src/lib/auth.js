import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db.js";
import { deviceAuthorization } from "better-auth/plugins";

const trimTrailingSlash = (url) => url.replace(/\/$/, "");

const apiBase = (
  process.env.BETTER_AUTH_URL ||
  process.env.API_PUBLIC_URL ||
  "http://localhost:3005"
);

const normalizedApiBase = trimTrailingSlash(apiBase);

const trustedOrigins = process.env.TRUSTED_ORIGINS
  ? process.env.TRUSTED_ORIGINS.split(",")
      .map((s) => s.trim())
      .map(trimTrailingSlash)
      .filter(Boolean)
  : ["http://localhost:3000"];

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: normalizedApiBase,
  basePath: "/api/auth",
  trustedOrigins,
  advanced: {
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
  account: {
    skipStateCookieCheck: true,
  },
  plugins: [
    deviceAuthorization({
      verificationUri: "/device",
    }),
  ],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      redirectURI:
        process.env.GITHUB_REDIRECT_URI ||
        `${normalizedApiBase}/api/auth/callback/github`,
    },
  },
});
