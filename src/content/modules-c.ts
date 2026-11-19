import type { Module } from './types';

export const modulesC: Module[] = [
  // ───────────────────────────── 13 ─────────────────────────────
  {
    id: 'diagnostic',
    n: 13,
    title: 'Diagnostic accuracy and Bayesian reasoning',
    tagline: 'Sensitivity and specificity describe the test. Predictive values describe your patient — and depend on prevalence.',
    minutes: 20,
    objectives: [
      'Compute sensitivity, specificity, PPV, NPV and likelihood ratios',
      'Update a pre-test probability with a likelihood ratio',
      'Explain why PPV collapses at low prevalence',
      'Recognise design biases that inflate accuracy',
    ],
    sections: [
      {
        kind: 'text',
        title: 'The four numbers',
        body: `| | Disease + | Disease − |
|---|---|---|
| **Test +** | TP | FP |
| **Test −** | FN | TN |

- [[sensitivity|Sensitivity]] = TP / (TP + FN) — of people with the disease, how many test positive.
- [[specificity|Specificity]] = TN / (TN + FP) — of people without it, how many test negative.
- [[ppv|PPV]] = TP / (TP + FP) — of positives, how many have it.
- [[npv|NPV]] = TN / (TN + FN) — of negatives, how many are free of it.

Sensitivity and specificity are properties of the test **in a given case mix**. Predictive values also depend on **prevalence**.`,
      },
      { kind: 'lab', lab: 'diagnostic', caption: 'Slide prevalence from emergency department to population screening. The same test gives very different PPVs.' },
      {
        kind: 'text',
        title: 'Likelihood ratios: the clinician’s tool',
        body: `[[likelihood-ratio|Likelihood ratios]] convert test results into changes in probability {{deeks2004}}:

- LR+ = sensitivity / (1 − specificity); LR− = (1 − sensitivity) / specificity.
- **Post-test odds = pre-test odds × LR**, where odds = p / (1 − p).

Example: pre-test probability 20% (odds 0.25). A test with sensitivity 90% and specificity 85% has LR+ = 6.0 and LR− = 0.12. A positive result gives odds 1.5 → probability 60%; a negative gives odds 0.03 → about 3%.

Rough guide: LR+ > 10 or LR− < 0.1 shifts probability substantially; LRs between 0.5 and 2 rarely change management.`,
      },
      {
        kind: 'callout',
        tone: 'pitfall',
        title: 'SnNout and SpPin are shortcuts, not rules',
        body: `"A highly sensitive test, when negative, rules out" holds only if specificity is not too poor; what matters is the LR− {{pewsner2004}}. A test with 95% sensitivity and 20% specificity has LR− = 0.25 — a negative result moves a 30% pre-test probability only to about 10%.`,
      },
      {
        kind: 'text',
        title: 'Why published accuracy is often too good',
        body: `- **[[spectrum-bias|Spectrum bias]]:** comparing clear-cut cases with healthy volunteers (two-gate design) inflates both sensitivity and specificity. Use consecutive patients with the clinical presentation in question.
- **Partial verification:** only test-positives receive the reference standard.
- **Differential verification:** different reference standards for positives and negatives.
- **Incorporation bias:** the index test is part of the reference standard.
- **Review bias:** the index test is read knowing the reference result.

Assess studies with QUADAS-2 {{whiting2011}} and report them with STARD 2015 {{stard2015}}. For continuous tests, the ROC curve and [[auc|AUC]] summarise discrimination across thresholds; choose a threshold from the clinical consequences of false positives and false negatives, not by maximising Youden’s index alone.`,
      },
    ],
    takeaways: [
      'Sensitivity and specificity condition on disease status; predictive values condition on the test result.',
      'PPV falls steeply as prevalence falls — screening produces many false positives.',
      'Post-test odds = pre-test odds × LR.',
      'Judge rule-in and rule-out by LR+ and LR−, not by sensitivity or specificity alone.',
      'Case-control (two-gate) diagnostic studies overstate accuracy.',
    ],
  },

  // ───────────────────────────── 14 ─────────────────────────────
  {
    id: 'prediction',
    n: 14,
    title: 'Prediction models: discrimination, calibration and overfitting',
    tagline: 'A good AUC is not enough. Predictions must be calibrated, validated and useful.',
    minutes: 20,
    objectives: [
      'Distinguish prediction from causal explanation',
      'Evaluate discrimination, calibration and clinical utility',
      'Explain overfitting and how sample size, penalisation and validation address it',
      'Use TRIPOD+AI and PROBAST+AI to report and appraise models',
    ],
    sections: [
      {
        kind: 'text',
        title: 'Prediction is not explanation',
        body: `A causal model asks how the outcome would change if we intervened on one exposure; covariates are chosen to remove confounding. A **prediction model** asks how accurately we can estimate an individual’s risk from information available at the time of prediction; predictors are chosen for predictive value and availability, and their coefficients are not causal effects.`,
      },
      {
        kind: 'text',
        title: 'Three dimensions of performance',
        body: `1. **Discrimination** — does the model rank patients correctly? Measured by the [[auc|C-statistic (AUC)]].
2. **[[calibration|Calibration]]** — are predicted risks right? A model can rank perfectly yet predict 30% for patients whose true risk is 10%. Assess with a calibration plot, the calibration slope (ideal 1) and calibration-in-the-large (ideal 0). Poor calibration is the "Achilles heel" of prediction models {{vancalster2019}}.
3. **Clinical utility** — does using the model improve decisions? [[decision-curve|Decision curve analysis]] shows net benefit across risk thresholds compared with treating everyone or no one {{vickers2006}}.`,
      },
      { kind: 'lab', lab: 'calibration', caption: 'Make the model overfit. The validation AUC slips a little; the calibration slope collapses.' },
      {
        kind: 'text',
        title: 'Overfitting and sample size',
        body: `A model developed on too little data fits its noise: predictions are too extreme in new patients (calibration slope < 1) and the apparent AUC is optimistic.

- **Sample size:** "10 events per variable" is not an adequate basis for prediction models {{vansmeden2019}}. Use the Riley et al. criteria, which target small overfitting (expected shrinkage ≥ 0.9), small optimism in R², and precise estimation of overall risk {{riley2020}}.
- **Penalisation** (ridge, lasso, uniform shrinkage) pulls coefficients towards zero to counter overfitting, but cannot rescue a sample that is far too small.
- **Internal validation** by bootstrapping the whole modelling process estimates optimism. Splitting a single dataset into development and test halves wastes data and gives unstable estimates {{steyerberg2019}}.
- **External validation** in a new setting needs at least 100, preferably 200 or more, outcome events {{collins2016}}.`,
      },
      {
        kind: 'callout',
        tone: 'pitfall',
        title: 'Common errors in prediction studies',
        body: `- Dichotomising continuous predictors or selecting them by univariable p-values.
- Predictors that would not be available at the moment of prediction (data leakage).
- Reporting only the AUC, or using the Hosmer–Lemeshow test as evidence of calibration.
- Dropping patients with missing predictors instead of imputing.
- Not publishing the full model (intercept/baseline risk and every coefficient), so no one can validate it.

Report with TRIPOD+AI {{tripodai2024}}; appraise risk of bias with PROBAST+AI {{probastai2025}}.`,
      },
    ],
    takeaways: [
      'Prediction coefficients are not causal effects.',
      'Report discrimination, calibration and clinical utility — AUC alone is not enough.',
      'Overfitting shows up as a calibration slope below 1.',
      'Use Riley’s criteria for sample size; bootstrap for internal validation; ≥ 100–200 events for external validation.',
      'Publish the full model so it can be validated.',
    ],
  },

  // ───────────────────────────── 15 ─────────────────────────────
  {
    id: 'multiplicity',
    n: 15,
    title: 'Multiplicity, p-hacking and research integrity',
    tagline: 'Test enough hypotheses and something will be "significant". Know when to adjust and how to prevent the problem by design.',
    minutes: 20,
    objectives: [
      'Compute the family-wise error rate and apply Bonferroni, Holm and Benjamini–Hochberg',
      'Decide when multiplicity adjustment is required and when labelling is enough',
      'Recognise forking paths, outcome switching and non-credible subgroup claims',
      'Estimate the chance that a "significant" finding is true',
    ],
    sections: [
      {
        kind: 'text',
        title: 'The arithmetic',
        body: `With m independent tests of true null hypotheses at α = 0.05, the chance of at least one false positive is 1 − 0.95^m:

| Tests | 1 | 5 | 10 | 20 | 50 |
|---|---|---|---|---|---|
| P(≥ 1 false positive) | 5% | 23% | 40% | 64% | 92% |

- **Bonferroni:** test each at α/m. Controls the [[fwer|FWER]], conservative.
- **Holm:** step-down version; always at least as powerful as Bonferroni with the same guarantee {{holm1979}}. There is no reason to prefer plain Bonferroni.
- **Benjamini–Hochberg:** controls the [[fdr|false discovery rate]] — the expected share of false positives among discoveries {{benjamini1995}}. Suited to screening (genomics, many biomarkers), not to confirmatory claims.`,
      },
      { kind: 'lab', lab: 'multiplicity', caption: 'Run 20 tests where only some effects are real. Compare what each correction finds.' },
      {
        kind: 'text',
        title: 'When to adjust',
        body: `**Adjust (or use a gatekeeping/hierarchical strategy)** when several tests together support one confirmatory claim: multiple primary endpoints, several doses or arms versus control, interim analyses, or a claim that "the treatment works" if any of several outcomes is significant {{fda2022,bender2001}}.

**Label rather than adjust** for secondary and exploratory analyses: present them as hypothesis-generating, with estimates and CIs, and report how many were examined. Some argue that adjustment is never needed if all comparisons are reported honestly {{rothman1990}}; the common ground is that undisclosed multiplicity is the real problem.`,
      },
      {
        kind: 'text',
        title: 'Forking paths and p-hacking',
        body: `Researchers make many choices after seeing data: which outcome, which time point, which covariates, which patients to exclude, which cut-point, when to stop recruiting. Each looks reasonable; together they inflate false positives far beyond 5%, even without any conscious fishing {{gelman2014,simmons2011}}.

Defences: a registered protocol and statistical analysis plan before data are unblinded {{spirit2025}}, reporting all outcomes as pre-specified, and the open-science items in CONSORT 2025 {{consort2025}}. Compare the registry entry with the publication when you appraise a trial.`,
      },
      {
        kind: 'callout',
        tone: 'rule',
        title: 'Is a subgroup effect believable?',
        body: `Credible [[subgroup-analysis|subgroup claims]] are pre-specified with a stated direction, few in number, supported by a significant test of interaction (not separate p-values in each subgroup), consistent across related outcomes and studies, and biologically plausible {{sun2010,schandelmaier2020}}. Most claimed subgroup effects fail these tests.`,
      },
      {
        kind: 'text',
        title: 'How often is a "significant" finding true?',
        body: `It depends on how plausible the hypotheses were and how much power the study had {{ioannidis2005}}. If 10% of tested hypotheses are true, α = 0.05:

| Power | True positives | False positives | Share of significant results that are true |
|---|---|---|---|
| 80% | 8.0 per 100 | 4.5 per 100 | 64% |
| 20% | 2.0 per 100 | 4.5 per 100 | 31% |

This is the diagnostic-test logic of Module 13: α plays the role of 1 − specificity, power the role of sensitivity, prior plausibility the role of prevalence.`,
      },
    ],
    takeaways: [
      '20 independent tests of true nulls → 64% chance of at least one false positive.',
      'Use Holm rather than Bonferroni for FWER; Benjamini–Hochberg for screening.',
      'Adjust for confirmatory families; label exploratory analyses and report them all.',
      'Pre-registration and an analysis plan are the main defence against forking paths.',
      'Subgroup claims need a pre-specified, significant interaction test.',
    ],
  },

  // ───────────────────────────── 16 ─────────────────────────────
  {
    id: 'meta-analysis',
    n: 16,
    title: 'Meta-analysis and forest plots',
    tagline: 'Pooling increases precision, but only heterogeneity and bias assessment tell you what the pooled number means.',
    minutes: 15,
    objectives: [
      'Read a forest plot, including weights and the pooled diamond',
      'Distinguish common-effect from random-effects models',
      'Interpret τ², I² and the prediction interval',
      'Recognise small-study effects and rate certainty with GRADE',
    ],
    sections: [
      {
        kind: 'text',
        title: 'Pooling',
        body: `Each study contributes an effect estimate (log RR, log OR, mean difference) and its SE. Inverse-variance weighting gives more weight to precise studies.

- **Common (fixed) effect:** assumes every study estimates the same true effect.
- **[[random-effects|Random effects]]:** assumes true effects vary across studies with variance τ², and estimates their mean. Weights become more equal as τ² grows.

Estimate τ² with REML or Paule–Mandel rather than DerSimonian–Laird, and use the Hartung–Knapp(–Sidik–Jonkman) adjustment for the CI, especially with few studies {{inthout2014,cochrane2024}}.`,
      },
      { kind: 'lab', lab: 'forest', caption: 'Spread the study results apart. The pooled CI widens a little; the prediction interval widens a lot.' },
      {
        kind: 'text',
        title: 'Heterogeneity',
        body: `- **τ²** is the between-study variance of true effects, in the units of the effect measure.
- **I²** is the percentage of observed variation due to heterogeneity rather than chance {{higgins2003}}. It grows with study size even when τ² is unchanged, so it is a relative measure, not an absolute one.
- The **[[prediction-interval|prediction interval]]** shows where the true effect in a new setting is likely to lie. A pooled RR of 0.80 (95% CI 0.70 to 0.92) with a prediction interval of 0.50 to 1.30 means the treatment may not help in some settings {{inthout2016}}.

Explore heterogeneity with a few pre-specified subgroup analyses or meta-regression; with fewer than about 10 studies these have little power.`,
      },
      {
        kind: 'text',
        title: 'Bias and certainty',
        body: `- **[[publication-bias|Small-study effects]]:** smaller studies showing larger effects (funnel-plot asymmetry) may reflect publication bias, but also heterogeneity or chance. Tests need about 10 or more studies.
- **Risk of bias in included studies:** RoB 2 for randomised trials {{sterne2019}}, ROBINS-I for non-randomised studies {{sterne2016}}.
- **Certainty of evidence:** GRADE rates it high, moderate, low or very low, considering risk of bias, inconsistency, indirectness, imprecision and publication bias {{guyatt2008}}.

Report systematic reviews with PRISMA 2020 {{prisma2020}}. A meta-analysis of biased studies is a precise estimate of a biased answer.`,
      },
    ],
    takeaways: [
      'Random-effects models estimate the mean of a distribution of true effects.',
      'I² is relative; τ² and the prediction interval describe the actual spread.',
      'Prefer REML/Paule–Mandel with Hartung–Knapp CIs over DerSimonian–Laird.',
      'Funnel-plot asymmetry has several causes and needs ≥ 10 studies.',
      'Rate certainty with GRADE; pooling cannot remove bias.',
    ],
  },

  // ───────────────────────────── 17 ─────────────────────────────
  {
    id: 'appraisal',
    n: 17,
    title: 'Putting it together: appraising and reporting a study',
    tagline: 'A ten-step workflow for any results section, plus the reporting guidelines and estimands that structure it.',
    minutes: 20,
    objectives: [
      'Apply a structured workflow to the statistics of any clinical paper',
      'State the estimand and judge whether ITT, per-protocol or other analyses answer it',
      'Pick the right reporting guideline and risk-of-bias tool for each design',
      'Write a statistical methods paragraph that others can reproduce',
    ],
    sections: [
      {
        kind: 'text',
        title: 'Ten questions for any results section',
        body: `1. **What is the question and the estimand?** Population, treatment conditions, outcome, handling of intercurrent events, summary measure {{iche9r1,kahan2024}}.
2. **What is the design**, and what can it support — causal effect, association, prediction, accuracy?
3. **What type is the outcome, and how are observations related?** Does the method match (Modules 1, 6, 10)?
4. **Was the analysis pre-specified?** Compare the protocol or registry with the paper.
5. **What is the effect estimate, with its CI?** In absolute and relative terms, with a time frame.
6. **Is it clinically important?** Compare the whole CI with the MCID.
7. **Could bias explain it?** Confounding, selection, measurement, missing data, immortal time.
8. **How many analyses were run?** Multiplicity, subgroups, outcome switching.
9. **Were assumptions reasonable?** Proportional hazards, overdispersion, linearity, clustering.
10. **Does it apply to my patients?** Eligibility, setting, baseline risk.`,
      },
      {
        kind: 'text',
        title: 'Estimands, ITT and per-protocol',
        body: `Intercurrent events — stopping treatment, rescue medication, switching, death — change what "the treatment effect" means. ICH E9(R1) asks trials to state how each is handled: treatment-policy (regardless of the event, as in [[itt|ITT]]), hypothetical (as if it had not occurred), composite (the event counts as failure), while-on-treatment, or principal stratum {{iche9r1,kahan2024}}.

- **ITT** compares groups as randomised and preserves randomisation. For superiority trials it tends to dilute the effect towards the null.
- **Naive [[per-protocol|per-protocol]]** analyses keep only adherent patients and are confounded by the reasons for non-adherence.
- In **non-inferiority trials** dilution favours the conclusion "non-inferior", so ITT is no longer conservative; both ITT and per-protocol results should support the conclusion {{piaggio2012}}.`,
      },
      {
        kind: 'text',
        title: 'Reporting guidelines and appraisal tools',
        body: `| Design | Report with | Appraise with |
|---|---|---|
| Randomised trial | CONSORT 2025 {{consort2025}} | RoB 2 {{sterne2019}} |
| Trial protocol | SPIRIT 2025 {{spirit2025}} | — |
| Cluster trial | CONSORT cluster extension {{consortcluster2012}} | RoB 2 (cluster variant) |
| Non-inferiority trial | CONSORT NI extension {{piaggio2012}} | RoB 2 |
| Observational study | STROBE {{strobe2007}} | ROBINS-I {{sterne2016}} |
| Target trial emulation | TARGET 2025 {{target2025}} | ROBINS-I |
| Diagnostic accuracy | STARD 2015 {{stard2015}} | QUADAS-2 {{whiting2011}} |
| Prediction model | TRIPOD+AI {{tripodai2024}} | PROBAST+AI {{probastai2025}} |
| Systematic review | PRISMA 2020 {{prisma2020}} | GRADE for certainty {{guyatt2008}} |

All guidelines are collected at the [EQUATOR Network](https://www.equator-network.org).`,
      },
      {
        kind: 'callout',
        tone: 'example',
        title: 'A reproducible statistical methods paragraph',
        body: `"The primary outcome, SBP at 12 weeks, was analysed with linear regression adjusting for baseline SBP and the randomisation stratification factor (site), under the treatment-policy strategy for treatment discontinuation. Missing outcomes (8%) were handled by multiple imputation (50 imputations) under MAR, with a tipping-point sensitivity analysis. We report the adjusted mean difference with 95% CI. A sample of 274 (137 per group) gives 90% power to detect a 5 mmHg difference (SD 12) at two-sided α = 0.05 after allowing for 10% attrition. Secondary outcomes are reported without multiplicity adjustment and interpreted as exploratory. Analyses used R 4.4."`,
      },
      {
        kind: 'callout',
        tone: 'pitfall',
        title: 'Red flags in a results section',
        body: `- p-values without effect estimates or CIs; "trend towards significance".
- Baseline p-values in a randomised trial’s Table 1.
- Relative effects only, no absolute risks or time frame.
- Primary outcome different from the registry entry.
- Subgroup claims without interaction tests.
- "No difference" claimed from a non-significant, wide CI.
- Survival curves without numbers at risk; HR read as a risk ratio.
- Stepwise selection, dichotomised predictors, LOCF.`,
      },
    ],
    takeaways: [
      'Start appraisal from the question and estimand, then check the method fits the data.',
      'ITT dilutes effects; that is conservative for superiority but not for non-inferiority.',
      'Use the design-specific reporting guideline and risk-of-bias tool.',
      'A methods paragraph should let a reader reproduce the analysis and the sample size.',
    ],
  },
];
