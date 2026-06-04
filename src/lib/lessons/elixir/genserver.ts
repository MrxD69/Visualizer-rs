import type { Lesson } from "../types";

const code = `defmodule Counter do
  use GenServer

  def start_link(n), do: GenServer.start_link(__MODULE__, n)
  def inc(pid),      do: GenServer.call(pid, :inc)
  def get(pid),      do: GenServer.call(pid, :get)

  def init(n),                  do: {:ok, n}
  def handle_call(:inc, _, n),  do: {:reply, n + 1, n + 1}
  def handle_call(:get, _, n),  do: {:reply, n, n}
end

{:ok, pid} = Counter.start_link(0)
Counter.inc(pid)
Counter.inc(pid)
Counter.get(pid)`;

export const genserver: Lesson = {
  id: "elixir-genserver",
  language: "elixir",
  topic: "OTP",
  title: "GenServer Lifecycle",
  subtitle: "A long-running process with state, callbacks, and a synchronous call API.",
  difficulty: "Core",
  code,
  panels: ["processes", "genserver", "mailbox"],
  steps: [
    {
      title: "start_link → init",
      lines: [15],
      explanation: "GenServer spawns the process and runs `init(0)`. The return `{:ok, 0}` becomes the **initial state**.",
      snapshot: {
        processes: [
          { id: "cl", name: "caller", state: "running", role: "user" },
          { id: "gs", name: "Counter", state: "waiting", role: "genserver" },
        ],
        genserver: { pid: "gs", module: "Counter", state: { value: 0 } },
      },
    },
    {
      title: "call :inc — caller blocks",
      lines: [16, 5],
      explanation: "`GenServer.call` sends a request and **waits** for a reply. Caller is suspended.",
      snapshot: {
        processes: [
          { id: "cl", name: "caller", state: "waiting", role: "user" },
          { id: "gs", name: "Counter", state: "running", role: "genserver" },
        ],
        messages: [{ id: "c1", from: "cl", to: "gs", content: ":inc", phase: "in-mailbox" }],
        genserver: {
          pid: "gs", module: "Counter", state: { value: 0 },
          callQueue: [{ id: "c1", label: ":inc" }],
        },
      },
    },
    {
      title: "handle_call runs",
      lines: [10],
      explanation: "Callback returns `{:reply, 1, 1}` — first element is the reply sent back, second is the **new state**.",
      snapshot: {
        processes: [
          { id: "cl", name: "caller", state: "running", role: "user" },
          { id: "gs", name: "Counter", state: "waiting", role: "genserver" },
        ],
        genserver: { pid: "gs", module: "Counter", state: { value: 1 }, lastReply: "1" },
      },
    },
    {
      title: "Second :inc",
      lines: [17, 10],
      explanation: "State threads through. Each call sees the result of the previous one.",
      snapshot: {
        processes: [
          { id: "cl", name: "caller", state: "running", role: "user" },
          { id: "gs", name: "Counter", state: "waiting", role: "genserver" },
        ],
        genserver: { pid: "gs", module: "Counter", state: { value: 2 }, lastReply: "2" },
      },
    },
    {
      title: ":get — read-only",
      lines: [18, 11],
      explanation: "`:get` returns state without mutating it. Replies `2`.",
      snapshot: {
        processes: [
          { id: "cl", name: "caller", state: "running", role: "user" },
          { id: "gs", name: "Counter", state: "waiting", role: "genserver" },
        ],
        genserver: { pid: "gs", module: "Counter", state: { value: 2 }, lastReply: "2" },
      },
    },
  ],
};
