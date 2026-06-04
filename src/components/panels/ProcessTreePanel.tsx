import { motion, AnimatePresence } from "framer-motion";
import { Panel } from "./Panel";
import type { EProcess } from "@/lib/lessons/types";

const stateMeta: Record<string, { color: string; label: string }> = {
  running:  { color: "var(--ok)",   label: "running" },
  ready:    { color: "var(--info)", label: "ready" },
  waiting:  { color: "var(--warn)", label: "waiting" },
  exited:   { color: "var(--muted-foreground)", label: "exited" },
  crashed:  { color: "var(--err)",  label: "crashed" },
};

const roleGlyph: Record<string, string> = {
  supervisor: "◇",
  genserver:  "◉",
  worker:     "●",
  task:       "▸",
  user:       "◌",
};

export function ProcessTreePanel({ processes = [] }: { processes?: EProcess[] }) {
  // Build tree
  const byParent = new Map<string | undefined, EProcess[]>();
  for (const p of processes) {
    const k = p.parent;
    if (!byParent.has(k)) byParent.set(k, []);
    byParent.get(k)!.push(p);
  }
  const roots = byParent.get(undefined) ?? [];

  const renderNode = (p: EProcess, depth = 0): React.ReactNode => {
    const meta = stateMeta[p.state];
    const children = byParent.get(p.id) ?? [];
    return (
      <div key={p.id} className="flex flex-col">
        <motion.div
          layout
          layoutId={`proc-${p.id}`}
          initial={{ opacity: 0, scale: 0.92, y: 6 }}
          animate={{
            opacity: p.state === "exited" ? 0.45 : 1,
            scale: 1, y: 0,
            filter: p.state === "exited" ? "grayscale(0.5)" : "none",
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hairline bg-[var(--surface-2)]/60"
          style={{ marginLeft: depth * 16 }}
        >
          <span className="text-[14px] leading-none" style={{ color: meta.color }}>
            {roleGlyph[p.role ?? "worker"]}
          </span>
          <span className="mono text-[12px]">{p.name}</span>
          {p.state === "running" && (
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: meta.color }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
            />
          )}
          <span className="ml-auto mono text-[10px] uppercase tracking-wider"
                style={{ color: meta.color }}>
            {meta.label}
          </span>
        </motion.div>
        {children.length > 0 && (
          <div className="flex flex-col gap-1.5 mt-1.5 border-l border-dashed border-border ml-[14px] pl-2">
            {children.map((c) => renderNode(c, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Panel title="Processes" subtitle="BEAM process tree" accent="var(--elixir)" icon="◈"
           empty={processes.length === 0} emptyHint="// no processes">
      <div className="flex flex-col gap-1.5">
        <AnimatePresence mode="popLayout">
          {roots.map((p) => renderNode(p))}
        </AnimatePresence>
      </div>
    </Panel>
  );
}
