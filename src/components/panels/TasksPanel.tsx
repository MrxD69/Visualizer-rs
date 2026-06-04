import { motion, AnimatePresence } from "framer-motion";
import { Panel } from "./Panel";
import type { ETask } from "@/lib/lessons/types";

const statusMeta: Record<string, { color: string; label: string }> = {
  pending: { color: "var(--muted-foreground)", label: "pending" },
  running: { color: "var(--info)", label: "running" },
  done:    { color: "var(--ok)",   label: "ready" },
};

export function TasksPanel({ tasks = [], accent = "var(--rust)" }: { tasks?: ETask[]; accent?: string }) {
  return (
    <Panel title="Tasks" subtitle="async work" accent={accent} icon="∿"
           empty={tasks.length === 0} emptyHint="// no tasks scheduled">
      <div className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {tasks.map((t) => {
            const m = statusMeta[t.status];
            return (
              <motion.div
                key={t.id}
                layout
                layoutId={`task-${t.id}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg hairline bg-[var(--surface-2)]/60"
              >
                <span className="dot" style={{ background: m.color }} />
                <span className="mono text-[12px]">{t.label}</span>
                {t.status === "running" && (
                  <div className="ml-2 flex-1 h-[3px] rounded-full overflow-hidden bg-[var(--surface-3)]">
                    <motion.div
                      className="h-full"
                      style={{ background: accent }}
                      initial={{ width: "10%" }}
                      animate={{ width: ["10%", "90%", "10%"] }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                    />
                  </div>
                )}
                <span className="ml-auto mono text-[10px] uppercase tracking-wider" style={{ color: m.color }}>
                  {m.label}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Panel>
  );
}
