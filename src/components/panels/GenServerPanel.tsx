import { motion, AnimatePresence } from "framer-motion";
import { Panel } from "./Panel";
import type { EGenServerState } from "@/lib/lessons/types";

export function GenServerPanel({ state }: { state?: EGenServerState }) {
  return (
    <Panel
      title="GenServer"
      subtitle={state ? `${state.module} · ${state.pid}` : "—"}
      accent="var(--elixir)"
      icon="◉"
      empty={!state}
      emptyHint="// no GenServer in scope"
    >
      {state && (
        <div className="flex flex-col gap-3">
          <div className="rounded-lg hairline p-3 bg-[var(--surface-2)]/50">
            <div className="panel-title mb-2 text-[9px]">state</div>
            <div className="flex flex-col gap-1">
              <AnimatePresence mode="popLayout">
                {Object.entries(state.state).map(([k, v]) => (
                  <motion.div
                    key={k}
                    layout
                    layoutId={`gs-${state.pid}-${k}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 mono text-[12px]"
                  >
                    <span className="text-muted-foreground">{k}:</span>
                    <motion.span
                      key={String(v)}
                      initial={{ scale: 1.4, color: "var(--elixir)" }}
                      animate={{ scale: 1, color: "var(--syntax-number)" }}
                      transition={{ duration: 0.4 }}
                      className="text-[var(--syntax-number)] font-medium"
                    >
                      {String(v)}
                    </motion.span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {state.callQueue && state.callQueue.length > 0 && (
            <div className="rounded-lg hairline p-2">
              <div className="panel-title mb-1.5 text-[9px]">pending calls</div>
              <div className="flex flex-col gap-1">
                {state.callQueue.map((c) => (
                  <span key={c.id} className="mono text-[11px] px-2 py-1 rounded-md bg-[var(--surface-2)]">
                    {c.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {state.lastReply !== undefined && (
            <div className="flex items-center gap-2 mono text-[11px] text-muted-foreground">
              <span className="dot" style={{ background: "var(--ok)" }} />
              last reply →
              <span className="text-[var(--syntax-number)]">{state.lastReply}</span>
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
