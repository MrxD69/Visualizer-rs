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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      className={`glass rounded-xl flex flex-col overflow-hidden ${className ?? ""}`}
    >
      <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-border">
        {icon && (
          <span
            className="w-5 h-5 rounded-md flex items-center justify-center text-[11px]"
            style={{
              background: accent ? `color-mix(in oklab, ${accent} 20%, transparent)` : undefined,
              color: accent ?? "var(--foreground)",
            }}
          >
            {icon}
          </span>
        )}
        <div className="flex flex-col leading-none">
          <span className="panel-title">{title}</span>
          {subtitle && <span className="text-[10px] text-muted-foreground/70 mono mt-1">{subtitle}</span>}
        </div>
        {accent && (
          <span
            className="ml-auto w-1.5 h-1.5 rounded-full"
            style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
          />
        )}
      </div>
      <div className="flex-1 p-3.5 relative">
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
