import { useRef, useState } from "react";
import { Header } from "@/components/Header";
import { ChatPreview } from "@/components/chat/ChatPreview";
import { PromptBar } from "@/components/chat/PromptBar";
import { sendChat } from "@/lib/api";
import type { ChatMessage } from "@/lib/api";
import WindowManager, { type WindowManagerHandle } from "@/components/windows/WindowManager";
import { Button } from "@/components/ui/button";
import { parseWindowCommands } from "@/lib/windowParser";

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [windowCount, setWindowCount] = useState(0);
  const wmRef = useRef<WindowManagerHandle>(null);

  async function handleSubmit(message: string) {
    try {
      setLoading(true);
      const next: ChatMessage[] = [...messages, { role: "user", content: message }];
      setMessages(next);
      const content = await sendChat(next);

      // Parse window commands from LLM response with current window count
      const { originalContent, windows, errors } = parseWindowCommands(content || "", windowCount);

      // Create windows automatically
      windows.forEach(w => {
        wmRef.current?.createWindow(w);
        setWindowCount(c => c + 1);
      });

      // Log errors for debugging
      if (errors.length > 0) {
        console.warn("Window creation errors:", errors);
      }

      // Store ORIGINAL content in history (for LLM context)
      setMessages((prev) => [...prev, { role: "assistant", content: originalContent }]);
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
        <Button
          variant="outline"
          className="cursor-pointer px-4 py-2.5 rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          onClick={() => {
            const spec = {
              title: "Fenêtre A",
              width: 420,
              height: 300,
              key: "test-window-a",
              contentHtml:
                '<div><h3>Fenêtre A</h3><button id="btnA">Click</button><div id="logA"></div><style>body{margin:0;padding:1rem;font-family:system-ui,sans-serif;background:#f9fafb;color:#1f2937}h3{margin:0 0 12px 0;color:#111827;font-size:1.25rem}button{padding:8px 16px;border:2px solid #6366f1;border-radius:6px;cursor:pointer;background:#6366f1;color:white;font-weight:600;transition:all 0.2s}button:hover{background:#4f46e5;border-color:#4f46e5}#logA{margin-top:12px;padding:8px;background:#e0e7ff;border-radius:4px;min-height:24px;color:#3730a3}</style><script>var b=document.getElementById("btnA");var l=document.getElementById("logA");var n=0;b&&b.addEventListener("click",function(){n++;l&&(l.textContent="Clicks: "+n);});</script></div>',
            } as const;
            wmRef.current?.createWindow(spec);
          }}
        >
          🪟 Créer fenêtre A
        </Button>
        <Button
          variant="outline"
          className="cursor-pointer px-4 py-2.5 rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          onClick={() => {
            const spec = {
              title: "Fenêtre B",
              width: 520,
              height: 360,
              key: "test-window-b",
              contentHtml:
                '<div><h3>Fenêtre B</h3><div class="box"></div><style>body{margin:0;padding:1.5rem;font-family:system-ui,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#ffffff}h3{margin:0 0 16px 0;color:#ffffff;font-size:1.5rem;text-shadow:0 2px 4px rgba(0,0,0,0.2)}.box{width:80px;height:80px;background:#ffffff;border-radius:12px;animation:spin 2s linear infinite;box-shadow:0 4px 12px rgba(0,0,0,0.3)}@keyframes spin{to{transform:rotate(1turn)}}</style></div>',
            } as const;
            wmRef.current?.createWindow(spec);
          }}
        >
          ✨ Créer fenêtre B
        </Button>
      </div>
      <ChatPreview messages={messages} expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
      <PromptBar onSubmit={handleSubmit} loading={loading} />
      <WindowManager ref={wmRef} />
    </>
  );
}

export default App;
