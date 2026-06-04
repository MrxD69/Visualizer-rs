import { motion, AnimatePresence } from "framer-motion";
import { Panel } from "./Panel";
import type { ESchedulerState } from "@/lib/lessons/types";

export function SchedulerPanel({ state, accent = "var(--elixir)" }: { state?: ESchedulerState; accent?: string }) {
  const cores = state?.cores ?? [];
  return (
    <Panel title="Scheduler" subtitle="cores · run queues" accent={accent} icon="◊"
           empty={cores.length === 0} emptyHint="// idle">
      <div className="grid grid-cols-2 gap-2">
        {cores.map((c) => (
          <motion.div
            layout
            key={c.id}
            className="rounded-lg hairline p-2 bg-[var(--surface-2)]/50 min-h-[88px] flex flex-col"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="mono text-[10px] uppercase tracking-wider text-muted-foreground">
                core · {c.id}
              </span>
              {c.running && (
                <motion.span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: accent }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
              )}
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <AnimatePresence mode="popLayout">
                {c.running && (
                  <motion.div
                    key={`run-${c.running}`}
                    layoutId={`sched-${c.running}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="mono text-[11px] px-2 py-1 rounded-md"
                    style={{
                      background: `color-mix(in oklab, ${accent} 22%, transparent)`,
                      border: `1px solid color-mix(in oklab, ${accent} 45%, transparent)`,
                    }}
                  >
                    ▶ {c.running}
                  </motion.div>
                )}
                {c.queue.map((id) => (
                  <motion.div
                    key={`q-${id}`}
                    layoutId={`sched-${id}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    className="mono text-[11px] px-2 py-1 rounded-md hairline text-muted-foreground"
                  >
                    {id}
                  </motion.div>
                ))}
              </AnimatePresence>
              {!c.running && c.queue.length === 0 && (
                <span className="mono text-[10px] text-muted-foreground/60">idle</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Panel>
  );
}
