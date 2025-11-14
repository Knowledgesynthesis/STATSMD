import type { Assumption } from '../../types';

export const assumptions: Assumption[] = [
  {
    id: 'normality',
    name: 'Normality',
    description:
      'Data follows a normal (Gaussian) distribution. Critical for parametric tests like t-tests and ANOVA.',
    howToCheck: [
      'Visual: Histogram, Q-Q plot',
      'Statistical: Shapiro-Wilk test, Kolmogorov-Smirnov test',
      'Rule of thumb: With large samples (n>30), CLT makes tests robust to mild violations',
    ],
    whatIfViolated:
      'Results may be unreliable, particularly with small samples. P-values and confidence intervals may be inaccurate.',
    remedies: [
      'Use non-parametric alternative (e.g., Mann-Whitney instead of t-test)',
      'Transform data (log, square root) if appropriate',
      'Use robust statistics',
      'Increase sample size (Central Limit Theorem)',
    ],
  },
  {
    id: 'homoscedasticity',
    name: 'Homoscedasticity (Equal Variances)',
    description:
      'Variances are equal across groups or across the range of predictor variables.',
    howToCheck: [
      "Visual: Residual plots (residuals vs. fitted values)",
      "Statistical: Levene's test, Bartlett's test (sensitive to non-normality)",
      'For regression: Plot residuals vs fitted values; look for funnel shape',
    ],
    whatIfViolated:
      'Standard errors and p-values may be inaccurate. Particularly problematic when group sizes are unequal.',
    remedies: [
      "Use Welch's t-test instead of standard t-test",
      'Use robust standard errors in regression',
      'Transform outcome variable',
      'Use weighted regression',
      'Use non-parametric tests',
    ],
  },
  {
    id: 'independence',
    name: 'Independence of Observations',
    description:
      'Each observation is independent; one observation does not influence another.',
    howToCheck: [
      'Consider study design: Are observations clustered? (e.g., patients within hospitals)',
      'Check for repeated measures on same subjects',
      'For regression: Durbin-Watson test for autocorrelation',
      'Visual: Plot residuals over time or sequence',
    ],
    whatIfViolated:
      'Standard errors underestimated, p-values too small, increased Type I error.',
    remedies: [
      'Use mixed models or multilevel models for clustered data',
      'Use repeated measures ANOVA for within-subject designs',
      'Use GEE (Generalized Estimating Equations)',
      'Account for clustering with robust standard errors',
      'Use time series methods if temporal correlation exists',
    ],
  },
  {
    id: 'linearity',
    name: 'Linearity',
    description:
      'The relationship between predictor and outcome is linear. Applies to linear regression and logistic regression (linear in log-odds).',
    howToCheck: [
      'Visual: Scatter plots of outcome vs predictors',
      'Residual plots: residuals vs each predictor',
      'For logistic regression: Box-Tidwell test, smoothed scatter plots',
    ],
    whatIfViolated:
      'Model predictions will be biased. Coefficients will not accurately represent the relationship.',
    remedies: [
      'Transform variables (log, polynomial, splines)',
      'Add polynomial terms (quadratic, cubic)',
      'Use generalized additive models (GAM)',
      'Categorize continuous predictors (with caution)',
    ],
  },
  {
    id: 'proportional-hazards',
    name: 'Proportional Hazards',
    description:
      'In Cox regression, the hazard ratio between groups remains constant over time.',
    howToCheck: [
      'Visual: Log-log survival plots should be parallel',
      'Statistical: Test time-dependent covariates, Schoenfeld residuals',
    ],
    whatIfViolated:
      'Hazard ratio estimates are averaged over time and may not reflect time-varying effects.',
    remedies: [
      'Stratify by the variable violating the assumption',
      'Include time-dependent covariates',
      'Use parametric survival models',
      'Split analysis by time periods',
    ],
  },
  {
    id: 'no-multicollinearity',
    name: 'No Multicollinearity',
    description:
      'Predictor variables are not highly correlated with each other in regression models.',
    howToCheck: [
      'Correlation matrix of predictors',
      'Variance Inflation Factor (VIF): VIF > 10 suggests problem, VIF > 5 warrants attention',
      'Condition number',
    ],
    whatIfViolated:
      'Coefficient estimates become unstable and unreliable. Standard errors inflate. Difficult to determine individual predictor effects.',
    remedies: [
      'Remove one of the correlated predictors',
      'Combine correlated predictors into a composite score',
      'Use ridge regression or LASSO',
      'Principal component analysis',
      'Increase sample size',
    ],
  },
];
