import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-slate-950 text-slate-50">
      <h1 className="mb-4 text-5xl font-bold tracking-tight">
        Portfolio
      </h1>
      <p className="mb-8 text-slate-300">
        Tailwind v4 + shadcn/ui sont bien configurés. ✨
      </p>
      <Button>
        Test shadcn/ui
      </Button>
    </div>
  );
}

export default App;
