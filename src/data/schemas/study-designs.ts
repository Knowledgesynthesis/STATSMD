import type { StudyDesign } from '../../types';

export const studyDesigns: StudyDesign[] = [
  {
    id: 'rct',
    name: 'Randomized Controlled Trial (RCT)',
    description:
      'Participants are randomly assigned to intervention or control groups. The gold standard for establishing causality.',
    characteristics: {
      temporality: 'prospective',
      intervention: true,
      randomization: true,
    },
    strengthOfEvidence: 'high',
    commonUses: [
      'Testing new treatments or interventions',
      'Comparing efficacy of drugs',
      'Evaluating preventive strategies',
    ],
    limitations: [
      'Expensive and time-consuming',
      'May have limited external validity (generalizability)',
      'Ethical concerns for some interventions',
    ],
  },
  {
    id: 'cohort',
    name: 'Cohort Study',
    description:
      'Follows a group of people over time to assess the development of outcomes based on exposure status.',
    characteristics: {
      temporality: 'prospective',
      intervention: false,
      randomization: false,
    },
    strengthOfEvidence: 'moderate',
    commonUses: [
      'Studying disease incidence',
      'Evaluating risk factors',
      'Long-term follow-up of exposures',
    ],
    limitations: [
      'Time-consuming and expensive',
      'Loss to follow-up',
      'Confounding',
      'Cannot study rare diseases efficiently',
    ],
  },
  {
    id: 'case-control',
    name: 'Case-Control Study',
    description:
      'Compares individuals with a disease (cases) to those without (controls) to identify potential risk factors.',
    characteristics: {
      temporality: 'retrospective',
      intervention: false,
      randomization: false,
    },
    strengthOfEvidence: 'moderate',
    commonUses: [
      'Studying rare diseases',
      'Investigating disease outbreaks',
      'Identifying risk factors efficiently',
    ],
    limitations: [
      'Susceptible to recall bias',
      'Selection bias in choosing controls',
      'Cannot calculate incidence or prevalence directly',
      'Temporal relationship may be unclear',
    ],
  },
  {
    id: 'cross-sectional',
    name: 'Cross-Sectional Study',
    description:
      'Collects data at a single point in time to assess prevalence of outcomes and exposures.',
    characteristics: {
      temporality: 'cross-sectional',
      intervention: false,
      randomization: false,
    },
    strengthOfEvidence: 'low',
    commonUses: [
      'Prevalence surveys',
      'Screening studies',
      'Hypothesis generation',
    ],
    limitations: [
      'Cannot establish causality',
      'Cannot determine temporal sequence',
      'Prevalence-incidence bias',
    ],
  },
  {
    id: 'diagnostic-accuracy',
    name: 'Diagnostic Accuracy Study',
    description:
      'Evaluates the performance of a diagnostic test against a gold standard.',
    characteristics: {
      temporality: 'cross-sectional',
      intervention: false,
      randomization: false,
    },
    strengthOfEvidence: 'moderate',
    commonUses: [
      'Validating new diagnostic tests',
      'Comparing test performance',
      'Establishing sensitivity and specificity',
    ],
    limitations: [
      'Requires gold standard',
      'Spectrum bias if patient selection is not representative',
      'May not reflect real-world test performance',
    ],
  },
  {
    id: 'before-after',
    name: 'Before-After Study',
    description:
      'Measures outcomes before and after an intervention in the same subjects.',
    characteristics: {
      temporality: 'prospective',
      intervention: true,
      randomization: false,
    },
    strengthOfEvidence: 'low',
    commonUses: [
      'Quality improvement projects',
      'Pilot interventions',
      'Single-arm treatment studies',
    ],
    limitations: [
      'No control group',
      'Cannot distinguish intervention effect from temporal trends',
      'Regression to the mean',
      'Learning effects',
    ],
  },
  {
    id: 'time-series',
    name: 'Time Series Study',
    description:
      'Tracks outcomes over multiple time points to identify trends or intervention effects.',
    characteristics: {
      temporality: 'prospective',
      intervention: false,
      randomization: false,
    },
    strengthOfEvidence: 'low',
    commonUses: [
      'Monitoring disease trends',
      'Evaluating policy interventions',
      'Interrupted time series analysis',
    ],
    limitations: [
      'Autocorrelation in data',
      'Difficult to isolate intervention effects from secular trends',
      'Confounding by time-varying factors',
    ],
  },
];
