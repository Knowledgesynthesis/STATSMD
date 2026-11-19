import type { Case } from './types';

export const cases: Case[] = [
  {
    id: 'bp-rct',
    title: 'Antihypertensive RCT with a baseline measurement',
    level: 1,
    modules: ['comparing-groups', 'estimation'],
    scenario: `240 adults with uncontrolled hypertension were randomised 1:1 (stratified by site) to a new drug or placebo. SBP was measured at baseline and 12 weeks. Baseline SBP correlates with 12-week SBP (r ≈ 0.6). The protocol defines 5 mmHg as the minimal clinically important difference.`,
    steps: [
      {
        prompt: 'Which primary analysis makes best use of the design?',
        options: [
          { text: 'Welch t-test on 12-week SBP', feedback: 'Valid and unbiased, but it ignores the baseline measurement and so has wider CIs than necessary.' },
          { text: 't-test on change from baseline', feedback: 'Unbiased, and slightly better than follow-up-only when r > 0.5, but still less efficient than ANCOVA.' },
          { text: 'ANCOVA: 12-week SBP ~ treatment + baseline SBP + site', correct: true, feedback: 'Correct. ANCOVA has the smallest variance of these options, and adjusting for the stratification factor (site) gives correct SEs.' },
          { text: 'Paired t-test within each arm', feedback: 'Within-arm tests do not compare the arms. A significant change in one arm and not the other is not evidence of a difference between arms.' },
        ],
      },
      {
        prompt: 'Table 1 shows baseline age differs between arms (p = 0.04). What should be done?',
        options: [
          { text: 'Add age to the model because p < 0.05', feedback: 'Choosing covariates from baseline p-values is data-driven and has no theoretical basis in a randomised trial.' },
          { text: 'Remove the baseline p-values; pre-specify adjustment for strongly prognostic covariates regardless of imbalance', correct: true, feedback: 'Correct. Any imbalance after proper randomisation is chance by definition. Adjustment should be planned from prognostic importance, not from Table 1.' },
          { text: 'Conclude randomisation failed', feedback: 'With 15–20 baseline variables, about one "significant" difference is expected by chance.' },
        ],
      },
      {
        prompt: 'Result: adjusted difference −4.1 mmHg (95% CI −7.0 to −1.2), p = 0.006. What is the best interpretation?',
        options: [
          { text: 'The drug produces a clinically important reduction', feedback: 'The point estimate is below the 5 mmHg MCID and the CI extends to 1.2 mmHg, so clinical importance is not established.' },
          { text: 'A reduction is likely, but the data are compatible with effects from about 1 to 7 mmHg — so it may or may not reach the 5 mmHg MCID', correct: true, feedback: 'Correct. Statistical significance answers "is there an effect?"; the CI against the MCID answers "is it big enough?".' },
          { text: 'No effect, because the reduction is smaller than 5 mmHg', feedback: 'The CI excludes zero; there is evidence of some reduction.' },
        ],
      },
    ],
    debrief: 'Use ANCOVA with stratification factors for trials with a baseline measurement; never test baseline balance; interpret the CI against the MCID.',
    refs: ['vickers2001', 'senn1994', 'kahan2012'],
  },
  {
    id: 'pain-prepost',
    title: 'Physiotherapy before and after, no control group',
    level: 1,
    modules: ['comparing-groups', 'confounding'],
    scenario: `40 patients were enrolled from a back-pain clinic during an acute flare (pain ≥ 7 on a 0–10 numeric rating scale). Pain was recorded before and after a 6-week physiotherapy programme. Mean pain fell from 7.8 to 4.9.`,
    steps: [
      {
        prompt: 'How are the observations structured?',
        options: [
          { text: 'Two independent groups (before vs after)', feedback: 'The same patients appear in both — the measurements are paired.' },
          { text: 'Paired: two measurements on each patient', correct: true, feedback: 'Correct. Analyse within-patient differences.' },
          { text: 'Clustered by therapist', feedback: 'Possibly relevant, but the defining feature is that each patient is measured twice.' },
        ],
      },
      {
        prompt: 'Which analysis of the change is reasonable?',
        options: [
          { text: 'Paired t-test on the differences, or Wilcoxon signed-rank if the differences are clearly skewed', correct: true, feedback: 'Correct. With 40 pairs the paired t-test is robust; the NRS is often analysed as approximately continuous. Report the mean (or Hodges–Lehmann) difference with a CI.' },
          { text: 'Mann–Whitney U test', feedback: 'That is for independent groups; it ignores the pairing.' },
          { text: 'Chi-square test of pain ≥ 7 before vs after', feedback: 'Dichotomising wastes information, and a standard χ² ignores the pairing.' },
        ],
      },
      {
        prompt: 'The paired difference is −2.9 points (95% CI −3.6 to −2.2). Can the improvement be attributed to physiotherapy?',
        options: [
          { text: 'Yes — the CI excludes zero', feedback: 'The CI shows that pain fell, not why it fell.' },
          { text: 'No — patients enrolled during a flare would improve on average anyway (regression to the mean and natural history); a randomised control group is needed', correct: true, feedback: 'Correct. Selection for extreme values plus a fluctuating condition guarantees improvement on re-measurement.' },
          { text: 'Yes, if the Wilcoxon test is also significant', feedback: 'A second test of the same change does not address the missing comparison group.' },
        ],
      },
    ],
    debrief: 'Paired data need paired analysis, but no pre–post analysis can separate treatment from regression to the mean without a control group.',
    refs: ['barnett2005'],
  },
  {
    id: 'matched-cc',
    title: 'Individually matched case-control study',
    level: 2,
    modules: ['categorical', 'effect-measures'],
    scenario: `200 patients with lung cancer were each matched to one control on age (± 2 years), sex and general practice. Exposure: home radon above the action level (yes/no). Of the 200 pairs, 30 had both members exposed, 110 had neither exposed, in 40 only the case was exposed and in 20 only the control was exposed.`,
    steps: [
      {
        prompt: 'Which effect measure can this design estimate?',
        options: [
          { text: 'Risk ratio', feedback: 'Risks cannot be estimated because the investigators fixed the number of cases and controls.' },
          { text: 'Odds ratio', correct: true, feedback: 'Correct. The exposure odds ratio equals the disease odds ratio.' },
          { text: 'Risk difference', feedback: 'Requires risks, which this design cannot provide.' },
        ],
      },
      {
        prompt: 'Which analysis respects the design?',
        options: [
          { text: 'Pearson χ² on the 2×2 table of case status by exposure', feedback: 'This breaks the matching and usually biases the OR towards 1.' },
          { text: 'McNemar test / matched OR from discordant pairs, or conditional logistic regression for adjustment', correct: true, feedback: 'Correct. Individually matched data need a matched analysis.' },
          { text: 'Fisher’s exact test', feedback: 'Also ignores the matching.' },
        ],
      },
      {
        prompt: 'What is the matched odds ratio?',
        options: [
          { text: '40 / 20 = 2.0', correct: true, feedback: 'Correct. Only discordant pairs inform the matched OR: case-exposed-only ÷ control-exposed-only. McNemar χ² = (40 − 20)² / 60 = 6.7, p ≈ 0.01.' },
          { text: '(70 × 150) / (130 × 50) ≈ 1.6', feedback: 'That is the unmatched OR after breaking the pairs (70 of 200 cases and 50 of 200 controls exposed) — biased towards 1 here.' },
          { text: '30 / 110 ≈ 0.27', feedback: 'Concordant pairs carry no information about the exposure–disease association in a matched analysis.' },
        ],
      },
    ],
    debrief: 'Matching is a design choice that must be mirrored in the analysis. With 1:1 pairs and a binary exposure, the matched OR is b/c.',
    refs: ['pearce2016', 'agresti2013'],
  },
  {
    id: 'icu-mobilisation',
    title: 'Early mobilisation and ICU mortality (observational)',
    level: 2,
    modules: ['regression', 'effect-measures', 'confounding'],
    scenario: `A cohort of 300 ventilated ICU patients: 60 died in hospital (20%). Early mobilisation (within 72 h) was given at the team’s discretion. Investigators want the effect of early mobilisation on mortality, adjusting for age, APACHE II, sepsis and vasopressor use. They plan to add 8 more variables selected by univariable p < 0.2.`,
    steps: [
      {
        prompt: 'What is the main threat to a causal interpretation?',
        options: [
          { text: 'Small sample size', feedback: 'Relevant to precision, but not the main threat to validity.' },
          { text: 'Confounding by indication: sicker patients are less likely to be mobilised early and more likely to die', correct: true, feedback: 'Correct. Mobilisation was not randomised; illness severity drives both treatment and outcome.' },
          { text: 'Regression to the mean', feedback: 'Not the central problem here; patients were not selected on a fluctuating measurement.' },
        ],
      },
      {
        prompt: 'What is wrong with the covariate plan?',
        options: [
          { text: 'Nothing — more covariates are always better', feedback: 'Extra covariates selected by p-values add noise, can introduce bias and overfit with only 60 events.' },
          { text: 'Confounders should be chosen from causal knowledge; univariable screening is unreliable, and 12 parameters with 60 events (5 per parameter) risks unstable estimates', correct: true, feedback: 'Correct. Choose a DAG-based adjustment set; consider propensity-score methods to reduce dimension.' },
          { text: 'They should use stepwise selection instead', feedback: 'Stepwise selection biases coefficients and understates uncertainty.' },
        ],
      },
      {
        prompt: 'The adjusted OR for early mobilisation is 0.60 (95% CI 0.38 to 0.95). Baseline mortality is about 20%. Which statement is best?',
        options: [
          { text: 'Early mobilisation reduces the risk of death by 40%', feedback: 'With a 20% outcome, the OR exaggerates the relative risk reduction.' },
          { text: 'The odds of death are 40% lower; the corresponding RR is about 0.65 (risk about 35% lower), still subject to residual confounding', correct: true, feedback: 'Correct. RR ≈ OR / (1 − p₀ + p₀·OR) = 0.60 / 0.92 ≈ 0.65. Report absolute risks and an E-value too.' },
          { text: 'Early mobilisation causes a 0.6% reduction in mortality', feedback: 'An OR is a ratio, not an absolute difference.' },
        ],
      },
    ],
    debrief: 'Observational treatment effects need a causal adjustment set, enough events per parameter, and careful translation of ORs into risks.',
    refs: ['sun1996', 'heinze2018', 'vittinghoff2007', 'vanderweele2017'],
  },
  {
    id: 'cancer-cohort',
    title: 'Comparing two cancer treatments in a registry',
    level: 3,
    modules: ['survival', 'confounding'],
    scenario: `A registry of 2,000 patients with stage II–III colon cancer compares adjuvant regimen A (started at surgery) with regimen B (started a median 10 weeks after surgery, after recovery). Follow-up starts at surgery for everyone; patients who die before starting B are counted in group A or excluded. Median follow-up is 4 years with substantial censoring.`,
    steps: [
      {
        prompt: 'What is the most serious design flaw?',
        options: [
          { text: 'Too much censoring', feedback: 'Censoring is handled by survival methods if it is non-informative.' },
          { text: 'Immortal time bias: B patients had to survive ~10 weeks to be classified as B, and that event-free time is credited to B', correct: true, feedback: 'Correct. Align time zero: start follow-up when treatment is assigned, use a landmark, or model treatment as time-varying in a target-trial emulation.' },
          { text: 'Use of a registry', feedback: 'Registries can support valid analyses if designed carefully.' },
        ],
      },
      {
        prompt: 'After fixing time zero, which analysis is appropriate for a non-randomised comparison?',
        options: [
          { text: 'Kaplan–Meier with log-rank, unadjusted', feedback: 'Fine for description, but unadjusted comparisons of non-randomised treatments are confounded (stage, age, performance status).' },
          { text: 'Cox regression adjusted for confounders chosen a priori (or propensity-score weighting), with absolute survival reported', correct: true, feedback: 'Correct. Report adjusted HRs plus standardised survival curves or risk differences at fixed times.' },
          { text: 'Logistic regression for death at 4 years', feedback: 'Ignores censoring before 4 years.' },
        ],
      },
      {
        prompt: 'The Schoenfeld residual test for treatment gives p = 0.002 and the curves cross at 18 months. How should results be summarised?',
        options: [
          { text: 'Report the single HR as usual', feedback: 'A single HR averages a benefit and a harm over different periods.' },
          { text: 'Report RMST difference to a pre-specified horizon and/or survival at fixed times; or period-specific HRs', correct: true, feedback: 'Correct. These summaries remain interpretable when hazards are not proportional.' },
          { text: 'Exclude patients followed beyond 18 months', feedback: 'Discarding data does not solve non-proportionality.' },
        ],
      },
    ],
    debrief: 'Time zero, eligibility and treatment assignment must coincide. Then adjust for confounding and choose summaries that survive non-proportional hazards.',
    refs: ['suissa2008', 'hernan2016', 'target2025', 'uno2014', 'grambsch1994'],
  },
  {
    id: 'los-skew',
    title: 'Length of stay with a new discharge pathway',
    level: 2,
    modules: ['comparing-groups', 'data-types', 'regression'],
    scenario: `400 patients are randomised to a new discharge pathway or usual care. Length of stay (days) is strongly right-skewed: usual care median 5 (IQR 3–9), mean 7.4, SD 8.1, maximum 64.`,
    steps: [
      {
        prompt: 'How should LOS be summarised in Table 1–style descriptions?',
        options: [
          { text: 'Mean (SD)', feedback: 'Mean < 2 × SD for a non-negative variable signals strong skew; the mean and SD alone mislead.' },
          { text: 'Median (IQR), possibly with the mean if costs matter', correct: true, feedback: 'Correct. Median (IQR) describes the typical patient; the mean is still relevant for bed-days and budgets.' },
          { text: 'Mean (SE)', feedback: 'SE describes precision, not spread.' },
        ],
      },
      {
        prompt: 'The clinical question is "does the pathway shorten typical stays?" Which analysis gives an interpretable effect?',
        options: [
          { text: 'Linear regression (or Welch t-test) on log(LOS), reporting the ratio of geometric means', correct: true, feedback: 'Correct. A ratio of 0.85 means stays are about 15% shorter. Negative binomial regression on days is a good alternative.' },
          { text: 'Mann–Whitney test with p-value only', feedback: 'A valid test, but without an effect estimate it does not say how much shorter stays are.' },
          { text: 'Chi-square of LOS > 7 days', feedback: 'Dichotomising wastes information and depends on an arbitrary cut-point.' },
        ],
      },
      {
        prompt: 'The hospital finance team asks for the expected saving in bed-days per 100 patients. Which estimate answers that?',
        options: [
          { text: 'The ratio of geometric means', feedback: 'A geometric-mean ratio does not translate directly into total bed-days.' },
          { text: 'Difference in arithmetic means, with a robust (e.g., bootstrap) CI', correct: true, feedback: 'Correct. Totals depend on means, including the long tail of long stays.' },
          { text: 'Difference in medians', feedback: 'Medians ignore the long stays that drive most bed-day use.' },
        ],
      },
    ],
    debrief: 'Skewed outcomes: choose the scale that answers the question — log scale for typical patients, arithmetic means for totals and costs.',
    refs: ['altman1996', 'lumley2002'],
  },
  {
    id: 'copd-exacerbations',
    title: 'Exacerbation counts in an inhaler trial',
    level: 2,
    modules: ['regression'],
    scenario: `In a 12-month COPD trial, 600 patients were randomised to inhaler X or Y. Some withdrew early, so follow-up ranges from 2 to 12 months. Outcome: number of moderate or severe exacerbations. Most patients had 0–2; a few had 8 or more.`,
    steps: [
      {
        prompt: 'Which model is appropriate?',
        options: [
          { text: 't-test on exacerbation counts', feedback: 'Ignores the count nature of the data and unequal follow-up.' },
          { text: 'Poisson regression without offset', feedback: 'Ignores varying follow-up time and probably overdispersion.' },
          { text: 'Negative binomial regression with log(follow-up time) as an offset', correct: true, feedback: 'Correct. Handles rates per unit time and overdispersion typical of clinical event counts.' },
          { text: 'Logistic regression of any exacerbation yes/no', feedback: 'Wastes information on repeated events and ignores follow-up time.' },
        ],
      },
      {
        prompt: 'A Poisson model is fitted first and gives Pearson χ²/df = 2.8. What does this indicate?',
        options: [
          { text: 'Good fit', feedback: 'Values well above 1 indicate the variance exceeds the mean.' },
          { text: 'Overdispersion: Poisson SEs are too small and CIs too narrow', correct: true, feedback: 'Correct. The negative binomial (or robust SEs) corrects this.' },
          { text: 'Underdispersion', feedback: 'That would give values below 1.' },
        ],
      },
      {
        prompt: 'Result: rate ratio 0.75 (95% CI 0.63 to 0.89); rate on Y is 1.2 per patient-year. How would you explain this to a patient?',
        options: [
          { text: 'You will have 75% fewer exacerbations', feedback: 'An RR of 0.75 is a 25% reduction, not 75%.' },
          { text: 'About 25% fewer exacerbations: roughly 0.9 instead of 1.2 per year, i.e., about 3 fewer per 10 patient-years', correct: true, feedback: 'Correct. Translating the rate ratio into absolute rates makes it meaningful.' },
          { text: 'A 0.75 lower chance of any exacerbation', feedback: 'A rate ratio is not a probability.' },
        ],
      },
    ],
    debrief: 'Counts with variable follow-up: model rates with an offset and allow for overdispersion; translate rate ratios into absolute rates.',
    refs: ['agresti2013'],
  },
  {
    id: 'screening-ppv',
    title: 'A blood test for colorectal cancer',
    level: 1,
    modules: ['diagnostic'],
    scenario: `A blood test for colorectal cancer has sensitivity 80% and specificity 95% in a well-conducted study of symptomatic clinic patients. A health board considers using it for population screening, where prevalence of undiagnosed cancer is about 0.5%.`,
    steps: [
      {
        prompt: 'What is the PPV in population screening (prevalence 0.5%)?',
        options: [
          { text: 'About 80%', feedback: 'That is the sensitivity — the probability of a positive test given cancer.' },
          { text: 'About 7%', correct: true, feedback: 'Correct. Per 100,000: 500 cancers → 400 TP; 99,500 without → 4,975 FP. PPV = 400 / 5,375 ≈ 7.4%.' },
          { text: 'About 95%', feedback: 'That is the specificity.' },
        ],
      },
      {
        prompt: 'In the symptomatic clinic, prevalence is 5%. What is the PPV there?',
        options: [
          { text: 'About 46%', correct: true, feedback: 'Correct. Per 100,000: 4,000 TP and 4,750 FP → PPV ≈ 46%. Same test, very different meaning.' },
          { text: 'About 7%', feedback: 'PPV rises with prevalence.' },
          { text: 'About 80%', feedback: 'That is the sensitivity again.' },
        ],
      },
      {
        prompt: 'Which summary of the test is most transportable between settings?',
        options: [
          { text: 'PPV', feedback: 'PPV depends heavily on prevalence.' },
          { text: 'Likelihood ratios (LR+ = 16, LR− ≈ 0.21), applied to each setting’s pre-test probability', correct: true, feedback: 'Correct — though sensitivity and specificity (and therefore LRs) can themselves shift with case mix; screening populations have earlier, smaller tumours.' },
          { text: 'Accuracy (proportion correct)', feedback: 'Accuracy is dominated by the large disease-free group and hides false negatives.' },
        ],
      },
    ],
    debrief: 'Predictive values belong to a setting, not to a test. Use LRs with the local pre-test probability, and remember spectrum effects.',
    refs: ['deeks2004', 'whiting2011'],
  },
  {
    id: 'cluster-hygiene',
    title: 'A cluster-randomised hand-hygiene trial',
    level: 3,
    modules: ['correlated-data', 'power'],
    scenario: `24 wards (about 100 patients each) were randomised to a hand-hygiene intervention or usual practice. Outcome: hospital-acquired infection per patient. The draft analysis uses a χ² test on 2,400 patients. The ICC for infection between wards is estimated at 0.01.`,
    steps: [
      {
        prompt: 'What is wrong with the χ² test on all patients?',
        options: [
          { text: 'Nothing — 2,400 patients is a large sample', feedback: 'Patients on the same ward share staff and practices; they are not independent.' },
          { text: 'It ignores clustering by ward, so the SE is too small and p-values too optimistic', correct: true, feedback: 'Correct. The unit of randomisation is the ward.' },
          { text: 'Expected counts are too small', feedback: 'Unlikely with 2,400 patients; the problem is independence.' },
        ],
      },
      {
        prompt: 'What is the design effect?',
        options: [
          { text: '1.01', feedback: 'Design effect = 1 + (m − 1) × ICC with m = 100.' },
          { text: 'About 2 (1 + 99 × 0.01 = 1.99)', correct: true, feedback: 'Correct. The effective sample size is about 2,400 / 2 ≈ 1,200 — even a tiny ICC halves the information.' },
          { text: '100', feedback: 'That would be the case if ICC = 1.' },
        ],
      },
      {
        prompt: 'Which analysis is appropriate with 24 clusters?',
        options: [
          { text: 'GEE with standard sandwich SEs', feedback: 'With fewer than about 40 clusters, standard sandwich SEs are too small.' },
          { text: 'Mixed-effects logistic regression or GEE with a small-sample correction (or cluster-level analysis)', correct: true, feedback: 'Correct. With few clusters, small-sample corrections or cluster-level summaries keep error rates honest.' },
          { text: 'Logistic regression ignoring ward', feedback: 'Same problem as the χ² test.' },
        ],
      },
    ],
    debrief: 'Analyse at the level of randomisation, inflate sample size by the design effect, and correct for few clusters.',
    refs: ['killip2004', 'consortcluster2012', 'fitzmaurice2011'],
  },
  {
    id: 'subgroup-claim',
    title: 'A subgroup "discovery"',
    level: 2,
    modules: ['multiplicity', 'p-values'],
    scenario: `A heart-failure trial (n = 3,000) finds no overall effect: HR 0.95 (95% CI 0.84 to 1.07). The discussion highlights women: HR 0.70 (p = 0.03) vs men HR 1.10 (p = 0.40). Twelve subgroup analyses were reported; none were pre-specified with a direction. Interaction p = 0.08.`,
    steps: [
      {
        prompt: 'What does the contrast between women (p = 0.03) and men (p = 0.40) show?',
        options: [
          { text: 'The drug works in women only', feedback: 'Separate subgroup p-values do not test whether effects differ.' },
          { text: 'On its own, nothing — the relevant test is the interaction, which here is p = 0.08 after 12 subgroup analyses', correct: true, feedback: 'Correct. Significant in one subgroup and not in another is not evidence of a difference.' },
          { text: 'The drug harms men', feedback: 'HR 1.10 with p = 0.40 is compatible with benefit, no effect or harm.' },
        ],
      },
      {
        prompt: 'How credible is the subgroup effect?',
        options: [
          { text: 'Highly credible: p = 0.03', feedback: 'With 12 post-hoc subgroups, finding one with p < 0.05 is expected.' },
          { text: 'Low credibility: post hoc, one of many, weak interaction evidence, no pre-specified direction', correct: true, feedback: 'Correct. It is hypothesis-generating at most.' },
          { text: 'Credible if biologically plausible', feedback: 'Plausibility is necessary but not sufficient; most post-hoc subgroup effects have some post-hoc rationale.' },
        ],
      },
      {
        prompt: 'What should the abstract conclusion say?',
        options: [
          { text: '"The drug is effective in women"', feedback: 'Overstates a post-hoc finding.' },
          { text: '"No overall effect; HR 0.95 (0.84 to 1.07). Subgroup analyses were exploratory and do not support differential effects."', correct: true, feedback: 'Correct. The primary result leads; the CI excludes large benefits.' },
          { text: '"The trial was underpowered"', feedback: 'The CI shows what effects were excluded; that is more informative than a claim about power.' },
        ],
      },
    ],
    debrief: 'Judge subgroup claims by pre-specification, number of comparisons and the interaction test — not by separate p-values.',
    refs: ['sun2010', 'schandelmaier2020', 'gelman2006'],
  },
  {
    id: 'poc-haemoglobin',
    title: 'A point-of-care haemoglobin device',
    level: 2,
    modules: ['correlation-agreement'],
    scenario: `A point-of-care device and the laboratory analyser measured haemoglobin in 150 patients. The manufacturer reports r = 0.97 (p < 0.001). Clinicians say differences larger than ±1.0 g/dL would change transfusion decisions.`,
    steps: [
      {
        prompt: 'Does r = 0.97 show the device can replace the laboratory?',
        options: [
          { text: 'Yes — r > 0.9 means excellent agreement', feedback: 'A systematic offset or wide scatter around the line of equality can coexist with very high r.' },
          { text: 'No — correlation measures association, not agreement', correct: true, feedback: 'Correct. And r is inflated by the wide range of Hb across patients.' },
          { text: 'Yes, because p < 0.001', feedback: 'Testing r = 0 is irrelevant for method comparison.' },
        ],
      },
      {
        prompt: 'Which analysis answers the clinical question?',
        options: [
          { text: 'Paired t-test of the two methods', feedback: 'Tests only the mean difference; large random disagreement can hide behind a zero mean difference.' },
          { text: 'Bland–Altman: bias and 95% limits of agreement, with CIs, compared with the ±1.0 g/dL clinical limit', correct: true, feedback: 'Correct. It estimates how far an individual device reading can be from the laboratory value — the quantity that matters for a transfusion decision.' },
          { text: 'Linear regression of device on lab', feedback: 'Regression is affected by the range and measurement error in both methods; it does not give limits of agreement.' },
        ],
      },
      {
        prompt: 'Bias −0.3 g/dL, limits of agreement −1.9 to +1.3 g/dL. Conclusion?',
        options: [
          { text: 'Acceptable: the bias is small', feedback: 'Individual differences matter for transfusion decisions, not only the average.' },
          { text: 'Not acceptable for replacing the laboratory: individual differences up to about 2 g/dL exceed the ±1.0 g/dL clinical limit', correct: true, feedback: 'Correct. Roughly 1 patient in 20 would have a difference beyond −1.9 or +1.3 g/dL; many more exceed ±1.0.' },
          { text: 'Cannot be judged without a p-value', feedback: 'The clinical limit, defined in advance, is the benchmark.' },
        ],
      },
    ],
    debrief: 'Method comparison requires Bland–Altman limits of agreement judged against a clinical limit set in advance.',
    refs: ['bland1986'],
  },
  {
    id: 'sepsis-model',
    title: 'Developing a sepsis mortality model',
    level: 3,
    modules: ['prediction', 'regression'],
    scenario: `A team developed a 30-day mortality model in 800 sepsis admissions (80 deaths), starting from 25 candidate predictors, selecting with backward stepwise regression at p < 0.05 after dichotomising lactate (> 2 mmol/L) and age (> 65). Apparent AUC = 0.86. They plan to publish the AUC with a list of selected predictors.`,
    steps: [
      {
        prompt: 'What is the main methodological concern?',
        options: [
          { text: 'AUC 0.86 is too low', feedback: 'The apparent AUC is likely optimistic, not too low.' },
          { text: 'Overfitting: 25 candidate predictors with 80 events, stepwise selection and dichotomised predictors', correct: true, feedback: 'Correct. The model will predict too extremely in new patients (calibration slope < 1).' },
          { text: 'Sepsis should be modelled with Cox regression', feedback: 'Logistic regression is fine for fixed-horizon mortality without censoring.' },
        ],
      },
      {
        prompt: 'How should performance be evaluated in this dataset?',
        options: [
          { text: 'Split 70/30 and report AUC on the 30%', feedback: 'Split-sample validation wastes data and is unstable at this size.' },
          { text: 'Bootstrap internal validation of the whole modelling process, reporting optimism-corrected AUC and calibration slope', correct: true, feedback: 'Correct. Then apply shrinkage and plan external validation with ≥ 100–200 events.' },
          { text: 'Hosmer–Lemeshow test', feedback: 'Low power, sensitive to grouping, and says nothing about the direction of miscalibration.' },
        ],
      },
      {
        prompt: 'What must be published for others to use and validate the model?',
        options: [
          { text: 'The AUC and the list of predictors', feedback: 'Others cannot compute predictions without the coefficients and intercept.' },
          { text: 'The full equation (intercept and all coefficients), calibration and discrimination with CIs, following TRIPOD+AI', correct: true, feedback: 'Correct. Without the intercept and coefficients nobody can compute a risk, recalibrate the model, or validate it elsewhere.' },
          { text: 'Only the predictors with p < 0.05', feedback: 'Predictors are not chosen or reported by significance in prediction modelling.' },
        ],
      },
    ],
    debrief: 'Plan sample size (Riley), keep predictors continuous, avoid stepwise selection, validate with bootstrap, and publish the full model.',
    refs: ['riley2020', 'collins2016', 'tripodai2024', 'vancalster2019', 'steyerberg2019'],
  },
  {
    id: 'noninferiority',
    title: 'Short-course antibiotics: non-inferior?',
    level: 3,
    modules: ['appraisal', 'p-values'],
    scenario: `A trial randomised 900 patients with uncomplicated pneumonia to 5 or 10 days of antibiotics. Primary outcome: clinical cure at day 30. Pre-specified non-inferiority margin: short course no more than 10 percentage points worse. ITT: cure difference (short − long) −2.0% (95% CI −8.5% to +4.5%). Per-protocol (12% non-adherent, mostly in the long arm): −4.0% (95% CI −11.2% to +3.2%).`,
    steps: [
      {
        prompt: 'Is non-inferiority shown in the ITT analysis?',
        options: [
          { text: 'Yes — the lower CI limit (−8.5%) is above the −10% margin', correct: true, feedback: 'Correct for ITT. Non-inferiority requires the whole CI to lie above −Δ.' },
          { text: 'No — the CI includes zero', feedback: 'Including zero is expected; non-inferiority concerns the margin, not zero.' },
          { text: 'No — p > 0.05', feedback: 'The superiority p-value is irrelevant to non-inferiority.' },
        ],
      },
      {
        prompt: 'Why must the per-protocol analysis also be considered?',
        options: [
          { text: 'It is always the primary analysis', feedback: 'Not necessarily, but both are required for non-inferiority.' },
          { text: 'In non-inferiority trials, non-adherence dilutes differences towards zero, favouring a non-inferiority conclusion under ITT', correct: true, feedback: 'Correct. ITT is not conservative here.' },
          { text: 'Per-protocol has more power', feedback: 'It usually has less, and it may be confounded.' },
        ],
      },
      {
        prompt: 'The per-protocol lower limit is −11.2%, beyond the margin. Conclusion?',
        options: [
          { text: 'Non-inferiority robustly demonstrated', feedback: 'The analyses disagree.' },
          { text: 'Non-inferiority not robustly established; the short course could be up to about 11 points worse in adherent patients', correct: true, feedback: 'Correct. Report both and interpret cautiously.' },
          { text: 'The short course is inferior', feedback: 'Inferiority would need the whole CI below the margin.' },
        ],
      },
    ],
    debrief: 'Non-inferiority is judged against a pre-specified margin, and requires consistent ITT and per-protocol results.',
    refs: ['piaggio2012', 'iche9r1'],
  },
  {
    id: 'meta-steroids',
    title: 'A meta-analysis with heterogeneity',
    level: 2,
    modules: ['meta-analysis'],
    scenario: `A meta-analysis of 9 RCTs of corticosteroids in severe pneumonia reports pooled RR for mortality 0.78 (95% CI 0.64 to 0.95), I² = 58%, τ² = 0.06, 95% prediction interval 0.45 to 1.35, using DerSimonian–Laird. Three small trials with large benefits dominate the funnel plot’s lower left.`,
    steps: [
      {
        prompt: 'How should the prediction interval be read?',
        options: [
          { text: 'It is another way of writing the CI', feedback: 'The CI concerns the average effect; the prediction interval concerns a new setting.' },
          { text: 'In a new setting the true effect could range from a 55% reduction to a 35% increase', correct: true, feedback: 'Correct. Average benefit does not guarantee benefit everywhere.' },
          { text: 'It shows the result is not significant', feedback: 'The pooled CI excludes 1; the prediction interval answers a different question.' },
        ],
      },
      {
        prompt: 'What methodological improvement would you request?',
        options: [
          { text: 'Switch to a fixed-effect model', feedback: 'Fixed-effect assumes no heterogeneity, which the data contradict.' },
          { text: 'REML τ² with Hartung–Knapp CIs (with only 9 trials), and sensitivity analyses excluding high risk-of-bias trials', correct: true, feedback: 'Correct. DL CIs are often too narrow with few studies.' },
          { text: 'Report I² only', feedback: 'I² is relative; τ² and the prediction interval are more informative.' },
        ],
      },
      {
        prompt: 'What does the funnel-plot asymmetry suggest?',
        options: [
          { text: 'Definite publication bias', feedback: 'Asymmetry has several causes, and 9 studies give little power to assess it.' },
          { text: 'Possible small-study effects (publication bias, poorer quality, or genuine heterogeneity); treat the pooled estimate with caution', correct: true, feedback: 'Correct. GRADE would consider downgrading certainty.' },
          { text: 'Nothing — funnel plots are uninformative', feedback: 'They are informative but not diagnostic.' },
        ],
      },
    ],
    debrief: 'Report τ² and the prediction interval, use robust random-effects methods with few studies, and treat small-study effects as a certainty concern.',
    refs: ['inthout2016', 'inthout2014', 'higgins2003', 'guyatt2008'],
  },
];

export const casesById: Record<string, Case> = Object.fromEntries(cases.map((c) => [c.id, c]));
