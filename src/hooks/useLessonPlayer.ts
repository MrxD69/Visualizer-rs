import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Lesson } from "@/lib/lessons/types";

export interface LessonPlayer {
  stepIndex: number;
  totalSteps: number;
  playing: boolean;
  speed: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  restart: () => void;
  goto: (i: number) => void;
  setSpeed: (s: number) => void;
}

export function useLessonPlayer(lesson: Lesson): LessonPlayer {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 1x = 1800ms / step
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = lesson.steps.length;

  // reset on lesson change
  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [lesson.id]);

  const clear = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => {
    clear();
    if (!playing) return;
    if (stepIndex >= total - 1) {
      setPlaying(false);
      return;
    }
    const delay = Math.max(450, 1800 / speed);
    timer.current = setTimeout(() => setStepIndex((i) => Math.min(i + 1, total - 1)), delay);
    return clear;
  }, [playing, stepIndex, total, speed]);

  const play = useCallback(() => {
    if (stepIndex >= total - 1) setStepIndex(0);
    setPlaying(true);
  }, [stepIndex, total]);
  const pause = useCallback(() => setPlaying(false), []);
  const toggle = useCallback(() => setPlaying((p) => !p), []);
  const next = useCallback(() => { setPlaying(false); setStepIndex((i) => Math.min(i + 1, total - 1)); }, [total]);
  const prev = useCallback(() => { setPlaying(false); setStepIndex((i) => Math.max(i - 1, 0)); }, []);
  const restart = useCallback(() => { setPlaying(false); setStepIndex(0); }, []);
  const goto = useCallback((i: number) => { setPlaying(false); setStepIndex(Math.max(0, Math.min(i, total - 1))); }, [total]);

  // keyboard controls
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.code === "Space") { e.preventDefault(); toggle(); }
      else if (e.code === "ArrowRight") next();
      else if (e.code === "ArrowLeft") prev();
      else if (e.code === "KeyR") restart();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [toggle, next, prev, restart]);

  return useMemo(() => ({
    stepIndex, totalSteps: total, playing, speed,
    play, pause, toggle, next, prev, restart, goto, setSpeed,
  }), [stepIndex, total, playing, speed, play, pause, toggle, next, prev, restart, goto]);
}
