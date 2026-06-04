import { Play, Pause, SkipBack, SkipForward, RotateCcw, Gauge } from "lucide-react";
import type { LessonPlayer } from "@/hooks/useLessonPlayer";

export function Controls({ player, accent }: { player: LessonPlayer; accent: string }) {
  const { playing, play, pause, next, prev, restart, stepIndex, totalSteps, speed, setSpeed, goto } = player;
  const pct = ((stepIndex) / Math.max(1, totalSteps - 1)) * 100;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 glass rounded-lg p-1">
        <IconBtn onClick={restart} title="Restart (R)"><RotateCcw size={14} /></IconBtn>
        <IconBtn onClick={prev} title="Previous (←)" disabled={stepIndex === 0}>
          <SkipBack size={14} />
        </IconBtn>
        <button
          onClick={playing ? pause : play}
          title={playing ? "Pause (Space)" : "Play (Space)"}
          className="h-7 px-3 rounded-md flex items-center gap-1.5 mono text-[11px] font-medium transition-colors"
          style={{
            background: `color-mix(in oklab, ${accent} 22%, transparent)`,
            color: accent,
            border: `1px solid color-mix(in oklab, ${accent} 45%, transparent)`,
          }}
        >
          {playing ? <Pause size={12} /> : <Play size={12} />}
          {playing ? "pause" : "play"}
        </button>
        <IconBtn onClick={next} title="Next (→)" disabled={stepIndex >= totalSteps - 1}>
          <SkipForward size={14} />
        </IconBtn>
      </div>

      {/* Step pips */}
      <div className="hidden md:flex items-center gap-1 px-2 glass rounded-lg h-9">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <button
            key={i}
            onClick={() => goto(i)}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === stepIndex ? 18 : 8,
              background: i <= stepIndex ? accent : "var(--surface-3)",
              opacity: i <= stepIndex ? 1 : 0.7,
            }}
          />
        ))}
      </div>

      <div className="flex md:hidden items-center gap-2 glass rounded-lg px-3 h-9 mono text-[11px] text-muted-foreground min-w-[80px]">
        <div className="flex-1 h-1 rounded-full bg-[var(--surface-3)] overflow-hidden">
          <div className="h-full transition-all" style={{ width: `${pct}%`, background: accent }} />
        </div>
        {stepIndex + 1}/{totalSteps}
      </div>

      <div className="hidden sm:flex items-center gap-1 glass rounded-lg px-2 h-9">
        <Gauge size={12} className="text-muted-foreground" />
        {[0.5, 1, 1.5, 2].map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className="px-1.5 h-6 rounded mono text-[11px] transition-colors"
            style={{
              color: speed === s ? accent : "var(--muted-foreground)",
              background: speed === s ? `color-mix(in oklab, ${accent} 18%, transparent)` : "transparent",
            }}
          >
            {s}×
          </button>
        ))}
      </div>
    </div>
  );
}

function IconBtn({ children, onClick, disabled, title }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; title?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[var(--surface-3)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}
