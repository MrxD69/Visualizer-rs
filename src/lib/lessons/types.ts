// Data model for lessons. Snapshots are declarative — components render from
// the current step's snapshot and animate via Framer Motion layoutId.

export type Language = "rust" | "elixir" | "compare";

export type PanelKind =
  | "stack"
  | "heap"
  | "borrow"
  | "ownership"
  | "compiler"
  | "processes"
  | "mailbox"
  | "scheduler"
  | "genserver"
  | "tasks";

export interface StackVar {
  id: string;          // stable across steps for animation
  name: string;
  type?: string;
  value?: string;      // primitive value to display
  heapRef?: string;    // id of a heap block it points to
  state?: "owned" | "moved" | "borrowed" | "dropped";
}

export interface StackFrame {
  id: string;
  name: string;
  vars: StackVar[];
}

export interface HeapBlock {
  id: string;
  label: string;       // e.g. String, Vec<i32>
  value?: string;      // payload preview
  refs?: number;       // Rc/Arc count
  kind?: "Box" | "String" | "Vec" | "Rc" | "Arc" | "RefCell" | "Generic";
  state?: "alive" | "freed";
}

export interface Borrow {
  id: string;
  from: string;        // stack var id
  to: string;          // heap block id or var id
  kind: "shared" | "mut";
}

export interface CompilerDiagnostic {
  level: "error" | "warning" | "note";
  code?: string;       // e.g. E0382
  line?: number;
  message: string;
  hint?: string;
}

export interface RustSnapshot {
  stack?: StackFrame[];
  heap?: HeapBlock[];
  borrows?: Borrow[];
  diagnostics?: CompilerDiagnostic[];
}

// Elixir
export interface EProcess {
  id: string;
  name: string;
  parent?: string;
  state: "running" | "ready" | "waiting" | "exited" | "crashed";
  role?: "supervisor" | "worker" | "genserver" | "task" | "user";
  link?: string[];     // ids of linked processes
}

export interface EMessage {
  id: string;
  from?: string;
  to: string;
  content: string;
  phase: "in-flight" | "in-mailbox" | "consumed";
}

export interface ESchedulerState {
  cores: Array<{ id: string; running?: string; queue: string[] }>;
}

export interface EGenServerState {
  pid: string;
  module: string;
  state: Record<string, string | number | boolean>;
  callQueue?: Array<{ id: string; label: string }>;
  lastReply?: string;
}

export interface ETask {
  id: string;
  label: string;
  status: "pending" | "running" | "done";
}

export interface ElixirSnapshot {
  processes?: EProcess[];
  messages?: EMessage[];
  scheduler?: ESchedulerState;
  genserver?: EGenServerState;
  tasks?: ETask[];
}

export type Snapshot = RustSnapshot & ElixirSnapshot;

export interface LessonStep {
  title?: string;
  lines: number[];           // 1-indexed highlighted lines
  explanation: string;       // markdown-lite (plain string, **bold**, `code`)
  snapshot: Snapshot;
}

export interface LessonResource {
  label: string;
  url: string;
  note?: string;
}

export interface Lesson {
  id: string;
  language: Language;
  topic: string;             // e.g. "Memory", "Concurrency"
  title: string;
  subtitle: string;
  difficulty: "Intro" | "Core" | "Advanced";
  code: string;
  panels: PanelKind[];
  steps: LessonStep[];
  resources?: LessonResource[];
}
