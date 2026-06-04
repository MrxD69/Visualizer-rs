import type { Lesson } from "../types";

export const rustAdvancedLessons: Lesson[] = [
  {
    id: "rust-struct-graphs",
    language: "rust",
    topic: "Memory",
    title: "Ownership in Struct Graphs",
    subtitle: "Nested structs still obey one-owner-at-a-time rules, even when the graph feels tree-shaped.",
    difficulty: "Advanced",
    code: `struct Leaf {
    value: String,
}

struct Branch {
    leaf: Leaf,
}

struct Root {
    branch: Branch,
}

fn main() {
    let root = Root {
        branch: Branch {
            leaf: Leaf { value: String::from("oak") },
        },
    };

    let archive = root;
}`,
    panels: ["stack", "heap", "compiler"],
    resources: [
      { label: "The Rust Book: Ownership", url: "https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html", note: "Refresh the core move model before layering structs on top." },
      { label: "The Rust Book: Defining Structs", url: "https://doc.rust-lang.org/book/ch05-01-defining-structs.html", note: "How field ownership composes inside aggregate types." },
    ],
    steps: [
      {
        title: "Construct the root graph",
        lines: [12, 13, 14, 15, 16],
        explanation: "`root` owns the whole nested graph. There is still just **one top-level owner** on the stack, even though multiple heap nodes are reachable beneath it.",
        snapshot: {
          stack: [{ id: "f-main", name: "main()", vars: [{ id: "root", name: "root", type: "Root", heapRef: "h-root", state: "owned" }] }],
          heap: [
            { id: "h-root", kind: "Generic", label: "Root", value: "branch -> h-branch", state: "alive" },
            { id: "h-branch", kind: "Generic", label: "Branch", value: "leaf -> h-leaf", state: "alive" },
            { id: "h-leaf", kind: "String", label: "Leaf.value", value: "\"oak\"", state: "alive" },
          ],
        },
      },
      {
        title: "Fields do not become separate owners",
        lines: [2, 6, 10],
        explanation: "The nested `Leaf` and `Branch` values are **owned through** `root`; they do not implicitly create independent stack owners.",
        snapshot: {
          stack: [{ id: "f-main", name: "main()", vars: [{ id: "root", name: "root", type: "Root", heapRef: "h-root", state: "owned" }] }],
          heap: [
            { id: "h-root", kind: "Generic", label: "Root", value: "owns Branch", state: "alive" },
            { id: "h-branch", kind: "Generic", label: "Branch", value: "owns Leaf", state: "alive" },
            { id: "h-leaf", kind: "String", label: "Leaf.value", value: "\"oak\"", state: "alive" },
          ],
        },
      },
      {
        title: "Move the whole graph",
        lines: [19],
        explanation: "Assigning `root` into `archive` moves the **entire nested ownership chain**. Nothing inside the graph is copied.",
        snapshot: {
          stack: [{
            id: "f-main",
            name: "main()",
            vars: [
              { id: "root", name: "root", type: "Root", state: "moved" },
              { id: "archive", name: "archive", type: "Root", heapRef: "h-root", state: "owned" },
            ],
          }],
          heap: [
            { id: "h-root", kind: "Generic", label: "Root", value: "branch -> h-branch", state: "alive" },
            { id: "h-branch", kind: "Generic", label: "Branch", value: "leaf -> h-leaf", state: "alive" },
            { id: "h-leaf", kind: "String", label: "Leaf.value", value: "\"oak\"", state: "alive" },
          ],
        },
      },
      {
        title: "Use-after-move remains illegal",
        lines: [19],
        explanation: "Trying to read `root.branch.leaf.value` after the move would still be a **use after move**, even though the field path looks deeper than a simple variable.",
        snapshot: {
          stack: [{
            id: "f-main",
            name: "main()",
            vars: [
              { id: "root", name: "root", type: "Root", state: "moved" },
              { id: "archive", name: "archive", type: "Root", heapRef: "h-root", state: "owned" },
            ],
          }],
          heap: [
            { id: "h-root", kind: "Generic", label: "Root", value: "branch -> h-branch", state: "alive" },
            { id: "h-branch", kind: "Generic", label: "Branch", value: "leaf -> h-leaf", state: "alive" },
            { id: "h-leaf", kind: "String", label: "Leaf.value", value: "\"oak\"", state: "alive" },
          ],
          diagnostics: [{ level: "error", code: "E0382", line: 19, message: "use of moved value: `root`", hint: "the move included all of `root`'s fields" }],
        },
      },
    ],
  },
  {
    id: "rust-collection-moves",
    language: "rust",
    topic: "Memory",
    title: "Move Semantics in Collections",
    subtitle: "Growing `Vec` and `String` values can reallocate their buffers and invalidate old addresses.",
    difficulty: "Advanced",
    code: `fn main() {
    let mut names = Vec::with_capacity(2);
    names.push(String::from("ada"));
    names.push(String::from("grace"));

    let first = &names[0];
    names.push(String::from("linus"));

    println!("{}", first);
}`,
    panels: ["stack", "heap", "borrow", "compiler"],
    resources: [
      { label: "Vec<T> docs", url: "https://doc.rust-lang.org/stable/std/vec/struct.Vec.html", note: "See capacity, reallocation, and growth guarantees." },
      { label: "String docs", url: "https://doc.rust-lang.org/stable/std/string/struct.String.html", note: "Heap-backed strings also grow by reallocating." },
    ],
    steps: [
      {
        title: "Reserve collection capacity",
        lines: [2, 3, 4],
        explanation: "`names` starts with capacity for two items. The vector owns a heap buffer that currently holds two `String` elements.",
        snapshot: {
          stack: [{ id: "f", name: "main()", vars: [{ id: "names", name: "names", type: "Vec<String>", heapRef: "vec-a", state: "owned" }] }],
          heap: [{ id: "vec-a", kind: "Vec", label: "Vec<String>", value: "cap=2 len=2", state: "alive" }],
        },
      },
      {
        title: "Borrow the first element",
        lines: [6],
        explanation: "`first` points into the vector's current buffer. As long as that buffer stays put, the borrow is valid.",
        snapshot: {
          stack: [{
            id: "f", name: "main()", vars: [
              { id: "names", name: "names", type: "Vec<String>", heapRef: "vec-a", state: "borrowed" },
              { id: "first", name: "first", type: "&String", state: "owned" },
            ],
          }],
          heap: [{ id: "vec-a", kind: "Vec", label: "Vec<String>", value: "cap=2 len=2", state: "alive" }],
          borrows: [{ id: "b-first", from: "first", to: "vec-a", kind: "shared" }],
        },
      },
      {
        title: "Push beyond capacity",
        lines: [7],
        explanation: "Pushing a third item forces `Vec` to **reallocate**. The old buffer is freed and a new buffer takes its place.",
        snapshot: {
          stack: [{
            id: "f", name: "main()", vars: [
              { id: "names", name: "names", type: "Vec<String>", heapRef: "vec-b", state: "owned" },
              { id: "first", name: "first", type: "&String", state: "moved" },
            ],
          }],
          heap: [
            { id: "vec-a", kind: "Vec", label: "old Vec<String>", value: "cap=2 len=2", state: "freed" },
            { id: "vec-b", kind: "Vec", label: "Vec<String>", value: "cap=4 len=3", state: "alive" },
          ],
        },
      },
      {
        title: "Stale borrow rejected",
        lines: [8],
        explanation: "Rust forbids the `push` while `first` is alive because reallocation would make that reference **dangle**.",
        snapshot: {
          stack: [{
            id: "f", name: "main()", vars: [
              { id: "names", name: "names", type: "Vec<String>", heapRef: "vec-b", state: "owned" },
              { id: "first", name: "first", type: "&String", state: "moved" },
            ],
          }],
          heap: [
            { id: "vec-a", kind: "Vec", label: "old Vec<String>", value: "cap=2 len=2", state: "freed" },
            { id: "vec-b", kind: "Vec", label: "Vec<String>", value: "cap=4 len=3", state: "alive" },
          ],
          diagnostics: [{ level: "error", code: "E0502", line: 7, message: "cannot borrow `names` as mutable because it is also borrowed as immutable", hint: "a reallocation could invalidate `first`" }],
        },
      },
    ],
  },
  {
    id: "rust-refcell-runtime-borrows",
    language: "rust",
    topic: "Memory",
    title: "Interior Mutability with RefCell",
    subtitle: "The compiler permits shared access, but `RefCell` enforces borrow rules at runtime.",
    difficulty: "Advanced",
    code: `use std::cell::RefCell;

fn main() {
    let cell = RefCell::new(String::from("hello"));
    let read = cell.borrow();
    let write = cell.borrow_mut();
    println!("{}", read);
}`,
    panels: ["stack", "heap", "borrow", "compiler"],
    resources: [
      { label: "The Rust Book: Interior Mutability", url: "https://doc.rust-lang.org/stable/book/ch15-05-interior-mutability.html", note: "Why `RefCell<T>` moves checking from compile time to runtime." },
      { label: "RefCell API docs", url: "https://doc.rust-lang.org/core/cell/struct.RefCell.html", note: "Borrowing methods and the runtime failure behavior." },
    ],
    steps: [
      {
        title: "Create RefCell state",
        lines: [4],
        explanation: "`cell` owns a `String`, but it exposes mutation through **runtime-checked** borrows instead of static `&mut` rules.",
        snapshot: {
          stack: [{ id: "f", name: "main()", vars: [{ id: "cell", name: "cell", type: "RefCell<String>", heapRef: "rcell", state: "owned" }] }],
          heap: [{ id: "rcell", kind: "RefCell", label: "RefCell<String>", value: "\"hello\"", state: "alive" }],
        },
      },
      {
        title: "Shared runtime borrow",
        lines: [5],
        explanation: "`borrow()` succeeds and returns a guard. The compiler allows this because `RefCell` promises to check aliasing later.",
        snapshot: {
          stack: [{
            id: "f", name: "main()", vars: [
              { id: "cell", name: "cell", type: "RefCell<String>", heapRef: "rcell", state: "borrowed" },
              { id: "read", name: "read", type: "Ref<String>", state: "owned" },
            ],
          }],
          heap: [{ id: "rcell", kind: "RefCell", label: "RefCell<String>", value: "\"hello\"", state: "alive" }],
          borrows: [{ id: "b-read", from: "read", to: "rcell", kind: "shared" }],
        },
      },
      {
        title: "Mutable borrow attempt",
        lines: [6],
        explanation: "Now `borrow_mut()` collides with the live shared borrow. This is where **runtime enforcement** kicks in.",
        snapshot: {
          stack: [{
            id: "f", name: "main()", vars: [
              { id: "cell", name: "cell", type: "RefCell<String>", heapRef: "rcell", state: "borrowed" },
              { id: "read", name: "read", type: "Ref<String>", state: "owned" },
            ],
          }],
          heap: [{ id: "rcell", kind: "RefCell", label: "RefCell<String>", value: "\"hello\"", state: "alive" }],
          borrows: [{ id: "b-read", from: "read", to: "rcell", kind: "shared" }],
        },
      },
      {
        title: "Runtime borrow violation",
        lines: [6],
        explanation: "The compiler stays silent, but the program **panics at runtime** with a `BorrowMutError` because the aliasing rules were violated dynamically.",
        snapshot: {
          stack: [{
            id: "f", name: "main()", vars: [
              { id: "cell", name: "cell", type: "RefCell<String>", heapRef: "rcell", state: "borrowed" },
              { id: "read", name: "read", type: "Ref<String>", state: "owned" },
            ],
          }],
          heap: [{ id: "rcell", kind: "RefCell", label: "RefCell<String>", value: "\"hello\"", state: "alive" }],
          borrows: [{ id: "b-read", from: "read", to: "rcell", kind: "shared" }],
          diagnostics: [{ level: "note", line: 6, message: "runtime panic: already borrowed: BorrowMutError", hint: "use `try_borrow_mut` if you want an error instead of a panic" }],
        },
      },
    ],
  },
  {
    id: "rust-arc-mutex-deadlock",
    language: "rust",
    topic: "Concurrency",
    title: "Deadlocks with Arc + Mutex",
    subtitle: "Shared-state safety does not remove lock-ordering bugs.",
    difficulty: "Advanced",
    code: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let a = Arc::new(Mutex::new(()));
    let b = Arc::new(Mutex::new(()));

    let t1_a = a.clone();
    let t1_b = b.clone();
    thread::spawn(move || {
        let _ga = t1_a.lock().unwrap();
        let _gb = t1_b.lock().unwrap();
    });

    let t2_a = a.clone();
    let t2_b = b.clone();
    thread::spawn(move || {
        let _gb = t2_b.lock().unwrap();
        let _ga = t2_a.lock().unwrap();
    });
}`,
    panels: ["heap", "tasks", "scheduler", "compiler"],
    resources: [
      { label: "Mutex docs", url: "https://doc.rust-lang.org/stable/std/sync/struct.Mutex.html", note: "Mutex behavior, blocking, and poisoning." },
      { label: "The Rust Book: Shared-State Concurrency", url: "https://doc.rust-lang.org/book/ch16-03-shared-state.html", note: "How `Mutex<T>` and `Arc<T>` are composed in practice." },
    ],
    steps: [
      {
        title: "Two locks, two threads",
        lines: [5, 6, 10, 17],
        explanation: "Both threads share the same two mutexes via `Arc`. The type system permits it because the access is synchronized.",
        snapshot: {
          heap: [
            { id: "lock-a", kind: "Arc", label: "Arc<Mutex<A>>", value: "unlocked refs=3", refs: 3, state: "alive" },
            { id: "lock-b", kind: "Arc", label: "Arc<Mutex<B>>", value: "unlocked refs=3", refs: 3, state: "alive" },
          ],
          tasks: [
            { id: "t1", label: "thread 1", status: "pending" },
            { id: "t2", label: "thread 2", status: "pending" },
          ],
          scheduler: { cores: [{ id: "c1", queue: ["t1"] }, { id: "c2", queue: ["t2"] }] },
        },
      },
      {
        title: "Thread 1 locks A",
        lines: [10, 11],
        explanation: "Thread 1 acquires lock `A` and then moves on toward `B`.",
        snapshot: {
          heap: [
            { id: "lock-a", kind: "Arc", label: "Arc<Mutex<A>>", value: "owner=t1", refs: 3, state: "alive" },
            { id: "lock-b", kind: "Arc", label: "Arc<Mutex<B>>", value: "unlocked", refs: 3, state: "alive" },
          ],
          tasks: [
            { id: "t1", label: "thread 1", status: "running" },
            { id: "t2", label: "thread 2", status: "running" },
          ],
          scheduler: { cores: [{ id: "c1", running: "t1", queue: [] }, { id: "c2", running: "t2", queue: [] }] },
        },
      },
      {
        title: "Thread 2 locks B",
        lines: [17, 18],
        explanation: "Thread 2 acquires `B` first. Now each thread holds one lock and wants the other.",
        snapshot: {
          heap: [
            { id: "lock-a", kind: "Arc", label: "Arc<Mutex<A>>", value: "owner=t1", refs: 3, state: "alive" },
            { id: "lock-b", kind: "Arc", label: "Arc<Mutex<B>>", value: "owner=t2", refs: 3, state: "alive" },
          ],
          tasks: [
            { id: "t1", label: "thread 1", status: "running" },
            { id: "t2", label: "thread 2", status: "running" },
          ],
          scheduler: { cores: [{ id: "c1", running: "t1", queue: [] }, { id: "c2", running: "t2", queue: [] }] },
        },
      },
      {
        title: "Circular wait",
        lines: [11, 18],
        explanation: "Each thread blocks on the other lock. This is a **deadlock**: memory safety is intact, but progress is gone.",
        snapshot: {
          heap: [
            { id: "lock-a", kind: "Arc", label: "Arc<Mutex<A>>", value: "owner=t1 waiting=t2", refs: 3, state: "alive" },
            { id: "lock-b", kind: "Arc", label: "Arc<Mutex<B>>", value: "owner=t2 waiting=t1", refs: 3, state: "alive" },
          ],
          tasks: [
            { id: "t1", label: "thread 1", status: "running" },
            { id: "t2", label: "thread 2", status: "running" },
          ],
          scheduler: { cores: [{ id: "c1", running: "t1", queue: [] }, { id: "c2", running: "t2", queue: [] }] },
          diagnostics: [{ level: "warning", line: 11, message: "possible deadlock: inconsistent lock ordering", hint: "acquire locks in one global order or use `try_lock`/message passing" }],
        },
      },
    ],
  },
  {
    id: "rust-async-cancellation",
    language: "rust",
    topic: "Concurrency",
    title: "Async Cancellation & Dropped Futures",
    subtitle: "In async Rust, cancellation usually means a future is dropped before completion.",
    difficulty: "Advanced",
    code: `use tokio::task;
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    let handle = task::spawn(async {
        sleep(Duration::from_secs(5)).await;
        "done"
    });

    handle.abort();
}`,
    panels: ["tasks", "scheduler", "compiler"],
    resources: [
      { label: "Tokio: Select and Cancellation", url: "https://tokio.rs/tokio/tutorial/select", note: "Cancellation in async Rust happens by dropping futures." },
      { label: "Tokio: Graceful Shutdown", url: "https://tokio.rs/tokio/topics/shutdown", note: "How to shut tasks down deliberately instead of abruptly." },
      { label: "JoinHandle docs", url: "https://docs.rs/tokio/latest/tokio/task/struct.JoinHandle.html", note: "Abort and completion semantics for spawned tasks." },
    ],
    steps: [
      {
        title: "Spawn a future",
        lines: [6, 7, 8],
        explanation: "Spawning returns a `JoinHandle`; the future is now owned by the runtime scheduler.",
        snapshot: {
          tasks: [{ id: "fetch", label: "spawned future", status: "pending" }],
          scheduler: { cores: [{ id: "w1", queue: ["fetch"] }, { id: "w2", queue: [] }] },
        },
      },
      {
        title: "Runtime polls it",
        lines: [7],
        explanation: "The runtime polls the future. At this point it has internal state that can later be dropped for cancellation.",
        snapshot: {
          tasks: [{ id: "fetch", label: "spawned future", status: "running" }],
          scheduler: { cores: [{ id: "w1", running: "fetch", queue: [] }, { id: "w2", queue: [] }] },
        },
      },
      {
        title: "Abort requested",
        lines: [11],
        explanation: "`abort()` marks the task for cancellation. The future will not make more progress once the runtime observes the abort.",
        snapshot: {
          tasks: [{ id: "fetch", label: "spawned future", status: "running" }],
          scheduler: { cores: [{ id: "w1", running: "fetch", queue: [] }, { id: "w2", queue: [] }] },
        },
      },
      {
        title: "Future is dropped",
        lines: [11],
        explanation: "Cancellation in async Rust means the future is **dropped**. Any cleanup must live in `Drop` or explicit shutdown logic.",
        snapshot: {
          tasks: [{ id: "fetch", label: "spawned future", status: "done" }],
          scheduler: { cores: [{ id: "w1", queue: [] }, { id: "w2", queue: [] }] },
          diagnostics: [{ level: "note", line: 11, message: "task aborted before producing an output", hint: "cancellation is cooperative only if you write explicit shutdown paths" }],
        },
      },
    ],
  },
  {
    id: "rust-pinning-futures",
    language: "rust",
    topic: "Concurrency",
    title: "Pinning & Self-Referential Futures",
    subtitle: "Async state machines often need stable addresses once they contain self-references.",
    difficulty: "Advanced",
    code: `use std::pin::Pin;

async fn work() -> usize {
    42
}

fn main() {
    let fut = work();
    let pinned: Pin<Box<_>> = Box::pin(fut);
    // pinned future must not move before polling completes
}`,
    panels: ["stack", "heap", "compiler", "tasks"],
    resources: [
      { label: "Pin module docs", url: "https://doc.rust-lang.org/std/pin/", note: "The core pinning contract and why address stability matters." },
      { label: "Pin<Ptr> docs", url: "https://doc.rust-lang.org/stable/std/pin/struct.Pin.html", note: "Practical APIs for pinning values." },
      { label: "Unpin docs", url: "https://doc.rust-lang.org/std/marker/trait.Unpin.html", note: "What becomes possible when a type does not care about pinning." },
    ],
    steps: [
      {
        title: "Future created",
        lines: [8],
        explanation: "The compiler turns `work()` into a **future state machine**. Before pinning, that state machine may still move.",
        snapshot: {
          stack: [{ id: "f", name: "main()", vars: [{ id: "fut", name: "fut", type: "impl Future<Output = usize>", state: "owned" }] }],
          tasks: [{ id: "poll", label: "future state machine", status: "pending" }],
        },
      },
      {
        title: "Heap pinning pointer",
        lines: [9],
        explanation: "`Box::pin` allocates the future and promises that its address will stay stable from now on.",
        snapshot: {
          stack: [{
            id: "f", name: "main()", vars: [
              { id: "fut", name: "fut", type: "impl Future<Output = usize>", state: "moved" },
              { id: "pinned", name: "pinned", type: "Pin<Box<...>>", heapRef: "pin-box", state: "owned" },
            ],
          }],
          heap: [{ id: "pin-box", kind: "Box", label: "pinned future", value: "address stable", state: "alive" }],
          tasks: [{ id: "poll", label: "future state machine", status: "running" }],
        },
      },
      {
        title: "Self-reference is now sound",
        lines: [3],
        explanation: "Compiler-generated async futures may hold references into their own state. Pinning is what makes that **self-reference** safe.",
        snapshot: {
          stack: [{
            id: "f", name: "main()", vars: [
              { id: "pinned", name: "pinned", type: "Pin<Box<...>>", heapRef: "pin-box", state: "borrowed" },
            ],
          }],
          heap: [{ id: "pin-box", kind: "Box", label: "pinned future", value: "self-ref fields active", state: "alive" }],
          tasks: [{ id: "poll", label: "future state machine", status: "running" }],
        },
      },
      {
        title: "Moving after pin is restricted",
        lines: [9, 10],
        explanation: "Once pinned, safe code cannot move the inner future out freely. That restriction is the whole point of pinning.",
        snapshot: {
          stack: [{
            id: "f", name: "main()", vars: [
              { id: "pinned", name: "pinned", type: "Pin<Box<...>>", heapRef: "pin-box", state: "owned" },
            ],
          }],
          heap: [{ id: "pin-box", kind: "Box", label: "pinned future", value: "must not move", state: "alive" }],
          tasks: [{ id: "poll", label: "future state machine", status: "running" }],
          diagnostics: [{ level: "note", line: 9, message: "pinned data cannot be moved through ordinary APIs", hint: "poll uses `Pin<&mut Self>` for this reason" }],
        },
      },
    ],
  },
  {
    id: "rust-send-sync-boundaries",
    language: "rust",
    topic: "Concurrency",
    title: "Send vs Sync Trait Boundaries",
    subtitle: "Rust encodes thread-safety constraints in marker traits long before execution starts.",
    difficulty: "Advanced",
    code: `use std::cell::RefCell;
use std::rc::Rc;
use std::thread;

fn main() {
    let shared = Rc::new(RefCell::new(0));
    thread::spawn(move || {
        *shared.borrow_mut() += 1;
    });
}`,
    panels: ["stack", "heap", "compiler"],
    resources: [
      { label: "The Rust Book: Send and Sync", url: "https://doc.rust-lang.org/book/ch16-04-extensible-concurrency-sync-and-send.html", note: "The user-facing model for thread-safety auto traits." },
      { label: "Rustonomicon: Send and Sync", url: "https://doc.rust-lang.org/nomicon/send-and-sync.html", note: "The deeper contract behind the markers." },
    ],
    steps: [
      {
        title: "Single-threaded shared state",
        lines: [6],
        explanation: "`Rc<RefCell<_>>` is fine **within one thread**. The reference count is non-atomic and the borrow rules are enforced at runtime.",
        snapshot: {
          stack: [{ id: "f", name: "main()", vars: [{ id: "shared", name: "shared", type: "Rc<RefCell<i32>>", heapRef: "rcell", state: "owned" }] }],
          heap: [{ id: "rcell", kind: "Rc", label: "Rc<RefCell<i32>>", value: "value=0 refs=1", refs: 1, state: "alive" }],
        },
      },
      {
        title: "Capture into a thread",
        lines: [7, 8],
        explanation: "Spawning tries to move `shared` across a thread boundary. Now the `Send` trait matters.",
        snapshot: {
          stack: [{ id: "f", name: "main()", vars: [{ id: "shared", name: "shared", type: "Rc<RefCell<i32>>", heapRef: "rcell", state: "owned" }] }],
          heap: [{ id: "rcell", kind: "Rc", label: "Rc<RefCell<i32>>", value: "cross-thread capture attempted", refs: 1, state: "alive" }],
        },
      },
      {
        title: "Compiler rejects it",
        lines: [7],
        explanation: "`Rc<RefCell<_>>` is **not `Send`** and not `Sync`, so the compiler blocks the thread handoff before any race can happen.",
        snapshot: {
          stack: [{ id: "f", name: "main()", vars: [{ id: "shared", name: "shared", type: "Rc<RefCell<i32>>", heapRef: "rcell", state: "owned" }] }],
          heap: [{ id: "rcell", kind: "Rc", label: "Rc<RefCell<i32>>", value: "thread-unsafe sharing", refs: 1, state: "alive" }],
          diagnostics: [{ level: "error", line: 7, message: "`Rc<RefCell<i32>>` cannot be sent between threads safely", hint: "use `Arc<Mutex<T>>` for shared mutable cross-thread state" }],
        },
      },
      {
        title: "Swap to Arc + Mutex",
        lines: [1, 2],
        explanation: "Replacing `Rc<RefCell<_>>` with `Arc<Mutex<_>>` changes the type's thread-safety story and satisfies the boundary.",
        snapshot: {
          stack: [{ id: "f", name: "main()", vars: [{ id: "shared2", name: "shared2", type: "Arc<Mutex<i32>>", heapRef: "arc-mtx", state: "owned" }] }],
          heap: [{ id: "arc-mtx", kind: "Arc", label: "Arc<Mutex<i32>>", value: "value=0 refs=1", refs: 1, state: "alive" }],
        },
      },
    ],
  },
  {
    id: "rust-safe-memory-leaks",
    language: "rust",
    topic: "Memory",
    title: "Memory Leaks in Safe Rust",
    subtitle: "Reference cycles can keep heap data alive forever without using `unsafe`.",
    difficulty: "Advanced",
    code: `use std::cell::RefCell;
use std::rc::Rc;

struct Node {
    next: RefCell<Option<Rc<Node>>>,
}

fn main() {
    let a = Rc::new(Node { next: RefCell::new(None) });
    let b = Rc::new(Node { next: RefCell::new(None) });

    *a.next.borrow_mut() = Some(b.clone());
    *b.next.borrow_mut() = Some(a.clone());
}`,
    panels: ["stack", "heap", "compiler"],
    resources: [
      { label: "The Rust Book: Reference Cycles", url: "https://doc.rust-lang.org/book/ch15-06-reference-cycles.html", note: "How cycles leak memory even in safe Rust." },
      { label: "Rc<T> docs", url: "https://doc.rust-lang.org/std/rc/", note: "Single-threaded shared ownership and its tradeoffs." },
      { label: "RefCell<T> docs", url: "https://doc.rust-lang.org/core/cell/struct.RefCell.html", note: "Used here to mutate links inside shared ownership." },
    ],
    steps: [
      {
        title: "Two nodes allocated",
        lines: [9, 10],
        explanation: "`a` and `b` are independently reference-counted nodes. Each starts with a strong count of one.",
        snapshot: {
          stack: [{
            id: "f", name: "main()", vars: [
              { id: "a", name: "a", type: "Rc<Node>", heapRef: "node-a", state: "owned" },
              { id: "b", name: "b", type: "Rc<Node>", heapRef: "node-b", state: "owned" },
            ],
          }],
          heap: [
            { id: "node-a", kind: "Rc", label: "Node a", value: "next=None", refs: 1, state: "alive" },
            { id: "node-b", kind: "Rc", label: "Node b", value: "next=None", refs: 1, state: "alive" },
          ],
        },
      },
      {
        title: "Link a -> b",
        lines: [12],
        explanation: "Cloning `b` into `a.next` bumps `b`'s strong count. Shared ownership is working as designed.",
        snapshot: {
          stack: [{
            id: "f", name: "main()", vars: [
              { id: "a", name: "a", type: "Rc<Node>", heapRef: "node-a", state: "owned" },
              { id: "b", name: "b", type: "Rc<Node>", heapRef: "node-b", state: "owned" },
            ],
          }],
          heap: [
            { id: "node-a", kind: "Rc", label: "Node a", value: "next -> b", refs: 1, state: "alive" },
            { id: "node-b", kind: "Rc", label: "Node b", value: "held by stack + a.next", refs: 2, state: "alive" },
          ],
        },
      },
      {
        title: "Link b -> a",
        lines: [13],
        explanation: "Now the nodes point to each other. The cycle means each node keeps the other alive.",
        snapshot: {
          stack: [{
            id: "f", name: "main()", vars: [
              { id: "a", name: "a", type: "Rc<Node>", heapRef: "node-a", state: "owned" },
              { id: "b", name: "b", type: "Rc<Node>", heapRef: "node-b", state: "owned" },
            ],
          }],
          heap: [
            { id: "node-a", kind: "Rc", label: "Node a", value: "next -> b", refs: 2, state: "alive" },
            { id: "node-b", kind: "Rc", label: "Node b", value: "next -> a", refs: 2, state: "alive" },
          ],
        },
      },
      {
        title: "Leak after scope exit",
        lines: [14],
        explanation: "When stack owners go away, each node still has a strong count of one from the cycle. The program is safe, but the heap memory **leaks**.",
        snapshot: {
          stack: [],
          heap: [
            { id: "node-a", kind: "Rc", label: "Node a", value: "cycle keeps it alive", refs: 1, state: "alive" },
            { id: "node-b", kind: "Rc", label: "Node b", value: "cycle keeps it alive", refs: 1, state: "alive" },
          ],
          diagnostics: [{ level: "warning", line: 13, message: "reference cycle prevents both nodes from being dropped", hint: "use `Weak<T>` for back-edges that should not keep data alive" }],
        },
      },
    ],
  },
];
