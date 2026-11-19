import { describe, expect, it } from 'vitest';
import {
  chiSquareQuantile,
  chiSquareSf,
  chiSquareTest,
  createRng,
  effectMeasures,
  fisherExact,
  fQuantile,
  fSf,
  kaplanMeier,
  linearFit,
  logRank,
  mcnemar,
  normalCdf,
  normalQuantile,
  pAdjust,
  pairedTTest,
  pearson,
  powerTwoMeans,
  rmst,
  rnorm,
  sampleSizeTwoMeans,
  sampleSizeTwoProportions,
  spearman,
  tCdf,
  tQuantile,
  tTestSummary,
  wilsonCI,
  correlationP,
  bayesFactorBound,
  sValue,
  type SurvivalObs,
} from '..';

// Reference values computed with SciPy 1.18, statsmodels 0.15 and lifelines 0.30.
const close = (a: number, b: number, tol = 1e-6) => expect(Math.abs(a - b)).toBeLessThan(tol);

describe('distributions', () => {
  it('normal', () => {
    close(normalQuantile(0.975), 1.959963984540054, 1e-9);
    close(normalCdf(-3), 0.0013498980316300933, 1e-12);
    close(normalQuantile(1e-10), -6.361340902404056, 1e-7);
    close(normalCdf(normalQuantile(0.3)), 0.3, 1e-12);
  });
  it('student t', () => {
    close(tCdf(2, 5), 0.9490302605850708, 1e-10);
    close(tCdf(-2.5, 20), 0.01061677271956619, 1e-10);
    close(tQuantile(0.975, 10), 2.228138851986274, 1e-8);
    close(tQuantile(0.975, 1), 12.706204736174694, 1e-6);
    close(tQuantile(0.975, 7.3), 2.345066736547703, 1e-8);
  });
  it('chi-square and F', () => {
    close(chiSquareSf(10, 3), 0.01856613546304325, 1e-10);
    close(chiSquareQuantile(0.95, 4), 9.487729036781154, 1e-7);
    expect(chiSquareSf(50, 1) / 1.537459794428033e-12).toBeCloseTo(1, 6);
    close(fSf(3.5, 3, 20), 0.03449310388512439, 1e-10);
    close(fQuantile(0.95, 2, 10), 4.1028210151304, 1e-7);
  });
});

describe('categorical tests', () => {
  it('Fisher exact (two-sided, R/SciPy convention)', () => {
    close(fisherExact({ a: 3, b: 1, c: 1, d: 3 }).p, 0.48571428571428565, 1e-12);
    close(fisherExact({ a: 1, b: 11, c: 9, d: 3 }).p, 0.0027594561852200836, 1e-12);
    close(fisherExact({ a: 10, b: 2, c: 3, d: 15 }).p, 0.0005367241191434357, 1e-12);
  });
  it('Pearson chi-square with and without Yates', () => {
    const t = [[20, 80], [35, 65]];
    close(chiSquareTest(t).statistic, 5.642633228840125, 1e-10);
    close(chiSquareTest(t).p, 0.017528861260372782, 1e-10);
    close(chiSquareTest(t, { yates: true }).statistic, 4.915360501567398, 1e-10);
    close(chiSquareTest(t, { yates: true }).p, 0.02661890761245943, 1e-10);
  });
  it('McNemar exact equals binomial tail', () => {
    // b = 2, c = 8 → 2·P(X ≤ 2 | n = 10, p = .5) = 2·56/1024
    close(mcnemar(2, 8).exactP, (2 * 56) / 1024, 1e-12);
    close(mcnemar(2, 8).statistic, 3.6, 1e-12);
  });
  it('Wilson interval', () => {
    const [l, u] = wilsonCI(8, 20);
    close(l, 0.21880653237281705, 1e-9);
    close(u, 0.6134184992377469, 1e-9);
  });
  it('effect measures and NNT', () => {
    // 20/100 vs 35/100 → RR 0.571, RD −0.15, NNTB 6.7
    const em = effectMeasures({ a: 20, b: 80, c: 35, d: 65 });
    close(em.rr, 20 / 35, 1e-12);
    close(em.or, (20 * 65) / (80 * 35), 1e-12);
    close(em.rd, -0.15, 1e-12);
    expect(em.nnt.kind).toBe('NNTB');
    close(em.nnt.value, 1 / 0.15, 1e-9);
    expect(em.rdCI[1]).toBeLessThan(0);
    // Woolf CI for OR
    const se = Math.sqrt(1 / 20 + 1 / 80 + 1 / 35 + 1 / 65);
    close(em.orCI[0], em.or * Math.exp(-1.959963984540054 * se), 1e-9);
  });
  it('NNT CI passes through infinity when RD CI spans 0', () => {
    const em = effectMeasures({ a: 10, b: 90, c: 12, d: 88 });
    expect(em.nnt.ciText).toContain('∞');
  });
  it('zero cells trigger Haldane correction for ratios', () => {
    const em = effectMeasures({ a: 0, b: 50, c: 5, d: 45 });
    expect(em.correctionApplied).toBe(true);
    expect(Number.isFinite(em.or)).toBe(true);
  });
});

describe('t-tests', () => {
  it('Welch and Student from summary stats', () => {
    const w = tTestSummary(10, 2, 15, 12, 3, 12);
    close(w.t, -1.983538814721859, 1e-10);
    close(w.p, 0.0624440929639274, 1e-10);
    const s = tTestSummary(10, 2, 15, 12, 3, 12, { welch: false });
    close(s.t, -2.0739033894608507, 1e-10);
    close(s.p, 0.04853992114372369, 1e-10);
  });
  it('paired t-test', () => {
    const r = pairedTTest([5, 6, 7, 8, 9, 7], [6, 8, 7, 10, 11, 9]);
    close(r.t, -4.391550328268399, 1e-10);
    close(r.p, 0.0070775979254982845, 1e-10);
    expect(r.df).toBe(5);
  });
});

describe('correlation and regression', () => {
  it('Pearson, Spearman (with ties)', () => {
    close(pearson([1, 2, 3, 4, 5, 6], [2, 1, 4, 3, 6, 5]), 0.8285714285714285, 1e-12);
    close(correlationP(0.8285714285714285, 6), 0.04156268221574347, 1e-9);
    close(spearman([1, 2, 2, 3, 4], [1, 3, 2, 2, 5]), 0.7631578947368421, 1e-12);
  });
  it('OLS matches scipy.linregress', () => {
    const f = linearFit([1, 2, 3, 4, 5, 6, 7, 8], [2.1, 3.9, 6.2, 7.8, 10.1, 12.2, 13.8, 16.5]);
    close(f.slope, 2.030952380952381, 1e-10);
    close(f.intercept, -0.06428571428571495, 1e-10);
    close(f.r, 0.9989776683093574, 1e-10);
    close(f.seSlope, 0.03752046556689969, 1e-10);
    close(f.seIntercept, 0.18946906364127386, 1e-10);
    expect(f.pSlope / 2.669208041839641e-9).toBeCloseTo(1, 5);
    // Prediction interval is always wider than the CI for the mean
    const b = f.band(4.5);
    expect(b.piHigh - b.piLow).toBeGreaterThan(b.ciHigh - b.ciLow);
  });
});

describe('multiplicity (matches statsmodels / R p.adjust)', () => {
  const p = [0.01, 0.02, 0.03, 0.04, 0.05, 0.2, 0.003];
  const round = (xs: number[]) => xs.map((x) => Math.round(x * 1e6) / 1e6);
  it('bonferroni', () => expect(round(pAdjust(p, 'bonferroni'))).toEqual([0.07, 0.14, 0.21, 0.28, 0.35, 1, 0.021]));
  it('holm', () => expect(round(pAdjust(p, 'holm'))).toEqual([0.06, 0.1, 0.12, 0.12, 0.12, 0.2, 0.021]));
  it('hochberg', () => expect(round(pAdjust(p, 'hochberg'))).toEqual([0.06, 0.1, 0.1, 0.1, 0.1, 0.2, 0.021]));
  it('benjamini-hochberg', () =>
    expect(round(pAdjust(p, 'bh'))).toEqual([0.035, 0.046667, 0.0525, 0.056, 0.058333, 0.2, 0.021]));
});

describe('power and sample size', () => {
  it('two means within 1 participant of exact noncentral t (statsmodels)', () => {
    for (const [d, exact] of [[0.2, 393.4056930002526], [0.5, 63.76561058891169], [0.8, 25.524571854446116]]) {
      const { n1 } = sampleSizeTwoMeans({ delta: d, sd: 1 });
      expect(n1).toBe(Math.ceil(exact));
    }
  });
  it('power for d = 0.5, n = 50/group', () => close(powerTwoMeans({ delta: 0.5, sd: 1, n1: 50 }), 0.6968934055333837, 2e-3));
  it('two proportions (R power.prop.test: 0.6 vs 0.4 → 96.92)', () => {
    close(sampleSizeTwoProportions({ p1: 0.6, p2: 0.4 }).raw, 96.92, 0.01);
  });
});

describe('survival (Freireich 6-MP leukaemia data, matches lifelines)', () => {
  const mpT = [6, 6, 6, 6, 7, 9, 10, 10, 11, 13, 16, 17, 19, 20, 22, 23, 25, 32, 32, 34, 35];
  const mpE = [1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0];
  const plT = [1, 1, 2, 2, 3, 4, 4, 5, 5, 8, 8, 8, 8, 11, 11, 12, 12, 15, 17, 22, 23];
  const mp: SurvivalObs[] = mpT.map((time, i) => ({ time, event: mpE[i] as 0 | 1 }));
  const pl: SurvivalObs[] = plT.map((time) => ({ time, event: 1 }));
  it('KM curve, Greenwood log-log CI and median', () => {
    const km = kaplanMeier(mp);
    expect(km.median).toBe(23);
    const s = km.steps.map((st) => Math.round(st.survival * 1e4) / 1e4);
    expect(s).toEqual([1, 0.8571, 0.8067, 0.8067, 0.7529, 0.7529, 0.6902, 0.6275, 0.6275, 0.6275, 0.6275, 0.5378, 0.4482, 0.4482, 0.4482, 0.4482, 0.4482]);
    close(km.steps[1].lower, 0.6197, 1e-4);
    close(km.steps[1].upper, 0.9516, 1e-4);
    expect(kaplanMeier(pl).median).toBe(8);
  });
  it('log-rank', () => {
    const lr = logRank(mp, pl);
    close(lr.statistic, 16.792940989216547, 1e-9);
    close(lr.p, 4.168809109334511e-5, 1e-10);
  });
  it('RMST of a curve with no events equals tau', () => {
    const km = kaplanMeier([{ time: 10, event: 0 }, { time: 12, event: 0 }]);
    close(rmst(km.steps, 8), 8, 1e-12);
  });
});

describe('random + misc', () => {
  it('seeded RNG is reproducible and roughly standard normal', () => {
    const a = createRng(42);
    const b = createRng(42);
    expect(a()).toBe(b());
    const r = createRng(7);
    const xs = Array.from({ length: 20000 }, () => rnorm(r));
    const m = xs.reduce((s, x) => s + x, 0) / xs.length;
    expect(Math.abs(m)).toBeLessThan(0.03);
  });
  it('S-value and Bayes factor bound', () => {
    close(sValue(0.05), 4.321928094887363, 1e-12);
    close(bayesFactorBound(0.05), 2.4562, 1e-3);
  });
});

describe('models (match statsmodels)', () => {
  it('logistic regression by IRLS', async () => {
    const { logisticFit } = await import('../models');
    const X = [[0.5, 1.2], [1.5, -0.3], [2.0, 0.8], [-0.4, 0.1], [0.9, 2.2], [1.1, -1.0], [2.5, 0.4], [-1.2, 0.9], [0.3, -0.6], [1.8, 1.5], [-0.7, -1.1], [0.0, 0.3]];
    const y = [0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1];
    const f = logisticFit(X, y);
    expect(f.converged).toBe(true);
    [-1.80094261963388, 2.0678322785576233, 1.149456643437941].forEach((b, i) => close(f.coef[i], b, 1e-6));
    close(f.logLik, -3.8755348624072736, 1e-8);
    close(f.nullLogLik, -8.317766166719343, 1e-8);
  });
  it('AUC with ties', async () => {
    const { auc } = await import('../models');
    close(auc([0.1, 0.4, 0.35, 0.8, 0.2, 0.9, 0.4, 0.4], [0, 0, 1, 1, 0, 1, 1, 0]), 0.8125, 1e-12);
  });
  it('meta-analysis: FE, DL and Paule–Mandel τ², Hartung–Knapp CI', async () => {
    const { metaAnalysis } = await import('../models');
    const y = [0.7, 0.85, 0.6, 1.05, 0.75, 0.9, 0.5].map(Math.log);
    const se = [0.15, 0.2, 0.25, 0.12, 0.3, 0.18, 0.35];
    const m = metaAnalysis(y, se);
    close(m.fixed.est, -0.17952169023561712, 1e-9);
    close(m.fixed.se, 0.069838, 1e-6);
    close(m.Q, 9.231413409259591, 1e-9);
    close(m.I2, 0.35004535773669443, 1e-9);
    close(m.tau2DL, 0.019946829610565407, 1e-9);
    close(m.tau2PM, 0.015368183622683535, 1e-7);
    close(m.random.est, -0.21184001900370372, 1e-6);
    close(m.random.se, 0.08818818521102877, 1e-6);
    close(m.randomDL.est, -0.21751395983433863, 1e-9);
    close(m.random.ciHK[0], -0.42762878990218445, 1e-6);
    close(m.random.ciHK[1], 0.003948751894777031, 1e-6);
    close(m.random.pi[0], -0.6029178640006964, 1e-6);
    close(m.random.pi[1], 0.17923782599328894, 1e-6);
  });
});
