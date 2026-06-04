import { BookOpenText, Code2, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { highlight } from "@/lib/highlight";
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
        <strong key={index} className="font-semibold text-foreground">
          {part.text}
        </strong>
      );
    }

    if (part.type === "code") {
      return (
        <code
          key={index}
          className="mono rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-[12px] text-[var(--syntax-fn)]"
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
  const highlightedCode = highlight(deepDive.studyCode, lesson.language);

  return (
    <section className="glass rounded-2xl px-5 py-6 md:px-6 md:py-7">
      <div className="mx-auto max-w-[1480px] flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-[20px] font-semibold tracking-tight">Deep Dive</h2>
            <span
              className="mono rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{
                background: `color-mix(in oklab, ${accent} 14%, transparent)`,
                color: accent,
              }}
            >
              {lesson.language}
            </span>
          </div>
          <p className="max-w-[760px] text-[13px] leading-relaxed text-muted-foreground">
            Richer explanation, cited references, and study code for a deeper technical reading of the runtime behavior.
          </p>
        </div>

        <section className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] gap-x-14 gap-y-5">
          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{ background: `color-mix(in oklab, ${accent} 10%, transparent)`, color: accent }}
            >
              <BookOpenText size={16} />
            </div>
            <div className="min-w-0">
              <div className="mb-3 text-[15px] font-semibold tracking-tight">Lesson Overview</div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-4">
                {deepDive.summary.map((paragraph, index) => (
                  <p
                    key={index}
                    className="max-w-[68ch] border-l pl-4 text-[14px] leading-7 text-foreground/88"
                    style={{ borderColor: `color-mix(in oklab, ${accent} 20%, transparent)` }}
                  >
                    {renderInline(paragraph)}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="2xl:pl-2">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70 mono">
              How To Use This
            </div>
            <p className="mt-2 max-w-[42ch] text-[13px] leading-6 text-muted-foreground">
              Read the overview first, step through the runtime view, then use the annotated code and prompts to connect the visuals back to real production code.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] gap-x-14 gap-y-10">
          <div className="flex flex-col gap-8">
            {deepDive.sections.map((section, index) => (
              <motion.section
                key={section.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: index * 0.04 }}
                className="border-t border-border/80 pt-5 first:border-t-0 first:pt-0"
              >
                <div className="mb-3 flex items-center gap-2 flex-wrap">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: accent }}
                  />
                  <h3 className="text-[15px] font-semibold tracking-tight">{section.title}</h3>
                  {section.citations && section.citations.length > 0 && (
                    <div className="ml-1 flex items-center gap-1.5">
                      {section.citations.map((citation) => {
                        const resource = resources[citation - 1];
                        if (!resource) return null;
                        return (
                          <a
                            key={`${section.title}-${citation}`}
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mono rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
                            style={{
                              background: `color-mix(in oklab, ${accent} 8%, transparent)`,
                              borderColor: `color-mix(in oklab, ${accent} 16%, var(--border))`,
                            }}
                            title={resource.label}
                          >
                            [{citation}]
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3 text-[14px] leading-7 text-foreground/84">
                  {section.body.map((paragraph, bodyIndex) => (
                    <p key={bodyIndex} className="max-w-[74ch]">
                      {renderInline(paragraph)}
                    </p>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>

          <aside className="flex flex-col gap-8 xl:sticky xl:top-4 self-start">
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: `color-mix(in oklab, ${accent} 10%, transparent)`, color: accent }}
                >
                  <Code2 size={16} />
                </div>
                <div>
                  <div className="text-[15px] font-semibold tracking-tight">{deepDive.studyCodeLabel}</div>
                  <div className="mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
                    Step-aware study code
                  </div>
                </div>
              </div>
              <p className="mb-4 max-w-[42ch] text-[12.5px] leading-6 text-muted-foreground">
                The annotations below keep the code synchronized with the simulation so you can reread the example without losing the runtime story.
              </p>
              <div className="overflow-hidden rounded-2xl border border-border bg-[var(--surface-2)]/35">
                <pre className="overflow-auto p-4 mono text-[12px] leading-[1.75] whitespace-pre">
                  {highlightedCode.map((line, lineIdx) => (
                    <div key={lineIdx} className="flex">
                      <span className="w-7 shrink-0 select-none text-[10px] text-muted-foreground/35">
                        {lineIdx + 1}
                      </span>
                      <div className="flex-1">
                        {line.map((token, tokenIdx) => (
                          <span key={tokenIdx} className={token.cls}>
                            {token.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </pre>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: `color-mix(in oklab, ${accent} 10%, transparent)`, color: accent }}
                >
                  <HelpCircle size={16} />
                </div>
                <div>
                  <div className="text-[15px] font-semibold tracking-tight">Study Prompts</div>
                  <div className="mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
                    Think past the happy path
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {deepDive.studyPrompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-border bg-[var(--surface-2)]/20 px-4 py-3 text-[13px] leading-6 text-foreground/84"
                  >
                    <div className="flex gap-3">
                      <span className="mono font-semibold" style={{ color: accent }}>
                        ?
                      </span>
                      <div className="flex-1">{renderInline(prompt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
