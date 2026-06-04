import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { highlight } from "@/lib/highlight";
import type { Language } from "@/lib/lessons/types";

interface Props {
  code: string;
  language: Language;
  activeLines: number[];
  fileName?: string;
}

export function CodeViewer({ code, language, activeLines, fileName }: Props) {
  const lines = highlight(code, language);
  const active = new Set(activeLines);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstActive = activeLines[0];

  useEffect(() => {
    if (!firstActive || !containerRef.current) return;
    const el = containerRef.current.querySelector<HTMLDivElement>(
      `[data-line="${firstActive}"]`,
    );
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [firstActive]);

  const accent =
    language === "rust"
      ? "var(--rust)"
      : language === "elixir"
        ? "var(--elixir)"
        : "var(--info)";

  return (
    <div className="glass rounded-xl overflow-hidden flex flex-col h-full">
      {/* Title bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-[var(--surface-2)]/60">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.65_0.22_25)]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.78_0.16_85)]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.78_0.16_155)]/70" />
        </div>
        <span className="mono text-xs text-muted-foreground tracking-tight">
          {fileName ?? (language === "rust" ? "main.rs" : language === "elixir" ? "demo.exs" : "runtime.compare")}
        </span>
        <span className="ml-auto chip">
          <span className="dot" style={{ background: accent }} />
          {language}
        </span>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-auto py-3 text-[13px] leading-[1.65]"
      >
        {lines.map((tokens, i) => {
          const lineNo = i + 1;
          const isActive = active.has(lineNo);
          return (
            <div
              key={lineNo}
              data-line={lineNo}
              className="relative flex items-start pl-2 pr-4 group"
            >
              {/* active gutter bar */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="code-active-bar"
                    transition={{ type: "spring", stiffness: 360, damping: 32 }}
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r"
                    style={{ background: accent }}
                  />
                )}
              </AnimatePresence>
              {/* active row highlight */}
              <motion.div
                animate={{
                  backgroundColor: isActive
                    ? `color-mix(in oklab, ${accent} 22%, transparent)`
                    : "transparent",
                  borderLeft: isActive ? `3px solid ${accent}` : "3px solid transparent",
                }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 pointer-events-none z-0"
              />
              <span className="relative w-10 shrink-0 text-right pr-3 mono text-[11px] text-muted-foreground/70 select-none z-10">
                {lineNo}
              </span>
              <pre className="relative mono whitespace-pre flex-1 z-10">
                {tokens.length === 0 ? (
                  <span> </span>
                ) : (
                  tokens.map((t, j) => (
                    <span key={j} className={t.cls}>
                      {t.text}
                    </span>
                  ))
                )}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
