import type { DecisionNode } from './types';

export const ROOT = 'goal';

export const decisionTree: DecisionNode[] = [
  {
    id: 'goal',
    question: 'What are you trying to do?',
    help: 'Start from the research question, not from the data you happen to have.',
    options: [
      { label: 'Estimate the effect of a treatment or exposure on an outcome', detail: 'Compare groups, with or without adjustment', next: 'outcome' },
      { label: 'Describe the association between two variables', detail: 'How strongly do X and Y move together?', next: 'assoc' },
      { label: 'Assess agreement or reliability', detail: 'Two methods, two raters, or repeated measurements of the same thing', next: 'agree' },
      {
        label: 'Evaluate a diagnostic test',
        detail: 'Index test vs reference standard',
        result: { primary: 'diagnostic-accuracy', also: ['roc'], why: 'Estimate sensitivity and specificity in a consecutive sample of the intended-use population; convert to predictive values for the prevalence where the test will be used.', watch: 'Two-gate (case-control) sampling and partial verification inflate accuracy. Assess with QUADAS-2 and report per STARD 2015.' },
      },
      { label: 'Develop or validate a prediction model', detail: 'Predict individual risk from several predictors', next: 'predict' },
      {
        label: 'Combine results from several studies',
        result: { primary: 'meta-analysis', why: 'A random-effects model estimates the average effect and how much true effects vary between studies.', watch: 'Report τ² and a prediction interval, not just I². With few studies use Hartung–Knapp CIs.' },
      },
    ],
  },
  {
    id: 'outcome',
    question: 'What type of outcome are you analysing?',
    help: 'The outcome (dependent variable) drives the choice of method more than anything else.',
    options: [
      { label: 'Continuous', detail: 'BP, HbA1c, length of stay, a score with many levels', next: 'cont-structure' },
      { label: 'Binary', detail: 'Died / survived, infection yes / no', next: 'bin-structure' },
      { label: 'Ordinal', detail: 'Ordered categories: mRS, NYHA class, Likert item', next: 'ord-structure' },
      {
        label: 'Nominal with 3+ unordered categories',
        detail: 'Discharge destination, tumour subtype',
        result: { primary: 'multinomial-logistic', why: 'Models the odds of each category relative to a reference.', watch: 'Merge sparse categories on clinical grounds before analysis, not after looking at results.' },
      },
      { label: 'Count or rate', detail: 'Exacerbations, falls, infections per catheter-day', next: 'count' },
      { label: 'Time to event', detail: 'Time to death, relapse, discharge — with censoring', next: 'tte' },
    ],
  },
  {
    id: 'cont-structure',
    question: 'How are the observations related?',
    help: 'Paired and clustered data carry less independent information than their row count suggests. Getting this wrong is the commonest serious error.',
    options: [
      { label: 'Independent groups', detail: 'Each person contributes one value to one group', next: 'cont-groups' },
      { label: 'Paired', detail: 'Same people measured twice, or 1:1 matched pairs', next: 'cont-paired' },
      {
        label: 'Repeated over time (3+ times) or clustered',
        detail: 'Visits within patients; patients within hospitals',
        result: { primary: 'mixed-model', also: ['gee'], why: 'Models the correlation between observations from the same patient or cluster and uses all available data under missing-at-random.', watch: 'Do not average or analyse visits as independent rows; avoid last-observation-carried-forward.' },
      },
    ],
  },
  {
    id: 'cont-groups',
    question: 'What comparison do you need?',
    options: [
      { label: 'Two groups, unadjusted', next: 'cont-two-shape' },
      {
        label: 'Three or more groups',
        result: { primary: 'anova', also: ['kruskal-wallis', 'linear-regression'], why: 'Welch\'s ANOVA tests for any difference between means without assuming equal variances; follow with pre-specified contrasts.', watch: 'If the groups are ordered (dose levels, age bands), model a trend with regression instead of a global test.' },
      },
      {
        label: 'RCT with the outcome also measured at baseline',
        result: { primary: 'ancova', why: 'Adjusting for the baseline value is unbiased in randomised trials and more powerful than comparing change scores or follow-up values alone.', watch: 'Also adjust for any stratification factors used in randomisation. Do not test baseline balance.' },
      },
      {
        label: 'Adjusted for confounders or several predictors',
        result: { primary: 'linear-regression', why: 'Estimates the mean difference while holding other covariates fixed.', watch: 'Choose covariates from causal knowledge (a DAG), not stepwise selection. Model continuous covariates flexibly (splines).' },
      },
    ],
  },
  {
    id: 'cont-two-shape',
    question: 'What do the data look like?',
    help: 'Judge from plots and subject knowledge — not from a normality test.',
    options: [
      {
        label: 'Roughly symmetric, or moderate samples without extreme skew',
        result: { primary: 'welch-t', also: ['linear-regression'], why: 'Compares means without assuming equal variances. The t-test is robust to non-normal data once groups are moderately sized because it relies on the sampling distribution of the mean.', watch: 'Use Welch by default; do not pick Student vs Welch from a Levene test.' },
      },
      {
        label: 'Strongly right-skewed positive values',
        detail: 'Costs, LOS, CRP, viral load',
        result: { primary: 'welch-t', also: ['mann-whitney', 'linear-regression'], why: 'Analyse log-transformed values with a Welch t-test (or regression on log y); back-transformed results are ratios of geometric means, e.g., "25% higher".', watch: 'If the clinical question is about mean cost (budgets), analyse means on the original scale with robust methods rather than the log scale.' },
      },
      {
        label: 'Small samples with outliers, or the question is "do values tend to be higher?"',
        result: { primary: 'mann-whitney', also: ['welch-t'], why: 'Rank-based test of stochastic superiority, insensitive to outliers.', watch: 'It is a test of medians only if both distributions have the same shape. Report a Hodges–Lehmann shift with CI.' },
      },
    ],
  },
  {
    id: 'cont-paired',
    question: 'What do the within-pair differences look like?',
    options: [
      {
        label: 'Roughly symmetric, or ≥ ~20 pairs',
        result: { primary: 'paired-t', why: 'Estimates the mean within-pair difference; uses the SD of differences, which removes between-person variation.', watch: 'A pre–post change without a control group is not a treatment effect — regression to the mean and secular trends produce change on their own.' },
      },
      {
        label: 'Few pairs and clearly skewed differences',
        result: { primary: 'wilcoxon-signed-rank', also: ['paired-t'], why: 'Rank-based test of the within-pair differences.', watch: 'Assumes the differences are symmetric about their median; report the Hodges–Lehmann estimate with CI.' },
      },
    ],
  },
  {
    id: 'bin-structure',
    question: 'How are the observations related, and do you need adjustment?',
    options: [
      { label: 'Independent groups, unadjusted', next: 'bin-counts' },
      {
        label: 'Paired: same people measured twice, or 1:1 matched pairs',
        result: { primary: 'mcnemar', also: ['conditional-logistic'], why: 'Uses only discordant pairs, which carry all the information about the difference.', watch: 'Use the exact binomial version when discordant pairs are few.' },
      },
      {
        label: 'Individually matched case-control sets (1:k)',
        result: { primary: 'conditional-logistic', why: 'Estimates the OR within matched sets; breaking the matching usually biases the OR towards 1.', watch: 'For frequency (group) matching, ordinary logistic regression adjusting for the matching factors is appropriate.' },
      },
      { label: 'Adjusted for confounders or several predictors', next: 'bin-adjust' },
      {
        label: 'Clustered or repeated',
        detail: 'Cluster-randomised trials, several eyes/teeth/lesions per patient',
        result: { primary: 'gee', also: ['mixed-model'], why: 'Population-averaged effects with cluster-robust SEs.', watch: 'With fewer than ~40 clusters, use small-sample corrections.' },
      },
    ],
  },
  {
    id: 'bin-counts',
    question: 'How large are the expected cell counts?',
    help: 'Expected count = row total × column total / N.',
    options: [
      {
        label: 'All expected counts ≥ 1 (2×2), or ≤ 20% below 5 (larger tables)',
        result: { primary: 'chi-square', also: ['fisher-exact'], why: 'For 2×2 tables the "N − 1" χ² has accurate type I error whenever all expected counts are ≥ 1.', watch: 'Report risk difference and risk ratio with CIs — a χ² p-value carries no effect size.' },
      },
      {
        label: 'Some expected counts < 1, or a very small table',
        result: { primary: 'fisher-exact', why: 'Exact test conditional on the margins.', watch: 'Conservative; still report an effect estimate with a CI.' },
      },
    ],
  },
  {
    id: 'bin-adjust',
    question: 'Which effect measure do you need?',
    options: [
      {
        label: 'Odds ratio',
        detail: 'Case-control studies, or when ORs are conventional',
        result: { primary: 'logistic-regression', why: 'The standard model for adjusted analyses of binary outcomes.', watch: 'When the outcome is common (> ~10%), the OR exaggerates the RR. Present absolute risks too.' },
      },
      {
        label: 'Risk ratio or risk difference',
        detail: 'Cohorts and trials, especially with common outcomes',
        result: { primary: 'modified-poisson', also: ['logistic-regression'], why: 'Poisson regression with robust SEs (or log-binomial) estimates adjusted RRs directly; marginal risk differences can be derived from a logistic model.', watch: 'Use robust (sandwich) SEs.' },
      },
    ],
  },
  {
    id: 'ord-structure',
    question: 'What comparison do you need?',
    options: [
      {
        label: 'Two independent groups, unadjusted',
        result: { primary: 'mann-whitney', also: ['ordinal-logistic'], why: 'Rank test suited to ordered categories.', watch: 'Many ties are expected; report the distribution in each group and a common OR or probability of superiority.' },
      },
      {
        label: 'Three or more independent groups',
        result: { primary: 'kruskal-wallis', also: ['ordinal-logistic'], why: 'Rank-based global test.', watch: 'Pre-specify which comparisons matter.' },
      },
      {
        label: 'Paired',
        result: { primary: 'wilcoxon-signed-rank', why: 'Rank test of paired differences.', watch: 'Many zero differences reduce the effective sample size.' },
      },
      {
        label: 'Adjusted, or you want an effect estimate',
        result: { primary: 'ordinal-logistic', why: 'Uses all levels of the outcome; the common OR describes a shift across the whole scale.', watch: 'Check proportional odds. Do not dichotomise the scale just to run logistic regression.' },
      },
    ],
  },
  {
    id: 'count',
    question: 'What kind of counts are these?',
    options: [
      {
        label: 'Recurrent events in patients (exacerbations, falls), or not sure',
        result: { primary: 'negative-binomial', also: ['poisson-regression'], why: 'Clinical event counts are nearly always overdispersed — some patients have many events. The negative binomial allows variance > mean.', watch: 'Include log(follow-up time) as an offset.' },
      },
      {
        label: 'Rare independent events with variance ≈ mean',
        result: { primary: 'poisson-regression', also: ['negative-binomial'], why: 'Rate ratios from a log-linear model.', watch: 'Check Pearson χ²/df; values well above 1 mean overdispersion.' },
      },
    ],
  },
  {
    id: 'tte',
    question: 'What do you need from the time-to-event analysis?',
    options: [
      {
        label: 'Describe and compare survival curves (e.g., randomised arms)',
        result: { primary: 'kaplan-meier', also: ['cox', 'rmst'], why: 'Kaplan–Meier handles censoring; the log-rank test compares curves.', watch: 'Report survival at fixed times with CIs and the numbers at risk.' },
      },
      {
        label: 'Adjust for covariates',
        result: { primary: 'cox', also: ['rmst'], why: 'Adjusted hazard ratios without specifying the baseline hazard.', watch: 'Check proportional hazards; model exposures that start during follow-up as time-varying.' },
      },
      {
        label: 'Curves cross, or hazards clearly not proportional',
        result: { primary: 'rmst', also: ['kaplan-meier'], why: 'Compares average event-free time to a pre-specified horizon; does not need proportional hazards.', watch: 'Fix τ in the protocol.' },
      },
      {
        label: 'Another event (e.g., death) prevents the event of interest',
        result: { primary: 'competing-risks', also: ['cox'], why: 'Cumulative incidence (Aalen–Johansen) gives the real-world probability of the event; 1 − KM overstates it.', watch: 'Cause-specific HRs for aetiology; Fine–Gray for absolute-risk prediction.' },
      },
    ],
  },
  {
    id: 'assoc',
    question: 'What are the two variables?',
    options: [
      {
        label: 'Two continuous variables, linear relation',
        result: { primary: 'pearson', also: ['linear-regression'], why: 'r measures the strength of linear association.', watch: 'Plot first. r depends on the range sampled and says nothing about agreement or slope.' },
      },
      {
        label: 'Ordinal, skewed, outliers, or monotonic but curved',
        result: { primary: 'spearman', why: 'Correlation of ranks: robust to outliers and monotonic non-linearity.', watch: 'Neither correlation captures U-shaped relations.' },
      },
      {
        label: 'Two categorical variables',
        result: { primary: 'chi-square', also: ['fisher-exact'], why: 'Tests association in a contingency table.', watch: 'Report an effect measure (RR, OR, risk difference) as well.' },
      },
    ],
  },
  {
    id: 'agree',
    question: 'What kind of measurements?',
    options: [
      {
        label: 'Two methods measuring the same continuous quantity',
        result: { primary: 'bland-altman', why: 'Estimates bias and the range within which most differences fall.', watch: 'Correlation is not agreement: two methods can correlate perfectly and still differ by 20 mmHg.' },
      },
      {
        label: 'Reliability of raters or occasions (continuous)',
        result: { primary: 'icc', also: ['bland-altman'], why: 'Share of variance due to true between-subject differences.', watch: 'State the ICC form, e.g., two-way random, absolute agreement, single rater.' },
      },
      {
        label: 'Categorical ratings',
        result: { primary: 'kappa', why: 'Agreement beyond chance; weighted κ for ordinal categories.', watch: 'Report raw agreement and prevalence alongside κ.' },
      },
    ],
  },
  {
    id: 'predict',
    question: 'What does the model predict?',
    help: 'Prediction differs from causal inference: the aim is accurate, well-calibrated risks for new patients, not unbiased coefficients.',
    options: [
      {
        label: 'Risk of a binary outcome',
        result: { primary: 'logistic-regression', also: ['roc'], why: 'Logistic regression (with penalisation if needed) gives predicted risks; evaluate discrimination, calibration and net benefit.', watch: 'Calculate sample size with Riley et al. (2020); internally validate with the bootstrap; report per TRIPOD+AI.' },
      },
      {
        label: 'Risk of an event over time',
        result: { primary: 'cox', also: ['competing-risks', 'roc'], why: 'Cox (or flexible parametric) models give risk at a time horizon; account for competing risks.', watch: 'Report the baseline survival so others can compute risks.' },
      },
      {
        label: 'A continuous value',
        result: { primary: 'linear-regression', why: 'Predicts the mean; prediction intervals quantify individual uncertainty.', watch: 'Prediction intervals are much wider than CIs for the mean.' },
      },
    ],
  },
];

export const decisionById: Record<string, DecisionNode> = Object.fromEntries(decisionTree.map((n) => [n.id, n]));
