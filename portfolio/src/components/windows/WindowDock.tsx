import { useState } from "react";
import { Button } from "@/components/ui/button";

type Item = { id: string; title: string };

type Props = {
  items: Item[];
  onRestore: (id: string) => void;
};

export function WindowDock({ items, onRestore }: Props) {
  const [collapsed, setCollapsed] = useState(true);

  if (items.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[10000] rounded-xl bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-xl border border-primary/20 shadow-2xl ring-1 ring-white/10 overflow-hidden">
      <Button
        variant="ghost"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-3 py-2.5 transition-colors group cursor-pointer rounded-none hover:bg-transparent"
      >
        <div className="flex items-center gap-2">
          <svg className={`w-4 h-4 text-foreground/50 transition-transform ${collapsed ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-foreground/50">
            Fenêtres
          </span>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-primary/20 text-[10px] font-bold text-primary">
          {items.length}
        </div>
      </Button>
      {!collapsed && (
        <div className="flex flex-col gap-2.5 p-3 pt-0">
          {items.map(w => (
            <Button
              key={w.id}
              variant="outline"
              onClick={() => onRestore(w.id)}
              className="px-3.5 py-2.5 text-xs font-medium rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 hover:bg-transparent border border-primary/30 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm flex items-center gap-2.5 group max-w-[220px] hover:scale-105 active:scale-95 cursor-pointer"
              title={w.title}
            >
              <svg className="w-4 h-4 text-primary/70 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="truncate text-foreground/80 font-semibold">{w.title}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
