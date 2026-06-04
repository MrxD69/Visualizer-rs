import type { Lesson } from "../types";

const code = `fn main() {
    let s1 = String::from("hello");
    let s2 = s1;
    println!("{}", s2);
}`;

export const ownership: Lesson = {
  id: "rust-ownership",
  language: "rust",
  topic: "Memory",
  title: "Ownership & Move Semantics",
  subtitle: "Watch a value's ownership transfer from one binding to another.",
  difficulty: "Intro",
  code,
  panels: ["stack", "heap", "compiler"],
  steps: [
    {
      title: "Enter main",
      lines: [1],
      explanation:
        "Execution begins. A new **stack frame** for `main` is pushed. No allocations yet.",
      snapshot: {
        stack: [{ id: "f-main", name: "main()", vars: [] }],
        heap: [],
      },
    },
    {
      title: "Allocate the String",
      lines: [2],
      explanation:
        "`String::from(\"hello\")` allocates on the **heap**. `s1` holds the pointer, length and capacity on the stack — it **owns** the heap buffer.",
      snapshot: {
        stack: [
          {
            id: "f-main",
            name: "main()",
            vars: [
              { id: "s1", name: "s1", type: "String", heapRef: "h1", state: "owned" },
            ],
          },
        ],
        heap: [
          { id: "h1", kind: "String", label: "String", value: "\"hello\"", state: "alive" },
        ],
      },
    },
    {
      title: "Move s1 → s2",
      lines: [3],
      explanation:
        "Rust **moves** ownership. The heap buffer is not copied — only the pointer. `s1` becomes invalid; using it now is a compile error.",
      snapshot: {
        stack: [
          {
            id: "f-main",
            name: "main()",
            vars: [
              { id: "s1", name: "s1", type: "String", state: "moved" },
              { id: "s2", name: "s2", type: "String", heapRef: "h1", state: "owned" },
            ],
          },
        ],
        heap: [
          { id: "h1", kind: "String", label: "String", value: "\"hello\"", state: "alive" },
        ],
      },
    },
    {
      title: "What if we used s1?",
      lines: [3, 4],
      explanation:
        "If you wrote `println!(\"{}\", s1)` the compiler would refuse — `s1` was moved. Try it mentally; the diagnostic appears →",
      snapshot: {
        stack: [
          {
            id: "f-main",
            name: "main()",
            vars: [
              { id: "s1", name: "s1", type: "String", state: "moved" },
              { id: "s2", name: "s2", type: "String", heapRef: "h1", state: "owned" },
            ],
          },
        ],
        heap: [
          { id: "h1", kind: "String", label: "String", value: "\"hello\"", state: "alive" },
        ],
        diagnostics: [
          {
            level: "error",
            code: "E0382",
            line: 3,
            message: "borrow of moved value: `s1`",
            hint: "value used here after move",
          },
        ],
      },
    },
    {
      title: "println! borrows s2",
      lines: [4],
      explanation: "`println!` takes a temporary shared borrow of `s2`. The macro reads the heap buffer and prints `hello`.",
      snapshot: {
        stack: [
          {
            id: "f-main",
            name: "main()",
            vars: [
              { id: "s1", name: "s1", type: "String", state: "moved" },
              { id: "s2", name: "s2", type: "String", heapRef: "h1", state: "owned" },
            ],
          },
        ],
        heap: [
          { id: "h1", kind: "String", label: "String", value: "\"hello\"", state: "alive" },
        ],
        borrows: [{ id: "b1", from: "s2", to: "h1", kind: "shared" }],
      },
    },
    {
      title: "Drop at scope exit",
      lines: [5],
      explanation:
        "`main` returns. `s2` goes out of scope, so Rust automatically calls `drop` — the heap buffer is **freed**. No GC, no leak.",
      snapshot: {
        stack: [],
        heap: [
          { id: "h1", kind: "String", label: "String", value: "\"hello\"", state: "freed" },
        ],
      },
    },
  ],
};
