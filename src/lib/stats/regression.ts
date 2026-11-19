import { tQuantile, tTwoSidedP } from './distributions';
import { mean } from './inference';

export interface LinearFit {
  n: number;
  slope: number;
  intercept: number;
  r: number;
  r2: number;
  seSlope: number;
  seIntercept: number;
  slopeCI: [number, number];
  pSlope: number;
  residualSE: number;
  fitted: number[];
  residuals: number[];
  leverage: number[];
  cooksD: number[];
  predict: (x: number) => number;
  /** 95% CI for the mean response and 95% prediction interval at x */
  band: (x: number, conf?: number) => { fit: number; ciLow: number; ciHigh: number; piLow: number; piHigh: number };
}

/** Ordinary least squares for one predictor, with influence diagnostics. */
export function linearFit(x: number[], y: number[], conf = 0.95): LinearFit {
  const n = x.length;
  const mx = mean(x);
  const my = mean(y);
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (x[i] - mx) ** 2;
    sxy += (x[i] - mx) * (y[i] - my);
    syy += (y[i] - my) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const fitted = x.map((xi) => intercept + slope * xi);
  const residuals = y.map((yi, i) => yi - fitted[i]);
  const sse = residuals.reduce((s, e) => s + e * e, 0);
  const df = n - 2;
  const s2 = sse / df;
  const residualSE = Math.sqrt(s2);
  const seSlope = Math.sqrt(s2 / sxx);
  const seIntercept = Math.sqrt(s2 * (1 / n + (mx * mx) / sxx));
  const q = tQuantile(1 - (1 - conf) / 2, df);
  const leverage = x.map((xi) => 1 / n + (xi - mx) ** 2 / sxx);
  const cooksD = residuals.map((e, i) => (e * e * leverage[i]) / (2 * s2 * (1 - leverage[i]) ** 2));
  const r = sxy / Math.sqrt(sxx * syy);
  return {
    n,
    slope,
    intercept,
    r,
    r2: r * r,
    seSlope,
    seIntercept,
    slopeCI: [slope - q * seSlope, slope + q * seSlope],
    pSlope: tTwoSidedP(slope / seSlope, df),
    residualSE,
    fitted,
    residuals,
    leverage,
    cooksD,
    predict: (xv) => intercept + slope * xv,
    band: (xv, c = 0.95) => {
      const qq = tQuantile(1 - (1 - c) / 2, df);
      const fit = intercept + slope * xv;
      const seMean = residualSE * Math.sqrt(1 / n + (xv - mx) ** 2 / sxx);
      const sePred = residualSE * Math.sqrt(1 + 1 / n + (xv - mx) ** 2 / sxx);
      return { fit, ciLow: fit - qq * seMean, ciHigh: fit + qq * seMean, piLow: fit - qq * sePred, piHigh: fit + qq * sePred };
    },
  };
}

export const logistic = (x: number) => 1 / (1 + Math.exp(-x));
export const logit = (p: number) => Math.log(p / (1 - p));
