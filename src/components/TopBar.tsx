import type { Lesson } from "@/lib/lessons/types";
import type { LessonPlayer } from "@/hooks/useLessonPlayer";
import { Controls } from "./Controls";

export function TopBar({ lesson, player }: { lesson: Lesson; player: LessonPlayer }) {
  const accent = lesson.language === "rust" ? "var(--rust)" : "var(--elixir)";
  return (
    <header className="h-[68px] shrink-0 border-b border-border bg-[var(--surface)]/40 backdrop-blur-xl flex items-center px-6 gap-4">
      <div className="flex flex-col leading-tight min-w-0">
        <div className="flex items-center gap-2">
          <span className="mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {lesson.topic}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="chip" style={{ color: accent, borderColor: `color-mix(in oklab, ${accent} 35%, transparent)` }}>
            <span className="dot" style={{ background: accent }} />
            {lesson.language}
          </span>
          <span className="chip">{lesson.difficulty}</span>
        </div>
        <h1 className="text-[16px] font-semibold tracking-tight truncate">{lesson.title}</h1>
      </div>

      <div className="ml-auto">
        <Controls player={player} accent={accent} />
      </div>
    </header>
  );
}
