import type { Lesson } from "../types";

const code = `parent = self()

child = spawn(fn ->
  IO.puts("child running")
end)

IO.puts("parent continues")`;

export const processes: Lesson = {
  id: "elixir-processes",
  language: "elixir",
  topic: "Concurrency",
  title: "Lightweight Processes",
  subtitle: "Every Elixir process is isolated, cheap, and scheduled by the BEAM.",
  difficulty: "Intro",
  code,
  panels: ["processes", "scheduler"],
  steps: [
    {
      title: "Parent shell",
      lines: [1],
      explanation: "We're inside an IEx-like process. `self()` returns its pid.",
      snapshot: {
        processes: [{ id: "p", name: "parent", state: "running", role: "user" }],
        scheduler: { cores: [{ id: "s1", running: "p", queue: [] }, { id: "s2", queue: [] }] },
      },
    },
    {
      title: "spawn — process appears",
      lines: [3, 4, 5],
      explanation: "`spawn/1` creates a **brand new BEAM process** with its own heap and mailbox. Setup cost: microseconds.",
      snapshot: {
        processes: [
          { id: "p", name: "parent", state: "running", role: "user" },
          { id: "c", name: "child", state: "ready", role: "worker", parent: "p" },
        ],
        scheduler: { cores: [{ id: "s1", running: "p", queue: [] }, { id: "s2", queue: ["c"] }] },
      },
    },
    {
      title: "Scheduler picks child",
      lines: [4],
      explanation: "A scheduler pulls `child` from its run queue and runs it on another core. Truly parallel.",
      snapshot: {
        processes: [
          { id: "p", name: "parent", state: "running", role: "user" },
          { id: "c", name: "child", state: "running", role: "worker", parent: "p" },
        ],
        scheduler: { cores: [{ id: "s1", running: "p", queue: [] }, { id: "s2", running: "c", queue: [] }] },
      },
    },
    {
      title: "Child finishes",
      lines: [4],
      explanation: "Child prints, returns, and **exits normally**. Its heap is reclaimed immediately. Parent is unaffected — isolation.",
      snapshot: {
        processes: [
          { id: "p", name: "parent", state: "running", role: "user" },
          { id: "c", name: "child", state: "exited", role: "worker", parent: "p" },
        ],
        scheduler: { cores: [{ id: "s1", running: "p", queue: [] }, { id: "s2", queue: [] }] },
      },
    },
    {
      title: "Parent continues",
      lines: [7],
      explanation: "Parent never blocked. `spawn` returns immediately with the new pid.",
      snapshot: {
        processes: [
          { id: "p", name: "parent", state: "running", role: "user" },
          { id: "c", name: "child", state: "exited", role: "worker", parent: "p" },
        ],
        scheduler: { cores: [{ id: "s1", running: "p", queue: [] }, { id: "s2", queue: [] }] },
      },
    },
  ],
};
