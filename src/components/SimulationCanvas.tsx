import type { Lesson, Snapshot, PanelKind } from "@/lib/lessons/types";
import { StackPanel } from "./panels/StackPanel";
import { HeapPanel } from "./panels/HeapPanel";
import { BorrowPanel } from "./panels/BorrowPanel";
import { CompilerPanel } from "./panels/CompilerPanel";
import { ProcessTreePanel } from "./panels/ProcessTreePanel";
import { MailboxPanel } from "./panels/MailboxPanel";
import { SchedulerPanel } from "./panels/SchedulerPanel";
import { GenServerPanel } from "./panels/GenServerPanel";
import { TasksPanel } from "./panels/TasksPanel";

interface Props {
  lesson: Lesson;
  snapshot: Snapshot;
}

export function SimulationCanvas({ lesson, snapshot }: Props) {
  const accent =
    lesson.language === "rust"
      ? "var(--rust)"
      : lesson.language === "elixir"
        ? "var(--elixir)"
        : "var(--info)";

  const renderPanel = (kind: PanelKind) => {
    switch (kind) {
      case "stack":      return <StackPanel key={kind} frames={snapshot.stack} />;
      case "heap":       return <HeapPanel key={kind} blocks={snapshot.heap} />;
      case "borrow":     return <BorrowPanel key={kind} borrows={snapshot.borrows} />;
      case "compiler":   return <CompilerPanel key={kind} diagnostics={snapshot.diagnostics} />;
      case "processes":  return <ProcessTreePanel key={kind} processes={snapshot.processes} />;
      case "mailbox":    return <MailboxPanel key={kind} messages={snapshot.messages} />;
      case "scheduler":  return <SchedulerPanel key={kind} state={snapshot.scheduler} accent={accent} />;
      case "genserver":  return <GenServerPanel key={kind} state={snapshot.genserver} />;
      case "tasks":      return <TasksPanel key={kind} tasks={snapshot.tasks} accent={accent} />;
      default: return null;
    }
  };

  // Auto layout: 2 cols on md, 3 cols only if panels >= 5
  const cols = lesson.panels.length >= 5 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${cols} gap-3 auto-rows-min`}>
      {lesson.panels.map(renderPanel)}
    </div>
  );
}
