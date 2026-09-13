"use client";

import { useEffect, useState } from "react";

const DEFAULT_DURATION_MS = 1600;

export function useCountUp(target: number, start: boolean, durationMs: number = DEFAULT_DURATION_MS) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let frame: number;
    const startTime = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target, durationMs]);

  return value;
}
