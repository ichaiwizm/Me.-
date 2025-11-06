import { useState } from "react";
import { Header } from "@/components/Header";
import { ChatPreview } from "@/components/chat/ChatPreview";
import { PromptBar } from "@/components/chat/PromptBar";
import { sendMessage } from "@/lib/api";

function App() {
  const [agentText, setAgentText] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(message: string) {
    try {
      setLoading(true);
      const content = await sendMessage(message);
      setAgentText(content || "");
    } catch (e) {
      setAgentText("(Erreur lors de la requête)");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <ChatPreview text={agentText} expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
      <PromptBar onSubmit={handleSubmit} loading={loading} />
    </>
  );
}

export default App;
