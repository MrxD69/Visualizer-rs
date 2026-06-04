import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Boxes,
  Cpu,
  Droplets,
  Flame,
  Map,
  Network,
  RadioTower,
  Route,
  Scale,
  ShieldAlert,
  TrainFront,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { groupedByTopic, lessons, lessonsById, lessonsByLanguage } from "@/lib/lessons";
import type { Language } from "@/lib/lessons/types";

const languageOrder: Language[] = ["rust", "elixir", "compare"];

const langMeta: Record<
  Language,
  {
    color: string;
    label: string;
    icon: LucideIcon;
    short: string;
  }
> = {
  rust: { color: "var(--rust)", label: "Rust", icon: Flame, short: "Rs" },
  elixir: { color: "var(--elixir)", label: "Elixir", icon: Droplets, short: "Ex" },
  compare: { color: "var(--info)", label: "Compare", icon: Scale, short: "Vs" },
};

const topicMeta: Record<string, { icon: LucideIcon; label: string }> = {
  Memory: { icon: Cpu, label: "Memory" },
  Borrowing: { icon: Workflow, label: "Borrowing" },
  Concurrency: { icon: Network, label: "Concurrency" },
  Async: { icon: Activity, label: "Async" },
  "Failure Model": { icon: ShieldAlert, label: "Failure" },
  OTP: { icon: Boxes, label: "OTP" },
  Phoenix: { icon: BookOpenText, label: "Phoenix" },
  Realtime: { icon: RadioTower, label: "Realtime" },
  "Transport Systems": { icon: TrainFront, label: "Systems" },
  "Concurrency Applied": { icon: Network, label: "Applied" },
  Integrations: { icon: Workflow, label: "Integrations" },
  Mapping: { icon: Map, label: "Mapping" },
  Reliability: { icon: ShieldAlert, label: "Reliability" },
};

function getLessonIdFromPath(pathname: string): string | undefined {
  if (!pathname.startsWith("/lesson/")) return undefined;
  return decodeURIComponent(pathname.replace("/lesson/", ""));
}

export function Sidebar() {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const activeLessonId = getLessonIdFromPath(currentPath);
  const activeLesson = activeLessonId ? lessonsById[activeLessonId] : undefined;
  const activeIndex = activeLesson ? lessons.findIndex((lesson) => lesson.id === activeLesson.id) : -1;
  const previousLesson = activeIndex > 0 ? lessons[activeIndex - 1] : undefined;
  const nextLesson = activeIndex >= 0 && activeIndex < lessons.length - 1 ? lessons[activeIndex + 1] : undefined;

  return (
    <aside className="w-[290px] shrink-0 border-r border-border bg-background flex flex-col h-full">
      <Link
        to="/"
        className="px-6 py-6 flex items-center gap-3 group transition-colors"
      >
        <div
          className="relative w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform"
          style={{ background: "linear-gradient(135deg, var(--rust), var(--elixir))" }}
        >
          <span className="mono text-[12px] font-black text-white">VZ</span>
        </div>
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-[15px] font-bold tracking-tight">Visualize</span>
          <span className="mono text-[9px] text-muted-foreground/60 tracking-[0.2em] truncate">
            RUNTIME · SYSTEMS
          </span>
        </div>
      </Link>

      <div className="px-4 pb-6 flex flex-col gap-1">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Curriculum</span>
          <span className="text-[10px] mono text-muted-foreground/30">{lessons.length} Modules</span>
        </div>
        {languageOrder.map((lang) => {
          const meta = langMeta[lang];
          const selected = activeLesson?.language === lang;
          return (
            <div
              key={lang}
              className={`rounded-xl px-3 py-2 flex items-center justify-between transition-all cursor-default ${selected ? 'bg-muted/50' : 'opacity-60 hover:opacity-100'}`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
                <span className="text-[13px] font-semibold">{meta.label}</span>
              </div>
              <span className="mono text-[10px] text-muted-foreground/60">
                {lessonsByLanguage(lang).length}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto px-4 py-2 flex flex-col gap-6 custom-scrollbar">
        {languageOrder.map((lang) => {
          const groups = groupedByTopic(lang);
          const meta = langMeta[lang];

          return (
            <section key={lang} className="flex flex-col gap-3">
              {groups.map((group) => {
                const info = topicMeta[group.topic] ?? { icon: Route, label: group.topic };

                return (
                  <div key={group.topic} className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 px-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">{info.label}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      {group.items.map((lesson) => {
                        const active = currentPath === `/lesson/${lesson.id}`;
                        return (
                          <Link
                            key={lesson.id}
                            to="/lesson/$id"
                            params={{ id: lesson.id }}
                            className={`group px-3 py-2.5 rounded-xl flex items-center gap-3 text-[13px] transition-all relative ${active ? 'bg-primary/5 text-primary' : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'}`}
                          >
                            <span className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center mono text-[10px] font-bold transition-colors ${active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground/60 group-hover:bg-muted-foreground/10'}`}>
                              {lesson.title
                                .split(" ")
                                .slice(0, 2)
                                .map((part) => part[0])
                                .join("")}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className={`block text-[13px] font-medium leading-snug transition-colors ${active ? 'text-primary' : 'text-foreground/80'}`}>
                                {lesson.title}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>

      <div className="p-6 border-t border-border flex flex-col gap-3">
        {activeLesson && (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex gap-1">
              {previousLesson && (
                <Link
                  to="/lesson/$id"
                  params={{ id: previousLesson.id }}
                  className="flex-1 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  title={previousLesson.title}
                >
                  <ArrowLeft size={14} />
                </Link>
              )}
              {nextLesson && (
                <Link
                  to="/lesson/$id"
                  params={{ id: nextLesson.id }}
                  className="flex-1 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  title={nextLesson.title}
                >
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
            <div className="mono text-[10px] text-muted-foreground/40 font-medium">
              STEPPER
            </div>
          </div>
        )}
        <div className="mono text-[9px] text-muted-foreground/40 tracking-wider text-center">
          VZ v0.1 · OPEN SOURCE
        </div>
      </div>
    </aside>
  );
}
