import type { LessonResource, Language } from "@/lib/lessons/types";

interface Props {
  resources?: LessonResource[];
  language: Language;
}

export function ResourceLinks({ resources = [], language }: Props) {
  if (resources.length === 0) return null;

  const accent =
    language === "rust"
      ? "var(--rust)"
      : language === "elixir"
        ? "var(--elixir)"
        : "var(--info)";

  return (
    <div className="glass rounded-xl p-4 flex flex-col gap-3">
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
          official docs and references
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {resources.map((resource) => (
          <a
            key={resource.url}
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border bg-[var(--surface-2)]/50 px-3 py-2.5 hover:bg-[var(--surface-2)] transition-colors"
          >
            <div className="text-[13px] font-medium leading-snug">{resource.label}</div>
            {resource.note && (
              <div className="mt-1 text-[11px] text-muted-foreground leading-snug">{resource.note}</div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
