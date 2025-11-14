import type { AssessmentQuestion } from '../../types';

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'q001',
    type: 'multiple-choice',
    question:
      'A researcher wants to compare mean blood pressure between two independent groups (treatment vs control). The data is normally distributed. Which test is most appropriate?',
    options: [
      { id: 'a', text: 'Independent t-test', isCorrect: true },
      { id: 'b', text: 'Paired t-test', isCorrect: false },
      { id: 'c', text: 'Chi-square test', isCorrect: false },
      { id: 'd', text: 'Mann-Whitney U test', isCorrect: false },
    ],
    explanation:
      'Independent t-test is correct because: (1) the outcome is continuous (blood pressure), (2) there are two independent groups, and (3) the data is normally distributed. Paired t-test is for paired data, chi-square is for categorical outcomes, and Mann-Whitney is a non-parametric alternative when normality is violated.',
    difficulty: 'beginner',
    tags: ['t-test', 'parametric', 'continuous-outcome'],
  },
  {
    id: 'q002',
    type: 'multiple-choice',
    question:
      'What does it mean when the p-value is 0.03?',
    options: [
      {
        id: 'a',
        text: 'There is a 3% probability that the null hypothesis is true',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'There is a 3% probability of observing results this extreme if the null hypothesis is true',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'The treatment has a 3% effect size',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'There is a 97% probability that the alternative hypothesis is true',
        isCorrect: false,
      },
    ],
    explanation:
      'The p-value represents the probability of observing results as extreme or more extreme than those obtained, assuming the null hypothesis is true. It is NOT the probability that the null hypothesis is true, nor does it tell us about effect sizes or the probability of the alternative hypothesis.',
    difficulty: 'beginner',
    tags: ['p-value', 'interpretation', 'hypothesis-testing'],
  },
  {
    id: 'q003',
    type: 'multiple-choice',
    question:
      'In a case-control study examining the relationship between smoking and lung cancer, which measure is most appropriate to report?',
    options: [
      { id: 'a', text: 'Relative Risk (Risk Ratio)', isCorrect: false },
      { id: 'b', text: 'Odds Ratio', isCorrect: true },
      { id: 'c', text: 'Hazard Ratio', isCorrect: false },
      { id: 'd', text: 'Incidence Rate', isCorrect: false },
    ],
    explanation:
      'Case-control studies sample based on outcome status (cases and controls), making it impossible to calculate true disease incidence or relative risk directly. Odds ratios are the appropriate measure for case-control studies. When the outcome is rare (<10%), the odds ratio approximates the relative risk.',
    difficulty: 'intermediate',
    tags: ['case-control', 'odds-ratio', 'study-design'],
  },
  {
    id: 'q004',
    type: 'multiple-choice',
    question:
      'A researcher collects pain scores (0-10 scale) before and after an intervention in the same 30 patients. The pain scores are not normally distributed. Which test should be used?',
    options: [
      { id: 'a', text: 'Independent t-test', isCorrect: false },
      { id: 'b', text: 'Paired t-test', isCorrect: false },
      { id: 'c', text: 'Wilcoxon Signed-Rank test', isCorrect: true },
      { id: 'd', text: 'Mann-Whitney U test', isCorrect: false },
    ],
    explanation:
      'Wilcoxon Signed-Rank test is correct because: (1) the data is paired (same patients before/after), (2) the pain scale is ordinal, and (3) the data is not normally distributed. Independent t-test is for unpaired data, paired t-test requires normality, and Mann-Whitney U is for unpaired non-parametric data.',
    difficulty: 'intermediate',
    tags: ['non-parametric', 'paired-data', 'ordinal'],
  },
  {
    id: 'q005',
    type: 'multiple-choice',
    question:
      'Which assumption is NOT required for linear regression?',
    options: [
      { id: 'a', text: 'Linearity', isCorrect: false },
      { id: 'b', text: 'Independence of observations', isCorrect: false },
      { id: 'c', text: 'Normality of outcome variable', isCorrect: true },
      { id: 'd', text: 'Homoscedasticity', isCorrect: false },
    ],
    explanation:
      'Linear regression assumes normality of RESIDUALS, not the outcome variable itself. The other assumptions (linearity, independence, and homoscedasticity) are all required. This is a common misconception—the outcome can have any distribution, but the residuals should be normally distributed.',
    difficulty: 'advanced',
    tags: ['linear-regression', 'assumptions', 'normality'],
  },
  {
    id: 'q006',
    type: 'multiple-choice',
    question:
      'In logistic regression, an odds ratio of 2.5 means:',
    options: [
      {
        id: 'a',
        text: 'The risk is 2.5 times higher in the exposed group',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'The odds are 2.5 times higher in the exposed group',
        isCorrect: true,
      },
      {
        id: 'c',
        text: '2.5% increase in probability',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'The hazard is 2.5 times higher',
        isCorrect: false,
      },
    ],
    explanation:
      'Odds ratio (OR) compares odds, not risk. OR = 2.5 means the odds of the outcome are 2.5 times higher in the exposed group compared to unexposed. ORs often overestimate relative risk when the outcome is common (>10%). This distinction is critical in interpretation.',
    difficulty: 'intermediate',
    tags: ['logistic-regression', 'odds-ratio', 'interpretation'],
  },
  {
    id: 'q007',
    type: 'multiple-choice',
    question:
      'When testing 20 different hypotheses at α = 0.05, how many false positives would you expect by chance alone?',
    options: [
      { id: 'a', text: '0', isCorrect: false },
      { id: 'b', text: '1', isCorrect: true },
      { id: 'c', text: '5', isCorrect: false },
      { id: 'd', text: '10', isCorrect: false },
    ],
    explanation:
      'With α = 0.05, there is a 5% chance of Type I error (false positive) for each test. Testing 20 hypotheses: 20 × 0.05 = 1 expected false positive. This is why multiple comparison corrections (e.g., Bonferroni) are needed when conducting many tests.',
    difficulty: 'intermediate',
    tags: ['multiple-testing', 'type-i-error', 'alpha'],
  },
  {
    id: 'q008',
    type: 'multiple-choice',
    question:
      'A Cox proportional hazards model reports a hazard ratio of 0.7 for a new treatment. This means:',
    options: [
      {
        id: 'a',
        text: 'The treatment increases survival by 70%',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'The hazard of the event is 30% lower in the treatment group',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'The treatment increases the event rate',
        isCorrect: false,
      },
      {
        id: 'd',
        text: '70% of patients will survive',
        isCorrect: false,
      },
    ],
    explanation:
      'HR = 0.7 means the hazard (instantaneous risk) is 0.7 times that of the control group, or 30% lower (1 - 0.7 = 0.30 = 30% reduction). HR < 1 indicates protective effect (reduced hazard), while HR > 1 indicates increased hazard. This is a relative measure, not absolute survival.',
    difficulty: 'advanced',
    tags: ['cox-regression', 'hazard-ratio', 'survival-analysis'],
  },
  {
    id: 'q009',
    type: 'multiple-choice',
    question:
      'Which study design is best for establishing causality?',
    options: [
      { id: 'a', text: 'Cross-sectional study', isCorrect: false },
      { id: 'b', text: 'Case-control study', isCorrect: false },
      { id: 'c', text: 'Cohort study', isCorrect: false },
      { id: 'd', text: 'Randomized controlled trial', isCorrect: true },
    ],
    explanation:
      'Randomized controlled trials (RCTs) are the gold standard for establishing causality because randomization balances both known and unknown confounders between groups. While cohort studies can suggest causality, they cannot control for all potential confounders like RCTs can.',
    difficulty: 'beginner',
    tags: ['study-design', 'causality', 'rct'],
  },
  {
    id: 'q010',
    type: 'multiple-choice',
    question:
      'A confidence interval for a mean difference is reported as [2.3, 8.7]. What can we conclude?',
    options: [
      {
        id: 'a',
        text: 'The p-value is > 0.05',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'The p-value is < 0.05',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'There is no statistical significance',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'Cannot determine significance from CI alone',
        isCorrect: false,
      },
    ],
    explanation:
      'Since the 95% confidence interval does not include zero (the null value for a difference), we can conclude p < 0.05. If a 95% CI for a difference excludes zero, the result is statistically significant at the 0.05 level. This demonstrates the relationship between CIs and p-values.',
    difficulty: 'intermediate',
    tags: ['confidence-interval', 'p-value', 'interpretation'],
  },
  {
    id: 'q011',
    type: 'scenario',
    question:
      'A researcher wants to predict hospital length of stay (in days) based on age, comorbidity score, and admission type. The length of stay data is right-skewed. What should the researcher do?',
    scenario:
      'Hospital LOS data: Median = 4 days, Mean = 6.2 days, Range = 1-45 days. Histogram shows strong right skew.',
    options: [
      {
        id: 'a',
        text: 'Use linear regression on the original LOS values',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Use linear regression on log-transformed LOS',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'Use logistic regression',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'Use chi-square test',
        isCorrect: false,
      },
    ],
    explanation:
      'Log-transformation of the outcome is appropriate for right-skewed continuous data. Linear regression on log(LOS) helps meet the normality of residuals assumption and provides interpretable results (coefficients represent multiplicative effects). Logistic regression is for binary outcomes, and chi-square is for categorical data.',
    difficulty: 'advanced',
    tags: ['linear-regression', 'transformation', 'skewed-data'],
  },
  {
    id: 'q012',
    type: 'assumption-check',
    question:
      'You run an independent t-test and find that the variances in the two groups are significantly different (Levene\'s test p < 0.001). What should you do?',
    options: [
      {
        id: 'a',
        text: 'Proceed with the standard t-test',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Use Welch\'s t-test',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'Use paired t-test',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'Use chi-square test',
        isCorrect: false,
      },
    ],
    explanation:
      'Welch\'s t-test is the appropriate alternative when the assumption of equal variances (homoscedasticity) is violated. It adjusts for unequal variances and provides valid results. The standard t-test assumes equal variances, which has been violated here.',
    difficulty: 'intermediate',
    tags: ['t-test', 'assumptions', 'homoscedasticity'],
  },
];
