import { chiSquareSf, normalQuantile } from './distributions';

export interface SurvivalObs {
  time: number;
  /** 1 = event observed, 0 = right-censored */
  event: 0 | 1;
}

export interface KMStep {
  time: number;
  atRisk: number;
  events: number;
  censored: number;
  survival: number;
  lower: number;
  upper: number;
}

/**
 * Kaplan–Meier product-limit estimator with Greenwood variance and
 * log(−log) confidence limits (the default in lifelines and Stata).
 */
export function kaplanMeier(data: SurvivalObs[], conf = 0.95): { steps: KMStep[]; median: number | null } {
  const z = normalQuantile(1 - (1 - conf) / 2);
  const times = [...new Set(data.map((d) => d.time))].sort((a, b) => a - b);
  let atRisk = data.length;
  let s = 1;
  let greenwood = 0;
  const steps: KMStep[] = [{ time: 0, atRisk, events: 0, censored: 0, survival: 1, lower: 1, upper: 1 }];
  for (const t of times) {
    const here = data.filter((d) => d.time === t);
    const events = here.filter((d) => d.event === 1).length;
    const censored = here.length - events;
    if (events > 0) {
      s *= 1 - events / atRisk;
      if (atRisk > events) greenwood += events / (atRisk * (atRisk - events));
    }
    let lower = s;
    let upper = s;
    if (s > 0 && s < 1) {
      const v = greenwood / Math.log(s) ** 2;
      lower = s ** Math.exp(z * Math.sqrt(v));
      upper = s ** Math.exp(-z * Math.sqrt(v));
    } else if (s === 0) {
      lower = 0;
      upper = 0;
    }
    steps.push({ time: t, atRisk, events, censored, survival: s, lower, upper });
    atRisk -= here.length;
  }
  const crossing = steps.find((st) => st.survival <= 0.5);
  return { steps, median: crossing ? crossing.time : null };
}

/** Two-group log-rank (Mantel–Cox) test. */
export function logRank(g1: SurvivalObs[], g2: SurvivalObs[]) {
  const all = [...g1.map((d) => ({ ...d, g: 1 })), ...g2.map((d) => ({ ...d, g: 2 }))];
  const eventTimes = [...new Set(all.filter((d) => d.event === 1).map((d) => d.time))].sort((a, b) => a - b);
  let o1 = 0;
  let e1 = 0;
  let v = 0;
  for (const t of eventTimes) {
    const n1 = g1.filter((d) => d.time >= t).length;
    const n2 = g2.filter((d) => d.time >= t).length;
    const n = n1 + n2;
    const d1 = g1.filter((d) => d.time === t && d.event === 1).length;
    const d = all.filter((x) => x.time === t && x.event === 1).length;
    o1 += d1;
    e1 += (d * n1) / n;
    if (n > 1) v += (n1 * n2 * d * (n - d)) / (n * n * (n - 1));
  }
  const statistic = (o1 - e1) ** 2 / v;
  const o2 = g1.length + g2.length === 0 ? 0 : all.filter((d) => d.g === 2 && d.event === 1).length;
  const total = all.filter((d) => d.event === 1).length;
  return { statistic, p: chiSquareSf(statistic, 1), observed: [o1, o2], expected: [e1, total - e1] };
}

/**
 * Restricted mean survival time up to tau: area under the KM curve
 * (Royston & Parmar 2013; Uno et al. 2014).
 */
export function rmst(steps: KMStep[], tau: number): number {
  let area = 0;
  for (let i = 0; i < steps.length; i++) {
    const start = steps[i].time;
    if (start >= tau) break;
    const end = i + 1 < steps.length ? Math.min(steps[i + 1].time, tau) : tau;
    area += steps[i].survival * (end - start);
  }
  return area;
}
