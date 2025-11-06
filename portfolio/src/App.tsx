import { useRef, useState } from "react";
import { Header } from "@/components/Header";
import { ChatPreview } from "@/components/chat/ChatPreview";
import { PromptBar } from "@/components/chat/PromptBar";
import { sendChat } from "@/lib/api";
import type { ChatMessage } from "@/lib/api";
import WindowManager, { type WindowManagerHandle } from "@/components/windows/WindowManager";

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const wmRef = useRef<WindowManagerHandle>(null);

  async function handleSubmit(message: string) {
    try {
      setLoading(true);
      const next: ChatMessage[] = [...messages, { role: "user", content: message }];
      setMessages(next);
      const content = await sendChat(next);
      setMessages((prev) => [...prev, { role: "assistant", content: content || "" }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: "(Erreur lors de la requête)" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className="px-4 py-2 mt-20 flex gap-3">
        <button
          className="px-4 py-2.5 rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          onClick={() =>
            wmRef.current?.createWindow({
              title: "Fenêtre A",
              width: 420,
              height: 300,
              key: "test-window-a",
              contentHtml:
                '<div><h3>Fenêtre A</h3><button id="btnA">Click</button><div id="logA"></div><style>h3{margin-bottom:8px}button{padding:6px 10px;border:1px solid #888;border-radius:6px}#logA{margin-top:8px}</style><script>var b=document.getElementById("btnA");var l=document.getElementById("logA");var n=0;b&&b.addEventListener("click",function(){n++;l&&(l.textContent="Clicks: "+n);});</script></div>',
            })
          }
        >
          🪟 Créer fenêtre A
        </button>
        <button
          className="px-4 py-2.5 rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          onClick={() =>
            wmRef.current?.createWindow({
              title: "Fenêtre B",
              width: 520,
              height: 360,
              key: "test-window-b",
              contentHtml:
                '<div><h3>Fenêtre B</h3><div class="box"></div><style>.box{width:60px;height:60px;background:#7c3aed;border-radius:8px;animation:spin 2s linear infinite}@keyframes spin{to{transform:rotate(1turn)}}</style><script>console.log("B script ok")</script></div>',
            })
          }
        >
          ✨ Créer fenêtre B
        </button>
      </div>
      <ChatPreview messages={messages} expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
      <PromptBar onSubmit={handleSubmit} loading={loading} />
      <WindowManager ref={wmRef} />
    </>
  );
}

export default App;
