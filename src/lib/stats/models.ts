import { chiSquareSf, normalQuantile, tQuantile } from './distributions';
import { logistic } from './regression';

// ---------- Logistic regression (IRLS / Newton–Raphson) ----------

function solve(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    const piv = M[c][c] || 1e-12;
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c] / piv;
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((row, i) => row[n] / (row[i] || 1e-12));
}

export interface LogisticFit {
  /** [intercept, β1, …] */
  coef: number[];
  logLik: number;
  nullLogLik: number;
  lrChi2: number;
  converged: boolean;
  predict: (x: number[]) => number;
}

/** Maximum-likelihood logistic regression. X excludes the intercept column. */
export function logisticFit(X: number[][], y: number[], maxIter = 50): LogisticFit {
  const n = y.length;
  const k = (X[0]?.length ?? 0) + 1;
  const row = (i: number) => [1, ...X[i]];
  let beta = new Array<number>(k).fill(0);
  const ll = (b: number[]) => {
    let s = 0;
    for (let i = 0; i < n; i++) {
      const eta = row(i).reduce((acc, v, j) => acc + v * b[j], 0);
      s += y[i] * eta - Math.log1p(Math.exp(eta));
    }
    return s;
  };
  let converged = false;
  let prev = ll(beta);
  for (let it = 0; it < maxIter; it++) {
    const H = Array.from({ length: k }, () => new Array<number>(k).fill(0));
    const g = new Array<number>(k).fill(0);
    for (let i = 0; i < n; i++) {
      const xi = row(i);
      const p = logistic(xi.reduce((acc, v, j) => acc + v * beta[j], 0));
      const w = Math.max(p * (1 - p), 1e-10);
      for (let a = 0; a < k; a++) {
        g[a] += (y[i] - p) * xi[a];
        for (let c = a; c < k; c++) H[a][c] += w * xi[a] * xi[c];
      }
    }
    for (let a = 0; a < k; a++) for (let c = 0; c < a; c++) H[a][c] = H[c][a];
    // small ridge for numerical stability under (quasi-)separation
    for (let a = 0; a < k; a++) H[a][a] += 1e-8;
    const step = solve(H, g);
    let t = 1;
    let next = beta.map((b, j) => b + t * step[j]);
    let cur = ll(next);
    while (cur < prev - 1e-12 && t > 1e-4) {
      t /= 2;
      next = beta.map((b, j) => b + t * step[j]);
      cur = ll(next);
    }
    beta = next;
    if (Math.abs(cur - prev) < 1e-10) {
      converged = true;
      prev = cur;
      break;
    }
    prev = cur;
  }
  const ybar = y.reduce((s, v) => s + v, 0) / n;
  const nullLogLik = n * (ybar > 0 && ybar < 1 ? ybar * Math.log(ybar) + (1 - ybar) * Math.log(1 - ybar) : 0);
  const coef = beta;
  return {
    coef,
    logLik: prev,
    nullLogLik,
    lrChi2: 2 * (prev - nullLogLik),
    converged,
    predict: (x) => logistic(coef[0] + x.reduce((acc, v, j) => acc + v * coef[j + 1], 0)),
  };
}

/** AUC / C-statistic via the Mann–Whitney identity (ties count ½). */
export function auc(scores: number[], labels: number[]): number {
  const idx = scores.map((s, i) => [s, labels[i]] as const).sort((a, b) => a[0] - b[0]);
  let rankSum = 0;
  let nPos = 0;
  let i = 0;
  while (i < idx.length) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++;
    const r = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) if (idx[k][1] === 1) {
      rankSum += r;
      nPos++;
    }
    i = j + 1;
  }
  const nNeg = idx.length - nPos;
  return (rankSum - (nPos * (nPos + 1)) / 2) / (nPos * nNeg);
}

/** Calibration slope and intercept: logistic regression of y on logit(p̂). */
export function calibrationSlope(pred: number[], y: number[]): { slope: number; intercept: number } {
  const lp = pred.map((p) => Math.log(Math.min(1 - 1e-9, Math.max(1e-9, p)) / (1 - Math.min(1 - 1e-9, Math.max(1e-9, p)))));
  const fit = logisticFit(lp.map((v) => [v]), y);
  return { intercept: fit.coef[0], slope: fit.coef[1] };
}

// ---------- Meta-analysis ----------

export interface MetaResult {
  k: number;
  fixed: { est: number; se: number; ci: [number, number] };
  Q: number;
  pQ: number;
  I2: number;
  tau2DL: number;
  tau2PM: number;
  /** Random effects with Paule–Mandel τ² */
  random: { est: number; se: number; ciWald: [number, number]; ciHK: [number, number]; pi: [number, number] };
  /** Random effects with DerSimonian–Laird τ² and Wald CI (for comparison) */
  randomDL: { est: number; ci: [number, number] };
  weightsRandom: number[];
}

function pooled(y: number[], v: number[], tau2: number) {
  const w = v.map((vi) => 1 / (vi + tau2));
  const sw = w.reduce((a, b) => a + b, 0);
  const est = w.reduce((a, wi, i) => a + wi * y[i], 0) / sw;
  return { est, se: Math.sqrt(1 / sw), w, sw };
}

const qStat = (y: number[], v: number[], tau2: number) => {
  const { est, w } = pooled(y, v, tau2);
  return w.reduce((a, wi, i) => a + wi * (y[i] - est) ** 2, 0);
};

/** Inverse-variance meta-analysis of estimates y with standard errors se (on an additive scale, e.g. log RR). */
export function metaAnalysis(y: number[], se: number[], conf = 0.95): MetaResult {
  const k = y.length;
  const v = se.map((s) => s * s);
  const z = normalQuantile(1 - (1 - conf) / 2);
  const fe = pooled(y, v, 0);
  const Q = qStat(y, v, 0);
  const df = k - 1;
  const sw = fe.sw;
  const sw2 = fe.w.reduce((a, w) => a + w * w, 0);
  const tau2DL = Math.max(0, (Q - df) / (sw - sw2 / sw));
  // Paule–Mandel: solve Q(τ²) = k − 1 (Q is decreasing in τ²)
  let tau2PM = 0;
  if (qStat(y, v, 0) > df) {
    let lo = 0;
    let hi = Math.max(1, tau2DL * 10);
    while (qStat(y, v, hi) > df) hi *= 2;
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2;
      if (qStat(y, v, mid) > df) lo = mid;
      else hi = mid;
    }
    tau2PM = (lo + hi) / 2;
  }
  const re = pooled(y, v, tau2PM);
  const qHK = re.w.reduce((a, w, i) => a + w * (y[i] - re.est) ** 2, 0) / df;
  const seHK = Math.sqrt(qHK / re.sw);
  const tk1 = tQuantile(1 - (1 - conf) / 2, df);
  const tk2 = k > 2 ? tQuantile(1 - (1 - conf) / 2, k - 2) : Infinity;
  const piHalf = tk2 * Math.sqrt(tau2PM + re.se * re.se);
  const dl = pooled(y, v, tau2DL);
  return {
    k,
    fixed: { est: fe.est, se: fe.se, ci: [fe.est - z * fe.se, fe.est + z * fe.se] },
    Q,
    pQ: chiSquareSf(Q, df),
    I2: Q > 0 ? Math.max(0, (Q - df) / Q) : 0,
    tau2DL,
    tau2PM,
    random: {
      est: re.est,
      se: re.se,
      ciWald: [re.est - z * re.se, re.est + z * re.se],
      ciHK: [re.est - tk1 * seHK, re.est + tk1 * seHK],
      pi: [re.est - piHalf, re.est + piHalf],
    },
    randomDL: { est: dl.est, ci: [dl.est - z * dl.se, dl.est + z * dl.se] },
    weightsRandom: re.w.map((w) => w / re.sw),
  };
}
