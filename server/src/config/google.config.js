import dotenv from "dotenv";
dotenv.config();

export const config = {
  googleApiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  model: process.env.PALSCLI_MODEL || "gemini-2.5-flash",
  temperature: parseFloat(process.env.AI_TEMPERATURE || "0.7"),
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || "4096", 10),
};
