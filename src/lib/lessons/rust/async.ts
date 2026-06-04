import type { Lesson } from "../types";

const code = `async fn fetch(id: u32) -> u32 {
    // simulate I/O
    id * 10
}

#[tokio::main]
async fn main() {
    let a = fetch(1);
    let b = fetch(2);
    let (x, y) = tokio::join!(a, b);
    println!("{x} {y}");
}`;

export const asyncAwait: Lesson = {
  id: "rust-async",
  language: "rust",
  topic: "Concurrency",
  title: "async / await with Tokio",
  subtitle: "Futures are state machines. The runtime polls them concurrently.",
  difficulty: "Advanced",
  code,
  panels: ["tasks", "scheduler"],
  steps: [
    {
      title: "Runtime boots",
      lines: [6, 7],
      explanation: "`#[tokio::main]` spins up a multi-threaded **executor** with worker cores.",
      snapshot: {
        scheduler: { cores: [
          { id: "w1", queue: [] },
          { id: "w2", queue: [] },
        ]},
        tasks: [],
      },
    },
    {
      title: "Create futures (lazy)",
      lines: [8, 9],
      explanation: "Calling an `async fn` **does not run it** — it returns a `Future`. Nothing executes yet.",
      snapshot: {
        scheduler: { cores: [{ id: "w1", queue: [] }, { id: "w2", queue: [] }] },
        tasks: [
          { id: "a", label: "fetch(1)", status: "pending" },
          { id: "b", label: "fetch(2)", status: "pending" },
        ],
      },
    },
    {
      title: "join! polls both",
      lines: [10],
      explanation: "`tokio::join!` polls `a` and `b` **concurrently** on the current task. The executor drives them forward.",
      snapshot: {
        scheduler: { cores: [
          { id: "w1", running: "a", queue: [] },
          { id: "w2", running: "b", queue: [] },
        ]},
        tasks: [
          { id: "a", label: "fetch(1)", status: "running" },
          { id: "b", label: "fetch(2)", status: "running" },
        ],
      },
    },
    {
      title: "Futures complete",
      lines: [10],
      explanation: "Both futures resolve. Their values are bound to `x` and `y`.",
      snapshot: {
        scheduler: { cores: [{ id: "w1", queue: [] }, { id: "w2", queue: [] }] },
        tasks: [
          { id: "a", label: "fetch(1) → 10", status: "done" },
          { id: "b", label: "fetch(2) → 20", status: "done" },
        ],
      },
    },
    {
      title: "Print result",
      lines: [11],
      explanation: "Output: `10 20`. The runtime shuts down once `main`'s future returns.",
      snapshot: {
        scheduler: { cores: [{ id: "w1", queue: [] }, { id: "w2", queue: [] }] },
        tasks: [
          { id: "a", label: "fetch(1) → 10", status: "done" },
          { id: "b", label: "fetch(2) → 20", status: "done" },
        ],
      },
    },
  ],
};
