import type { CaseVignette } from '../../types';

export const caseVignettes: CaseVignette[] = [
  {
    id: 'case-001',
    title: 'Blood Pressure Comparison in RCT',
    scenario:
      'A randomized controlled trial enrolled 120 hypertensive patients. 60 patients received a new antihypertensive drug, and 60 received placebo. After 12 weeks, systolic blood pressure was measured in all patients. The data appears normally distributed with similar variances between groups.',
    dataDescription: {
      outcome: {
        id: 'sbp',
        name: 'Systolic Blood Pressure',
        type: 'continuous',
        description: 'mmHg measured after 12 weeks',
        role: 'outcome',
      },
      predictors: [
        {
          id: 'treatment',
          name: 'Treatment Group',
          type: 'binary',
          description: 'Drug vs Placebo',
          role: 'predictor',
        },
      ],
      sampleSize: 120,
      studyDesign: 'rct',
    },
    correctTest: 'independent-t-test',
    incorrectTests: [
      {
        testId: 'paired-t-test',
        whyIncorrect: 'This is unpaired data (different patients in each group), not paired measurements',
      },
      {
        testId: 'mann-whitney-u',
        whyIncorrect: 'Data is normally distributed, so parametric test is preferred for better power',
      },
      {
        testId: 'chi-square',
        whyIncorrect: 'Outcome is continuous, not categorical',
      },
    ],
    interpretation:
      'Independent t-test compares mean SBP between two groups. Report mean difference with 95% CI and p-value. Calculate Cohen\'s d for effect size.',
  },
  {
    id: 'case-002',
    title: 'Pain Scores Before and After Intervention',
    scenario:
      'A physical therapy intervention was tested in 40 patients with chronic back pain. Pain was assessed using a 0-10 numeric rating scale before and immediately after a 6-week intervention program in the same patients.',
    dataDescription: {
      outcome: {
        id: 'pain',
        name: 'Pain Score',
        type: 'ordinal',
        description: '0-10 scale, ordinal',
        role: 'outcome',
      },
      predictors: [
        {
          id: 'time',
          name: 'Timepoint',
          type: 'binary',
          description: 'Before vs After',
          role: 'predictor',
        },
      ],
      sampleSize: 40,
      studyDesign: 'before-after',
    },
    correctTest: 'wilcoxon-signed-rank',
    incorrectTests: [
      {
        testId: 'independent-t-test',
        whyIncorrect: 'These are paired measurements on the same patients, not independent groups',
      },
      {
        testId: 'paired-t-test',
        whyIncorrect: 'Pain scale is ordinal, not truly continuous; non-parametric test is more appropriate',
      },
      {
        testId: 'mann-whitney-u',
        whyIncorrect: 'This test is for unpaired data, but we have paired before/after measurements',
      },
    ],
    interpretation:
      'Wilcoxon signed-rank test is appropriate for paired ordinal data. Report median difference and p-value.',
  },
  {
    id: 'case-003',
    title: 'Smoking and Lung Cancer Association',
    scenario:
      'A case-control study identified 200 lung cancer patients (cases) and 200 matched controls. Smoking status (ever vs never) was assessed for all participants.',
    dataDescription: {
      outcome: {
        id: 'lung-cancer',
        name: 'Lung Cancer',
        type: 'binary',
        description: 'Case vs Control',
        role: 'outcome',
      },
      predictors: [
        {
          id: 'smoking',
          name: 'Smoking Status',
          type: 'binary',
          description: 'Ever vs Never',
          role: 'predictor',
        },
      ],
      sampleSize: 400,
      studyDesign: 'case-control',
    },
    correctTest: 'chi-square',
    incorrectTests: [
      {
        testId: 'independent-t-test',
        whyIncorrect: 'Both variables are categorical/binary, not continuous',
      },
      {
        testId: 'fisher-exact',
        whyIncorrect:
          'While Fisher\'s exact could be used, with n=400 and likely no small expected cell counts, chi-square is standard',
      },
      {
        testId: 'logistic-regression',
        whyIncorrect:
          'While logistic regression could be used, a simple chi-square is appropriate for unadjusted 2x2 association',
      },
    ],
    interpretation:
      'Chi-square test assesses association between smoking and lung cancer. Report odds ratio with 95% CI (from case-control data). Check that expected cell counts are ≥5.',
  },
  {
    id: 'case-004',
    title: 'Predicting Hospital Length of Stay',
    scenario:
      'A hospital wants to predict length of stay (continuous, in days) based on patient age, comorbidity score, and admission type. Data from 500 patients shows length of stay is right-skewed.',
    dataDescription: {
      outcome: {
        id: 'los',
        name: 'Length of Stay',
        type: 'continuous',
        description: 'Days in hospital, right-skewed',
        role: 'outcome',
      },
      predictors: [
        {
          id: 'age',
          name: 'Age',
          type: 'continuous',
          description: 'Years',
          role: 'predictor',
        },
        {
          id: 'comorbidity',
          name: 'Comorbidity Score',
          type: 'continuous',
          description: 'Charlson index',
          role: 'predictor',
        },
        {
          id: 'admission-type',
          name: 'Admission Type',
          type: 'categorical',
          description: 'Emergency vs Elective',
          role: 'predictor',
        },
      ],
      sampleSize: 500,
      studyDesign: 'cohort',
    },
    correctTest: 'linear-regression',
    incorrectTests: [
      {
        testId: 'logistic-regression',
        whyIncorrect: 'Outcome is continuous (LOS in days), not binary. Use linear regression.',
      },
      {
        testId: 'one-way-anova',
        whyIncorrect: 'Multiple continuous predictors are involved; regression allows modeling them simultaneously',
      },
      {
        testId: 'independent-t-test',
        whyIncorrect: 'Multiple predictors need to be modeled together; t-test only handles one binary predictor',
      },
    ],
    interpretation:
      'Linear regression models LOS as a function of multiple predictors. Consider log-transforming LOS due to right skew. Report adjusted coefficients with 95% CI. Check regression assumptions (linearity, normality of residuals, homoscedasticity).',
  },
  {
    id: 'case-005',
    title: 'Mortality Risk in ICU Patients',
    scenario:
      'A study of 300 ICU patients aims to predict 30-day mortality (died vs survived) based on APACHE II score, age, and presence of sepsis.',
    dataDescription: {
      outcome: {
        id: 'mortality',
        name: '30-day Mortality',
        type: 'binary',
        description: 'Died vs Survived',
        role: 'outcome',
      },
      predictors: [
        {
          id: 'apache',
          name: 'APACHE II Score',
          type: 'continuous',
          description: 'Severity score',
          role: 'predictor',
        },
        {
          id: 'age',
          name: 'Age',
          type: 'continuous',
          description: 'Years',
          role: 'predictor',
        },
        {
          id: 'sepsis',
          name: 'Sepsis',
          type: 'binary',
          description: 'Yes vs No',
          role: 'predictor',
        },
      ],
      sampleSize: 300,
      studyDesign: 'cohort',
    },
    correctTest: 'logistic-regression',
    incorrectTests: [
      {
        testId: 'linear-regression',
        whyIncorrect: 'Outcome is binary (died vs survived), not continuous. Linear regression is inappropriate.',
      },
      {
        testId: 'chi-square',
        whyIncorrect: 'Need to model multiple predictors simultaneously and get adjusted odds ratios',
      },
      {
        testId: 'cox-regression',
        whyIncorrect: 'No time-to-event information; outcome is simply binary status at 30 days',
      },
    ],
    interpretation:
      'Logistic regression models probability of mortality. Report adjusted odds ratios with 95% CI. Interpret OR carefully: OR is not equal to relative risk. Can report AUC for model discrimination.',
  },
  {
    id: 'case-006',
    title: 'Survival After Cancer Diagnosis',
    scenario:
      'A cohort of 250 cancer patients was followed for up to 5 years after diagnosis. The outcome is time to death (or censored if alive at end of study). Researchers want to compare survival between two treatment groups.',
    dataDescription: {
      outcome: {
        id: 'survival-time',
        name: 'Time to Death',
        type: 'time-to-event',
        description: 'Months from diagnosis to death (censored data)',
        role: 'outcome',
      },
      predictors: [
        {
          id: 'treatment',
          name: 'Treatment',
          type: 'binary',
          description: 'Treatment A vs Treatment B',
          role: 'predictor',
        },
      ],
      sampleSize: 250,
      studyDesign: 'cohort',
    },
    correctTest: 'kaplan-meier',
    incorrectTests: [
      {
        testId: 'independent-t-test',
        whyIncorrect: 'Cannot handle censored data. Time-to-event requires survival analysis methods.',
      },
      {
        testId: 'logistic-regression',
        whyIncorrect: 'Does not use time-to-event information or handle censoring',
      },
      {
        testId: 'cox-regression',
        whyIncorrect:
          'Cox regression is appropriate if adjusting for covariates. For simple comparison of two groups, Kaplan-Meier with log-rank test is simpler.',
      },
    ],
    interpretation:
      'Kaplan-Meier provides survival curves for each treatment group. Log-rank test compares survival distributions. Report median survival times and p-value.',
  },
];
