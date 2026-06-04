import { BookOpenText, Code2, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { resolveLessonDeepDive } from "@/lib/lessons/deep-dive";
import type { Language, Lesson } from "@/lib/lessons/types";
import { highlight } from "@/lib/highlight";

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
          className="mono text-[12px] px-1.5 py-0.5 rounded bg-muted text-primary font-medium"
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
    <div className="bg-transparent flex flex-col gap-10">
      <div className="flex flex-col gap-1 px-1">
        <h2 className="text-[18px] font-bold tracking-tight flex items-center gap-2">
          Deep Dive
          <span className="text-[10px] mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-widest">
            {lesson.language}
          </span>
        </h2>
        <p className="text-[12px] text-muted-foreground/60 leading-relaxed max-w-xl">
          Richer explanation, academic citations, and step-aware study code for a deeper technical understanding of the runtime behavior.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        <section className="bg-transparent">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
              <BookOpenText size={16} />
            </div>
            <h3 className="text-[15px] font-bold tracking-tight">Lesson Overview</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-[13.5px] leading-relaxed text-foreground/90">
            {deepDive.summary.map((paragraph, index) => (
              <p key={index} className="pl-5 border-l-2 border-primary/20 italic">
                {renderInline(paragraph)}
              </p>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-x-12 gap-y-10">
          <div className="space-y-10">
            {deepDive.sections.map((section, index) => (
              <motion.section
                key={section.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <div className="flex items-center gap-2 flex-wrap mb-3.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
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
                            className="mono text-[9px] px-1.5 py-0.5 rounded bg-muted/50 border border-border/20 hover:border-primary/50 transition-all text-muted-foreground hover:text-primary"
                            title={resource.label}
                          >
                            [{citation}]
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="pl-4 flex flex-col gap-3.5 text-[13px] leading-relaxed text-foreground/80">
                  {section.body.map((paragraph, bodyIndex) => (
                    <p key={bodyIndex}>{renderInline(paragraph)}</p>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>

          <div className="flex flex-col gap-10">
            <section className="bg-transparent">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                  <Code2 size={16} />
                </div>
                <span className="text-[15px] font-bold tracking-tight">{deepDive.studyCodeLabel}</span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="mono text-[11px] text-muted-foreground/60 leading-relaxed px-1">
                  Step-aware annotations ensure the code and simulation stay tied together during execution.
                </div>
                <div className="rounded-2xl bg-muted/30 border border-border/40 p-5 overflow-hidden">
                  <pre className="overflow-auto mono text-[12px] leading-[1.7] whitespace-pre">
                    {highlightedCode.map((line, lineIdx) => (
                      <div key={lineIdx} className="flex">
                        <span className="w-6 shrink-0 text-[10px] text-muted-foreground/30 select-none">{lineIdx + 1}</span>
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
              </div>
            </section>

            <section className="bg-transparent">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                  <HelpCircle size={16} />
                </div>
                <span className="text-[15px] font-bold tracking-tight">Study Prompts</span>
              </div>
              <div className="grid gap-3">
                {deepDive.studyPrompts.map((prompt, index) => (
                  <div 
                    key={index} 
                    className="relative p-4 rounded-xl bg-muted/20 border border-border/20 text-[12.5px] leading-relaxed text-foreground/85 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex gap-3">
                      <span className="text-primary font-bold">?</span>
                      <div className="flex-1">{renderInline(prompt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
