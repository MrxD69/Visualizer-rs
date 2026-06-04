import { motion, AnimatePresence } from "framer-motion";
import { Panel } from "./Panel";
import type { Borrow } from "@/lib/lessons/types";

export function BorrowPanel({ borrows = [] }: { borrows?: Borrow[] }) {
  return (
    <Panel title="Borrows" subtitle="active references" accent="var(--rust)" icon="↪"
           empty={borrows.length === 0} emptyHint="// no live borrows">
      <div className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {borrows.map((b) => {
            const color = b.kind === "mut" ? "var(--warn)" : "var(--info)";
            return (
              <motion.div
                key={b.id}
                layout
                layoutId={`borrow-${b.id}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg hairline bg-[var(--surface-2)]/60"
              >
                <span className="mono text-[11px] px-1.5 py-0.5 rounded-md"
                      style={{ background: `color-mix(in oklab, ${color} 22%, transparent)`, color }}>
                  {b.kind === "mut" ? "&mut" : "&"}
                </span>
                <span className="mono text-[12px]">{b.from}</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  className="text-muted-foreground"
                >
                  ──→
                </motion.span>
                <span className="mono text-[12px] text-muted-foreground">{b.to}</span>
                {b.kind === "mut" && (
                  <span className="ml-auto chip" style={{ color: "var(--warn)" }}>exclusive</span>
                )}
                {b.kind === "shared" && (
                  <span className="ml-auto chip" style={{ color: "var(--info)" }}>shared</span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Panel>
  );
}
