import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db.js";
import { deviceAuthorization } from "better-auth/plugins";

const apiBase = (
  process.env.BETTER_AUTH_URL ||
  process.env.API_PUBLIC_URL ||
  "https://pal-cli.onrender.com"
  // "http://localhost:3005"
).replace(/\/$/, "");

const trustedOrigins = process.env.TRUSTED_ORIGINS
  ? process.env.TRUSTED_ORIGINS.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : ["http://localhost:3000", "https://pals-cli.vercel.app", "https://pal-cli.onrender.com"];

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: apiBase,
  basePath: "/api/auth",
  trustedOrigins,
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
        `${apiBase}/api/auth/callback/github`,
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      partitioned: true // required by new browsers
    }
  }
});
