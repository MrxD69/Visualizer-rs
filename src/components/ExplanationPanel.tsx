import { motion, AnimatePresence } from "framer-motion";
import type { LessonStep, Language } from "@/lib/lessons/types";

// Render plain text with **bold** and `code` inline markers.
function renderInline(text: string) {
  const parts: Array<{ type: "text" | "bold" | "code"; text: string }> = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push({ type: "text", text: text.slice(last, m.index) });
    const s = m[0];
    if (s.startsWith("**")) parts.push({ type: "bold", text: s.slice(2, -2) });
    else parts.push({ type: "code", text: s.slice(1, -1) });
    last = m.index + s.length;
  }
  if (last < text.length) parts.push({ type: "text", text: text.slice(last) });
  return parts.map((p, i) => {
    if (p.type === "bold") return <strong key={i} className="text-foreground font-semibold">{p.text}</strong>;
    if (p.type === "code") return <code key={i} className="mono text-[12px] px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--syntax-fn)]">{p.text}</code>;
    return <span key={i}>{p.text}</span>;
  });
}

interface Props {
  step: LessonStep;
  index: number;
  total: number;
  language: Language;
}

export function ExplanationPanel({ step, index, total, language }: Props) {
  const accent = language === "rust" ? "var(--rust)" : "var(--elixir)";
  return (
    <div className="glass rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="chip" style={{ borderColor: `color-mix(in oklab, ${accent} 40%, transparent)`, color: accent }}>
          <span className="dot" style={{ background: accent }} />
          step {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        {step.title && (
          <span className="mono text-[11px] text-muted-foreground">// {step.title}</span>
        )}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="text-[14px] leading-relaxed text-foreground/90"
        >
          {renderInline(step.explanation)}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
