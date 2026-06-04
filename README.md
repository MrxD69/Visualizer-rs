# Visualize

Interactive runtime lessons for Rust, Elixir, Phoenix, and cross-system concurrency concepts.

`Visualize` is a teaching app that turns systems-programming ideas into step-by-step simulations. Instead of reading a static explanation of ownership, mailboxes, supervision, or route-planning flow, you can press play and watch the runtime state evolve beside the code.

## What It Does

- Teaches Rust concepts such as ownership, borrowing, `Rc`/`Arc`, async execution, interior mutability, deadlocks, pinning, and `Send`/`Sync`
- Teaches Elixir and OTP concepts such as processes, mailboxes, schedulers, GenServers, supervisors, links, monitors, and failure recovery
- Includes Phoenix and transport-app lessons for channels, PubSub, LiveView, Presence, Ecto, request lifecycles, realtime delays, routing, backpressure, retries, and graceful degradation
- Includes cross-system comparison lessons that explain the difference between shared-memory and message-passing models
- Adds per-lesson deep-dive reading sections, cited references, study prompts, and annotated study code

## Current Scope

- `60` authored lessons
- `12` Rust lessons
- `43` Elixir / Phoenix / transport lessons
- `5` comparison lessons

## Experience

Each lesson includes:

- A code viewer with active line highlighting
- A step player with play, pause, next, previous, and reset controls
- Runtime visualization panels such as stack, heap, borrows, compiler diagnostics, processes, mailbox, scheduler, GenServer state, and tasks
- Animated transitions powered by Framer Motion
- A deep-dive section with expanded explanation and resource citations

## Tech Stack

- `TanStack Start`
- `React 19`
- `TypeScript`
- `Tailwind CSS`
- `Framer Motion`
- `TanStack Router`
- `Lucide React`

## Project Structure

```text
src/
  components/        UI, panels, lesson layout, deep-dive renderer
  hooks/             lesson player state and interaction hooks
  lib/
    lessons/         lesson data, types, deep-dive generation
    highlight.ts     syntax highlighting logic
  routes/            app routes
  router.tsx         TanStack router setup
  start.ts           app entry
  styles.css         theme and design tokens
```

## Running Locally

This project uses `pnpm`.

```bash
pnpm install
pnpm dev
```

Then open the local URL shown by Vite, usually:

```text
http://localhost:8080
```

## Useful Commands

```bash
pnpm dev
pnpm build
pnpm preview
pnpm exec tsc --noEmit
pnpm lint
pnpm format
```

## Authoring Model

Lessons are currently defined as declarative lesson data in `src/lib/lessons`.

Each lesson provides:

- lesson metadata
- source code to display
- panel configuration
- a sequence of steps
- a snapshot for each step
- optional resources and deep-dive metadata

That makes it straightforward to add more educational content without rewriting the core UI.

## Why This Exists

Most learning material for systems programming is either:

- static prose
- isolated code snippets
- or abstract diagrams disconnected from execution

`Visualize` is meant to bridge that gap by making runtime behavior visible:

- who owns a value
- what moved
- what is borrowed
- which process is waiting
- where a message is queued
- which scheduler core is running work
- how failures propagate

## Roadmap Direction

Planned and in-progress directions include:

- more Rust runtime lessons
- more OTP and Phoenix production lessons
- richer transport-system modeling lessons
- stronger authored deep-dive content per flagship lesson
- more comparison lessons across runtime models

## Status

The app is functional and content-heavy, with the current UI built around lesson playback and animated state visualization.

Before pushing publicly, you may want to add:

- screenshots or a demo GIF
- deployment URL
- project logo / social preview
- contribution guidelines
- license

## License

No license has been added yet.
