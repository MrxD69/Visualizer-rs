import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PanelProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  accent?: string;
  children: ReactNode;
  empty?: boolean;
  emptyHint?: string;
  className?: string;
}

export function Panel({ title, subtitle, icon, accent, children, empty, emptyHint, className }: PanelProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`bg-card/30 rounded-2xl flex flex-col overflow-hidden border border-border/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300 ${className ?? ""}`}
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/20">
        {icon && (
          <div
            className="p-1.5 rounded-lg flex items-center justify-center transition-transform hover:rotate-6"
            style={{
              background: accent ? `color-mix(in oklab, ${accent} 10%, transparent)` : undefined,
              color: accent ?? "var(--foreground)",
            }}
          >
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-0.5">
          <span className="text-[12px] font-bold uppercase tracking-widest text-foreground/80">{title}</span>
          {subtitle && <span className="text-[10px] text-muted-foreground/50 mono font-medium">{subtitle}</span>}
        </div>
        {accent && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[9px] mono text-muted-foreground/30 font-bold">ACTIVE</span>
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
            />
          </div>
        )}
      </div>
      <div className="flex-1 p-5 relative min-h-[60px]">
        {empty ? (
          <div className="absolute inset-0 flex items-center justify-center text-[11px] text-muted-foreground/60 mono">
            {emptyHint ?? "— idle —"}
          </div>
        ) : (
          children
        )}
      </div>
    </motion.div>
  );
}
