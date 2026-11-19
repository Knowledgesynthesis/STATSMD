/**
 * Probability distributions implemented from first principles.
 * Accuracy is ~1e-12 relative in the central region; verified against
 * SciPy/R reference values in __tests__/stats.test.ts.
 *
 * Algorithms: Lanczos log-gamma (g = 7); regularized incomplete gamma via
 * series / continued fraction and regularized incomplete beta via modified
 * Lentz continued fraction (Press et al., Numerical Recipes, 3rd ed.);
 * inverse normal by Acklam's rational approximation + one Halley step.
 */

const EPS = 1e-15;
const FPMIN = 1e-300;
const MAX_IT = 1000;

const LANCZOS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
  -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
  1.5056327351493116e-7,
];

export function logGamma(x: number): number {
  if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - logGamma(1 - x);
  x -= 1;
  let a = LANCZOS[0];
  const t = x + 7.5;
  for (let i = 1; i < 9; i++) a += LANCZOS[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

export function logFactorial(n: number): number {
  return logGamma(n + 1);
}

export function logChoose(n: number, k: number): number {
  if (k < 0 || k > n) return -Infinity;
  return logFactorial(n) - logFactorial(k) - logFactorial(n - k);
}

/** Regularized lower (P) and upper (Q) incomplete gamma functions. */
export function gammaPQ(a: number, x: number): { P: number; Q: number } {
  if (x <= 0) return { P: 0, Q: 1 };
  const lnPre = -x + a * Math.log(x) - logGamma(a);
  if (x < a + 1) {
    let ap = a;
    let sum = 1 / a;
    let del = sum;
    for (let n = 0; n < MAX_IT; n++) {
      ap += 1;
      del *= x / ap;
      sum += del;
      if (Math.abs(del) < Math.abs(sum) * EPS) break;
    }
    const P = sum * Math.exp(lnPre);
    return { P, Q: 1 - P };
  }
  let b = x + 1 - a;
  let c = 1 / FPMIN;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < MAX_IT; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = b + an / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  const Q = Math.exp(lnPre) * h;
  return { P: 1 - Q, Q };
}

function betaContinuedFraction(a: number, b: number, x: number): number {
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= MAX_IT; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return h;
}

/** Regularized incomplete beta I_x(a, b). */
export function incompleteBeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const lnBt = logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x);
  if (x < (a + 1) / (a + b + 2)) return (Math.exp(lnBt) * betaContinuedFraction(a, b, x)) / a;
  return 1 - (Math.exp(lnBt) * betaContinuedFraction(b, a, 1 - x)) / b;
}

// ---------- Normal ----------

export function normalPdf(z: number, mu = 0, sd = 1): number {
  const u = (z - mu) / sd;
  return Math.exp(-0.5 * u * u) / (sd * Math.sqrt(2 * Math.PI));
}

/** Upper tail P(Z > z), precise in the far tail. */
export function normalSf(z: number): number {
  const q = 0.5 * gammaPQ(0.5, (z * z) / 2).Q;
  return z >= 0 ? q : 1 - q;
}

export function normalCdf(z: number): number {
  return normalSf(-z);
}

const A = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
const B = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
const C = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
const D = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];

export function normalQuantile(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const plow = 0.02425;
  let x: number;
  if (p < plow) {
    const q = Math.sqrt(-2 * Math.log(p));
    x = (((((C[0] * q + C[1]) * q + C[2]) * q + C[3]) * q + C[4]) * q + C[5]) / ((((D[0] * q + D[1]) * q + D[2]) * q + D[3]) * q + 1);
  } else if (p <= 1 - plow) {
    const q = p - 0.5;
    const r = q * q;
    x = ((((((A[0] * r + A[1]) * r + A[2]) * r + A[3]) * r + A[4]) * r + A[5]) * q) / (((((B[0] * r + B[1]) * r + B[2]) * r + B[3]) * r + B[4]) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    x = -(((((C[0] * q + C[1]) * q + C[2]) * q + C[3]) * q + C[4]) * q + C[5]) / ((((D[0] * q + D[1]) * q + D[2]) * q + D[3]) * q + 1);
  }
  // One Halley refinement step
  const e = normalCdf(x) - p;
  const u = e * Math.sqrt(2 * Math.PI) * Math.exp((x * x) / 2);
  return x - u / (1 + (x * u) / 2);
}

// ---------- Student t ----------

export function tCdf(t: number, df: number): number {
  if (!Number.isFinite(t)) return t > 0 ? 1 : 0;
  const tail = 0.5 * incompleteBeta(df / (df + t * t), df / 2, 0.5);
  return t > 0 ? 1 - tail : tail;
}

/** Two-sided p-value for a t statistic. */
export function tTwoSidedP(t: number, df: number): number {
  return Math.min(1, incompleteBeta(df / (df + t * t), df / 2, 0.5));
}

export function tQuantile(p: number, df: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p === 0.5) return 0;
  // Bracket, then bisect (robust for any df > 0, including fractional Welch df)
  let lo = -1;
  let hi = 1;
  while (tCdf(lo, df) > p) lo *= 2;
  while (tCdf(hi, df) < p) hi *= 2;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (tCdf(mid, df) < p) lo = mid;
    else hi = mid;
    if (hi - lo < 1e-12 * Math.max(1, Math.abs(mid))) break;
  }
  return (lo + hi) / 2;
}

export function tPdf(t: number, df: number): number {
  const lnC = logGamma((df + 1) / 2) - logGamma(df / 2) - 0.5 * Math.log(df * Math.PI);
  return Math.exp(lnC - ((df + 1) / 2) * Math.log(1 + (t * t) / df));
}

// ---------- Chi-square & F ----------

export function chiSquareSf(x: number, df: number): number {
  return gammaPQ(df / 2, x / 2).Q;
}

export function chiSquareCdf(x: number, df: number): number {
  return gammaPQ(df / 2, x / 2).P;
}

export function chiSquareQuantile(p: number, df: number): number {
  let lo = 0;
  let hi = Math.max(1, df);
  while (chiSquareCdf(hi, df) < p) hi *= 2;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (chiSquareCdf(mid, df) < p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export function fSf(f: number, d1: number, d2: number): number {
  if (f <= 0) return 1;
  return incompleteBeta(d2 / (d2 + d1 * f), d2 / 2, d1 / 2);
}

export function fQuantile(p: number, d1: number, d2: number): number {
  let lo = 0;
  let hi = 1;
  while (1 - fSf(hi, d1, d2) < p) hi *= 2;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (1 - fSf(mid, d1, d2) < p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
