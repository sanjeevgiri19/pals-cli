/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Option 1: simple domain whitelist
    domains: ["avatars.githubusercontent.com"],

    // Option 2: more flexible remotePatterns (Next.js 13+)
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "avatars.githubusercontent.com",
    //   },
    // ],
  },
};

module.exports = nextConfig;
