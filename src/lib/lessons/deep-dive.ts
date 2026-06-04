import type {
  Language,
  Lesson,
  LessonDeepDiveSection,
  LessonResource,
} from "./types";

export interface ResolvedLessonDeepDive {
  summary: string[];
  sections: LessonDeepDiveSection[];
  studyPrompts: string[];
  studyCode: string;
  studyCodeLabel: string;
}

const panelGlossary: Record<string, Record<string, string>> = {
  rust: {
    stack: "which bindings exist on the stack and which one currently owns the value",
    heap: "which heap allocation exists, moves, reallocates, or gets freed",
    borrow: "how references appear, overlap, and eventually end",
    compiler: "where Rust rejects the program before runtime or signals a runtime-adjacent hazard",
    tasks: "how async work is represented as state that must be resumed later",
  },
  elixir: {
    processes: "which process owns the work or state at each moment",
    mailbox: "where pressure, ordering, and delivery become visible",
    scheduler: "how runnable work competes for CPU time on the BEAM",
    genserver: "which server process currently owns state and how that state changes",
    tasks: "where short-lived background work enters and leaves the system",
  },
  compare: {
    stack: "how shared-memory coordination usually centers on one protected value",
    heap: "where ownership, aliasing, and lifetime pressure gather in the memory model",
    borrow: "how aliasing rules differ from process isolation",
    processes: "how actor isolation shifts the coordination problem into message flow",
    mailbox: "how load often surfaces as queue growth rather than lock contention",
    scheduler: "how the runtime decides which work unit runs next",
    tasks: "how units of concurrent work differ between models",
    compiler: "which guarantees are enforced before runtime versus during runtime",
    genserver: "where single-owner process state becomes the serialization point",
  },
};

function stripInline(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1").trim();
}

function firstSentence(text: string): string {
  const stripped = stripInline(text);
  const match = stripped.match(/(.+?[.!?])(\s|$)/);
  return (match?.[1] ?? stripped).trim();
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function citationRange(resources: LessonResource[] | undefined, start = 1, count = 2): number[] | undefined {
  const total = resources?.length ?? 0;
  if (total === 0) return undefined;
  return Array.from({ length: Math.min(count, total - start + 1) }, (_, idx) => start + idx).filter((n) => n > 0 && n <= total);
}

function runtimeFocus(lesson: Lesson): string[] {
  const glossary = panelGlossary[lesson.language];
  const notes = lesson.panels
    .map((panel) => glossary[panel])
    .filter((note): note is string => Boolean(note));

  if (notes.length === 0) {
    return [
      "Use the active step explanation to map the code to the runtime state transition being shown.",
    ];
  }

  return [
    `As you step through this lesson, focus on ${notes.join(", ")}.`,
    `The simulation panels are not decoration here; they are the concrete runtime structures this lesson is trying to teach.`,
  ];
}

function walkthrough(lesson: Lesson): string[] {
  return lesson.steps.map((step, index) => {
    const label = step.title ? step.title : `step ${index + 1}`;
    return `Step ${String(index + 1).padStart(2, "0")} - ${label}: ${stripInline(step.explanation)}`;
  });
}

function studyPrompts(lesson: Lesson): string[] {
  const shared = [
    `Which runtime structure becomes the bottleneck or source of truth in ${lesson.title.toLowerCase()}?`,
    "If you changed the order of events in the code, which panel would change first and why?",
    "What would break first under more load, more sharing, or more failure than the current example shows?",
  ];

  if (lesson.language === "rust") {
    return [
      "Which binding owns the value at the end of the lesson, and what gets dropped at scope exit?",
      "At what line would Rust reject the program, and is the issue a move, borrow, aliasing, or synchronization rule?",
      "If this example scaled to more threads, more borrows, or more allocations, where would the safety boundary show up?",
    ];
  }

  if (lesson.language === "elixir") {
    return [
      "Which process owns the state in this lesson, and how would another process learn about it safely?",
      "Where would mailbox pressure, supervision, or scheduling delay show up if this example were under heavier load?",
      "If one process in this lesson crashed, which parent, subscriber, or caller would notice first?",
    ];
  }

  return shared;
}

function buildAnnotatedCode(lesson: Lesson): string {
  const lines = lesson.code.split("\n");
  const comment = lesson.language === "rust" ? "//" : "#";
  const notesByLine = new Map<number, string[]>();

  for (const step of lesson.steps) {
    const note = step.title ? step.title : firstSentence(step.explanation);
    for (const line of step.lines) {
      if (!notesByLine.has(line)) notesByLine.set(line, []);
      notesByLine.get(line)!.push(note);
    }
  }

  return lines
    .map((line, index) => {
      const lineNo = index + 1;
      const notes = unique(notesByLine.get(lineNo) ?? []).slice(0, 2);
      if (notes.length === 0) return line;
      return `${line}  ${comment} ${notes.join(" | ")}`;
    })
    .join("\n");
}

function defaultSections(lesson: Lesson): LessonDeepDiveSection[] {
  const summarySections: LessonDeepDiveSection[] = [
    {
      title: "Runtime Model",
      body: runtimeFocus(lesson),
      citations: citationRange(lesson.resources, 1, 2),
    },
    {
      title: "Detailed Walkthrough",
      body: walkthrough(lesson),
      citations: citationRange(lesson.resources, 1, 1),
    },
    {
      title: "Production Reading",
      body: [
        `${lesson.title} matters because ${lesson.subtitle.charAt(0).toLowerCase()}${lesson.subtitle.slice(1)}`,
        "When you see this pattern in real code, look for the same ownership boundary, process boundary, queue boundary, or scheduling boundary that the simulation isolates here.",
      ],
      citations: citationRange(lesson.resources, Math.max((lesson.resources?.length ?? 1) - 1, 1), 2),
    },
  ];

  return summarySections;
}

export function resolveLessonDeepDive(lesson: Lesson): ResolvedLessonDeepDive {
  return {
    summary:
      lesson.deepDive?.summary ??
      [
        lesson.subtitle,
        `This lesson belongs to ${lesson.topic.toLowerCase()} and uses ${lesson.steps.length} simulation steps to make the runtime behavior visible instead of implicit.`,
      ],
    sections: lesson.deepDive?.sections ?? defaultSections(lesson),
    studyPrompts: lesson.deepDive?.studyPrompts ?? studyPrompts(lesson),
    studyCode: lesson.deepDive?.extendedCode ?? buildAnnotatedCode(lesson),
    studyCodeLabel: lesson.deepDive?.extendedCode ? "expanded study example" : "annotated study code",
  };
}
