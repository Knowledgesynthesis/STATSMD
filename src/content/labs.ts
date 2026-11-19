import type { LabId } from './types';

export interface LabMeta {
  id: LabId;
  title: string;
  summary: string;
  module: string;
}

export const labs: LabMeta[] = [
  { id: 'variable-sorter', title: 'Variable sorter', summary: 'Classify clinical variables by type, with feedback on the edge cases.', module: 'data-types' },
  { id: 'distribution', title: 'Skew, mean and median', summary: 'See how skew pulls the mean away from the median and inflates the SD.', module: 'data-types' },
  { id: 'ci-coverage', title: 'Confidence interval coverage', summary: 'Draw repeated samples and see what "95% confidence" really means.', module: 'estimation' },
  { id: 'p-dance', title: 'The dance of the p-values', summary: 'Replicate one experiment 20 times and watch the p-value jump around.', module: 'p-values' },
  { id: 'power', title: 'Power and sample size', summary: 'Calculate sample size for means or proportions and visualise α, β and power.', module: 'power' },
  { id: 'two-by-two', title: '2×2 table calculator', summary: 'RD, RR, OR and NNT with CIs, plus χ², N − 1 χ² and Fisher tests.', module: 'effect-measures' },
  { id: 'or-vs-rr', title: 'Odds ratio vs risk ratio', summary: 'Watch the OR and RR diverge as the outcome becomes common.', module: 'effect-measures' },
  { id: 'agreement', title: 'Correlation vs agreement', summary: 'Bland–Altman limits of agreement versus a misleadingly high r.', module: 'correlation-agreement' },
  { id: 'regression', title: 'Regression and influence', summary: 'Add points, fit least squares, and find leverage and influential points.', module: 'regression' },
  { id: 'simpson', title: "Simpson's paradox", summary: 'Confounding by severity reverses a treatment effect.', module: 'confounding' },
  { id: 'rtm', title: 'Regression to the mean', summary: 'Select high scorers, re-measure, and watch them "improve" untreated.', module: 'confounding' },
  { id: 'km', title: 'Kaplan–Meier builder', summary: 'Build survival curves from real trial data; RMST and log-rank included.', module: 'survival' },
  { id: 'diagnostic', title: 'Diagnostic test and Bayes', summary: 'Prevalence, PPV, NPV and likelihood ratios with a natural-frequency grid.', module: 'diagnostic' },
  { id: 'calibration', title: 'Discrimination vs calibration', summary: 'Overfit a model: the apparent AUC inflates and calibration fails in new patients.', module: 'prediction' },
  { id: 'multiplicity', title: 'Multiple testing', summary: 'Twenty tests, a few real effects: compare Bonferroni, Holm and BH.', module: 'multiplicity' },
  { id: 'forest', title: 'Forest plot and heterogeneity', summary: 'Random-effects pooling, τ², I² and the prediction interval.', module: 'meta-analysis' },
];

export const labsById: Record<string, LabMeta> = Object.fromEntries(labs.map((l) => [l.id, l]));
