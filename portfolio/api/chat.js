import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readSystemPrompt() {
  try {
    const p = path.join(__dirname, "prompts", "system-prompt.md");
    return fs.readFileSync(p, "utf-8");
  } catch {
    return "";
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    const body = (req.body && typeof req.body === "object") ? req.body : {};
    const messages = Array.isArray(body.messages) ? body.messages : null;
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if ((!messages || messages.length === 0) && !message) {
      return res.status(400).json({ error: "Message requis" });
    }

    const systemPrompt = readSystemPrompt();
    const model = process.env.OPENROUTER_MODEL || "anthropic/claude-haiku-4.5";

    const payloadMessages = [];
    if (systemPrompt) {
      payloadMessages.push({ role: "system", content: systemPrompt });
    }
    if (messages && messages.length > 0) {
      for (const m of messages) {
        if (m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string") {
          payloadMessages.push({ role: m.role, content: m.content });
        }
      }
    } else if (message) {
      payloadMessages.push({ role: "user", content: message });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY || ""}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_URL || "",
        "X-Title": process.env.APP_NAME || "Portfolio Chat",
      },
      body: JSON.stringify({ model, messages: payloadMessages }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: "OpenRouter error", detail: err });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";
    return res.status(200).json({ content });
  } catch (e) {
    const msg = (e && (e.stack || e.message)) || "Server error";
    return res.status(500).json({ error: "Server error", detail: msg });
  }
}


