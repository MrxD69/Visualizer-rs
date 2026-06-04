import type { Lesson } from "../types";

const code = `pid = spawn(fn ->
  receive do
    {:greet, name} -> IO.puts("hi #{name}")
    :stop -> :ok
  end
end)

send(pid, {:greet, "Ada"})
send(pid, :stop)`;

export const messages: Lesson = {
  id: "elixir-messages",
  language: "elixir",
  topic: "Concurrency",
  title: "Message Passing & Mailboxes",
  subtitle: "Processes never share memory — they communicate by copying messages.",
  difficulty: "Core",
  code,
  panels: ["processes", "mailbox"],
  steps: [
    {
      title: "Spawn the receiver",
      lines: [1, 2, 3, 4, 5, 6],
      explanation: "Child enters `receive` and **suspends** — it sleeps until a matching message arrives. Zero CPU cost.",
      snapshot: {
        processes: [
          { id: "p", name: "parent", state: "running", role: "user" },
          { id: "c", name: "child", state: "waiting", role: "worker", parent: "p" },
        ],
        messages: [],
      },
    },
    {
      title: "send #1 — in flight",
      lines: [8],
      explanation: "`send/2` **copies** the term and enqueues it. It's traveling toward the child's mailbox.",
      snapshot: {
        processes: [
          { id: "p", name: "parent", state: "running", role: "user" },
          { id: "c", name: "child", state: "waiting", role: "worker", parent: "p" },
        ],
        messages: [{ id: "m1", from: "p", to: "c", content: "{:greet, \"Ada\"}", phase: "in-flight" }],
      },
    },
    {
      title: "Mailbox receives it",
      lines: [8],
      explanation: "Message lands in the child's **mailbox** — a per-process FIFO queue.",
      snapshot: {
        processes: [
          { id: "p", name: "parent", state: "running", role: "user" },
          { id: "c", name: "child", state: "ready", role: "worker", parent: "p" },
        ],
        messages: [{ id: "m1", from: "p", to: "c", content: "{:greet, \"Ada\"}", phase: "in-mailbox" }],
      },
    },
    {
      title: "Pattern match & consume",
      lines: [3],
      explanation: "Child wakes, scans the mailbox, matches `{:greet, name}`, binds `name`, prints. Message removed.",
      snapshot: {
        processes: [
          { id: "p", name: "parent", state: "running", role: "user" },
          { id: "c", name: "child", state: "running", role: "worker", parent: "p" },
        ],
        messages: [{ id: "m1", from: "p", to: "c", content: "{:greet, \"Ada\"}", phase: "consumed" }],
      },
    },
    {
      title: "send :stop",
      lines: [9],
      explanation: "But — the function returned! There's no new `receive`. The next message lands in the mailbox of an **already-exited** process.",
      snapshot: {
        processes: [
          { id: "p", name: "parent", state: "running", role: "user" },
          { id: "c", name: "child", state: "exited", role: "worker", parent: "p" },
        ],
        messages: [
          { id: "m1", from: "p", to: "c", content: "{:greet, \"Ada\"}", phase: "consumed" },
          { id: "m2", from: "p", to: "c", content: ":stop", phase: "in-flight" },
        ],
      },
    },
    {
      title: "Silently dropped",
      lines: [9],
      explanation: "Elixir's `send` to a dead pid **does not error**. The message is simply discarded. Use links/monitors to detect failure.",
      snapshot: {
        processes: [
          { id: "p", name: "parent", state: "running", role: "user" },
          { id: "c", name: "child", state: "exited", role: "worker", parent: "p" },
        ],
        messages: [
          { id: "m1", from: "p", to: "c", content: "{:greet, \"Ada\"}", phase: "consumed" },
        ],
      },
    },
  ],
};
