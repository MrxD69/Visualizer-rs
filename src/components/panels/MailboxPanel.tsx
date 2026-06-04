import { motion, AnimatePresence } from "framer-motion";
import { Panel } from "./Panel";
import type { EMessage } from "@/lib/lessons/types";

export function MailboxPanel({ messages = [] }: { messages?: EMessage[] }) {
  const inFlight = messages.filter((m) => m.phase === "in-flight");
  const inMailbox = messages.filter((m) => m.phase === "in-mailbox");
  const consumed = messages.filter((m) => m.phase === "consumed");

  return (
    <Panel title="Mailbox" subtitle="message queues" accent="var(--elixir)" icon="✉"
           empty={messages.length === 0} emptyHint="// no messages">
      <div className="flex flex-col gap-3">
        {/* In-flight lane */}
        <div className="rounded-lg hairline p-2 bg-[var(--surface-2)]/40">
          <div className="panel-title mb-1.5 text-[9px]">in flight</div>
          <div className="min-h-[28px] flex flex-wrap gap-1.5">
            <AnimatePresence mode="popLayout">
              {inFlight.map((m) => (
                <motion.div
                  key={m.id}
                  layout
                  layoutId={`msg-${m.id}`}
                  initial={{ opacity: 0, x: -24, scale: 0.9 }}
                  animate={{
                    opacity: 1, x: 0, scale: 1,
                    boxShadow: `0 0 0 1px color-mix(in oklab, var(--elixir) 40%, transparent), 0 0 18px color-mix(in oklab, var(--elixir) 30%, transparent)`,
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="mono text-[11px] px-2 py-1 rounded-md"
                  style={{ background: "color-mix(in oklab, var(--elixir) 15%, transparent)" }}
                >
                  {m.from} → {m.to}: <span className="text-[var(--syntax-string)]">{m.content}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {inFlight.length === 0 && (
              <span className="mono text-[10px] text-muted-foreground/60">—</span>
            )}
          </div>
        </div>

        {/* Mailbox */}
        <div className="rounded-lg hairline p-2">
          <div className="panel-title mb-1.5 text-[9px]">queued</div>
          <div className="flex flex-col gap-1.5 min-h-[28px]">
            <AnimatePresence mode="popLayout">
              {inMailbox.map((m, i) => (
                <motion.div
                  key={m.id}
                  layout
                  layoutId={`msg-${m.id}`}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ type: "spring", stiffness: 280, damping: 24 }}
                  className="flex items-center gap-2 mono text-[11px] px-2 py-1.5 rounded-md hairline bg-[var(--surface-2)]"
                >
                  <span className="text-muted-foreground/60 w-4 text-right">{i + 1}</span>
                  <span className="text-muted-foreground">→ {m.to}</span>
                  <span className="text-[var(--syntax-string)] truncate">{m.content}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {inMailbox.length === 0 && (
              <span className="mono text-[10px] text-muted-foreground/60">—</span>
            )}
          </div>
        </div>

        {/* Consumed */}
        {consumed.length > 0 && (
          <div className="rounded-lg p-2 opacity-60">
            <div className="panel-title mb-1.5 text-[9px]">consumed</div>
            <div className="flex flex-wrap gap-1.5">
              {consumed.map((m) => (
                <span key={m.id} className="chip line-through decoration-1 opacity-70">
                  {m.content}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}
