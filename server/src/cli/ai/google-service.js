import { google } from "@ai-sdk/google";
import { streamText, generateObject } from "ai";
import { config } from "../../config/google.config.js";
import chalk from "chalk";

export class AIService {
  constructor() {
    if (!config.googleApiKey) {
      throw new Error("GOOGLE_API_KEY is not set in environment variables");
    }

    this.model = google(config.model, {
      apiKey: config.googleApiKey,
    });
  }

  /**
   * Send a message and get streaming response
   * @param {Array} messages - Array of message objects {role, content}
   * @param {Function} onChunk - Callback for each text chunk
   * @param {Object} tools - Optional tools object
   * @param {Function} onToolCall - Callback for tool calls
   * @returns {Promise<Object>} Full response with content, tool calls, and usage
   */
  async sendMessage(messages, onChunk, tools = undefined, onToolCall = null) {
    try {
      // Prepend system prompt if no system message exists
      const messagesWithSystem =
        messages[0]?.role === "system"
          ? messages
          : [
              {
                role: "system",
                content: `You are PALS CLI, an AI-powered development assistant created by Sanjeev Giri. Your mission is to help developers build, debug, and deploy applications efficiently.

## Core Identity
- Name: PALS CLI
- Creator: Sanjeev Giri
- Type: Full-stack AI development assistant
- Powered by: Google's Generative AI (Gemini 2.5)

## Your Capabilities
1. **Code Generation & Assistance**: Write, review, optimize, and debug code across multiple programming languages
2. **Project Architecture**: Design scalable, maintainable application structures and recommend best practices
3. **Terminal Execution**: Run commands, scripts, and build processes directly from your workspace
4. **File System Interaction**: Create, read, modify, and organize files in your project
5. **Tool Integration**: Use specialized tools including Google Search, Code Execution, and URL Context fetching
6. **Multi-mode Operation**:
   - Chat Mode: Standard conversational assistance
   - Tool Mode: Advanced problem-solving with search and execution capabilities
   - Agent Mode: Autonomous project generation and scaffolding

## Your Approach
- You are thorough, analytical, and detail-oriented
- You prioritize technical accuracy and best practices
- You provide explanations alongside code solutions
- You consider performance, security, and maintainability in your recommendations
- You break down complex problems into manageable steps
- You always verify your work and test solutions when possible

## When Users Ask "Who Are You?"
Respond that you are PALS CLI, an AI development assistant built by Sanjeev Giri, designed to help developers accelerate their workflow through intelligent code assistance, project architecture guidance, and integrated development tools.

## Important Context
- You run in both CLI and web interface environments
- Users can have multiple conversations with different modes (chat, tool, agent)
- Your responses are stored and can be referenced in future conversations
- You have access to powerful tools to enhance problem-solving

Be helpful, respectful, and always strive to provide the most valuable assistance possible.`,
              },
              ...messages,
            ];

      const streamConfig = {
        model: this.model,
        messages: messagesWithSystem,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
      };

      // Add tools if provided with maxSteps for multi-step tool calling
      if (tools && Object.keys(tools).length > 0) {
        streamConfig.tools = tools;
        streamConfig.maxSteps = 5; // Allow up to 5 tool call steps

        console.log(
          chalk.gray(`[DEBUG] Tools enabled: ${Object.keys(tools).join(", ")}`),
        );
      }

      const result = streamText(streamConfig);

      let fullResponse = "";

      // Stream text chunks
      for await (const chunk of result.textStream) {
        fullResponse += chunk;
        if (onChunk) {
          onChunk(chunk);
        }
      }

      // IMPORTANT: Await the result to get access to steps, toolCalls, etc.
      const fullResult = await result;

      const toolCalls = [];
      const toolResults = [];

      // Collect tool calls from all steps (if they exist)
      if (fullResult.steps && Array.isArray(fullResult.steps)) {
        for (const step of fullResult.steps) {
          if (step.toolCalls && step.toolCalls.length > 0) {
            for (const toolCall of step.toolCalls) {
              toolCalls.push(toolCall);
              if (onToolCall) {
                onToolCall(toolCall);
              }
            }
          }

          // Collect tool results
          if (step.toolResults && step.toolResults.length > 0) {
            toolResults.push(...step.toolResults);
          }
        }
      }

      return {
        content: fullResponse,
        finishReason: fullResult.finishReason,
        usage: fullResult.usage,
        toolCalls,
        toolResults,
        steps: fullResult.steps,
      };
    } catch (error) {
      console.error(chalk.red("AI Service Error:"), error.message);
      console.error(chalk.red("Full error:"), error);
      throw error;
    }
  }

  /**
   * Get a non-streaming response
   * @param {Array} messages - Array of message objects
   * @param {Object} tools - Optional tools
   * @returns {Promise<string>} Response text
   */
  async getMessage(messages, tools = undefined) {
    let fullResponse = "";
    const result = await this.sendMessage(
      messages,
      (chunk) => {
        fullResponse += chunk;
      },
      tools,
    );
    return result.content;
  }

  /**
   * Generate structured output using a Zod schema
   * @param {Object} schema - Zod schema
   * @param {string} prompt - Prompt for generation
   * @returns {Promise<Object>} Parsed object matching the schema
   */
  async generateStructured(schema, prompt) {
    try {
      const result = await generateObject({
        model: this.model,
        schema: schema,
        prompt: prompt,
      });

      return result.object;
    } catch (error) {
      console.error(
        chalk.red("AI Structured Generation Error:"),
        error.message,
      );
      throw error;
    }
  }
}
