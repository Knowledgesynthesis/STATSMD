import { normalCdf, normalQuantile } from './distributions';

/**
 * Sample size and power for two-group comparisons (two-sided tests).
 *
 * Means: normal approximation plus Guenther's (1981) correction z²/4 per group,
 * which reproduces exact noncentral-t results to within one participant.
 * Proportions: Fleiss formula without continuity correction (R power.prop.test).
 */

export interface MeansInput {
  delta: number;
  sd: number;
  alpha?: number;
  power?: number;
  /** n2 / n1 allocation ratio */
  ratio?: number;
}

export function sampleSizeTwoMeans({ delta, sd, alpha = 0.05, power = 0.8, ratio = 1 }: MeansInput) {
  const za = normalQuantile(1 - alpha / 2);
  const zb = normalQuantile(power);
  const d = Math.abs(delta) / sd;
  // n1 for allocation n2 = ratio·n1
  const raw = ((1 + 1 / ratio) * (za + zb) ** 2) / (d * d) + (za * za) / 4;
  const n1 = Math.ceil(raw);
  const n2 = Math.ceil(raw * ratio);
  return { n1, n2, total: n1 + n2, raw, effectSize: d };
}

export function powerTwoMeans({ delta, sd, n1, n2, alpha = 0.05 }: { delta: number; sd: number; n1: number; n2?: number; alpha?: number }) {
  const m = n2 ?? n1;
  const za = normalQuantile(1 - alpha / 2);
  // Undo the Guenther correction to keep power and sample size mutually consistent.
  const shrink = (n: number) => Math.max(1e-9, n - (za * za) / 4);
  const se = sd * Math.sqrt(1 / shrink(n1) + 1 / shrink(m));
  const ncp = Math.abs(delta) / se;
  return normalCdf(ncp - za) + normalCdf(-ncp - za);
}

export function sampleSizeTwoProportions({ p1, p2, alpha = 0.05, power = 0.8 }: { p1: number; p2: number; alpha?: number; power?: number }) {
  const za = normalQuantile(1 - alpha / 2);
  const zb = normalQuantile(power);
  const pbar = (p1 + p2) / 2;
  const num = za * Math.sqrt(2 * pbar * (1 - pbar)) + zb * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
  const raw = (num * num) / (p1 - p2) ** 2;
  const n = Math.ceil(raw);
  return { n1: n, n2: n, total: 2 * n, raw };
}

export function powerTwoProportions({ p1, p2, n, alpha = 0.05 }: { p1: number; p2: number; n: number; alpha?: number }) {
  const za = normalQuantile(1 - alpha / 2);
  const pbar = (p1 + p2) / 2;
  const diff = Math.abs(p1 - p2);
  const sd0 = Math.sqrt(2 * pbar * (1 - pbar));
  const sd1 = Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
  return normalCdf((diff * Math.sqrt(n) - za * sd0) / sd1);
}

/** Inflate a sample size for expected attrition: n / (1 − dropout). */
export const inflateForDropout = (n: number, dropout: number) => Math.ceil(n / (1 - dropout));

/** Minimal detectable difference in means for a given n per group. */
export function minimalDetectableDifference({ sd, n, alpha = 0.05, power = 0.8 }: { sd: number; n: number; alpha?: number; power?: number }) {
  const za = normalQuantile(1 - alpha / 2);
  const zb = normalQuantile(power);
  const eff = Math.max(1e-9, n - (za * za) / 4);
  return (za + zb) * sd * Math.sqrt(2 / eff);
}
