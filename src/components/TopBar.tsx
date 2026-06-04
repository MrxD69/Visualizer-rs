import type { Lesson } from "@/lib/lessons/types";
import type { LessonPlayer } from "@/hooks/useLessonPlayer";
import { Controls } from "./Controls";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function TopBar({ lesson, player }: { lesson: Lesson; player: LessonPlayer }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.body.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    }
  };

  const accent =
    lesson.language === "rust"
      ? "var(--rust)"
      : lesson.language === "elixir"
        ? "var(--elixir)"
        : "var(--info)";
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

      <div className="ml-auto flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md border border-border bg-[var(--surface-2)]/50 hover:bg-[var(--surface-3)] transition-colors text-muted-foreground hover:text-foreground"
          title="Toggle theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <Controls player={player} accent={accent} />
      </div>
    </header>
  );
}
