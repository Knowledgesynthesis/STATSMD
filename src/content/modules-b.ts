import type { Module } from './types';

export const modulesB: Module[] = [
  // ───────────────────────────── 7 ─────────────────────────────
  {
    id: 'categorical',
    n: 7,
    title: 'Categorical outcomes: χ², Fisher and McNemar',
    tagline: 'Contingency tables done properly — including the paired and matched cases most people get wrong.',
    minutes: 15,
    objectives: [
      'Compute expected counts and choose between χ², N − 1 χ² and Fisher’s exact test',
      'Recognise paired binary data and analyse it with McNemar',
      'Analyse matched case-control data correctly',
      'Report effect measures with appropriate CIs, not just a test',
    ],
    sections: [
      {
        kind: 'text',
        title: 'Independent groups: which test?',
        body: `For each cell, the [[expected-count|expected count]] under no association is (row total × column total) / N.

- **Larger tables:** Pearson χ² is reliable if no expected count is below 1 and no more than 20% are below 5 {{cochran1954}}.
- **2×2 tables:** the "N − 1" χ² (Pearson χ² × (N − 1)/N) keeps type I error close to nominal whenever every expected count is ≥ 1; use Fisher’s exact test otherwise {{campbell2007}}.
- **Yates’ continuity correction** makes the test overly conservative; it is not recommended.
- **Fisher’s exact test** is also conservative (its actual α is below 5%) but is safe with tiny counts.

The test answers only "is there an association?". Report the proportions with Wilson CIs {{brown2001}} and an effect measure — risk difference, RR or OR with CI.`,
      },
      { kind: 'lab', lab: 'two-by-two', caption: 'Shrink the counts and watch the expected-count warnings and the gap between χ² and Fisher.' },
      {
        kind: 'text',
        title: 'Paired binary data: McNemar',
        body: `When the same patients are classified twice — two diagnostic tests on everyone, symptom present before and after — the rows are not independent. Arrange the **pairs**:

| | Test B + | Test B − |
|---|---|---|
| **Test A +** | 45 (concordant) | b = 25 |
| **Test A −** | c = 10 | 420 (concordant) |

Concordant pairs say nothing about which test detects more. [[mcnemar|McNemar’s test]] uses only the discordant pairs: χ² = (b − c)² / (b + c) = (25 − 10)²/35 = 6.4, p = 0.011. With few discordant pairs, use the exact binomial version. The paired difference in positivity is (b − c)/N = 3 percentage points.`,
      },
      {
        kind: 'callout',
        tone: 'pitfall',
        title: 'Matched case-control studies need a matched analysis',
        body: `If each case was individually matched to a control (on age, sex, practice), analyse the matched sets: McNemar for 1:1 pairs with a binary exposure (matched OR = b/c) or **conditional logistic regression** in general. Ignoring the matching and running an ordinary χ² usually biases the OR towards 1. With frequency (group) matching, ordinary logistic regression that adjusts for the matching factors is appropriate {{pearce2016}}.`,
      },
      {
        kind: 'text',
        title: 'Ordered categories',
        body: `If one variable is ordered (dose groups, severity grades), a χ² test that ignores the order wastes power. Use a test for trend (Cochran–Armitage), a rank test, or [[proportional-odds|ordinal regression]] {{agresti2013}}.`,
      },
    ],
    takeaways: [
      'Expected count = row total × column total / N.',
      '2×2: N − 1 χ² if all expected ≥ 1, otherwise Fisher. Skip Yates.',
      'Paired binary data → McNemar (discordant pairs only).',
      'Individually matched case-control → McNemar or conditional logistic regression.',
      'Always report an effect measure with a CI alongside the test.',
    ],
  },

  // ───────────────────────────── 8 ─────────────────────────────
  {
    id: 'correlation-agreement',
    n: 8,
    title: 'Correlation, agreement and reliability',
    tagline: 'Correlation measures association. It never shows that two methods agree.',
    minutes: 15,
    objectives: [
      'Choose between Pearson and Spearman correlation and know their limits',
      'Assess method agreement with Bland–Altman limits of agreement',
      'Choose and report the right ICC; interpret kappa with its paradoxes',
    ],
    sections: [
      {
        kind: 'text',
        title: 'Correlation',
        body: `[[correlation|Pearson’s r]] measures the strength of **linear** association; **Spearman’s ρ** is Pearson’s r on ranks and captures any monotonic relation while resisting outliers.

- **Plot first.** Very different data sets can share the same r — Anscombe’s quartet has four sets with r = 0.82 that include a curve and a single outlier {{anscombe1973}}.
- **r depends on the range sampled.** Restricting to a narrow range (e.g., only normotensive patients) lowers r without changing the underlying relation.
- **r is not a slope.** A tiny slope can have r = 0.99. For "how much does Y change per unit X", use regression.
- **Testing r = 0** is rarely interesting; report r with its CI.
- r² is the proportion of variance in one variable linearly explained by the other.`,
      },
      {
        kind: 'text',
        title: 'Agreement is a different question',
        body: `Two methods can be perfectly correlated and still disagree: if method B always reads 20 mmHg higher, r = 1. Correlation also rises simply by widening the range of patients studied {{bland1986}}.

The **[[bland-altman|Bland–Altman]]** approach plots the difference against the mean of each pair and reports the **bias** (mean difference) and the **95% limits of agreement** (bias ± 1.96 SD of the differences). Whether the limits are acceptable is a clinical decision, made before the study. If differences grow with the magnitude, analyse log values (percentage differences).`,
      },
      { kind: 'lab', lab: 'agreement', caption: 'Add bias and proportional error. The correlation barely moves; the limits of agreement tell the real story.' },
      {
        kind: 'text',
        title: 'Reliability: ICC and kappa',
        body: `The [[icc|ICC]] is the share of total variance due to true differences between subjects. There are several forms — one-way or two-way models, absolute agreement or consistency, single or average rater — and they give different values. Report the exact form with its CI {{koo2016}}. A homogeneous sample produces a low ICC even when measurement error is small.

[[kappa|Cohen’s κ]] measures agreement on categories beyond chance. When one category dominates, κ can be low despite high raw agreement (the prevalence paradox) {{feinstein1990}}. Report raw agreement and category prevalence with κ; use weighted κ for ordinal scales. Verbal labels such as "substantial" (Landis–Koch) are conventions, not validated thresholds.`,
      },
    ],
    takeaways: [
      'Plot before computing r; r is not slope, agreement or causation.',
      'r depends on the range of values sampled.',
      'Method comparison → Bland–Altman bias and limits of agreement.',
      'Always state which ICC form you used.',
      'Report raw agreement and prevalence alongside kappa.',
    ],
  },

  // ───────────────────────────── 9 ─────────────────────────────
  {
    id: 'regression',
    n: 9,
    title: 'Regression: linear, logistic, Poisson and beyond',
    tagline: 'One framework covers almost every analysis. Build models from causal reasoning, not p-value screening.',
    minutes: 30,
    objectives: [
      'Match outcome type to model family and interpret exp(β) correctly',
      'Diagnose a linear model with residual and influence plots',
      'Select covariates for a causal question without univariable screening or stepwise methods',
      'Handle non-linearity, interactions, counts and overdispersion',
    ],
    sections: [
      {
        kind: 'text',
        title: 'One framework',
        body: `Most models are generalised linear models: a linear predictor β₀ + β₁x₁ + … linked to the outcome through a link function.

| Outcome | Model | Link | Coefficient means | Report |
|---|---|---|---|---|
| Continuous | linear | identity | mean difference per unit x | β (95% CI) |
| Continuous, log y | linear on log y | identity | ratio of geometric means | exp(β) |
| Binary | logistic | logit | log odds ratio | OR = exp(β) |
| Binary (RR wanted) | modified Poisson / log-binomial | log | log risk ratio | RR = exp(β) |
| Count / rate | Poisson, negative binomial | log | log rate ratio | RR = exp(β) |
| Ordinal | proportional odds | cumulative logit | log common OR | exp(β) |
| Time-to-event | Cox | log hazard | log hazard ratio | HR = exp(β) |

t-tests, ANOVA and ANCOVA are linear regression with categorical predictors.`,
      },
      { kind: 'lab', lab: 'regression', caption: 'Click to add points. Drag a point far from the others and watch its leverage and Cook’s distance.' },
      {
        kind: 'text',
        title: 'Reading coefficients',
        body: `- β is the change in the outcome per **one unit** of x with other covariates held fixed. Choose sensible units (per 10 years, per 5 kg/m²).
- For log-link models, exp(β) is multiplicative: an RR of 1.15 per unit means 15% higher rate per unit; per 10 units it is 1.15¹⁰ ≈ 4.0, not 2.5.
- With an [[interaction|interaction]] term, the "main effect" is the effect when the other variable equals zero (or its reference level). Centre continuous variables to make this meaningful.
- Only the exposure coefficient has the causal interpretation the model was built for. Coefficients of confounders are themselves confounded — reading them as causal is the "Table 2 fallacy" {{westreich2013}}.`,
      },
      {
        kind: 'text',
        title: 'Assumptions and diagnostics (linear model)',
        body: `In order of importance:
1. **Correct functional form.** Model continuous predictors flexibly — [[splines|restricted cubic splines]] — rather than assuming straight lines or cutting into categories {{royston2006,harrell2015}}.
2. **Independence.** Clustered or repeated data need mixed models or GEE.
3. **Constant variance.** A funnel in residuals-vs-fitted → robust (sandwich) SEs or a transformation.
4. **Normal residuals.** The least important; matters mainly for prediction intervals and very small samples. It concerns [[residual|residuals]], not the raw outcome.

**Influence:** a point with high leverage (extreme x) and a large residual can move the line. Cook’s distance flags such points. Investigate them; do not delete them because they are inconvenient.`,
      },
      {
        kind: 'callout',
        tone: 'pitfall',
        title: 'How not to choose covariates',
        body: `- **Univariable screening** ("include variables with p < 0.2") can exclude real confounders and include noise {{sun1996}}.
- **Stepwise selection** gives biased coefficients, SEs that are too small and p-values that are too optimistic, and its choices are unstable from sample to sample {{heinze2018,harrell2015}}.
- **Instead:** for a causal question, choose confounders from subject knowledge, ideally drawn as a [[dag|DAG]] (Module 11). Do not adjust for mediators or colliders. Check that the number of parameters is supported by the data: about 10 outcome events per parameter is a rough guide for logistic and Cox models, not a hard rule {{peduzzi1996,vittinghoff2007}}.`,
      },
      {
        kind: 'text',
        title: 'Binary outcomes: logistic regression',
        body: `Logistic regression models log-odds; exp(β) is an [[odds-ratio|OR]]. For common outcomes the OR exaggerates the RR, so present absolute risks too, or estimate RRs directly with modified Poisson regression {{zou2004}}. Because ORs are [[non-collapsibility|non-collapsible]], a change in the OR when a covariate is added does not by itself indicate confounding.

Check linearity of continuous predictors on the log-odds scale with splines. Assess fit with calibration plots rather than the Hosmer–Lemeshow test, whose result depends on arbitrary grouping {{hosmer2013}}.`,
      },
      {
        kind: 'text',
        title: 'Counts and rates',
        body: `Poisson regression models rates; include log(follow-up time) as an [[offset|offset]]. Clinical event counts are usually [[overdispersion|overdispersed]] — a few patients have many events — which makes Poisson SEs too small. Check Pearson χ²/df; use negative binomial regression or robust SEs when it is well above 1.`,
      },
      {
        kind: 'callout',
        tone: 'rule',
        title: 'Interaction depends on the scale',
        body: `An effect can be constant on the ratio scale and vary on the difference scale, or the reverse. RR 0.5 in low-risk (2% → 1%) and high-risk (20% → 10%) patients is no interaction multiplicatively but a 9-point interaction additively. Report effects in each stratum on both scales, test the interaction directly, and say which scale you mean.`,
      },
    ],
    takeaways: [
      'Match the model to the outcome; exp(β) is an OR, RR or HR depending on the link.',
      'Functional form matters most: use splines, never categorise.',
      'Normality applies to residuals and is the least important assumption.',
      'Choose confounders from causal knowledge, not univariable p-values or stepwise selection.',
      'Only the exposure coefficient has a causal interpretation (Table 2 fallacy).',
      'Counts: use an offset and check overdispersion.',
    ],
  },

  // ───────────────────────────── 10 ─────────────────────────────
  {
    id: 'correlated-data',
    n: 10,
    title: 'Repeated measures, clustering and missing data',
    tagline: 'Correlated observations carry less information than they appear to. Missing data are rarely missing at random.',
    minutes: 20,
    objectives: [
      'Explain why ignoring correlation gives false precision, and compute a design effect',
      'Choose among summary measures, mixed models and GEE',
      'Classify missing data as MCAR, MAR or MNAR and choose a valid method',
    ],
    sections: [
      {
        kind: 'text',
        title: 'Why independence matters',
        body: `Repeated measurements on one patient, or patients treated by the same clinician, resemble each other. Treating them as independent overstates the information, so SEs are too small and false positives too common.

The [[icc|ICC]] measures how alike observations within a cluster are. With clusters of size m, the variance is inflated by the [[design-effect|design effect]] 1 + (m − 1) × ICC {{killip2004}}. Even small ICCs matter: 50 patients per practice and ICC = 0.02 gives a design effect of 1.98 — the trial needs roughly twice as many patients as an individually randomised one. Cluster trials should be designed, analysed and reported accordingly {{consortcluster2012}}.`,
      },
      {
        kind: 'text',
        title: 'Analysing repeated measures',
        body: `| Approach | When it fits | Watch out for |
|---|---|---|
| **Summary measure** per patient (mean, slope, AUC, peak) then a simple test | One clear clinical summary {{matthews1990}} | Unequal numbers of measurements per patient |
| **[[mixed-model|Mixed model]] / MMRM** | Longitudinal trials; unbalanced visits; MAR dropout | Mis-specified covariance; few clusters |
| **[[gee|GEE]]** | Population-averaged effects; cluster RCTs with binary outcomes | Needs ~40+ clusters; assumes MCAR without weighting |
| Repeated-measures ANOVA | Complete, balanced data only | Drops patients with any missing visit; sphericity |

For non-linear links (logistic), mixed models give subject-specific ORs and GEE gives population-averaged ORs; the two differ and answer different questions {{fitzmaurice2011}}.`,
      },
      {
        kind: 'callout',
        tone: 'pitfall',
        title: 'Stratified randomisation must be reflected in the analysis',
        body: `If randomisation was stratified (by site, by severity) or used minimisation, adjust for the stratification factors. Ignoring them gives SEs that are too large and loses power {{kahan2012}}.`,
      },
      {
        kind: 'text',
        title: 'Missing data',
        body: `Rubin’s taxonomy {{rubin1976}}:
- **[[mcar|MCAR]]:** missingness unrelated to anything (a sample tube broke). Complete-case analysis is unbiased but loses power.
- **[[mar|MAR]]:** missingness depends only on observed data (older patients miss more visits, and age is recorded). Mixed models and [[multiple-imputation|multiple imputation]] are valid.
- **[[mnar|MNAR]]:** missingness depends on the unobserved value (patients feeling worse skip visits). No standard method is valid; run sensitivity analyses (e.g., delta-adjusted imputation, tipping-point analysis).

You cannot tell MAR from MNAR from the data. Prevention is better than cure: design to minimise dropout, keep following people who stop treatment, and record why data are missing {{little2012}}.

**Avoid** last observation carried forward and single mean imputation: they produce biased estimates and falsely narrow CIs, and LOCF is not reliably conservative {{little2012}}. In multiple imputation, include the outcome and auxiliary variables in the imputation model and pool with Rubin’s rules {{sterne2009}}. How intercurrent events such as treatment discontinuation are handled is part of the [[estimand|estimand]], not just a missing-data step {{iche9r1}}.`,
      },
    ],
    takeaways: [
      'Correlated data analysed as independent → SEs too small.',
      'Design effect = 1 + (m − 1) × ICC; even ICC 0.02 can double the required n.',
      'Mixed models handle unbalanced longitudinal data under MAR; GEE gives population-averaged effects.',
      'Adjust for stratification factors used in randomisation.',
      'Use multiple imputation or likelihood methods under MAR; never LOCF; do sensitivity analyses for MNAR.',
    ],
  },

  // ───────────────────────────── 11 ─────────────────────────────
  {
    id: 'confounding',
    n: 11,
    title: 'Confounding, bias and causal thinking',
    tagline: 'Adjustment is a causal decision. Know what to adjust for, what never to adjust for, and the biases no adjustment fixes.',
    minutes: 30,
    objectives: [
      'Use a DAG to classify variables as confounders, mediators or colliders',
      'Explain Simpson’s paradox and regression to the mean with examples',
      'Recognise immortal time bias and design it out with target trial emulation',
      'Quantify robustness to unmeasured confounding with the E-value',
    ],
    sections: [
      {
        kind: 'text',
        title: 'Three roles a variable can play',
        body: `A [[dag|directed acyclic graph]] makes assumptions explicit and shows what to adjust for {{greenland1999,hernan2020}}.

| Role | Structure | Example (exposure → outcome) | Adjust? |
|---|---|---|---|
| **[[confounder|Confounder]]** | common cause: X ← C → Y | age, for statin use → dementia | **Yes** |
| **[[mediator|Mediator]]** | on the path: X → M → Y | LDL, for statin → MI | **No** (for the total effect) |
| **[[collider|Collider]]** | common effect: X → K ← Y | hospital admission, for any two causes of admission | **Never** |

Adjusting for a mediator removes part of the effect you want. Conditioning on a collider — by adjustment, stratification or by **selecting** who is in the study — creates an association where none exists. Studies restricted to hospitalised patients, or to people who survived to enrolment, are conditioned on a collider {{cole2010}}.`,
      },
      { kind: 'lab', lab: 'simpson', caption: 'Change how severity drives both treatment choice and mortality. The crude and adjusted answers diverge, then reverse.' },
      {
        kind: 'text',
        title: 'Simpson’s paradox',
        body: `An association that reverses when data are stratified is [[simpsons-paradox|Simpson’s paradox]]. In the lab, sicker patients more often receive the treatment and also die more often, so crude mortality looks worse on treatment even though it helps within every severity stratum. The arithmetic does not say which answer is right — the causal structure does. Severity is a confounder here, so the stratified (adjusted) estimate answers the causal question. If the third variable were a mediator or a collider, the crude estimate would be the right one.`,
      },
      {
        kind: 'text',
        title: 'Regression to the mean',
        body: `Anyone selected because of an extreme measurement will, on average, be less extreme next time — partly because the first value included favourable measurement noise {{barnett2005}}. Patients enrolled for "BP > 160" improve without treatment; units flagged for high infection rates improve after any intervention.`,
      },
      { kind: 'lab', lab: 'rtm', caption: 'Select patients above a threshold and re-measure them with no treatment at all.' },
      {
        kind: 'text',
        title: 'Biases adjustment cannot fix',
        body: `- **[[selection-bias|Selection bias]]:** who enters or leaves the analysis depends on exposure and outcome (loss to follow-up, survivor-only cohorts).
- **Information bias:** misclassified exposure or outcome; recall bias in case-control studies.
- **Reverse causation:** early disease changes the exposure (weight loss before a cancer diagnosis).
- **[[immortal-time-bias|Immortal time bias]]:** patients classified as "treated" had to survive until they were treated. Counting that waiting time as treated person-time makes almost any treatment look protective {{suissa2008}}.

**[[target-trial|Target trial emulation]]** prevents the self-inflicted biases: write the protocol of the trial you would run (eligibility, strategies, assignment, time zero, follow-up, outcome, estimand), then emulate it with observational data, aligning eligibility, treatment assignment and start of follow-up at the same time zero {{hernan2016}}. Report such studies with the TARGET guideline {{target2025}}.`,
      },
      {
        kind: 'text',
        title: 'Tools for measured and unmeasured confounding',
        body: `**Measured confounders:** stratification, regression adjustment, or [[propensity-score|propensity scores]] (matching, inverse-probability weighting) {{austin2011}}. Propensity methods do not handle unmeasured confounders any better than regression; their strength is making overlap and balance visible.

**Unmeasured confounders:** report an [[e-value|E-value]] — the minimum strength of association, on the RR scale, an unmeasured confounder would need with both exposure and outcome to explain away the estimate {{vanderweele2017}}. For an observed RR: E = RR + √(RR × (RR − 1)) (use 1/RR for protective effects). RR = 2 → E = 3.4; RR = 1.3 → E = 1.9.`,
      },
    ],
    takeaways: [
      'Adjust for confounders; never for colliders; not for mediators when you want the total effect.',
      'Selecting a study population can condition on a collider.',
      'The causal structure, not the numbers, decides which of Simpson’s answers is right.',
      'Uncontrolled before–after improvement can be pure regression to the mean.',
      'Align eligibility, treatment assignment and time zero (target trial) to avoid immortal time bias.',
      'Report E-values to show how strong unmeasured confounding would need to be.',
    ],
  },

  // ───────────────────────────── 12 ─────────────────────────────
  {
    id: 'survival',
    n: 12,
    title: 'Time-to-event analysis',
    tagline: 'Censoring, Kaplan–Meier, Cox, and the limits of the hazard ratio.',
    minutes: 25,
    objectives: [
      'Explain censoring and why ordinary methods fail with it',
      'Read a Kaplan–Meier plot, including medians, CIs and numbers at risk',
      'Interpret a hazard ratio correctly and check proportional hazards',
      'Use RMST and competing-risks methods when the HR or 1 − KM misleads',
    ],
    sections: [
      {
        kind: 'text',
        title: 'Censoring',
        body: `In most follow-up studies some patients have not had the event when the study ends or when they are lost to follow-up. Their times are **[[censoring|censored]]**: we know only that the event time exceeds the last contact.

- Dropping censored patients biases the estimate towards early events.
- Treating them as event-free (logistic regression on "died by 5 years") ignores how long they were followed.
- Comparing mean follow-up times is meaningless.

Survival methods use each patient’s information until censoring. They assume **non-informative censoring**: patients censored at a time have the same prognosis as those still under follow-up.`,
      },
      { kind: 'lab', lab: 'km', caption: 'Real trial data (6-MP vs placebo in childhood leukaemia). Compare the correct handling of censoring with two common mistakes.' },
      {
        kind: 'text',
        title: 'Reading a Kaplan–Meier plot',
        body: `The [[kaplan-meier|Kaplan–Meier]] curve drops only at event times; tick marks show censoring {{kaplan1958}}.

- **Median survival** is where the curve crosses 50%. If it never does, the median is "not reached" — do not report the mean follow-up instead.
- **Survival at a fixed time** (e.g., 2-year survival with CI) is often the most useful summary.
- **Numbers at risk** belong under the x-axis. The right-hand tail rests on few patients and is unstable; do not read meaning into late steps.
- The [[log-rank|log-rank]] test compares curves; it is most powerful under proportional hazards and weak when curves cross.`,
      },
      {
        kind: 'text',
        title: 'Hazard ratios and the Cox model',
        body: `The Cox model estimates the [[hazard-ratio|hazard ratio]] — the ratio of instantaneous event rates — adjusted for covariates {{cox1972}}. An HR of 0.70 means that at any time, among people still event-free, the event rate is 30% lower. It does **not** mean 30% fewer events overall, 30% longer survival, or a risk ratio of 0.70.

**[[proportional-hazards|Proportional hazards]]**: the HR is assumed constant over time. Check with Schoenfeld residual tests and plots {{grambsch1994}}. When it fails, a single HR is a weighted average that may describe no period well.

Even in a randomised trial, HRs for later periods compare survivors who are no longer comparable — the early deaths removed the frailest people unevenly. Hence "the hazards of hazard ratios": report absolute survival differences at clinically relevant times as well {{hernan2010}}.`,
      },
      {
        kind: 'callout',
        tone: 'rule',
        title: 'RMST: an interpretable alternative',
        body: `The [[rmst|restricted mean survival time]] up to a horizon τ is the area under the KM curve — the average event-free time over τ. A difference in RMST ("on average 3.2 more months alive over 5 years") is clinically interpretable and valid whether or not hazards are proportional {{uno2014,royston2013}}. Choose τ in advance.`,
      },
      {
        kind: 'text',
        title: 'Competing risks',
        body: `When another event prevents the event of interest — death before dialysis, death before hip fracture — 1 − KM treats deaths as censoring and **overestimates** the probability of the event. Use the cumulative incidence function (Aalen–Johansen). For aetiology, model cause-specific hazards; for predicting absolute risk, the Fine–Gray subdistribution model. Label which one you report {{austin2016}}.

Exposures that begin during follow-up (a drug started months after diagnosis) must be modelled as time-varying; otherwise immortal time bias makes the exposure look protective {{suissa2008}}.`,
      },
    ],
    takeaways: [
      'Censored patients contribute information until they leave; censoring must be non-informative.',
      'Report survival at fixed times and medians with CIs, plus numbers at risk.',
      'HR = ratio of instantaneous rates — not a risk ratio, not % longer survival.',
      'Check proportional hazards; report absolute differences or RMST too.',
      'With competing risks, 1 − KM overstates risk; use cumulative incidence.',
    ],
  },
];
