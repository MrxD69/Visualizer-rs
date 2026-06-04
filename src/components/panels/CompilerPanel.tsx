import { motion, AnimatePresence } from "framer-motion";
import { Panel } from "./Panel";
import type { CompilerDiagnostic } from "@/lib/lessons/types";

export function CompilerPanel({ diagnostics = [] }: { diagnostics?: CompilerDiagnostic[] }) {
  const ok = diagnostics.length === 0;
  return (
    <Panel
      title="Compiler"
      subtitle="rustc diagnostics"
      accent={ok ? "var(--ok)" : "var(--err)"}
      icon={ok ? "✓" : "!"}
    >
      <AnimatePresence mode="wait">
        {ok ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 mono text-[12px] text-[var(--ok)]"
          >
            <span className="dot" style={{ background: "var(--ok)" }} />
            Compiled cleanly
          </motion.div>
        ) : (
          <motion.div
            key="err"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex flex-col gap-2"
          >
            {diagnostics.map((d, i) => (
              <div
                key={i}
                className="rounded-lg p-3 hairline"
                style={{
                  background: "color-mix(in oklab, var(--err) 10%, transparent)",
                  borderColor: "color-mix(in oklab, var(--err) 40%, transparent)",
                }}
              >
                <div className="flex items-center gap-2 mono text-[11px]">
                  <span className="uppercase tracking-wider text-[var(--err)]">{d.level}</span>
                  {d.code && <span className="chip" style={{ color: "var(--err)" }}>{d.code}</span>}
                  {d.line && <span className="text-muted-foreground">line {d.line}</span>}
                </div>
                <div className="mt-1.5 text-[13px] leading-snug">{d.message}</div>
                {d.hint && (
                  <div className="mt-1.5 mono text-[11px] text-muted-foreground border-l-2 pl-2"
                       style={{ borderColor: "var(--err)" }}>
                    = help: {d.hint}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Panel>
  );
}
