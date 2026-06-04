import type { Lesson } from "../types";

export const compareLessons: Lesson[] = [
  {
    id: "compare-shared-memory-vs-message-passing",
    language: "compare",
    topic: "Comparative Systems",
    title: "Shared Memory vs Message Passing Under Load",
    subtitle: "Rust coordinates through ownership and locks; Elixir coordinates through queues and isolated processes.",
    difficulty: "Advanced",
    code: `RUST
let shared = Arc::new(Mutex::new(Vec::<Job>::new()));
let worker = tokio::spawn(async move {
    shared.lock().unwrap().push(job);
});

ELIXIR
worker = spawn(fn -> loop([]) end)
send(worker, {:job, job})`,
    panels: ["heap", "tasks", "processes", "mailbox", "scheduler"],
    resources: [
      { label: "Rust shared-state concurrency", url: "https://doc.rust-lang.org/book/ch16-03-shared-state.html", note: "Ownership plus locks in the Rust model." },
      { label: "Tokio shared state", url: "https://tokio.rs/tokio/tutorial/shared-state", note: "Lock contention inside async runtimes." },
      { label: "Elixir Process docs", url: "https://hexdocs.pm/elixir/1.13.4/Process.html", note: "Message passing primitives on isolated processes." },
      { label: "Erlang efficiency guide", url: "https://www.erlang.org/doc/system/eff_guide_processes.html", note: "Why message passing scales differently from shared state." },
    ],
    steps: [
      {
        title: "Rust shares one queue",
        lines: [1, 2, 3],
        explanation: "In the shared-memory model, many workers coordinate around **one protected heap object**.",
        snapshot: {
          heap: [{ id: "jobs", kind: "Arc", label: "Arc<Mutex<Vec<Job>>>", value: "queue len=0", refs: 3, state: "alive" }],
          tasks: [{ id: "rw1", label: "rust worker", status: "pending" }],
          scheduler: { cores: [{ id: "c1", queue: ["rw1"] }, { id: "c2", queue: [] }] },
        },
      },
      {
        title: "Elixir owns state in a process",
        lines: [6, 7],
        explanation: "In the message-passing model, the queue lives **inside** one process and everybody else interacts by sending messages.",
        snapshot: {
          heap: [{ id: "jobs", kind: "Arc", label: "Arc<Mutex<Vec<Job>>>", value: "queue len=1", refs: 3, state: "alive" }],
          tasks: [{ id: "rw1", label: "rust worker", status: "running" }],
          processes: [{ id: "mail-owner", name: "job mailbox owner", state: "waiting", role: "worker" }],
          messages: [{ id: "job-1", from: "client", to: "mail-owner", content: "{:job, 1}", phase: "in-mailbox" }],
          scheduler: { cores: [{ id: "c1", running: "rw1", queue: [] }, { id: "c2", queue: ["mail-owner"] }] },
        },
      },
      {
        title: "Load shows different pain points",
        lines: [2, 7],
        explanation: "Rust tends to expose **lock contention**; Elixir tends to expose **mailbox growth**. Both are bottlenecks, just in different places.",
        snapshot: {
          heap: [{ id: "jobs", kind: "Arc", label: "Arc<Mutex<Vec<Job>>>", value: "contended lock", refs: 5, state: "alive" }],
          tasks: [
            { id: "rw1", label: "rust worker 1", status: "running" },
            { id: "rw2", label: "rust worker 2", status: "running" },
          ],
          processes: [{ id: "mail-owner", name: "job mailbox owner", state: "running", role: "worker" }],
          messages: [
            { id: "job-1", from: "client", to: "mail-owner", content: "{:job, 1}", phase: "consumed" },
            { id: "job-2", from: "client", to: "mail-owner", content: "{:job, 2}", phase: "in-mailbox" },
            { id: "job-3", from: "client", to: "mail-owner", content: "{:job, 3}", phase: "in-mailbox" },
          ],
          scheduler: { cores: [{ id: "c1", running: "rw1", queue: ["rw2"] }, { id: "c2", running: "mail-owner", queue: [] }] },
        },
      },
      {
        title: "Different defaults, same need for design",
        lines: [1, 6],
        explanation: "Neither model removes load management. They simply concentrate pressure in **different runtime structures**.",
        snapshot: {
          heap: [{ id: "jobs", kind: "Arc", label: "Arc<Mutex<Vec<Job>>>", value: "queue len=2", refs: 5, state: "alive" }],
          tasks: [
            { id: "rw1", label: "rust worker 1", status: "done" },
            { id: "rw2", label: "rust worker 2", status: "running" },
          ],
          processes: [{ id: "mail-owner", name: "job mailbox owner", state: "running", role: "worker" }],
          messages: [{ id: "job-3", from: "client", to: "mail-owner", content: "{:job, 3}", phase: "in-mailbox" }],
          scheduler: { cores: [{ id: "c1", running: "rw2", queue: [] }, { id: "c2", running: "mail-owner", queue: [] }] },
        },
      },
    ],
  },
  {
    id: "compare-panic-vs-let-it-crash",
    language: "compare",
    topic: "Comparative Systems",
    title: "Failure Handling: Panic Recovery vs Let-It-Crash",
    subtitle: "Rust tends to contain failure inside values and threads; OTP tends to turn failure into a restart protocol.",
    difficulty: "Advanced",
    code: `RUST
let result = std::panic::catch_unwind(|| work());
let lock = mutex.lock(); // maybe poisoned after panic

ELIXIR
child crashes
supervisor restarts child`,
    panels: ["heap", "compiler", "processes"],
    resources: [
      { label: "Mutex docs", url: "https://doc.rust-lang.org/stable/std/sync/struct.Mutex.html", note: "Poisoning is one Rust strategy for containing panic aftermath." },
      { label: "Rust Book: Unrecoverable Errors", url: "https://doc.rust-lang.org/book/ch09-01-unrecoverable-errors-with-panic.html", note: "What panic means in Rust." },
      { label: "Supervisor docs", url: "https://hexdocs.pm/elixir/1.15.7/Supervisor.html", note: "OTP turns crashes into supervision events." },
    ],
    steps: [
      {
        title: "Rust panic poisons shared state",
        lines: [1, 2],
        explanation: "When a thread panics while holding a mutex, later lock attempts observe **poisoning** and must decide how to recover.",
        snapshot: {
          heap: [{ id: "mx", kind: "Arc", label: "Mutex<State>", value: "poisoned after panic", refs: 1, state: "alive" }],
          diagnostics: [{ level: "warning", line: 2, message: "mutex is poisoned after panic", hint: "Rust pushes recovery to the caller" }],
        },
      },
      {
        title: "Elixir worker crashes normally",
        lines: [5, 6],
        explanation: "In OTP, a crash is often expected. Supervisors observe it and perform a policy-driven restart.",
        snapshot: {
          heap: [{ id: "mx", kind: "Arc", label: "Mutex<State>", value: "poisoned after panic", refs: 1, state: "alive" }],
          processes: [
            { id: "sup", name: "Supervisor", state: "running", role: "supervisor" },
            { id: "child", name: "worker", state: "crashed", role: "worker", parent: "sup" },
          ],
        },
      },
      {
        title: "Recovery lives in different layers",
        lines: [1, 6],
        explanation: "Rust usually asks **the same process** to inspect the error. OTP often delegates recovery to **another process** entirely.",
        snapshot: {
          heap: [{ id: "mx", kind: "Arc", label: "Mutex<State>", value: "caller decides whether to continue", refs: 1, state: "alive" }],
          processes: [
            { id: "sup", name: "Supervisor", state: "running", role: "supervisor" },
            { id: "child2", name: "worker (restarted)", state: "running", role: "worker", parent: "sup" },
          ],
        },
      },
    ],
  },
  {
    id: "compare-locks-vs-backpressure",
    language: "compare",
    topic: "Comparative Systems",
    title: "Concurrency Bottlenecks: Locks vs Mailbox Backpressure",
    subtitle: "Both systems bottleneck under pressure, but the hot spot shows up in different runtime structures.",
    difficulty: "Advanced",
    code: `RUST
for task in tasks {
    let _guard = queue.lock().unwrap();
}

ELIXIR
for msg <- burst do
  send(server, msg)
end`,
    panels: ["heap", "tasks", "mailbox", "processes", "scheduler"],
    resources: [
      { label: "Tokio shared-state contention", url: "https://tokio.rs/tokio/tutorial/shared-state", note: "Short critical sections still serialize under contention." },
      { label: "Mutex docs", url: "https://doc.rust-lang.org/stable/std/sync/struct.Mutex.html", note: "Blocking behavior and its consequences." },
      { label: "Process docs", url: "https://hexdocs.pm/elixir/1.13.4/Process.html", note: "Mailbox-based flow control starts here." },
    ],
    steps: [
      {
        title: "Rust tasks converge on one lock",
        lines: [1, 2, 3],
        explanation: "The queue is safe, but every writer still waits its turn through one mutex.",
        snapshot: {
          heap: [{ id: "q", kind: "Arc", label: "Arc<Mutex<Queue>>", value: "contended", refs: 4, state: "alive" }],
          tasks: [
            { id: "t1", label: "task 1", status: "running" },
            { id: "t2", label: "task 2", status: "pending" },
          ],
          scheduler: { cores: [{ id: "r1", running: "t1", queue: ["t2"] }, { id: "r2", queue: [] }] },
        },
      },
      {
        title: "Elixir senders converge on one mailbox",
        lines: [6, 7, 8],
        explanation: "There is no shared lock, but a single receiver can still become the serialization point as its mailbox grows.",
        snapshot: {
          heap: [{ id: "q", kind: "Arc", label: "Arc<Mutex<Queue>>", value: "contended", refs: 4, state: "alive" }],
          tasks: [
            { id: "t1", label: "task 1", status: "running" },
            { id: "t2", label: "task 2", status: "pending" },
          ],
          processes: [{ id: "srv", name: "server", state: "ready", role: "genserver" }],
          messages: [
            { id: "m1", from: "c1", to: "srv", content: ":job", phase: "in-mailbox" },
            { id: "m2", from: "c2", to: "srv", content: ":job", phase: "in-mailbox" },
          ],
          scheduler: { cores: [{ id: "r1", running: "t1", queue: ["t2"] }, { id: "r2", queue: ["srv"] }] },
        },
      },
      {
        title: "Bottlenecks are structural",
        lines: [2, 7],
        explanation: "In Rust the bottleneck is often **a protected memory region**. In Elixir it is often **a process mailbox and the scheduler around it**.",
        snapshot: {
          heap: [{ id: "q", kind: "Arc", label: "Arc<Mutex<Queue>>", value: "lock waiters piling up", refs: 4, state: "alive" }],
          tasks: [
            { id: "t1", label: "task 1", status: "running" },
            { id: "t2", label: "task 2", status: "running" },
          ],
          processes: [{ id: "srv", name: "server", state: "running", role: "genserver" }],
          messages: [
            { id: "m1", from: "c1", to: "srv", content: ":job", phase: "consumed" },
            { id: "m2", from: "c2", to: "srv", content: ":job", phase: "in-mailbox" },
            { id: "m3", from: "c3", to: "srv", content: ":job", phase: "in-mailbox" },
          ],
          scheduler: { cores: [{ id: "r1", running: "t1", queue: ["t2"] }, { id: "r2", running: "srv", queue: [] }] },
        },
      },
    ],
  },
  {
    id: "compare-borrow-checker-vs-isolation",
    language: "compare",
    topic: "Comparative Systems",
    title: "State Ownership: Borrow Checker vs Process Isolation",
    subtitle: "Rust prevents aliasing statically; Elixir prevents it architecturally by refusing to share memory at all.",
    difficulty: "Advanced",
    code: `RUST
let r1 = &state;
let r2 = &mut state; // rejected

ELIXIR
send(pid, {:update, state_copy})`,
    panels: ["stack", "borrow", "compiler", "processes", "mailbox"],
    resources: [
      { label: "Rust ownership chapter", url: "https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html", note: "Static aliasing rules in the language core." },
      { label: "Elixir Process docs", url: "https://hexdocs.pm/elixir/1.13.4/Process.html", note: "Isolation by process boundaries instead of borrow analysis." },
    ],
    steps: [
      {
        title: "Rust borrow conflict",
        lines: [2, 3],
        explanation: "Rust sees the aliasing conflict at compile time and rejects the mutable borrow before the program can run.",
        snapshot: {
          stack: [{
            id: "f", name: "rust()", vars: [
              { id: "state", name: "state", type: "Vec<u8>", heapRef: "st", state: "borrowed" },
              { id: "r1", name: "r1", type: "&Vec<u8>", state: "owned" },
            ],
          }],
          heap: [{ id: "st", kind: "Vec", label: "shared state", value: "len=4", state: "alive" }],
          borrows: [{ id: "br1", from: "r1", to: "st", kind: "shared" }],
          diagnostics: [{ level: "error", line: 3, message: "cannot borrow `state` as mutable because it is also borrowed as immutable", hint: "Rust encodes the aliasing policy in types" }],
        },
      },
      {
        title: "Elixir ships a copy",
        lines: [6],
        explanation: "Elixir avoids the same problem by sending data **between isolated processes** instead of sharing one mutable value.",
        snapshot: {
          stack: [{
            id: "f", name: "rust()", vars: [
              { id: "state", name: "state", type: "Vec<u8>", heapRef: "st", state: "borrowed" },
              { id: "r1", name: "r1", type: "&Vec<u8>", state: "owned" },
            ],
          }],
          heap: [{ id: "st", kind: "Vec", label: "shared state", value: "len=4", state: "alive" }],
          borrows: [{ id: "br1", from: "r1", to: "st", kind: "shared" }],
          processes: [
            { id: "sender", name: "sender", state: "running", role: "user" },
            { id: "worker", name: "worker", state: "ready", role: "worker" },
          ],
          messages: [{ id: "copy", from: "sender", to: "worker", content: "{:update, copy}", phase: "in-flight" }],
          diagnostics: [{ level: "error", line: 3, message: "cannot borrow `state` as mutable because it is also borrowed as immutable", hint: "Rust encodes the aliasing policy in types" }],
        },
      },
      {
        title: "Different enforcement layers",
        lines: [2, 6],
        explanation: "Rust's rule lives in the **compiler**. Elixir's rule lives in the **runtime topology** of isolated heaps and mailboxes.",
        snapshot: {
          processes: [
            { id: "sender", name: "sender", state: "running", role: "user" },
            { id: "worker", name: "worker", state: "running", role: "worker" },
          ],
          messages: [{ id: "copy", from: "sender", to: "worker", content: "{:update, copy}", phase: "consumed" }],
        },
      },
    ],
  },
  {
    id: "compare-futures-vs-beam-scheduling",
    language: "compare",
    topic: "Comparative Systems",
    title: "Async Execution: Futures vs BEAM Process Scheduling Model",
    subtitle: "Rust futures are polled state machines; BEAM processes are preemptively scheduled actors.",
    difficulty: "Advanced",
    code: `RUST
tokio::spawn(async move {
    socket.readable().await;
});

ELIXIR
spawn(fn ->
  receive do
    msg -> msg
  end
end)`,
    panels: ["tasks", "scheduler", "processes", "mailbox"],
    resources: [
      { label: "Tokio spawning tutorial", url: "https://tokio.rs/tokio/tutorial/spawning", note: "Tasks are lightweight, but they are still futures polled by an executor." },
      { label: "Tokio async in depth", url: "https://tokio.rs/tokio/tutorial/async", note: "Understand polling and wakeups." },
      { label: "Erlang process guide", url: "https://www.erlang.org/doc/system/eff_guide_processes.html", note: "Processes are runtime entities, not compiler-generated futures." },
    ],
    steps: [
      {
        title: "Rust future waits to be polled",
        lines: [2, 3],
        explanation: "A future makes no progress on its own. The executor must poll it whenever it becomes ready again.",
        snapshot: {
          tasks: [{ id: "fut", label: "socket future", status: "pending" }],
          scheduler: { cores: [{ id: "x1", queue: ["fut"] }, { id: "x2", queue: [] }] },
        },
      },
      {
        title: "BEAM process is independently schedulable",
        lines: [7, 8, 9, 10],
        explanation: "An Elixir process is a runtime actor with its own mailbox; the BEAM scheduler preempts and resumes it directly.",
        snapshot: {
          tasks: [{ id: "fut", label: "socket future", status: "running" }],
          processes: [{ id: "beam-p", name: "mailbox process", state: "waiting", role: "worker" }],
          scheduler: { cores: [{ id: "x1", running: "fut", queue: [] }, { id: "x2", queue: ["beam-p"] }] },
        },
      },
      {
        title: "Wakeups look different",
        lines: [3, 8],
        explanation: "Rust resumes by **waking a future for another poll**; Elixir resumes by **scheduling the process** when a message arrives or reductions are available.",
        snapshot: {
          tasks: [{ id: "fut", label: "socket future", status: "running" }],
          processes: [{ id: "beam-p", name: "mailbox process", state: "ready", role: "worker" }],
          messages: [{ id: "wake", from: "net", to: "beam-p", content: ":socket_ready", phase: "in-mailbox" }],
          scheduler: { cores: [{ id: "x1", running: "fut", queue: [] }, { id: "x2", queue: ["beam-p"] }] },
        },
      },
      {
        title: "Both need a scheduler, but not the same abstraction",
        lines: [1, 7],
        explanation: "Rust's scheduler manages **polling work units**; the BEAM scheduler manages **processes with mailboxes and reductions**.",
        snapshot: {
          tasks: [{ id: "fut", label: "socket future", status: "done" }],
          processes: [{ id: "beam-p", name: "mailbox process", state: "running", role: "worker" }],
          messages: [{ id: "wake", from: "net", to: "beam-p", content: ":socket_ready", phase: "consumed" }],
          scheduler: { cores: [{ id: "x1", queue: [] }, { id: "x2", running: "beam-p", queue: [] }] },
        },
      },
    ],
  },
];
