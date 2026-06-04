import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { lessons, lessonsByLanguage } from "@/lib/lessons";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visualize · Rust & Elixir Runtime" },
      { name: "description", content: "Interactive step-by-step simulations of Rust ownership, Elixir and Phoenix runtime behavior, transport systems, GenServers, channels, and cross-system concurrency tradeoffs." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex-1 overflow-auto">
      {/* Hero */}
      <section className="px-10 pt-16 pb-12 max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-6"
        >
          <span className="text-[10px] mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-widest">
            v0.1 · runtime simulator
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-semibold tracking-[-0.025em] leading-[1.05]"
        >
          See systems programming
          <br />
          <span style={{
            background: "linear-gradient(90deg, var(--rust), var(--elixir))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            execute, step by step.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mt-5 text-[15px] text-muted-foreground max-w-[640px] leading-relaxed"
        >
          Not docs. Not slides. A live runtime where Rust's stack, heap, borrow checker, and Elixir's processes,
          mailboxes, supervisors, Phoenix transport flows, and comparison lessons animate together as you press play.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-7 flex flex-wrap gap-2"
        >
          <Link
            to="/lesson/$id"
            params={{ id: "rust-ownership" }}
            className="px-4 h-10 inline-flex items-center gap-2 rounded-md text-[13px] font-medium transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, var(--rust), oklch(0.72 0.18 35))",
              color: "oklch(0.16 0.01 50)",
              boxShadow: "0 8px 30px -10px color-mix(in oklab, var(--rust) 60%, transparent)",
            }}
          >
            Start with Rust Ownership
            <ArrowUpRight size={14} />
          </Link>
          <Link
            to="/lesson/$id"
            params={{ id: "compare-shared-memory-vs-message-passing" }}
            className="px-4 h-10 inline-flex items-center gap-2 rounded-md text-[13px] font-medium glass hover:bg-[var(--surface-3)] transition-all"
          >
            Or: Compare the Models
          </Link>
          <Link
            to="/lesson/$id"
            params={{ id: "phoenix-channels-live-vehicle-tracking" }}
            className="px-4 h-10 inline-flex items-center gap-2 rounded-md text-[13px] font-medium glass hover:bg-[var(--surface-3)] transition-all"
          >
            Explore Phoenix Transport
          </Link>
        </motion.div>
      </section>

      {/* Catalog */}
      <section className="px-10 pb-20 max-w-[1100px] mx-auto">
        {(["rust", "elixir", "compare"] as const).map((lang, langIdx) => {
          const meta = lang === "rust"
            ? { color: "var(--rust)", label: "Rust", desc: "Memory & concurrency without GC." }
            : lang === "elixir"
              ? { color: "var(--elixir)", label: "Elixir", desc: "Actors on the BEAM." }
              : { color: "var(--info)", label: "Compare", desc: "Side-by-side concurrency and failure models." };
          const items = lessonsByLanguage(lang);
          return (
            <div key={lang} className="mt-10">
              <div className="flex items-end gap-3 mb-4">
                <div className="w-8 h-8 rounded-md flex items-center justify-center mono font-bold"
                     style={{ background: `color-mix(in oklab, ${meta.color} 22%, transparent)`, color: meta.color }}>
                  {meta.label[0]}
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">{meta.label}</h2>
                  <p className="text-[13px] text-muted-foreground">{meta.desc}</p>
                </div>
                <div className="ml-auto mono text-[11px] text-muted-foreground">
                  {items.length} lessons
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((l, i) => (
                  <motion.div
                    key={l.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.04 * i + 0.06 * langIdx }}
                  >
                    <Link
                      to="/lesson/$id"
                      params={{ id: l.id }}
                      className="block rounded-xl p-5 group transition-all relative border border-transparent hover:border-border hover:bg-muted/30 active:scale-[0.985]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="mono text-[10px] uppercase tracking-wider text-muted-foreground/60">{l.topic}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full border border-border/50 font-medium text-muted-foreground">{l.difficulty}</span>
                            <span className="ml-auto mono text-[10px] text-muted-foreground/40">{l.steps.length} steps</span>
                          </div>
                          <h3 className="text-[15px] font-bold tracking-tight mb-1">{l.title}</h3>
                          <p className="text-[13px] text-muted-foreground/80 leading-relaxed">{l.subtitle}</p>
                          <div className="mt-4 flex flex-wrap gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            {l.panels.map((p) => (
                              <span key={p} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground mono">{p}</span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-6 p-2 rounded-full bg-muted/50 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                          <ArrowUpRight size={14} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="mt-16 text-center mono text-[11px] text-muted-foreground">
          {lessons.length} lessons · 100+ planned · plugin-based panels
        </div>
      </section>
    </div>
  );
}
