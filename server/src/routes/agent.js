import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { generateProjectStructure } from "../config/agent.config.js";
import { AIService } from "../cli/ai/google-service.js";
import { sendSuccess, sendError } from "../utils/response.js";

const router = Router();
const aiService = new AIService();

// Agent generation endpoint
router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json(sendError("VALIDATION_ERROR", "Prompt is required", 400));
    }

    const project = await generateProjectStructure(prompt, aiService);
    return res.status(200).json(sendSuccess(project, 200));
  } catch (error) {
    console.error("Agent Generation Error:", error);
    return res.status(500).json(sendError("INTERNAL_ERROR", error.message, 500));
  }
});

export default router;
