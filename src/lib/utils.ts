import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a p-value the way journals expect (APA/ICMJE-style). */
export function formatP(p: number): string {
  if (!Number.isFinite(p)) return '—';
  if (p < 0.001) return 'p < 0.001';
  if (p >= 0.995) return 'p > 0.99';
  // Three decimals below 0.1 so that, e.g., 0.049 is not displayed as 0.05.
  return `p = ${p < 0.1 ? p.toFixed(3) : p.toFixed(2)}`;
}

/** p-value without the "p" prefix, for tables and ranges: "< 0.001", "0.04", "> 0.99". */
export function pValue(p: number): string {
  return formatP(p).replace(/^p = /, '').replace(/^p /, '');
}

export function fmt(x: number, digits = 2): string {
  if (!Number.isFinite(x)) return x > 0 ? '∞' : x < 0 ? '−∞' : '—';
  return x.toFixed(digits).replace(/^-/, '−');
}

export const pct = (x: number, digits = 1) => `${fmt(100 * x, digits)}%`;

export const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
