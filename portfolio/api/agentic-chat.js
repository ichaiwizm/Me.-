import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Agentic Chat API Endpoint
 * Handles multi-turn conversations for visual styling
 */
export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    // Convert messages to OpenRouter format
    const formattedMessages = messages.map((msg) => {
      // Handle tool_result role (convert to user message with context)
      if (msg.role === "tool_result") {
        return {
          role: "user",
          content: `[System: Command Results]\n${msg.content}`,
        };
      }
      return {
        role: msg.role,
        content: msg.content,
      };
    });

    // Call OpenRouter API
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.SITE_URL || "http://localhost:5173",
          "X-Title": "Portfolio Agentic Stylist",
        },
        body: JSON.stringify({
          model: "anthropic/claude-haiku-4.5",
          messages: formattedMessages,
          max_tokens: 4096,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Agentic API] OpenRouter error:", errorText);
      return res.status(response.status).json({
        error: "OpenRouter API error",
        details: errorText,
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return res.status(200).json({ content });
  } catch (error) {
    console.error("[Agentic API] Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}
