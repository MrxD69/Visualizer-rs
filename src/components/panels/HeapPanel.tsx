import { motion, AnimatePresence } from "framer-motion";
import { Panel } from "./Panel";
import type { HeapBlock } from "@/lib/lessons/types";

export function HeapPanel({ blocks = [] }: { blocks?: HeapBlock[] }) {
  return (
    <Panel title="Heap" subtitle="allocations" accent="var(--rust)" icon="◫"
           empty={blocks.length === 0} emptyHint="// no allocations">
      <div className="grid grid-cols-1 gap-2">
        <AnimatePresence mode="popLayout">
          {blocks.map((b) => {
            const freed = b.state === "freed";
            return (
              <motion.div
                key={b.id}
                layout
                layoutId={`heap-${b.id}`}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{
                  opacity: freed ? 0.35 : 1,
                  scale: 1,
                  filter: freed ? "grayscale(0.6)" : "none",
                }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                className="rounded-lg p-2.5 relative overflow-hidden hairline"
                style={{
                  background: freed
                    ? "var(--surface)"
                    : "linear-gradient(135deg, var(--rust-soft), transparent 70%)",
                  borderColor: freed ? "var(--border)" : "color-mix(in oklab, var(--rust) 35%, transparent)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {b.kind ?? "Box"}
                  </span>
                  <span className="mono text-[12px]">{b.label}</span>
                  {typeof b.refs === "number" && (
                    <span className="ml-auto chip" style={{ borderColor: "color-mix(in oklab, var(--rust) 40%, transparent)" }}>
                      <span className="dot" style={{ background: "var(--rust)" }} />
                      refs · {b.refs}
                    </span>
                  )}
                  {freed && (
                    <span className="ml-auto mono text-[10px] uppercase tracking-wider text-[var(--err)]">freed</span>
                  )}
                </div>
                {b.value && (
                  <div className="mono text-[12px] mt-1.5 text-[var(--syntax-string)] truncate">
                    {b.value}
                  </div>
                )}
                <div className="mono text-[10px] mt-1 text-muted-foreground/70">
                  0x{b.id.padStart(4, "0").slice(-4)}…
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Panel>
  );
}
