import {
  chiSquareSf,
  logChoose,
  normalQuantile,
  normalSf,
  tQuantile,
  tTwoSidedP,
} from './distributions';

// ---------- Descriptive ----------

export const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);
export const mean = (xs: number[]) => sum(xs) / xs.length;

export function variance(xs: number[]): number {
  const m = mean(xs);
  return xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1);
}

export const sd = (xs: number[]) => Math.sqrt(variance(xs));

/** Quantile, linear interpolation (R type 7 / NumPy default). */
export function quantile(xs: number[], p: number): number {
  const s = [...xs].sort((a, b) => a - b);
  const h = (s.length - 1) * p;
  const lo = Math.floor(h);
  const hi = Math.ceil(h);
  return s[lo] + (h - lo) * (s[hi] - s[lo]);
}

export const median = (xs: number[]) => quantile(xs, 0.5);

/** Average ranks (ties share the mean rank). */
export function ranks(xs: number[]): number[] {
  const idx = xs.map((x, i) => [x, i] as const).sort((a, b) => a[0] - b[0]);
  const r = new Array<number>(xs.length);
  let i = 0;
  while (i < idx.length) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) r[idx[k][1]] = avg;
    i = j + 1;
  }
  return r;
}

export function pearson(x: number[], y: number[]): number {
  const mx = mean(x);
  const my = mean(y);
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < x.length; i++) {
    sxy += (x[i] - mx) * (y[i] - my);
    sxx += (x[i] - mx) ** 2;
    syy += (y[i] - my) ** 2;
  }
  return sxy / Math.sqrt(sxx * syy);
}

export const spearman = (x: number[], y: number[]) => pearson(ranks(x), ranks(y));

/** p-value for H0: rho = 0 using t = r·sqrt((n−2)/(1−r²)). */
export function correlationP(r: number, n: number): number {
  const t = r * Math.sqrt((n - 2) / (1 - r * r));
  return tTwoSidedP(t, n - 2);
}

// ---------- t-tests ----------

export interface TTestResult {
  t: number;
  df: number;
  p: number;
  diff: number;
  se: number;
  ci: [number, number];
}

/** Two-sample t-test from summary statistics. Welch (default) or pooled Student. */
export function tTestSummary(
  m1: number, s1: number, n1: number,
  m2: number, s2: number, n2: number,
  opts: { welch?: boolean; conf?: number } = {},
): TTestResult {
  const welch = opts.welch ?? true;
  const conf = opts.conf ?? 0.95;
  const diff = m1 - m2;
  let se: number;
  let df: number;
  if (welch) {
    const v1 = (s1 * s1) / n1;
    const v2 = (s2 * s2) / n2;
    se = Math.sqrt(v1 + v2);
    df = (v1 + v2) ** 2 / (v1 ** 2 / (n1 - 1) + v2 ** 2 / (n2 - 1));
  } else {
    df = n1 + n2 - 2;
    const sp2 = ((n1 - 1) * s1 * s1 + (n2 - 1) * s2 * s2) / df;
    se = Math.sqrt(sp2 * (1 / n1 + 1 / n2));
  }
  const t = diff / se;
  const q = tQuantile(1 - (1 - conf) / 2, df);
  return { t, df, p: tTwoSidedP(t, df), diff, se, ci: [diff - q * se, diff + q * se] };
}

export function tTest(x: number[], y: number[], opts: { welch?: boolean; conf?: number } = {}): TTestResult {
  return tTestSummary(mean(x), sd(x), x.length, mean(y), sd(y), y.length, opts);
}

export function pairedTTest(x: number[], y: number[], conf = 0.95): TTestResult {
  const d = x.map((v, i) => v - y[i]);
  const n = d.length;
  const md = mean(d);
  const se = sd(d) / Math.sqrt(n);
  const t = md / se;
  const q = tQuantile(1 - (1 - conf) / 2, n - 1);
  return { t, df: n - 1, p: tTwoSidedP(t, n - 1), diff: md, se, ci: [md - q * se, md + q * se] };
}

/** One-sample t CI for a mean. */
export function meanCI(xs: number[], conf = 0.95): [number, number] {
  const m = mean(xs);
  const se = sd(xs) / Math.sqrt(xs.length);
  const q = tQuantile(1 - (1 - conf) / 2, xs.length - 1);
  return [m - q * se, m + q * se];
}

// ---------- Proportions ----------

/** Wilson score interval (recommended over Wald; Brown, Cai & DasGupta 2001). */
export function wilsonCI(x: number, n: number, conf = 0.95): [number, number] {
  if (n === 0) return [0, 1];
  const z = normalQuantile(1 - (1 - conf) / 2);
  const p = x / n;
  const denom = 1 + (z * z) / n;
  const centre = (p + (z * z) / (2 * n)) / denom;
  const half = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / denom;
  return [Math.max(0, centre - half), Math.min(1, centre + half)];
}

/** Newcombe hybrid score CI for p1 − p2 (Newcombe 1998, method 10). */
export function newcombeCI(x1: number, n1: number, x2: number, n2: number, conf = 0.95): [number, number] {
  const p1 = x1 / n1;
  const p2 = x2 / n2;
  const [l1, u1] = wilsonCI(x1, n1, conf);
  const [l2, u2] = wilsonCI(x2, n2, conf);
  const d = p1 - p2;
  return [d - Math.sqrt((p1 - l1) ** 2 + (u2 - p2) ** 2), d + Math.sqrt((u1 - p1) ** 2 + (p2 - l2) ** 2)];
}

export interface TwoByTwo {
  /** exposed/treated with event */ a: number;
  /** exposed/treated without event */ b: number;
  /** unexposed/control with event */ c: number;
  /** unexposed/control without event */ d: number;
}

export interface NNTResult {
  kind: 'NNTB' | 'NNTH' | 'none';
  value: number;
  /** Human-readable CI following Altman (1998): may pass through infinity. */
  ciText: string;
}

export interface EffectMeasures {
  risk1: number;
  risk0: number;
  rd: number;
  rdCI: [number, number];
  rr: number;
  rrCI: [number, number];
  or: number;
  orCI: [number, number];
  nnt: NNTResult;
  correctionApplied: boolean;
}

/**
 * Risk difference (Newcombe CI), risk ratio (log/Katz CI), odds ratio (Woolf CI)
 * and NNT (Altman 1998). 0.5 is added to every cell for RR/OR when any cell is 0.
 */
export function effectMeasures({ a, b, c, d }: TwoByTwo, conf = 0.95): EffectMeasures {
  const z = normalQuantile(1 - (1 - conf) / 2);
  const n1 = a + b;
  const n0 = c + d;
  const risk1 = a / n1;
  const risk0 = c / n0;
  const rd = risk1 - risk0;
  const rdCI = newcombeCI(a, n1, c, n0, conf);
  const zero = a === 0 || b === 0 || c === 0 || d === 0;
  const [A, B, C, Dd] = zero ? [a + 0.5, b + 0.5, c + 0.5, d + 0.5] : [a, b, c, d];
  const rr = A / (A + B) / (C / (C + Dd));
  const seLnRR = Math.sqrt(1 / A - 1 / (A + B) + 1 / C - 1 / (C + Dd));
  const or = (A * Dd) / (B * C);
  const seLnOR = Math.sqrt(1 / A + 1 / B + 1 / C + 1 / Dd);
  return {
    risk1,
    risk0,
    rd,
    rdCI,
    rr,
    rrCI: [rr * Math.exp(-z * seLnRR), rr * Math.exp(z * seLnRR)],
    or,
    orCI: [or * Math.exp(-z * seLnOR), or * Math.exp(z * seLnOR)],
    nnt: nntFromRD(rd, rdCI),
    correctionApplied: zero,
  };
}

/**
 * NNT from a risk difference (exposed − control) where the event is harmful.
 * rd < 0 → treatment prevents events → NNT to benefit.
 */
export function nntFromRD(rd: number, ci: [number, number]): NNTResult {
  if (rd === 0) return { kind: 'none', value: Infinity, ciText: 'not estimable (no difference)' };
  const kind = rd < 0 ? 'NNTB' : 'NNTH';
  const value = 1 / Math.abs(rd);
  const fmt = (v: number) => (v >= 1000 ? Math.round(v).toLocaleString() : v.toFixed(1));
  const [lo, hi] = ci;
  let ciText: string;
  if (lo < 0 && hi > 0) {
    // CI spans no effect: NNTB 1/|lo| to ∞ to NNTH 1/hi
    ciText = `NNTB ${fmt(1 / Math.abs(lo))} to ∞ to NNTH ${fmt(1 / hi)}`;
  } else {
    const a = 1 / Math.abs(lo);
    const b = 1 / Math.abs(hi);
    ciText = `${kind} ${fmt(Math.min(a, b))} to ${fmt(Math.max(a, b))}`;
  }
  return { kind, value, ciText };
}

export interface ChiSquareResult {
  statistic: number;
  df: number;
  p: number;
  expected: number[][];
  minExpected: number;
  propLessThan5: number;
}

/** Pearson chi-square for an r×c table. `yates` applies only to 2×2. `nMinus1` = Campbell's 'N−1' χ². */
export function chiSquareTest(table: number[][], opts: { yates?: boolean; nMinus1?: boolean } = {}): ChiSquareResult {
  const rows = table.map((r) => sum(r));
  const cols = table[0].map((_, j) => sum(table.map((r) => r[j])));
  const n = sum(rows);
  const expected = table.map((r, i) => r.map((_, j) => (rows[i] * cols[j]) / n));
  const is2x2 = table.length === 2 && table[0].length === 2;
  let x2 = 0;
  table.forEach((r, i) =>
    r.forEach((o, j) => {
      const e = expected[i][j];
      const dev = opts.yates && is2x2 ? Math.max(0, Math.abs(o - e) - 0.5) : Math.abs(o - e);
      x2 += (dev * dev) / e;
    }),
  );
  if (opts.nMinus1) x2 *= (n - 1) / n;
  const df = (table.length - 1) * (table[0].length - 1);
  const flat = expected.flat();
  return {
    statistic: x2,
    df,
    p: chiSquareSf(x2, df),
    expected,
    minExpected: Math.min(...flat),
    propLessThan5: flat.filter((e) => e < 5).length / flat.length,
  };
}

/** Fisher's exact test for a 2×2 table (two-sided: sum of tables as or less probable; R convention). */
export function fisherExact({ a, b, c, d }: TwoByTwo): { p: number; pLess: number; pGreater: number } {
  const r1 = a + b;
  const r2 = c + d;
  const c1 = a + c;
  const n = r1 + r2;
  const lo = Math.max(0, c1 - r2);
  const hi = Math.min(r1, c1);
  const denom = logChoose(n, c1);
  const prob = (x: number) => Math.exp(logChoose(r1, x) + logChoose(r2, c1 - x) - denom);
  const pObs = prob(a);
  let p = 0;
  let pLess = 0;
  let pGreater = 0;
  for (let x = lo; x <= hi; x++) {
    const px = prob(x);
    if (px <= pObs * (1 + 1e-7)) p += px;
    if (x <= a) pLess += px;
    if (x >= a) pGreater += px;
  }
  return { p: Math.min(1, p), pLess: Math.min(1, pLess), pGreater: Math.min(1, pGreater) };
}

/** McNemar's test for paired binary data using discordant counts b and c. */
export function mcnemar(b: number, c: number): { statistic: number; p: number; exactP: number } {
  const n = b + c;
  if (n === 0) return { statistic: 0, p: 1, exactP: 1 };
  const statistic = (b - c) ** 2 / n;
  const k = Math.min(b, c);
  let tail = 0;
  for (let x = 0; x <= k; x++) tail += Math.exp(logChoose(n, x) - n * Math.LN2);
  return { statistic, p: chiSquareSf(statistic, 1), exactP: Math.min(1, 2 * tail) };
}

/** Two-proportion z-test (unpooled SE for CI, pooled for test). */
export function twoProportionZ(x1: number, n1: number, x2: number, n2: number): { z: number; p: number } {
  const p = (x1 + x2) / (n1 + n2);
  const se = Math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2));
  const z = (x1 / n1 - x2 / n2) / se;
  return { z, p: 2 * normalSf(Math.abs(z)) };
}

/** Mantel–Haenszel pooled odds ratio across strata of 2×2 tables. */
export function mantelHaenszelOR(strata: TwoByTwo[]): number {
  let num = 0;
  let den = 0;
  for (const { a, b, c, d } of strata) {
    const n = a + b + c + d;
    if (n === 0) continue;
    num += (a * d) / n;
    den += (b * c) / n;
  }
  return num / den;
}

// ---------- Multiplicity ----------

export type AdjustMethod = 'bonferroni' | 'holm' | 'hochberg' | 'bh';

/** Adjusted p-values matching R's p.adjust(). */
export function pAdjust(ps: number[], method: AdjustMethod): number[] {
  const m = ps.length;
  const order = ps.map((p, i) => [p, i] as const).sort((x, y) => x[0] - y[0]);
  const out = new Array<number>(m);
  if (method === 'bonferroni') return ps.map((p) => Math.min(1, p * m));
  if (method === 'holm') {
    let running = 0;
    order.forEach(([p, i], k) => {
      running = Math.max(running, Math.min(1, (m - k) * p));
      out[i] = running;
    });
    return out;
  }
  // step-up procedures
  let running = 1;
  for (let k = m - 1; k >= 0; k--) {
    const [p, i] = order[k];
    const factor = method === 'hochberg' ? m - k : m / (k + 1);
    running = Math.min(running, Math.min(1, factor * p));
    out[i] = running;
  }
  return out;
}

/** Family-wise error rate for m independent tests at level alpha. */
export const fwer = (m: number, alpha = 0.05) => 1 - (1 - alpha) ** m;

// ---------- p-value re-expressions ----------

/** Shannon surprisal (S-value) in bits: −log2(p) (Greenland 2019). */
export const sValue = (p: number) => -Math.log2(p);

/**
 * Upper bound on the Bayes factor against H0 implied by a p-value:
 * 1 / (−e·p·ln p) for p < 1/e (Sellke, Bayarri & Berger 2001).
 */
export const bayesFactorBound = (p: number) => (p < 1 / Math.E ? 1 / (-Math.E * p * Math.log(p)) : 1);
