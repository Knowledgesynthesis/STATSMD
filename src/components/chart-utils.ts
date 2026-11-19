import React, { useLayoutEffect, useRef, useState } from 'react';

/** Series colours by fixed slot (CVD-validated order). Never cycle beyond s4. */
export const SERIES = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)'] as const;

/** Width of the element in px; 0 until the first ResizeObserver measurement. */
export function useWidth<T extends HTMLElement>(fallback = 0): [React.RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [w, setW] = useState(fallback);
  useLayoutEffect(() => {
    if (!ref.current) return;
    // ResizeObserver reports the initial size on observe, then every change.
    const ro = new ResizeObserver(([e]) => setW(Math.max(240, Math.round(e.contentRect.width))));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

export function niceTicks(min: number, max: number, count = 5): number[] {
  if (max === min) return [min];
  const span = max - min;
  let step = 10 ** Math.floor(Math.log10(span / count));
  const err = (count / span) * step;
  if (err <= 0.15) step *= 10;
  else if (err <= 0.35) step *= 5;
  else if (err <= 0.75) step *= 2;
  const start = Math.ceil(min / step - 1e-9) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step * 1e-9; v += step) ticks.push(Math.round(v / step) * step);
  return ticks;
}

export type Scale = ((v: number) => number) & { invert: (px: number) => number; domain: [number, number] };

export function linearScale(domain: [number, number], range: [number, number], log = false): Scale {
  const [d0, d1] = log ? [Math.log(domain[0]), Math.log(domain[1])] : domain;
  const [r0, r1] = range;
  const f = ((v: number) => r0 + (((log ? Math.log(v) : v) - d0) / (d1 - d0)) * (r1 - r0)) as Scale;
  f.invert = (px: number) => {
    const v = d0 + ((px - r0) / (r1 - r0)) * (d1 - d0);
    return log ? Math.exp(v) : v;
  };
  f.domain = domain;
  return f;
}

/** Step path for survival-type curves. */
export function stepPath(points: { x: number; y: number }[], sx: Scale, sy: Scale, xEnd?: number): string {
  if (points.length === 0) return '';
  let d = `M${sx(points[0].x)},${sy(points[0].y)}`;
  for (let i = 1; i < points.length; i++) d += `H${sx(points[i].x)}V${sy(points[i].y)}`;
  if (xEnd !== undefined) d += `H${sx(xEnd)}`;
  return d;
}

export function linePath(points: { x: number; y: number }[], sx: Scale, sy: Scale): string {
  return points.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`).join('');
}

