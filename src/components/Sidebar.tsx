import { Link, useRouterState } from "@tanstack/react-router";
import { groupedByTopic, lessons } from "@/lib/lessons";
import type { Language } from "@/lib/lessons/types";

const langMeta: Record<Language, { color: string; label: string; glyph: string }> = {
  rust:   { color: "var(--rust)",   label: "Rust",   glyph: "R" },
  elixir: { color: "var(--elixir)", label: "Elixir", glyph: "E" },
};

export function Sidebar() {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });

  return (
    <aside className="w-[260px] shrink-0 border-r border-border bg-[var(--surface)]/40 backdrop-blur-xl flex flex-col h-full">
      {/* Brand */}
      <Link to="/" className="px-4 py-4 border-b border-border flex items-center gap-2.5 hover:bg-[var(--surface-2)]/50 transition-colors">
        <div className="relative w-7 h-7 rounded-md overflow-hidden flex items-center justify-center"
             style={{ background: "linear-gradient(135deg, var(--rust), var(--elixir))" }}>
          <span className="mono text-[12px] font-bold text-background">V</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold tracking-tight">Visualize</span>
          <span className="mono text-[10px] text-muted-foreground tracking-wider">RUST · ELIXIR</span>
        </div>
      </Link>

      <div className="flex-1 overflow-auto p-3 flex flex-col gap-5">
        {(["rust", "elixir"] as Language[]).map((lang) => {
          const groups = groupedByTopic(lang);
          const meta = langMeta[lang];
          return (
            <div key={lang} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-2">
                <div className="w-4 h-4 rounded flex items-center justify-center mono text-[10px] font-bold"
                     style={{ background: `color-mix(in oklab, ${meta.color} 22%, transparent)`, color: meta.color }}>
                  {meta.glyph}
                </div>
                <span className="text-[12px] font-semibold">{meta.label}</span>
                <span className="ml-auto mono text-[10px] text-muted-foreground">
                  {lessons.filter(l => l.language === lang).length} lessons
                </span>
              </div>
              {groups.map((g) => (
                <div key={g.topic} className="flex flex-col">
                  <div className="panel-title px-2 mb-1">{g.topic}</div>
                  <div className="flex flex-col gap-0.5">
                    {g.items.map((l) => {
                      const active = currentPath === `/lesson/${l.id}`;
                      return (
                        <Link
                          key={l.id}
                          to="/lesson/$id"
                          params={{ id: l.id }}
                          className="group px-2 py-1.5 rounded-md flex items-center gap-2 text-[13px] transition-all relative"
                          style={{
                            background: active ? `color-mix(in oklab, ${meta.color} 14%, transparent)` : "transparent",
                            color: active ? "var(--foreground)" : "var(--muted-foreground)",
                          }}
                        >
                          {active && (
                            <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r"
                                  style={{ background: meta.color }} />
                          )}
                          <span className="truncate flex-1 group-hover:text-foreground transition-colors">
                            {l.title}
                          </span>
                          <span className="mono text-[9px] opacity-60">{l.difficulty}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-border mono text-[10px] text-muted-foreground/60 leading-relaxed">
        <div>← → to step · space to play · R to restart</div>
      </div>
    </aside>
  );
}
