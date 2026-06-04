import type { Lesson } from "../types";

const code = `fn main() {
    let mut s = String::from("hi");
    let r1 = &s;
    let r2 = &s;
    println!("{} {}", r1, r2);
    let r3 = &mut s;
    r3.push_str("!");
}`;

export const borrowing: Lesson = {
  id: "rust-borrowing",
  language: "rust",
  topic: "Memory",
  title: "Borrowing Rules",
  subtitle: "Many shared readers OR one exclusive writer — never both.",
  difficulty: "Core",
  code,
  panels: ["stack", "heap", "borrow", "compiler"],
  steps: [
    {
      title: "Own the buffer",
      lines: [2],
      explanation: "`s` owns a heap-allocated `String`.",
      snapshot: {
        stack: [{ id: "f", name: "main()", vars: [
          { id: "s", name: "s", type: "String", heapRef: "h", state: "owned" },
        ]}],
        heap: [{ id: "h", kind: "String", label: "String", value: "\"hi\"", state: "alive" }],
      },
    },
    {
      title: "Shared borrow #1",
      lines: [3],
      explanation: "`&s` creates an **immutable reference**. The owner cannot mutate while shared borrows are alive.",
      snapshot: {
        stack: [{ id: "f", name: "main()", vars: [
          { id: "s", name: "s", type: "String", heapRef: "h", state: "borrowed" },
          { id: "r1", name: "r1", type: "&String", state: "owned" },
        ]}],
        heap: [{ id: "h", kind: "String", label: "String", value: "\"hi\"", state: "alive" }],
        borrows: [{ id: "br1", from: "r1", to: "h", kind: "shared" }],
      },
    },
    {
      title: "Shared borrow #2 — allowed",
      lines: [4],
      explanation: "Multiple shared borrows can coexist. Readers don't conflict with other readers.",
      snapshot: {
        stack: [{ id: "f", name: "main()", vars: [
          { id: "s", name: "s", type: "String", heapRef: "h", state: "borrowed" },
          { id: "r1", name: "r1", type: "&String", state: "owned" },
          { id: "r2", name: "r2", type: "&String", state: "owned" },
        ]}],
        heap: [{ id: "h", kind: "String", label: "String", value: "\"hi\"", state: "alive" }],
        borrows: [
          { id: "br1", from: "r1", to: "h", kind: "shared" },
          { id: "br2", from: "r2", to: "h", kind: "shared" },
        ],
      },
    },
    {
      title: "Shared borrows end (NLL)",
      lines: [5],
      explanation: "After `println!`, `r1` and `r2` are last used — Rust's **non-lexical lifetimes** end the borrows right here.",
      snapshot: {
        stack: [{ id: "f", name: "main()", vars: [
          { id: "s", name: "s", type: "String", heapRef: "h", state: "owned" },
        ]}],
        heap: [{ id: "h", kind: "String", label: "String", value: "\"hi\"", state: "alive" }],
      },
    },
    {
      title: "Exclusive borrow",
      lines: [6],
      explanation: "`&mut s` is an **exclusive** reference. No other reference may exist while it's live.",
      snapshot: {
        stack: [{ id: "f", name: "main()", vars: [
          { id: "s", name: "s", type: "String", heapRef: "h", state: "borrowed" },
          { id: "r3", name: "r3", type: "&mut String", state: "owned" },
        ]}],
        heap: [{ id: "h", kind: "String", label: "String", value: "\"hi\"", state: "alive" }],
        borrows: [{ id: "br3", from: "r3", to: "h", kind: "mut" }],
      },
    },
    {
      title: "Mutation through r3",
      lines: [7],
      explanation: "`r3.push_str(\"!\")` reallocates if needed, then writes. The heap buffer is updated **in place**.",
      snapshot: {
        stack: [{ id: "f", name: "main()", vars: [
          { id: "s", name: "s", type: "String", heapRef: "h", state: "borrowed" },
          { id: "r3", name: "r3", type: "&mut String", state: "owned" },
        ]}],
        heap: [{ id: "h", kind: "String", label: "String", value: "\"hi!\"", state: "alive" }],
        borrows: [{ id: "br3", from: "r3", to: "h", kind: "mut" }],
      },
    },
    {
      title: "Try mixing &mut + & ?",
      lines: [6, 4],
      explanation: "Holding `r1` past line 6 would conflict with `&mut s`. The borrow checker rejects.",
      snapshot: {
        stack: [{ id: "f", name: "main()", vars: [
          { id: "s", name: "s", type: "String", heapRef: "h", state: "borrowed" },
          { id: "r3", name: "r3", type: "&mut String", state: "owned" },
        ]}],
        heap: [{ id: "h", kind: "String", label: "String", value: "\"hi!\"", state: "alive" }],
        borrows: [{ id: "br3", from: "r3", to: "h", kind: "mut" }],
        diagnostics: [{
          level: "error", code: "E0502", line: 6,
          message: "cannot borrow `s` as mutable because it is also borrowed as immutable",
          hint: "immutable borrow later used here",
        }],
      },
    },
  ],
};
