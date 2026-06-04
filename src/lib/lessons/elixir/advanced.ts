import type { Lesson } from "../types";

export const elixirAdvancedLessons: Lesson[] = [
  {
    id: "elixir-supervision-tree",
    language: "elixir",
    topic: "OTP",
    title: "Process Supervision Trees",
    subtitle: "Failures propagate differently across multi-level supervisors than they do in flat examples.",
    difficulty: "Advanced",
    code: `children = [
  {RootSup, []},
  {Worker, :api},
  {Worker, :db}
]

Supervisor.start_link(children, strategy: :rest_for_one)
# later: api worker crashes`,
    panels: ["processes"],
    resources: [
      { label: "Supervisor docs", url: "https://hexdocs.pm/elixir/1.15.7/Supervisor.html", note: "Restart strategies such as `:one_for_one`, `:one_for_all`, and `:rest_for_one`." },
      { label: "GenServer docs", url: "https://hexdocs.pm/elixir/GenServer.html", note: "Most long-lived workers end up supervised through this interface." },
    ],
    steps: [
      {
        title: "Root supervisor starts",
        lines: [1, 7],
        explanation: "The supervision tree begins with a root supervisor responsible for keeping lower layers alive.",
        snapshot: {
          processes: [{ id: "root", name: "RootSup", state: "running", role: "supervisor" }],
        },
      },
      {
        title: "Child supervisor and workers",
        lines: [1, 2, 3],
        explanation: "A real system often has **supervisors supervising supervisors**, not just a single parent over a few workers.",
        snapshot: {
          processes: [
            { id: "root", name: "RootSup", state: "running", role: "supervisor" },
            { id: "svc", name: "ServiceSup", state: "running", role: "supervisor", parent: "root", link: ["root"] },
            { id: "api", name: "Worker :api", state: "running", role: "worker", parent: "svc", link: ["svc"] },
            { id: "db", name: "Worker :db", state: "running", role: "worker", parent: "svc", link: ["svc"] },
          ],
        },
      },
      {
        title: "Crash propagates upward",
        lines: [8],
        explanation: "When `:api` dies abnormally, its immediate supervisor sees the failure. The root does not restart everything blindly.",
        snapshot: {
          processes: [
            { id: "root", name: "RootSup", state: "running", role: "supervisor" },
            { id: "svc", name: "ServiceSup", state: "running", role: "supervisor", parent: "root", link: ["root"] },
            { id: "api", name: "Worker :api", state: "crashed", role: "worker", parent: "svc" },
            { id: "db", name: "Worker :db", state: "running", role: "worker", parent: "svc", link: ["svc"] },
          ],
        },
      },
      {
        title: "Scoped recovery",
        lines: [7, 8],
        explanation: "Only the affected supervision subtree is healed. This is what lets OTP contain failures instead of turning them into global outages.",
        snapshot: {
          processes: [
            { id: "root", name: "RootSup", state: "running", role: "supervisor" },
            { id: "svc", name: "ServiceSup", state: "running", role: "supervisor", parent: "root", link: ["root"] },
            { id: "api2", name: "Worker :api (restarted)", state: "running", role: "worker", parent: "svc", link: ["svc"] },
            { id: "db", name: "Worker :db", state: "running", role: "worker", parent: "svc", link: ["svc"] },
          ],
        },
      },
    ],
  },
  {
    id: "elixir-mailbox-overflow",
    language: "elixir",
    topic: "Concurrency",
    title: "Mailbox Overflow & Backpressure",
    subtitle: "A process that cannot keep up accumulates messages whether or not the system is memory-safe.",
    difficulty: "Advanced",
    code: `consumer = spawn(fn ->
  receive do
    {:work, item} ->
      Process.sleep(100)
      item
  end
end)

for i <- 1..5, do: send(consumer, {:work, i})`,
    panels: ["processes", "mailbox", "scheduler"],
    resources: [
      { label: "Process docs", url: "https://hexdocs.pm/elixir/1.13.4/Process.html", note: "Low-level process tools, message sending, and monitoring helpers." },
      { label: "Erlang process efficiency guide", url: "https://www.erlang.org/doc/system/eff_guide_processes.html", note: "How processes and scheduler behavior work under load." },
    ],
    steps: [
      {
        title: "Slow consumer waits",
        lines: [1, 2, 3, 4, 5, 6],
        explanation: "The consumer is alive, but each unit of work takes time. Throughput is limited by how fast the mailbox is drained.",
        snapshot: {
          processes: [
            { id: "prod", name: "producer", state: "running", role: "user" },
            { id: "cons", name: "consumer", state: "waiting", role: "worker", parent: "prod" },
          ],
          scheduler: { cores: [{ id: "s1", running: "prod", queue: [] }, { id: "s2", queue: [] }] },
        },
      },
      {
        title: "Burst of messages",
        lines: [8],
        explanation: "The producer can enqueue work much faster than the consumer can process it.",
        snapshot: {
          processes: [
            { id: "prod", name: "producer", state: "running", role: "user" },
            { id: "cons", name: "consumer", state: "ready", role: "worker", parent: "prod" },
          ],
          messages: [
            { id: "w1", from: "prod", to: "cons", content: "{:work, 1}", phase: "in-mailbox" },
            { id: "w2", from: "prod", to: "cons", content: "{:work, 2}", phase: "in-mailbox" },
            { id: "w3", from: "prod", to: "cons", content: "{:work, 3}", phase: "in-mailbox" },
            { id: "w4", from: "prod", to: "cons", content: "{:work, 4}", phase: "in-mailbox" },
            { id: "w5", from: "prod", to: "cons", content: "{:work, 5}", phase: "in-mailbox" },
          ],
          scheduler: { cores: [{ id: "s1", running: "prod", queue: [] }, { id: "s2", queue: ["cons"] }] },
        },
      },
      {
        title: "Backlog forms",
        lines: [4],
        explanation: "The consumer is running, but the mailbox still keeps growing. This is **backpressure**: work arrives faster than it leaves.",
        snapshot: {
          processes: [
            { id: "prod", name: "producer", state: "running", role: "user" },
            { id: "cons", name: "consumer", state: "running", role: "worker", parent: "prod" },
          ],
          messages: [
            { id: "w1", from: "prod", to: "cons", content: "{:work, 1}", phase: "consumed" },
            { id: "w2", from: "prod", to: "cons", content: "{:work, 2}", phase: "in-mailbox" },
            { id: "w3", from: "prod", to: "cons", content: "{:work, 3}", phase: "in-mailbox" },
            { id: "w4", from: "prod", to: "cons", content: "{:work, 4}", phase: "in-mailbox" },
            { id: "w5", from: "prod", to: "cons", content: "{:work, 5}", phase: "in-mailbox" },
          ],
          scheduler: { cores: [{ id: "s1", running: "prod", queue: [] }, { id: "s2", running: "cons", queue: [] }] },
        },
      },
      {
        title: "Need flow control",
        lines: [8],
        explanation: "Isolation prevents shared-memory corruption, but it does **not** solve overload. You still need demand control, batching, or drops.",
        snapshot: {
          processes: [
            { id: "prod", name: "producer", state: "running", role: "user" },
            { id: "cons", name: "consumer", state: "running", role: "worker", parent: "prod" },
          ],
          messages: [
            { id: "w1", from: "prod", to: "cons", content: "{:work, 1}", phase: "consumed" },
            { id: "w2", from: "prod", to: "cons", content: "{:work, 2}", phase: "consumed" },
            { id: "w3", from: "prod", to: "cons", content: "{:work, 3}", phase: "in-mailbox" },
            { id: "w4", from: "prod", to: "cons", content: "{:work, 4}", phase: "in-mailbox" },
            { id: "w5", from: "prod", to: "cons", content: "{:work, 5}", phase: "in-mailbox" },
          ],
          scheduler: { cores: [{ id: "s1", running: "prod", queue: [] }, { id: "s2", running: "cons", queue: [] }] },
        },
      },
    ],
  },
  {
    id: "elixir-message-ordering-races",
    language: "elixir",
    topic: "Concurrency",
    title: "Race Conditions in Message Ordering",
    subtitle: "Send order across different processes is not the same thing as arrival order at the receiver.",
    difficulty: "Advanced",
    code: `parent = self()

a = spawn(fn -> send(parent, {:from, :a}) end)
b = spawn(fn -> send(parent, {:from, :b}) end)

receive do
  msg -> msg
end`,
    panels: ["processes", "mailbox", "scheduler"],
    resources: [
      { label: "Process docs", url: "https://hexdocs.pm/elixir/1.13.4/Process.html", note: "Process creation and low-level message primitives." },
      { label: "ERTS run queue docs", url: "https://www.erlang.org/docs/24/man/erlang", note: "Run queues explain why timing can reorder arrivals." },
    ],
    steps: [
      {
        title: "Two senders spawned",
        lines: [3, 4],
        explanation: "Sender `a` and sender `b` are independent processes racing to reach the parent mailbox.",
        snapshot: {
          processes: [
            { id: "p", name: "parent", state: "waiting", role: "user" },
            { id: "a", name: "sender :a", state: "ready", role: "worker", parent: "p" },
            { id: "b", name: "sender :b", state: "ready", role: "worker", parent: "p" },
          ],
          scheduler: { cores: [{ id: "s1", queue: ["a"] }, { id: "s2", queue: ["b"] }] },
        },
      },
      {
        title: "Messages in flight",
        lines: [3, 4],
        explanation: "Both messages are on the move, but there is no global ordering guarantee between different senders.",
        snapshot: {
          processes: [
            { id: "p", name: "parent", state: "waiting", role: "user" },
            { id: "a", name: "sender :a", state: "running", role: "worker", parent: "p" },
            { id: "b", name: "sender :b", state: "running", role: "worker", parent: "p" },
          ],
          messages: [
            { id: "ma", from: "a", to: "p", content: "{:from, :a}", phase: "in-flight" },
            { id: "mb", from: "b", to: "p", content: "{:from, :b}", phase: "in-flight" },
          ],
          scheduler: { cores: [{ id: "s1", running: "a", queue: [] }, { id: "s2", running: "b", queue: [] }] },
        },
      },
      {
        title: "b arrives first",
        lines: [6],
        explanation: "Even if `a` spawned first, `b` can still win the race and land earlier in the mailbox.",
        snapshot: {
          processes: [
            { id: "p", name: "parent", state: "ready", role: "user" },
            { id: "a", name: "sender :a", state: "running", role: "worker", parent: "p" },
            { id: "b", name: "sender :b", state: "exited", role: "worker", parent: "p" },
          ],
          messages: [
            { id: "mb", from: "b", to: "p", content: "{:from, :b}", phase: "in-mailbox" },
            { id: "ma", from: "a", to: "p", content: "{:from, :a}", phase: "in-flight" },
          ],
          scheduler: { cores: [{ id: "s1", running: "a", queue: [] }, { id: "s2", queue: [] }] },
        },
      },
      {
        title: "Mailbox reflects arrival order",
        lines: [6],
        explanation: "Per-sender order is preserved, but cross-sender order depends on runtime timing. Your protocol must tolerate that.",
        snapshot: {
          processes: [
            { id: "p", name: "parent", state: "ready", role: "user" },
            { id: "a", name: "sender :a", state: "exited", role: "worker", parent: "p" },
            { id: "b", name: "sender :b", state: "exited", role: "worker", parent: "p" },
          ],
          messages: [
            { id: "mb", from: "b", to: "p", content: "{:from, :b}", phase: "in-mailbox" },
            { id: "ma", from: "a", to: "p", content: "{:from, :a}", phase: "in-mailbox" },
          ],
        },
      },
    ],
  },
  {
    id: "elixir-linking-vs-monitoring",
    language: "elixir",
    topic: "Failure Model",
    title: "Process Linking vs Monitoring",
    subtitle: "Links share failure; monitors observe it without joining the crash.",
    difficulty: "Advanced",
    code: `worker = spawn(fn -> raise "boom" end)
Process.link(worker)
ref = Process.monitor(worker)

receive do
  msg -> msg
end`,
    panels: ["processes", "mailbox"],
    resources: [
      { label: "Process docs", url: "https://hexdocs.pm/elixir/1.13.4/Process.html", note: "Read `link/1`, `monitor/1`, and `spawn_monitor/1` together." },
      { label: "GenServer docs: Monitors or links?", url: "https://hexdocs.pm/elixir/GenServer.html", note: "Practical guidance for choosing each mechanism." },
    ],
    steps: [
      {
        title: "Create both relationships",
        lines: [1, 2, 3],
        explanation: "The caller both links to and monitors the worker. These two relationships behave very differently when failure hits.",
        snapshot: {
          processes: [
            { id: "caller", name: "caller", state: "running", role: "user" },
            { id: "worker", name: "worker", state: "running", role: "worker", parent: "caller", link: ["caller"] },
          ],
        },
      },
      {
        title: "Worker crashes",
        lines: [1],
        explanation: "The worker dies abnormally. A **link** propagates an exit signal; a **monitor** emits a `:DOWN` message.",
        snapshot: {
          processes: [
            { id: "caller", name: "caller", state: "running", role: "user" },
            { id: "worker", name: "worker", state: "crashed", role: "worker", parent: "caller" },
          ],
          messages: [
            { id: "down", from: "worker", to: "caller", content: "{:DOWN, ref, :process, pid, :boom}", phase: "in-mailbox" },
          ],
        },
      },
      {
        title: "Linked caller would also die",
        lines: [2],
        explanation: "If the caller is not trapping exits, the link means it is now in the failure path too.",
        snapshot: {
          processes: [
            { id: "caller", name: "caller", state: "crashed", role: "user" },
            { id: "worker", name: "worker", state: "crashed", role: "worker", parent: "caller" },
          ],
          messages: [
            { id: "down", from: "worker", to: "caller", content: "{:DOWN, ref, :process, pid, :boom}", phase: "consumed" },
          ],
        },
      },
      {
        title: "Monitor-only pattern",
        lines: [3, 5],
        explanation: "If you remove the link and keep only the monitor, the observer survives and can react explicitly to the crash.",
        snapshot: {
          processes: [
            { id: "observer", name: "observer", state: "running", role: "user" },
            { id: "worker2", name: "worker", state: "crashed", role: "worker", parent: "observer" },
          ],
          messages: [
            { id: "down2", from: "worker2", to: "observer", content: "{:DOWN, ref, :process, pid, :boom}", phase: "in-mailbox" },
          ],
        },
      },
    ],
  },
  {
    id: "elixir-genserver-concurrency-pressure",
    language: "elixir",
    topic: "OTP",
    title: "Stateful GenServer Under Concurrency Pressure",
    subtitle: "Many callers can queue up, but a single GenServer still serializes all state transitions.",
    difficulty: "Advanced",
    code: `defmodule Counter do
  use GenServer

  def handle_call(:inc, _from, n) do
    Process.sleep(50)
    {:reply, n + 1, n + 1}
  end
end`,
    panels: ["processes", "genserver", "mailbox"],
    resources: [
      { label: "GenServer docs", url: "https://hexdocs.pm/elixir/GenServer.html", note: "Calls are serialized through one server mailbox." },
      { label: "Supervisor docs", url: "https://hexdocs.pm/elixir/1.15.7/Supervisor.html", note: "Where long-lived servers usually live in production." },
    ],
    steps: [
      {
        title: "Server starts with state 0",
        lines: [1, 2],
        explanation: "The GenServer is single-threaded from the perspective of its internal state machine.",
        snapshot: {
          processes: [
            { id: "client1", name: "client 1", state: "running", role: "user" },
            { id: "client2", name: "client 2", state: "running", role: "user" },
            { id: "gs", name: "Counter", state: "waiting", role: "genserver" },
          ],
          genserver: { pid: "gs", module: "Counter", state: { value: 0 } },
        },
      },
      {
        title: "Concurrent calls queue up",
        lines: [4],
        explanation: "Two callers can issue requests concurrently, but the GenServer still handles them one at a time.",
        snapshot: {
          processes: [
            { id: "client1", name: "client 1", state: "waiting", role: "user" },
            { id: "client2", name: "client 2", state: "waiting", role: "user" },
            { id: "gs", name: "Counter", state: "running", role: "genserver" },
          ],
          messages: [
            { id: "c1", from: "client1", to: "gs", content: ":inc", phase: "in-mailbox" },
            { id: "c2", from: "client2", to: "gs", content: ":inc", phase: "in-mailbox" },
          ],
          genserver: { pid: "gs", module: "Counter", state: { value: 0 }, callQueue: [{ id: "c1", label: ":inc" }, { id: "c2", label: ":inc" }] },
        },
      },
      {
        title: "First increment commits",
        lines: [6],
        explanation: "The first call completes and updates the state to `1`. The second call still waits; no race occurred inside the server.",
        snapshot: {
          processes: [
            { id: "client1", name: "client 1", state: "running", role: "user" },
            { id: "client2", name: "client 2", state: "waiting", role: "user" },
            { id: "gs", name: "Counter", state: "running", role: "genserver" },
          ],
          messages: [
            { id: "c2", from: "client2", to: "gs", content: ":inc", phase: "in-mailbox" },
          ],
          genserver: { pid: "gs", module: "Counter", state: { value: 1 }, callQueue: [{ id: "c2", label: ":inc" }], lastReply: "1" },
        },
      },
      {
        title: "Second increment sees fresh state",
        lines: [6],
        explanation: "The second caller runs against the **updated** state and produces `2`. Serialization is the consistency mechanism here.",
        snapshot: {
          processes: [
            { id: "client1", name: "client 1", state: "running", role: "user" },
            { id: "client2", name: "client 2", state: "running", role: "user" },
            { id: "gs", name: "Counter", state: "waiting", role: "genserver" },
          ],
          genserver: { pid: "gs", module: "Counter", state: { value: 2 }, lastReply: "2" },
        },
      },
    ],
  },
  {
    id: "elixir-hot-code-swapping",
    language: "elixir",
    topic: "Runtime",
    title: "Hot Code Swapping Basics",
    subtitle: "The BEAM can run old and current code side by side while processes transition forward.",
    difficulty: "Advanced",
    code: `defmodule Counter do
  def loop(state) do
    receive do
      :code_switch -> Counter.loop(state)
      {:inc, from} -> send(from, state + 1); loop(state + 1)
    end
  end
end`,
    panels: ["processes", "genserver"],
    resources: [
      { label: "Erlang code loading docs", url: "https://erlang.org/documentation/doc-15.0-rc3/doc/system/code_loading.html", note: "Current code, old code, and process migration to new code." },
      { label: "Erlang reference manual", url: "https://www.erlang.org/doc/system/reference_manual.html", note: "Broader runtime context for code management on the BEAM." },
    ],
    steps: [
      {
        title: "Process runs version 1",
        lines: [1, 2],
        explanation: "The process starts life in the currently loaded module implementation.",
        snapshot: {
          processes: [{ id: "gs", name: "Counter loop", state: "running", role: "genserver" }],
          genserver: { pid: "gs", module: "Counter@v1", state: { value: 1 } },
        },
      },
      {
        title: "Load version 2",
        lines: [1],
        explanation: "Loading a new module version makes the old one **old code** and the new one **current code**.",
        snapshot: {
          processes: [{ id: "gs", name: "Counter loop", state: "running", role: "genserver" }],
          genserver: { pid: "gs", module: "Counter@v1 (old) / Counter@v2 (current)", state: { value: 1 } },
        },
      },
      {
        title: "Process still runs old code",
        lines: [4],
        explanation: "A long-lived process does not switch magically. It keeps executing the old code path until it makes a fully qualified jump.",
        snapshot: {
          processes: [{ id: "gs", name: "Counter loop", state: "running", role: "genserver" }],
          genserver: { pid: "gs", module: "Counter@v1", state: { value: 1 }, callQueue: [{ id: "sw", label: ":code_switch" }] },
        },
      },
      {
        title: "Code switch to v2",
        lines: [4],
        explanation: "After the explicit `Counter.loop(state)` jump, the process is now executing the **current** version while keeping its runtime state.",
        snapshot: {
          processes: [{ id: "gs", name: "Counter loop", state: "running", role: "genserver" }],
          genserver: { pid: "gs", module: "Counter@v2", state: { value: 1 }, lastReply: "state preserved across upgrade" },
        },
      },
    ],
  },
  {
    id: "elixir-beam-scheduler-contention",
    language: "elixir",
    topic: "Runtime",
    title: "BEAM Scheduler Contention",
    subtitle: "Lightweight processes still compete for finite scheduler time under heavy CPU load.",
    difficulty: "Advanced",
    code: `for i <- 1..6 do
  spawn(fn ->
    Enum.reduce(1..10_000_000, 0, &+/2)
  end)
end`,
    panels: ["processes", "scheduler"],
    resources: [
      { label: "Erlang process efficiency guide", url: "https://www.erlang.org/doc/system/eff_guide_processes.html", note: "How many processes the runtime can sustain and why." },
      { label: "Erlang scheduler info", url: "https://www.erlang.org/docs/24/man/scheduler.html", note: "Measuring scheduler behavior and wall time." },
      { label: "ERTS run queue docs", url: "https://www.erlang.org/docs/24/man/erlang", note: "Look at run queue length statistics under load." },
    ],
    steps: [
      {
        title: "Many CPU-heavy workers",
        lines: [1, 2, 3, 4],
        explanation: "The workers are cheap to spawn, but they still need actual scheduler time to run.",
        snapshot: {
          processes: [
            { id: "p1", name: "worker 1", state: "ready", role: "worker" },
            { id: "p2", name: "worker 2", state: "ready", role: "worker" },
            { id: "p3", name: "worker 3", state: "ready", role: "worker" },
            { id: "p4", name: "worker 4", state: "ready", role: "worker" },
            { id: "p5", name: "worker 5", state: "ready", role: "worker" },
            { id: "p6", name: "worker 6", state: "ready", role: "worker" },
          ],
          scheduler: { cores: [{ id: "s1", queue: ["p1", "p3", "p5"] }, { id: "s2", queue: ["p2", "p4", "p6"] }] },
        },
      },
      {
        title: "Run queues fill up",
        lines: [2],
        explanation: "Only a subset can run at once. The rest wait in run queues competing for reductions.",
        snapshot: {
          processes: [
            { id: "p1", name: "worker 1", state: "running", role: "worker" },
            { id: "p2", name: "worker 2", state: "running", role: "worker" },
            { id: "p3", name: "worker 3", state: "ready", role: "worker" },
            { id: "p4", name: "worker 4", state: "ready", role: "worker" },
            { id: "p5", name: "worker 5", state: "ready", role: "worker" },
            { id: "p6", name: "worker 6", state: "ready", role: "worker" },
          ],
          scheduler: { cores: [{ id: "s1", running: "p1", queue: ["p3", "p5"] }, { id: "s2", running: "p2", queue: ["p4", "p6"] }] },
        },
      },
      {
        title: "Interactive work can starve",
        lines: [1],
        explanation: "A latency-sensitive task entering the system now must wait behind heavy CPU work unless you architect around it.",
        snapshot: {
          processes: [
            { id: "ui", name: "interactive request", state: "ready", role: "user" },
            { id: "p1", name: "worker 1", state: "running", role: "worker" },
            { id: "p2", name: "worker 2", state: "running", role: "worker" },
            { id: "p3", name: "worker 3", state: "ready", role: "worker" },
            { id: "p4", name: "worker 4", state: "ready", role: "worker" },
            { id: "p5", name: "worker 5", state: "ready", role: "worker" },
            { id: "p6", name: "worker 6", state: "ready", role: "worker" },
          ],
          scheduler: { cores: [{ id: "s1", running: "p1", queue: ["p3", "p5", "ui"] }, { id: "s2", running: "p2", queue: ["p4", "p6"] }] },
        },
      },
      {
        title: "Fairness, not magic",
        lines: [2],
        explanation: "The BEAM works hard to share CPU fairly, but under enough load you still need capacity planning and work shaping.",
        snapshot: {
          processes: [
            { id: "ui", name: "interactive request", state: "running", role: "user" },
            { id: "p1", name: "worker 1", state: "ready", role: "worker" },
            { id: "p2", name: "worker 2", state: "running", role: "worker" },
            { id: "p3", name: "worker 3", state: "ready", role: "worker" },
            { id: "p4", name: "worker 4", state: "ready", role: "worker" },
            { id: "p5", name: "worker 5", state: "ready", role: "worker" },
            { id: "p6", name: "worker 6", state: "ready", role: "worker" },
          ],
          scheduler: { cores: [{ id: "s1", running: "ui", queue: ["p3", "p5", "p1"] }, { id: "s2", running: "p2", queue: ["p4", "p6"] }] },
        },
      },
    ],
  },
  {
    id: "elixir-distributed-node-failure",
    language: "elixir",
    topic: "Distributed Systems",
    title: "Distributed Node Failure Simulation",
    subtitle: "When a node disappears, messages, monitors, and remote processes all change state at once.",
    difficulty: "Advanced",
    code: `Node.connect(:"worker@10.0.0.2")
ref = Process.monitor({:remote_job, :"worker@10.0.0.2"})
send({:remote_job, :"worker@10.0.0.2"}, :work)
# later: network partition`,
    panels: ["processes", "mailbox"],
    resources: [
      { label: "Distributed Erlang docs", url: "https://www.erlang.org/docs/29/system/distributed.html", note: "Node connections, monitors, and `nodedown` behavior." },
      { label: "Process docs", url: "https://hexdocs.pm/elixir/1.13.4/Process.html", note: "Monitoring and distributed process handles." },
    ],
    steps: [
      {
        title: "Remote worker connected",
        lines: [1, 2],
        explanation: "The local node sees a remote process on another BEAM node and begins monitoring it.",
        snapshot: {
          processes: [
            { id: "local", name: "local@10.0.0.1", state: "running", role: "user" },
            { id: "remote", name: "remote_job@worker", state: "running", role: "worker", parent: "local" },
          ],
        },
      },
      {
        title: "Work sent across the link",
        lines: [3],
        explanation: "Messages can cross nodes transparently while the connection is healthy.",
        snapshot: {
          processes: [
            { id: "local", name: "local@10.0.0.1", state: "running", role: "user" },
            { id: "remote", name: "remote_job@worker", state: "running", role: "worker", parent: "local" },
          ],
          messages: [
            { id: "net1", from: "local", to: "remote", content: ":work", phase: "in-flight" },
          ],
        },
      },
      {
        title: "Partition begins",
        lines: [4],
        explanation: "The node connection drops. In-flight communication is now suspect, and distributed liveness changes immediately.",
        snapshot: {
          processes: [
            { id: "local", name: "local@10.0.0.1", state: "running", role: "user" },
            { id: "remote", name: "remote_job@worker", state: "waiting", role: "worker", parent: "local" },
          ],
          messages: [
            { id: "net1", from: "local", to: "remote", content: ":work", phase: "in-flight" },
            { id: "ndown", from: "node", to: "local", content: "{:nodedown, :\"worker@10.0.0.2\"}", phase: "in-mailbox" },
          ],
        },
      },
      {
        title: "Remote process considered lost",
        lines: [4],
        explanation: "From the local node's perspective, the remote process is gone until connectivity returns. Your system must reconcile that uncertainty.",
        snapshot: {
          processes: [
            { id: "local", name: "local@10.0.0.1", state: "running", role: "user" },
            { id: "remote", name: "remote_job@worker", state: "exited", role: "worker", parent: "local" },
          ],
          messages: [
            { id: "ndown", from: "node", to: "local", content: "{:nodedown, :\"worker@10.0.0.2\"}", phase: "consumed" },
          ],
        },
      },
    ],
  },
];
