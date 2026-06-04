// Tiny token-based highlighter for Rust + Elixir. Good enough to look like an IDE
// without pulling in a 100KB highlighter. Each token maps to a syntax CSS var.

import type { Language } from "@/lib/lessons/types";

export type Token = { text: string; cls?: string };

const RUST_KW = new Set([
  "fn","let","mut","use","pub","struct","enum","impl","trait","return","if","else",
  "match","for","in","while","loop","break","continue","async","await","move",
  "as","crate","mod","ref","self","Self","static","const","where","type","dyn",
]);
const RUST_TY = new Set([
  "String","u8","u16","u32","u64","i8","i16","i32","i64","usize","isize","bool",
  "char","f32","f64","Vec","Box","Rc","Arc","Option","Result","RefCell","Mutex",
]);

const ELIXIR_KW = new Set([
  "def","defp","defmodule","do","end","fn","if","else","case","cond","when",
  "receive","after","spawn","spawn_link","send","use","import","alias","require",
  "and","or","not","true","false","nil","__MODULE__","self",
]);

function tokenize(line: string, lang: Language): Token[] {
  const out: Token[] = [];
  // simple regex-based scanner
  const patterns: Array<[RegExp, string]> = [
    [/^\/\/.*$/, "comment"],                         // rust // comment
    [/^#.*$/, "comment"],                            // elixir # comment (rough)
    [/^"(?:[^"\\]|\\.)*"/, "string"],
    [/^'(?:[^'\\]|\\.)'?/, "string"],
    [/^:[A-Za-z_][\w?!]*/, "atom"],                  // elixir atom :foo
    [/^[A-Z][A-Za-z0-9_]*/, "type"],
    [/^\b\d+(?:\.\d+)?\b/, "number"],
    [/^[A-Za-z_][\w]*!?/, "ident"],
    [/^[(){}\[\];,.<>:=+\-*/&|%!?]+/, "punct"],
    [/^\s+/, "ws"],
    [/^./, "other"],
  ];

  let rest = line;
  while (rest.length) {
    let matched = false;
    for (const [re, kind] of patterns) {
      const m = re.exec(rest);
      if (!m) continue;
      let cls: string | undefined;
      const txt = m[0];
      switch (kind) {
        case "comment": cls = "text-[var(--syntax-comment)] italic"; break;
        case "string": cls = "text-[var(--syntax-string)]"; break;
        case "number": cls = "text-[var(--syntax-number)]"; break;
        case "type": cls = "text-[var(--syntax-type)]"; break;
        case "atom": cls = "text-[var(--syntax-fn)]"; break;
        case "punct": cls = "text-[var(--syntax-punct)]"; break;
        case "ident": {
          const set = lang === "rust" ? RUST_KW : ELIXIR_KW;
          const tyset = lang === "rust" ? RUST_TY : new Set<string>();
          if (set.has(txt)) cls = "text-[var(--syntax-keyword)] font-medium";
          else if (tyset.has(txt)) cls = "text-[var(--syntax-type)]";
          else if (/^[a-z_][\w]*!$/.test(txt)) cls = "text-[var(--syntax-fn)]"; // macro
          break;
        }
      }
      out.push({ text: txt, cls });
      rest = rest.slice(txt.length);
      matched = true;
      break;
    }
    if (!matched) { out.push({ text: rest[0] }); rest = rest.slice(1); }
  }
  return out;
}

export function highlight(code: string, lang: Language): Token[][] {
  return code.split("\n").map((line) => tokenize(line, lang));
}
