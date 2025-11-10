export type ChatMessage = { role: "user" | "assistant"; content: string }

export async function sendChat(messages: ChatMessage[]): Promise<string> {
  const baseUrl =
    (import.meta as any).env?.VITE_SERVER_URL ||
    // En dev local (Vite), on pointe sur l'Express local
    (import.meta as any).env?.DEV
      ? "http://localhost:3001"
      // En production (Vercel), on utilise le chemin relatif vers la Function
      : ""
  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  })
  if (!res.ok) throw new Error("Erreur serveur")
  const data = await res.json()
  return data?.content ?? ""
}


