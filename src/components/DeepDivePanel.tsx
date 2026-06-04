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

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="flex flex-col gap-6">
          <section className="bg-transparent">
            <div className="flex items-center gap-2 mb-3">
              <BookOpenText size={16} style={{ color: accent }} />
              <h3 className="text-[14px] font-bold tracking-tight">What This Lesson Is Really About</h3>
            </div>
            <div className="flex flex-col gap-3 text-[13px] leading-relaxed text-foreground/90">
              {deepDive.summary.map((paragraph, index) => (
                <p key={index} className="pl-6 border-l-2 border-border/40 italic">
                  {renderInline(paragraph)}
                </p>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            {deepDive.sections.map((section, index) => (
              <motion.section
                key={section.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <div className="flex items-center gap-2 flex-wrap mb-2.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                  <span className="text-[14px] font-bold group-hover:text-primary transition-colors">
                    {section.title}
                  </span>
                  {section.citations && section.citations.length > 0 && (
                    <div className="flex items-center gap-1.5 ml-1">
                      {section.citations.map((citation) => {
                        const resource = resources[citation - 1];
                        if (!resource) return null;
                        return (
                          <a
                            key={`${section.title}-${citation}`}
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mono text-[9px] px-1.5 py-0.5 rounded border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary"
                            title={resource.label}
                          >
                            {citation}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="pl-3.5 flex flex-col gap-3 text-[13px] leading-relaxed text-foreground/85">
                  {section.body.map((paragraph, bodyIndex) => (
                    <p key={bodyIndex}>{renderInline(paragraph)}</p>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-xl border border-border bg-[var(--surface-2)]/10 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-[var(--surface-2)]/20">
              <Code2 size={15} style={{ color: accent }} />
              <span className="text-[13px] font-bold">{deepDive.studyCodeLabel}</span>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="mono text-[11px] text-muted-foreground/80 leading-relaxed">
                The example below adds step-aware annotations so the code and simulation stay tied together.
              </div>
              <pre className="overflow-auto rounded-lg border border-border/60 bg-[var(--surface)]/40 p-3.5 mono text-[12px] leading-[1.7] whitespace-pre-wrap shadow-sm">
                {deepDive.studyCode}
              </pre>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-[var(--surface-2)]/10 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-[var(--surface-2)]/20">
              <HelpCircle size={15} style={{ color: accent }} />
              <span className="text-[13px] font-bold">Study Prompts</span>
            </div>
            <div className="p-4 flex flex-col gap-2.5">
              {deepDive.studyPrompts.map((prompt, index) => (
                <div 
                  key={index} 
                  className="relative pl-6 py-1 text-[12.5px] leading-relaxed text-foreground/85 before:content-['?'] before:absolute before:left-0 before:top-1.5 before:w-4 before:h-4 before:flex before:items-center before:justify-center before:bg-primary/10 before:text-primary before:rounded-sm before:font-bold before:text-[10px]"
                >
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
