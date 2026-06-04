import type { Lesson } from "../types";

const code = `use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("shared"));
    let b = Rc::clone(&a);
    {
        let c = Rc::clone(&a);
        println!("count = {}", Rc::strong_count(&a));
    }
    println!("count = {}", Rc::strong_count(&a));
}`;

export const rcArc: Lesson = {
  id: "rust-rc-arc",
  language: "rust",
  topic: "Memory",
  title: "Rc vs Arc — Reference Counting",
  subtitle: "Multiple owners sharing one heap allocation, counted at runtime.",
  difficulty: "Core",
  code,
  panels: ["stack", "heap"],
  steps: [
    {
      title: "Rc::new allocates",
      lines: [4],
      explanation: "`Rc::new` boxes the value on the heap with a **strong count** of 1. `a` is the first owner.",
      snapshot: {
        stack: [{ id: "f", name: "main()", vars: [
          { id: "a", name: "a", type: "Rc<String>", heapRef: "h", state: "owned" },
        ]}],
        heap: [{ id: "h", kind: "Rc", label: "Rc<String>", value: "\"shared\"", refs: 1, state: "alive" }],
      },
    },
    {
      title: "Clone bumps the count",
      lines: [5],
      explanation: "`Rc::clone` doesn't copy the payload — it increments the **strong count** to 2 and hands out another pointer.",
      snapshot: {
        stack: [{ id: "f", name: "main()", vars: [
          { id: "a", name: "a", type: "Rc<String>", heapRef: "h", state: "owned" },
          { id: "b", name: "b", type: "Rc<String>", heapRef: "h", state: "owned" },
        ]}],
        heap: [{ id: "h", kind: "Rc", label: "Rc<String>", value: "\"shared\"", refs: 2, state: "alive" }],
      },
    },
    {
      title: "Enter inner scope",
      lines: [6, 7],
      explanation: "A third clone in a nested scope. Count → 3.",
      snapshot: {
        stack: [{ id: "f", name: "main()", vars: [
          { id: "a", name: "a", type: "Rc<String>", heapRef: "h", state: "owned" },
          { id: "b", name: "b", type: "Rc<String>", heapRef: "h", state: "owned" },
          { id: "c", name: "c", type: "Rc<String>", heapRef: "h", state: "owned" },
        ]}],
        heap: [{ id: "h", kind: "Rc", label: "Rc<String>", value: "\"shared\"", refs: 3, state: "alive" }],
      },
    },
    {
      title: "Inner scope ends",
      lines: [9],
      explanation: "`c` is dropped — its destructor decrements the count back to 2. The buffer is still alive.",
      snapshot: {
        stack: [{ id: "f", name: "main()", vars: [
          { id: "a", name: "a", type: "Rc<String>", heapRef: "h", state: "owned" },
          { id: "b", name: "b", type: "Rc<String>", heapRef: "h", state: "owned" },
        ]}],
        heap: [{ id: "h", kind: "Rc", label: "Rc<String>", value: "\"shared\"", refs: 2, state: "alive" }],
      },
    },
    {
      title: "Last owners drop",
      lines: [11],
      explanation: "`main` returns. `a` and `b` drop — count hits **0**. The heap allocation is finally freed.",
      snapshot: {
        stack: [],
        heap: [{ id: "h", kind: "Rc", label: "Rc<String>", value: "\"shared\"", refs: 0, state: "freed" }],
      },
    },
    {
      title: "Why Arc?",
      lines: [1],
      explanation: "`Rc` uses non-atomic counters — single-threaded only. `Arc` uses **atomic** operations, safe across threads, slightly slower.",
      snapshot: {
        heap: [{ id: "h", kind: "Arc", label: "Arc<String>", value: "\"shared\"", refs: 0, state: "freed" }],
      },
    },
  ],
};
