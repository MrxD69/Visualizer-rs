import { motion, AnimatePresence } from "framer-motion";
import { Panel } from "./Panel";
import type { StackFrame } from "@/lib/lessons/types";

const stateColor: Record<string, string> = {
  owned:    "var(--ok)",
  borrowed: "var(--info)",
  moved:    "var(--err)",
  dropped:  "var(--muted-foreground)",
};

export function StackPanel({ frames = [] }: { frames?: StackFrame[] }) {
  const empty = frames.length === 0 || frames.every((f) => f.vars.length === 0);
  return (
    <Panel title="Stack" subtitle="frames • bindings" accent="var(--rust)" icon="▤"
           empty={empty && frames.length === 0} emptyHint="// no active frames">
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {frames.map((frame) => (
            <motion.div
              key={frame.id}
              layout
              layoutId={`frame-${frame.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="rounded-lg border border-border bg-[var(--surface-2)]/60"
            >
              <div className="px-3 py-1.5 mono text-[11px] text-muted-foreground border-b border-border flex items-center justify-between">
                <span>{frame.name}</span>
                <span className="opacity-60">{frame.vars.length} var{frame.vars.length === 1 ? "" : "s"}</span>
              </div>
              <div className="p-2 flex flex-col gap-1.5">
                <AnimatePresence mode="popLayout">
                  {frame.vars.map((v) => (
                    <motion.div
                      key={v.id}
                      layout
                      layoutId={`var-${v.id}`}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 6 }}
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hairline bg-[var(--surface)]"
                    >
                      <span className="dot" style={{ background: stateColor[v.state ?? "owned"] }} />
                      <span className="mono text-[12px]">{v.name}</span>
                      {v.type && (
                        <span className="mono text-[11px] text-muted-foreground">: {v.type}</span>
                      )}
                      <span className="ml-auto mono text-[11px]">
                        {v.state === "moved" && <span className="text-[var(--err)]">moved</span>}
                        {v.state === "borrowed" && <span className="text-[var(--info)]">borrowed</span>}
                        {v.heapRef && v.state !== "moved" && (
                          <span className="text-muted-foreground">→ heap</span>
                        )}
                        {v.value && !v.heapRef && (
                          <span className="text-[var(--syntax-number)]">{v.value}</span>
                        )}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Panel>
  );
}
