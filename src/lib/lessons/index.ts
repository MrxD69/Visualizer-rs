import type { Lesson, Language } from "./types";
import { ownership } from "./rust/ownership";
import { borrowing } from "./rust/borrowing";
import { rcArc } from "./rust/rc-arc";
import { asyncAwait } from "./rust/async";
import { rustAdvancedLessons } from "./rust/advanced";
import { processes } from "./elixir/processes";
import { messages } from "./elixir/messages";
import { genserver } from "./elixir/genserver";
import { supervisors } from "./elixir/supervisors";
import { elixirAdvancedLessons } from "./elixir/advanced";
import { compareLessons } from "./compare/systems";

export const lessons: Lesson[] = [
  ownership, borrowing, rcArc, asyncAwait,
  processes, messages, genserver, supervisors,
  ...rustAdvancedLessons,
  ...elixirAdvancedLessons,
  ...compareLessons,
];

export const lessonsById: Record<string, Lesson> = Object.fromEntries(
  lessons.map((l) => [l.id, l]),
);

export function getLesson(id: string): Lesson | undefined {
  return lessonsById[id];
}

export function lessonsByLanguage(lang: Language): Lesson[] {
  return lessons.filter((l) => l.language === lang);
}

export function groupedByTopic(lang: Language): Array<{ topic: string; items: Lesson[] }> {
  const out = new Map<string, Lesson[]>();
  for (const l of lessonsByLanguage(lang)) {
    if (!out.has(l.topic)) out.set(l.topic, []);
    out.get(l.topic)!.push(l);
  }
  return Array.from(out.entries()).map(([topic, items]) => ({ topic, items }));
}
