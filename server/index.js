const express = require("express")
const cors = require("cors")
const fetch = global.fetch || require("node-fetch")
require("dotenv").config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = String(req.body?.message || "").trim()
    if (!userMessage) return res.status(400).json({ error: "Message requis" })

    const model = process.env.OPENROUTER_MODEL || "anthropic/claude-haiku-4.5"
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY || ""}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_URL || "http://localhost:5173",
        "X-Title": process.env.APP_NAME || "Portfolio Chat",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "Tu es un assistant utile et concis." },
          { role: "user", content: userMessage },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return res.status(500).json({ error: "OpenRouter error", detail: err })
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content || ""
    return res.json({ content })
  } catch (e) {
    return res.status(500).json({ error: "Server error" })
  }
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})


