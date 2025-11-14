import type { GlossaryTerm } from '../../types';

export const glossary: GlossaryTerm[] = [
  {
    id: 'p-value',
    term: 'p-value',
    definition:
      'The probability of observing results as extreme or more extreme than those obtained, assuming the null hypothesis is true. NOT the probability that the null hypothesis is true.',
    category: 'concept',
    relatedTerms: ['null-hypothesis', 'type-i-error', 'statistical-significance'],
    examples: [
      'p = 0.03 means there is a 3% chance of seeing these results if there is truly no effect',
    ],
  },
  {
    id: 'confidence-interval',
    term: 'Confidence Interval (CI)',
    definition:
      'A range of values that, with a specified level of confidence (typically 95%), contains the true population parameter. Provides information about precision and clinical significance.',
    category: 'concept',
    relatedTerms: ['point-estimate', 'standard-error', 'statistical-significance'],
    examples: [
      'Mean difference = 5 mmHg, 95% CI [2, 8] means we are 95% confident the true difference is between 2-8 mmHg',
    ],
  },
  {
    id: 'effect-size',
    term: 'Effect Size',
    definition:
      'A quantitative measure of the magnitude of a phenomenon. Unlike p-values, effect sizes are not influenced by sample size.',
    category: 'measure',
    relatedTerms: ['cohens-d', 'odds-ratio', 'relative-risk', 'clinical-significance'],
    examples: [
      "Cohen's d = 0.2 (small), 0.5 (medium), 0.8 (large)",
      'Odds ratio = 2.5',
      'Mean difference = 10 mmHg',
    ],
  },
  {
    id: 'null-hypothesis',
    term: 'Null Hypothesis (H₀)',
    definition:
      'The hypothesis that there is no effect or no difference. The hypothesis we seek to reject through statistical testing.',
    category: 'concept',
    relatedTerms: ['alternative-hypothesis', 'p-value', 'type-i-error'],
    examples: [
      'H₀: There is no difference in blood pressure between treatment and control groups',
    ],
  },
  {
    id: 'alternative-hypothesis',
    term: 'Alternative Hypothesis (H₁ or Hₐ)',
    definition:
      'The hypothesis that there is an effect or difference. Accepted when null hypothesis is rejected.',
    category: 'concept',
    relatedTerms: ['null-hypothesis', 'p-value'],
    examples: [
      'H₁: Treatment reduces blood pressure compared to control',
    ],
  },
  {
    id: 'type-i-error',
    term: 'Type I Error (α)',
    definition:
      'Rejecting the null hypothesis when it is actually true (false positive). The significance level (α) sets the acceptable Type I error rate, typically 0.05.',
    category: 'concept',
    relatedTerms: ['type-ii-error', 'p-value', 'statistical-significance'],
    examples: [
      'Concluding a drug is effective when it actually has no effect',
    ],
  },
  {
    id: 'type-ii-error',
    term: 'Type II Error (β)',
    definition:
      'Failing to reject the null hypothesis when it is actually false (false negative). Power = 1 - β.',
    category: 'concept',
    relatedTerms: ['type-i-error', 'statistical-power'],
    examples: [
      'Concluding a drug is not effective when it actually does work',
    ],
  },
  {
    id: 'statistical-power',
    term: 'Statistical Power',
    definition:
      'The probability of correctly rejecting the null hypothesis when it is false (1 - β). Typically aim for 80% or higher.',
    category: 'concept',
    relatedTerms: ['type-ii-error', 'sample-size', 'effect-size'],
    examples: [
      'Power = 0.80 means 80% chance of detecting a true effect',
    ],
  },
  {
    id: 'odds-ratio',
    term: 'Odds Ratio (OR)',
    definition:
      'The odds of an outcome in one group divided by the odds in another group. Commonly used in case-control studies and logistic regression.',
    category: 'measure',
    relatedTerms: ['relative-risk', 'logistic-regression', 'confidence-interval'],
    examples: [
      'OR = 2.5 means the odds of disease are 2.5 times higher in exposed vs unexposed',
      'Note: OR ≠ RR, but approximates RR when outcome is rare (<10%)',
    ],
  },
  {
    id: 'relative-risk',
    term: 'Relative Risk (RR) / Risk Ratio',
    definition:
      'The risk (probability) of an outcome in one group divided by the risk in another group. Used in cohort studies and RCTs.',
    category: 'measure',
    relatedTerms: ['odds-ratio', 'absolute-risk', 'number-needed-to-treat'],
    examples: [
      'RR = 2.0 means the risk is twice as high in exposed vs unexposed',
      'RR = 0.5 means the treatment reduces risk by 50%',
    ],
  },
  {
    id: 'hazard-ratio',
    term: 'Hazard Ratio (HR)',
    definition:
      'The ratio of hazard rates between two groups in survival analysis. Represents the relative rate at which events occur.',
    category: 'measure',
    relatedTerms: ['cox-regression', 'survival-analysis', 'proportional-hazards'],
    examples: [
      'HR = 1.5 means the event rate is 1.5 times higher in the treatment group',
      'HR < 1 indicates reduced hazard (protective effect)',
    ],
  },
  {
    id: 'number-needed-to-treat',
    term: 'Number Needed to Treat (NNT)',
    definition:
      'The number of patients who must receive an intervention for one additional patient to benefit. Calculated as 1/(absolute risk reduction).',
    category: 'measure',
    relatedTerms: ['absolute-risk', 'relative-risk', 'clinical-significance'],
    examples: [
      'NNT = 10 means you need to treat 10 patients for 1 to benefit',
      'Lower NNT indicates more effective intervention',
    ],
  },
  {
    id: 'sensitivity',
    term: 'Sensitivity',
    definition:
      'The proportion of people with disease who test positive (true positive rate). Sensitivity = TP / (TP + FN).',
    category: 'measure',
    relatedTerms: ['specificity', 'positive-predictive-value', 'diagnostic-accuracy'],
    examples: [
      'Sensitivity = 90% means the test correctly identifies 90% of people with disease',
      'High sensitivity is important for screening tests (rule out disease)',
    ],
  },
  {
    id: 'specificity',
    term: 'Specificity',
    definition:
      'The proportion of people without disease who test negative (true negative rate). Specificity = TN / (TN + FP).',
    category: 'measure',
    relatedTerms: ['sensitivity', 'negative-predictive-value', 'diagnostic-accuracy'],
    examples: [
      'Specificity = 95% means the test correctly identifies 95% of people without disease',
      'High specificity is important for confirmatory tests (rule in disease)',
    ],
  },
  {
    id: 'confounding',
    term: 'Confounding',
    definition:
      'A variable that is associated with both the exposure and outcome, distorting the apparent relationship between them.',
    category: 'concept',
    relatedTerms: ['bias', 'adjustment', 'multivariate-analysis'],
    examples: [
      'Age confounds the relationship between exercise and heart disease',
      'Control through randomization, stratification, or multivariable analysis',
    ],
  },
  {
    id: 'cohens-d',
    term: "Cohen's d",
    definition:
      'A standardized measure of effect size for differences between two means. Calculated as (mean₁ - mean₂) / pooled SD.',
    category: 'measure',
    relatedTerms: ['effect-size', 't-test', 'statistical-significance'],
    examples: [
      'd = 0.2 (small effect), d = 0.5 (medium), d = 0.8 (large)',
      'Independent of sample size, unlike p-values',
    ],
  },
  {
    id: 'multicollinearity',
    term: 'Multicollinearity',
    definition:
      'High correlation between predictor variables in regression models, making it difficult to determine individual variable effects.',
    category: 'concept',
    relatedTerms: ['regression', 'variance-inflation-factor', 'assumptions'],
    examples: [
      'Height and weight are often collinear',
      'Check using VIF (values >10 indicate problem)',
    ],
  },
  {
    id: 'interaction',
    term: 'Interaction (Effect Modification)',
    definition:
      'When the effect of one variable on the outcome depends on the level of another variable.',
    category: 'concept',
    relatedTerms: ['stratification', 'regression', 'subgroup-analysis'],
    examples: [
      'Drug effect differs by sex (sex modifies the treatment effect)',
      'Test using interaction terms in regression',
    ],
  },
  {
    id: 'multiple-testing',
    term: 'Multiple Testing / Multiple Comparisons',
    definition:
      'When multiple statistical tests are performed, the probability of Type I error increases. Requires adjustment.',
    category: 'concept',
    relatedTerms: ['bonferroni-correction', 'type-i-error', 'false-discovery-rate'],
    examples: [
      'Testing 20 hypotheses at α=0.05, expect 1 false positive by chance',
      'Bonferroni correction: use α/n (e.g., 0.05/20 = 0.0025)',
    ],
  },
  {
    id: 'intention-to-treat',
    term: 'Intention-to-Treat (ITT) Analysis',
    definition:
      'Analyzing participants in the groups to which they were randomized, regardless of adherence or protocol deviations.',
    category: 'concept',
    relatedTerms: ['per-protocol-analysis', 'randomized-controlled-trial'],
    examples: [
      'Preserves randomization benefits',
      'Provides conservative estimate of treatment effect',
      'Reflects real-world effectiveness',
    ],
  },
];
