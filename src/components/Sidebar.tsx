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
    <aside className="w-[290px] shrink-0 border-r border-border bg-[var(--surface)]/55 backdrop-blur-xl flex flex-col h-full">
      <Link
        to="/"
        className="px-4 py-4 border-b border-border flex items-center gap-3 hover:bg-[var(--surface-2)]/50 transition-colors"
      >
        <div
          className="relative w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, var(--rust), var(--elixir))" }}
        >
          <span className="mono text-[11px] font-bold text-background">VZ</span>
        </div>
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-[13px] font-semibold tracking-tight">Visualize</span>
          <span className="mono text-[10px] text-muted-foreground tracking-wider truncate">
            RUST · ELIXIR · TRANSPORT
          </span>
        </div>
      </Link>

      <div className="px-3 pt-3 grid grid-cols-3 gap-2 border-b border-border/70 pb-3">
        {languageOrder.map((lang) => {
          const meta = langMeta[lang];
          const Icon = meta.icon;
          const firstLesson = lessonsByLanguage(lang)[0];
          const selected = activeLesson?.language === lang;
          if (!firstLesson) return null;
          return (
            <Link
              key={lang}
              to="/lesson/$id"
              params={{ id: firstLesson.id }}
              className="rounded-xl px-2.5 py-2.5 flex flex-col gap-1.5 transition-all"
              style={{
                background: selected
                  ? `color-mix(in oklab, ${meta.color} 18%, transparent)`
                  : "color-mix(in oklab, var(--surface-2) 75%, transparent)",
                border: `1px solid color-mix(in oklab, ${selected ? meta.color : "var(--border)"} 25%, transparent)`,
              }}
            >
              <div className="flex items-center gap-1.5">
                <Icon size={14} style={{ color: meta.color }} />
                <span className="mono text-[10px] uppercase tracking-wider">{meta.short}</span>
              </div>
              <span className="text-[12px] font-medium">{meta.label}</span>
              <span className="mono text-[9px] text-muted-foreground">
                {lessonsByLanguage(lang).length} lessons
              </span>
            </Link>
          );
        })}
      </div>

      {activeLesson && (
        <div className="px-3 pt-3">
          <div
            className="rounded-xl p-3 border"
            style={{
              background: `linear-gradient(180deg, color-mix(in oklab, ${langMeta[activeLesson.language].color} 12%, transparent), transparent)`,
              borderColor: `color-mix(in oklab, ${langMeta[activeLesson.language].color} 25%, transparent)`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="chip"
                style={{
                  borderColor: `color-mix(in oklab, ${langMeta[activeLesson.language].color} 30%, transparent)`,
                  color: langMeta[activeLesson.language].color,
                }}
              >
                <span className="dot" style={{ background: langMeta[activeLesson.language].color }} />
                now studying
              </span>
              <span className="ml-auto mono text-[10px] text-muted-foreground">
                {activeLesson.steps.length} steps
              </span>
            </div>
            <div className="text-[13px] font-semibold leading-snug">{activeLesson.title}</div>
            <div className="mt-1 text-[11px] text-muted-foreground leading-snug">
              {activeLesson.topic} · {activeLesson.difficulty}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {previousLesson ? (
                <Link
                  to="/lesson/$id"
                  params={{ id: previousLesson.id }}
                  className="rounded-lg px-2.5 py-2 bg-[var(--surface-2)]/70 hover:bg-[var(--surface-2)] transition-colors"
                >
                  <div className="flex items-center gap-1.5 mono text-[10px] text-muted-foreground">
                    <ArrowLeft size={12} />
                    prev
                  </div>
                  <div className="mt-1 text-[11px] font-medium leading-snug">{previousLesson.title}</div>
                </Link>
              ) : (
                <div className="rounded-lg px-2.5 py-2 bg-[var(--surface-2)]/35 opacity-60">
                  <div className="flex items-center gap-1.5 mono text-[10px] text-muted-foreground">
                    <ArrowLeft size={12} />
                    prev
                  </div>
                </div>
              )}
              {nextLesson ? (
                <Link
                  to="/lesson/$id"
                  params={{ id: nextLesson.id }}
                  className="rounded-lg px-2.5 py-2 bg-[var(--surface-2)]/70 hover:bg-[var(--surface-2)] transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1.5 mono text-[10px] text-muted-foreground">
                    next
                    <ArrowRight size={12} />
                  </div>
                  <div className="mt-1 text-[11px] font-medium leading-snug">{nextLesson.title}</div>
                </Link>
              ) : (
                <div className="rounded-lg px-2.5 py-2 bg-[var(--surface-2)]/35 opacity-60 text-right">
                  <div className="flex items-center justify-end gap-1.5 mono text-[10px] text-muted-foreground">
                    next
                    <ArrowRight size={12} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto px-3 py-3 flex flex-col gap-5">
        {languageOrder.map((lang) => {
          const groups = groupedByTopic(lang);
          const meta = langMeta[lang];
          const Icon = meta.icon;

          return (
            <section key={lang} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-1.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    background: `color-mix(in oklab, ${meta.color} 18%, transparent)`,
                    color: meta.color,
                  }}
                >
                  <Icon size={14} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold">{meta.label}</div>
                  <div className="mono text-[10px] text-muted-foreground">
                    {lessonsByLanguage(lang).length} lessons
                  </div>
                </div>
              </div>

              {groups.map((group) => {
                const info = topicMeta[group.topic] ?? { icon: Route, label: group.topic };
                const TopicIcon = info.icon;

                return (
                  <div key={group.topic} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 px-2 pt-1">
                      <TopicIcon size={12} className="text-muted-foreground" />
                      <span className="panel-title">{info.label}</span>
                      <span className="ml-auto mono text-[9px] text-muted-foreground/70">
                        {group.items.length}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      {group.items.map((lesson) => {
                        const active = currentPath === `/lesson/${lesson.id}`;
                        return (
                          <Link
                            key={lesson.id}
                            to="/lesson/$id"
                            params={{ id: lesson.id }}
                            className="group px-2.5 py-2 rounded-xl flex items-start gap-2.5 text-[13px] transition-all relative"
                            style={{
                              background: active
                                ? `color-mix(in oklab, ${meta.color} 14%, transparent)`
                                : "transparent",
                              color: active ? "var(--foreground)" : "var(--muted-foreground)",
                            }}
                          >
                            {active && (
                              <span
                                className="absolute left-0 top-2 bottom-2 w-[2px] rounded-r"
                                style={{ background: meta.color }}
                              />
                            )}
                            <span
                              className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center mono text-[10px] font-semibold"
                              style={{
                                background: active
                                  ? `color-mix(in oklab, ${meta.color} 22%, transparent)`
                                  : "color-mix(in oklab, var(--surface-2) 75%, transparent)",
                                color: meta.color,
                              }}
                            >
                              {lesson.title
                                .split(" ")
                                .slice(0, 2)
                                .map((part) => part[0])
                                .join("")}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-[12.5px] font-medium leading-snug text-foreground/95 group-hover:text-foreground transition-colors">
                                {lesson.title}
                              </span>
                              <span className="mt-1 flex items-center gap-2 mono text-[9px] uppercase tracking-wider text-muted-foreground">
                                <span>{lesson.difficulty}</span>
                                <span>{lesson.steps.length} steps</span>
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

      <div className="p-3 border-t border-border mono text-[10px] text-muted-foreground/70 leading-relaxed">
        <div>space to play · ← → to step</div>
        <div>switch lessons from the sidebar without touching playback</div>
      </div>
    </aside>
  );
}
