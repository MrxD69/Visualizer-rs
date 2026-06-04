import { BookOpenText, Code2, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { resolveLessonDeepDive } from "@/lib/lessons/deep-dive";
import type { Language, Lesson } from "@/lib/lessons/types";

function renderInline(text: string) {
  const parts: Array<{ type: "text" | "bold" | "code"; text: string }> = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    if (match.index > last) parts.push({ type: "text", text: text.slice(last, match.index) });
    const token = match[0];
    if (token.startsWith("**")) parts.push({ type: "bold", text: token.slice(2, -2) });
    else parts.push({ type: "code", text: token.slice(1, -1) });
    last = match.index + token.length;
  }
  if (last < text.length) parts.push({ type: "text", text: text.slice(last) });

  return parts.map((part, index) => {
    if (part.type === "bold") {
      return (
        <strong key={index} className="text-foreground font-semibold">
          {part.text}
        </strong>
      );
    }

    if (part.type === "code") {
      return (
        <code
          key={index}
          className="mono text-[12px] px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--syntax-fn)]"
        >
          {part.text}
        </code>
      );
    }

    return <span key={index}>{part.text}</span>;
  });
}

function accentFor(language: Language) {
  return language === "rust" ? "var(--rust)" : language === "elixir" ? "var(--elixir)" : "var(--info)";
}

export function DeepDivePanel({ lesson }: { lesson: Lesson }) {
  const accent = accentFor(lesson.language);
  const deepDive = resolveLessonDeepDive(lesson);
  const resources = lesson.resources ?? [];

  return (
    <div className="glass rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span
          className="chip"
          style={{
            color: accent,
            borderColor: `color-mix(in oklab, ${accent} 35%, transparent)`,
          }}
        >
          <span className="dot" style={{ background: accent }} />
          deep dive
        </span>
        <span className="mono text-[11px] text-muted-foreground">
          richer explanation, citations, and study code
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-3">
        <div className="flex flex-col gap-3">
          <section className="rounded-xl border border-border bg-[var(--surface-2)]/35 p-3">
            <div className="flex items-center gap-2 mb-2">
              <BookOpenText size={14} style={{ color: accent }} />
              <span className="text-[13px] font-semibold">What This Lesson Is Really About</span>
            </div>
            <div className="flex flex-col gap-2 text-[13px] leading-relaxed text-foreground/85">
              {deepDive.summary.map((paragraph, index) => (
                <p key={index}>{renderInline(paragraph)}</p>
              ))}
            </div>
          </section>

          {deepDive.sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className="rounded-xl border border-border bg-[var(--surface-2)]/25 p-3"
            >
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-[13px] font-semibold">{section.title}</span>
                {section.citations && section.citations.length > 0 && (
                  <div className="flex items-center gap-1">
                    {section.citations.map((citation) => {
                      const resource = resources[citation - 1];
                      if (!resource) return null;
                      return (
                        <a
                          key={`${section.title}-${citation}`}
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mono text-[10px] px-1.5 py-0.5 rounded-md border border-border hover:bg-[var(--surface-2)] transition-colors"
                          title={resource.label}
                        >
                          [{citation}]
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 text-[13px] leading-relaxed text-foreground/85">
                {section.body.map((paragraph, bodyIndex) => (
                  <p key={bodyIndex}>{renderInline(paragraph)}</p>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <section className="rounded-xl border border-border bg-[var(--surface-2)]/25 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Code2 size={14} style={{ color: accent }} />
              <span className="text-[13px] font-semibold">{deepDive.studyCodeLabel}</span>
            </div>
            <div className="mono text-[11px] text-muted-foreground mb-2">
              The example below adds step-aware annotations so the code and simulation stay tied together.
            </div>
            <pre className="overflow-auto rounded-lg border border-border bg-[var(--surface)]/80 p-3 mono text-[12px] leading-[1.65] whitespace-pre-wrap">
              {deepDive.studyCode}
            </pre>
          </section>

          <section className="rounded-xl border border-border bg-[var(--surface-2)]/25 p-3">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle size={14} style={{ color: accent }} />
              <span className="text-[13px] font-semibold">Study Prompts</span>
            </div>
            <div className="flex flex-col gap-2">
              {deepDive.studyPrompts.map((prompt, index) => (
                <div key={index} className="rounded-lg bg-[var(--surface)]/70 px-3 py-2 text-[12.5px] leading-relaxed text-foreground/85">
                  {renderInline(prompt)}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
