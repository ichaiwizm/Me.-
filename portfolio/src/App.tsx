import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";

function App() {
  return (
    <>
      <Header />
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
        <div className="mb-2 text-center text-sm text-muted-foreground">
          Salut, comment puis-je vous aider ?
        </div>
        <div className="flex items-center gap-2 rounded-full border bg-background px-2 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-ring">
          <input
            type="text"
            placeholder="Écrivez votre demande..."
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
          />
          <Button size="sm">Envoyer</Button>
        </div>
      </div>
    </>
  );
}

export default App;
