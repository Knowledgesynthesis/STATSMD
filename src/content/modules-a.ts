import type { Module } from './types';

export const modulesA: Module[] = [
  // ───────────────────────────── 1 ─────────────────────────────
  {
    id: 'data-types',
    n: 1,
    title: 'Variables, data types and distributions',
    tagline: 'The outcome’s type decides most of the analysis. Classify it correctly and summarise it honestly.',
    minutes: 15,
    objectives: [
      'Classify any clinical variable as continuous, binary, nominal, ordinal, count or time-to-event',
      'Choose mean (SD) or median (IQR) from the shape of the data',
      'Explain why dichotomising a continuous variable is costly',
      'Distinguish standard deviation from standard error',
    ],
    sections: [
      {
        kind: 'text',
        title: 'Why the data type comes first',
        body: `Almost every method choice follows from two facts: **what type the outcome is**, and **how the observations relate to each other** (independent, paired, clustered). Get the type wrong and every downstream number is wrong too.

| Type | Examples | Summarise with | Typical analysis |
|---|---|---|---|
| [[continuous|Continuous]] | SBP, HbA1c, eGFR | mean (SD) or median (IQR) | t-test, linear regression |
| Binary | death, infection, response | n (%) | risk difference/ratio, logistic regression |
| [[nominal|Nominal]] (3+ categories) | blood group, ward | n (%) per category | χ², multinomial regression |
| [[ordinal|Ordinal]] | mRS, NYHA, single Likert item | n (%) per level, median | rank tests, ordinal regression |
| [[count|Count / rate]] | exacerbations, falls | rate per person-time | Poisson / negative binomial |
| [[time-to-event|Time-to-event]] | time to death or relapse | Kaplan–Meier, median survival | log-rank, Cox, RMST |

Two traps recur. **Ordinal scales are not interval scales**: a change from mRS 0→1 is not the same as 4→5. Summed multi-item scores with many levels (e.g., a 0–63 depression inventory) usually behave well enough to analyse as continuous; single items and short scales do not. **Counts are not continuous**: they are bounded at zero, skewed, and usually depend on follow-up time.`,
      },
      { kind: 'lab', lab: 'variable-sorter', caption: 'Classify each variable. The feedback explains the edge cases.' },
      {
        kind: 'callout',
        tone: 'pitfall',
        title: 'Do not dichotomise continuous variables',
        body: `Splitting age, BMI or a biomarker at a cut-point discards information. A median split loses roughly as much power as throwing away a third of the data, treats people just either side of the cut as maximally different, and invites hunting for the "best" cut-point {{altman2006,royston2006}}. Keep variables continuous and model non-linearity with splines. If a clinical threshold matters for decisions, present results across the whole range and mark the threshold.`,
      },
      {
        kind: 'text',
        title: 'Describing a distribution',
        body: `Look at the data (histogram, dot plot) before summarising it {{altman1991}}.

- **Roughly symmetric** → mean and [[standard-deviation|SD]]. About 95% of values lie within mean ± 2 SD only if the distribution is close to normal.
- **[[skewness|Skewed]]** (length of stay, costs, CRP, triglycerides) → [[median|median and IQR]], or analyse on the log scale.
- **Quick check from a paper:** if a variable cannot be negative and its mean is less than about twice its SD, the distribution is skewed {{altman1996}}. LOS "mean 6.2 (SD 7.9) days" is clearly skewed.

The **SD describes the spread of individuals**. The **[[standard-error|standard error]]** (SD/√n) describes the precision of an estimate and shrinks as n grows. Descriptive tables should show SD, never SE: "mean ± SE" makes data look less variable than they are {{altman2005}}.`,
      },
      { kind: 'lab', lab: 'distribution', caption: 'Increase the skew and watch the mean drift away from the median.' },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Which variable is the outcome?',
        body: `The outcome is what the intervention or exposure is thought to change. In a case-control study the *exposure* is measured and compared between cases and controls, but the target of inference is still the exposure–disease association, estimated as an odds ratio.`,
      },
    ],
    takeaways: [
      'Classify the outcome first; it determines most of the analysis.',
      'Single Likert items and short ordinal scales are not continuous.',
      'Never dichotomise a continuous variable for analysis.',
      'Use mean (SD) for symmetric data and median (IQR) for skewed data; never mean ± SE in descriptive tables.',
      'A non-negative variable with mean < 2 SD is skewed.',
    ],
  },

  // ───────────────────────────── 2 ─────────────────────────────
  {
    id: 'estimation',
    n: 2,
    title: 'Sampling, standard errors and confidence intervals',
    tagline: 'Every estimate is uncertain. The confidence interval shows how uncertain — if you read it correctly.',
    minutes: 20,
    objectives: [
      'Explain sampling variability and the standard error',
      'Interpret a 95% CI correctly and spot common misreadings',
      'Use the CI to judge clinical importance, not just "significance"',
      'Compare two groups using the CI of the difference, not overlapping intervals',
    ],
    sections: [
      {
        kind: 'text',
        title: 'From sample to population',
        body: `A study estimates a population quantity (a mean difference, a risk ratio) from one sample. A different sample would give a different estimate. The spread of estimates across hypothetical repeated samples is the **sampling distribution**; its SD is the [[standard-error|standard error]].

- For a mean, SE = SD / √n. **Precision grows with √n**: to halve the width of a CI you need four times as many patients.
- By the [[clt|central limit theorem]], means are approximately normally distributed for moderate n even when the data are not — the reason t-based methods are robust. Heavy skew needs larger n.
- A 95% CI is roughly estimate ± 1.96 × SE (using t rather than 1.96 for small samples). Ratios (RR, OR, HR) are computed on the log scale, so their CIs are asymmetric.`,
      },
      { kind: 'lab', lab: 'ci-coverage', caption: 'Draw 100 samples and compute a 95% CI from each. About 95 capture the true mean — but you never know which ones.' },
      {
        kind: 'text',
        title: 'What a 95% CI does and does not mean',
        body: `**Correct:** if the study were repeated many times and a 95% CI computed each time, 95% of those intervals would contain the true value (assuming the model is correct). A practical reading: the CI contains the effect sizes **most compatible with the data** — some authors call it a [[compatibility-interval|compatibility interval]] {{greenland2016,amrhein2019}}.

**Incorrect:**
- "There is a 95% probability that the true value lies in this interval." Once calculated, the interval either contains the true value or not; a probability statement about the parameter needs a Bayesian analysis.
- "Values near the ends are as plausible as the point estimate." Compatibility is highest near the point estimate and falls off towards the limits.
- "95% of patients will have values in this range." That is a reference range or prediction interval, which is far wider.
- "The CI accounts for all uncertainty." It covers random error only — not bias, confounding, or a wrong model.`,
      },
      {
        kind: 'callout',
        tone: 'rule',
        title: 'Read every CI against the minimal important difference',
        body: `Ask: where is the point estimate, does the interval include no effect, and does it include clinically important effects? With an MCID of 5 mmHg for SBP:

| Result (mmHg reduction, 95% CI) | Reading |
|---|---|
| 8 (6 to 10) | Clear, important benefit |
| 1.5 (0.5 to 2.5) | "Significant" but clinically trivial |
| 4 (−1 to 9) | Inconclusive: compatible with no effect and with important benefit |
| 0.3 (−1 to 1.6) | Informative null: important effects excluded |

Rows 3 and 4 are both "non-significant" but mean opposite things. Only row 4 supports "no important effect".`,
      },
      {
        kind: 'text',
        title: 'Overlapping intervals and other traps',
        body: `**Overlap is not a test.** Two 95% CIs can overlap and the difference still be statistically significant. For two independent estimates with similar SEs, non-overlapping CIs correspond to p ≈ 0.006 or smaller, and intervals overlapping by up to about half a margin of error still give p < 0.05 {{cumming2005}}. Compare groups by computing the CI of the **difference**.

**Proportions near 0 or 1:** the textbook Wald interval (p ± 1.96√(p(1−p)/n)) performs badly; use Wilson or exact intervals {{brown2001}}.

**Zero events:** if none of n patients had an adverse event, the 95% upper limit for the true rate is about 3/n (the "rule of three"). Zero of 60 is compatible with a rate up to 5% {{hanley1983}}.`,
      },
    ],
    takeaways: [
      'SE = SD/√n measures precision of an estimate; quadrupling n halves the CI width.',
      'A 95% CI comes from a procedure that captures the truth in 95% of repeated samples; it is not a 95% probability statement about one interval.',
      'Judge clinical importance by comparing the whole CI with the MCID.',
      'A non-significant result with a wide CI is inconclusive, not negative.',
      'Use the CI of the difference, not overlap of two CIs.',
      'Zero events in n: the 95% upper bound is about 3/n.',
    ],
  },

  // ───────────────────────────── 3 ─────────────────────────────
  {
    id: 'p-values',
    n: 3,
    title: 'Hypothesis tests and p-values, read correctly',
    tagline: 'What a p-value measures, what it cannot tell you, and how to write results without the usual errors.',
    minutes: 20,
    objectives: [
      'State the correct definition of a p-value',
      'Identify the common misinterpretations',
      'Explain why p-values vary so much between replications',
      'Report results as estimates with CIs, and test for equivalence when "no difference" is the claim',
    ],
    sections: [
      {
        kind: 'text',
        title: 'The definition',
        body: `A [[p-value|p-value]] is the probability, **computed assuming the null hypothesis and every other model assumption is true**, of obtaining a test statistic at least as extreme as the one observed. Small p means the data are unusual under that model — either H₀ is false, an assumption is violated, or a rare event happened.

The American Statistical Association's six principles {{asa2016}}:
1. p-values can indicate how incompatible the data are with a specified model.
2. They do not measure the probability that the hypothesis is true, or that the data arose by chance alone.
3. Conclusions and decisions should not rest only on whether p passes a threshold.
4. Proper inference requires full reporting and transparency.
5. A p-value does not measure the size or importance of an effect.
6. By itself, a p-value is not a good measure of evidence about a model or hypothesis.`,
      },
      {
        kind: 'text',
        title: 'Common misinterpretations',
        body: `| Statement | True? | Why |
|---|---|---|
| p = 0.03 means a 3% chance H₀ is true | No | p is computed *assuming* H₀; it cannot be its probability {{greenland2016}} |
| p = 0.03 means a 3% chance the result is due to chance | No | Same error in different words |
| p > 0.05 means no effect | No | Absence of evidence is not evidence of absence — check the CI {{altman1995}} |
| A smaller p means a larger or more important effect | No | p mixes effect size with sample size; huge studies make trivial effects "highly significant" |
| p = 0.05 means a 5% false-positive risk | No | The chance a "significant" finding is false depends on prior plausibility and power — often well above 5% {{ioannidis2005}} |
| Significant in subgroup A, not in B, so the effect differs | No | Test the difference directly (interaction) {{gelman2006}} |
| A study with p = 0.04 will replicate | Not reliably | Replications of a study with p ≈ 0.05 often give p > 0.05 |`,
      },
      { kind: 'lab', lab: 'p-dance', caption: 'Run the same experiment 20 times. The true effect never changes; watch what p does.' },
      {
        kind: 'callout',
        tone: 'rule',
        title: 'Why estimates beat p-values for replication',
        body: `If the true effect equals the one observed in a study that gave p = 0.05, an exact replication has only about a 50% chance of giving p < 0.05 again. The CIs from the replications, by contrast, overlap heavily and keep pointing at the same effect size. Think in estimates and intervals; treat p as one noisy summary {{cumming2014}}.`,
      },
      {
        kind: 'text',
        title: 'How much evidence is p = 0.05?',
        body: `Less than most readers assume.

- **[[s-value|S-value]]:** −log₂(0.05) ≈ 4.3 bits — about as surprising as getting four heads in a row with a fair coin {{rafi2020}}.
- **Bayes factor bound:** p = 0.05 corresponds to a Bayes factor of at most about 2.5 : 1 against H₀ for a broad class of alternative hypotheses {{sellke2001}} — far from the 19 : 1 the number 0.05 suggests. For this reason some propose α = 0.005 for claims of new discoveries {{benjamin2018}}; others propose dropping thresholds altogether in favour of estimation {{amrhein2019,asa2019}}.

**Practical stance.** Pre-specify α where a decision rule is needed (confirmatory trials, regulators). Otherwise report the exact p-value alongside the effect estimate and CI, and interpret all three with the study's design, biases and prior evidence.`,
      },
      {
        kind: 'callout',
        tone: 'example',
        title: 'Writing a result',
        body: `**Weak:** "The drug significantly reduced SBP (p < 0.05)."

**Strong:** "Mean SBP at 12 weeks was 4.1 mmHg lower with the drug (95% CI 1.2 to 7.0; p = 0.006). The interval excludes no effect and includes the 5 mmHg considered clinically important, but also reductions as small as about 1 mmHg, so a benefit is likely but may be smaller than clinically important."

Give the effect in clinical units, its CI, the exact p, and the interpretation.`,
      },
      {
        kind: 'text',
        title: 'Claiming "no difference": equivalence and non-inferiority',
        body: `A non-significant test cannot establish equivalence. To support "A is as good as B", pre-specify a margin Δ and show the CI lies within it — the two one-sided tests ([[equivalence|TOST]]) procedure {{lakens2017}}. Non-inferiority trials do the same on one side, with the margin justified from historical evidence {{piaggio2012}}.

Tests are **two-sided by default**. A [[one-sided|one-sided]] test at 0.05 is the same as a two-sided test at 0.10 and needs a justification written before the data are seen.`,
      },
    ],
    takeaways: [
      'p = P(data at least this extreme | H₀ and all model assumptions).',
      'p is not P(H₀), not the size of the effect, and not the false-positive risk.',
      'p-values vary widely between exact replications; estimates with CIs are more stable guides.',
      'p = 0.05 is weak evidence: about 4 bits, Bayes factor ≤ 2.5.',
      'To claim "no difference", use an equivalence or non-inferiority test with a pre-specified margin.',
    ],
  },

  // ───────────────────────────── 4 ─────────────────────────────
  {
    id: 'power',
    n: 4,
    title: 'Power, sample size and the two kinds of error',
    tagline: 'Plan studies that can answer their question, and recognise ones that never could.',
    minutes: 20,
    objectives: [
      'Define type I error, type II error and power',
      'Calculate sample size for two means or two proportions and know which inputs drive it',
      'Choose a defensible target effect size',
      'Explain why underpowered studies exaggerate effects and why post-hoc power is uninformative',
    ],
    sections: [
      {
        kind: 'text',
        title: 'Two ways to be wrong',
        body: `| | H₀ true (no effect) | H₀ false (real effect) |
|---|---|---|
| **Reject H₀** | [[type-i-error|Type I error]] (α, false positive) | Correct: [[power|power]] = 1 − β |
| **Do not reject** | Correct | [[type-ii-error|Type II error]] (β, false negative) |

Power depends on four things: the **true effect size** (larger → more power), **variability** (more noise → less power), **sample size**, and **α**. Sample size scales with 1/Δ², so halving the target difference quadruples the required n.`,
      },
      { kind: 'lab', lab: 'power', caption: 'The overlap of the null and alternative distributions is the type II error. Change Δ, SD and n.' },
      {
        kind: 'text',
        title: 'Choosing the inputs',
        body: `- **Target difference:** the [[mcid|MCID]] or the smallest effect that would change practice. Not the effect seen in a pilot — pilot estimates are imprecise and, when selected for being promising, inflated. Not a generic "medium effect, d = 0.5": Cohen offered those labels only as a last resort {{cohen1988}}.
- **SD or control-group risk:** from prior studies in a similar population; use a conservative (larger) SD.
- **α and power:** usually 0.05 two-sided and 80–90%.
- **Attrition:** inflate n by 1/(1 − dropout).
- **Design:** cluster trials multiply n by the [[design-effect|design effect]]; ANCOVA adjustment for a baseline that correlates *r* with outcome reduces n by about a factor (1 − r²).

Protocols should state all of these so the calculation can be reproduced {{spirit2025}}. The calculator above uses the normal approximation with Guenther’s correction for means, which matches exact t-based results to within one participant per group {{guenther1981}}.`,
      },
      {
        kind: 'callout',
        tone: 'pitfall',
        title: 'Underpowered studies mislead even when "significant"',
        body: `When power is low, only results that happen to overestimate the effect cross p < 0.05. Significant results from small studies therefore exaggerate the true effect (type M, magnitude error) and can even have the wrong sign (type S) {{gelman2014b,button2013}}. A striking effect from a small trial is a reason for caution, not confidence.`,
      },
      {
        kind: 'callout',
        tone: 'pitfall',
        title: 'Post-hoc ("observed") power adds nothing',
        body: `Power computed from the observed effect is a one-to-one function of the p-value: a non-significant result always has "low observed power". It cannot show that a null result was due to small n. Use the CI instead — it shows directly which effects the data can and cannot exclude {{hoenig2001,greenland2016}}.`,
      },
    ],
    takeaways: [
      'Power depends on effect size, variability, n and α; n ∝ 1/Δ².',
      'Base the target difference on clinical importance, not on a pilot estimate or a generic d.',
      'State every input of a sample-size calculation, including attrition and design effects.',
      'Significant results from underpowered studies overestimate effects.',
      'Never report post-hoc power; interpret the CI.',
    ],
  },

  // ───────────────────────────── 5 ─────────────────────────────
  {
    id: 'effect-measures',
    n: 5,
    title: 'Risks, odds, rates and the number needed to treat',
    tagline: 'Relative measures tell you how strong an effect is; absolute measures tell you whether it matters.',
    minutes: 20,
    objectives: [
      'Compute risk difference, risk ratio, odds ratio and NNT from a 2×2 table, with CIs',
      'Explain when the odds ratio approximates the risk ratio and when it does not',
      'Report absolute and relative effects together, with a time frame',
      'Interpret an NNT confidence interval that passes through infinity',
    ],
    sections: [
      {
        kind: 'text',
        title: 'The 2×2 table',
        body: `| | Event | No event | Total |
|---|---|---|---|
| Treated / exposed | a | b | a + b |
| Control / unexposed | c | d | c + d |

| Measure | Formula | No effect |
|---|---|---|
| [[risk|Risk]] in treated, control | a/(a+b), c/(c+d) | — |
| [[absolute-risk-reduction|Risk difference]] (RD) | a/(a+b) − c/(c+d) | 0 |
| [[risk-ratio|Risk ratio]] (RR) | [a/(a+b)] / [c/(c+d)] | 1 |
| Relative risk reduction | 1 − RR | 0 |
| [[odds-ratio|Odds ratio]] (OR) | (a/b) / (c/d) = ad/bc | 1 |
| [[nnt|NNT]] | 1 / ARR (absolute value of RD) | ∞ |

Ratios get their CIs on the log scale. The RD CI should use a score method (Newcombe) rather than the simple Wald formula when counts are small {{newcombe1998}}.`,
      },
      { kind: 'lab', lab: 'two-by-two', caption: 'Enter any 2×2 table. Every measure, CI and test updates live.' },
      {
        kind: 'text',
        title: 'Relative vs absolute',
        body: `The same RR of 0.75 means very different things at different baseline risks:

| Baseline risk | Risk on treatment | ARR | NNT |
|---|---|---|---|
| 40% | 30% | 10 points | 10 |
| 4% | 3% | 1 point | 100 |
| 0.4% | 0.3% | 0.1 point | 1,000 |

Relative effects are often fairly constant across baseline risk; absolute effects are what patients and budgets experience. Report both for binary outcomes {{consort2025}}. Always state the **time horizon**: "NNT 25 over 5 years" {{laupacis1988}}.

When the RD CI includes zero, the NNT CI is not a finite interval: an RD of −4% (95% CI −9% to +1%) becomes "NNTB 25 (NNTB 11 to ∞ to NNTH 100)" {{altman1998}}.`,
      },
      { kind: 'lab', lab: 'or-vs-rr', caption: 'Hold the odds ratio fixed and raise the baseline risk. The RR and OR drift apart.' },
      {
        kind: 'text',
        title: 'When is an odds ratio "like" a risk ratio?',
        body: `- If the outcome is **rare** (say < 10% in all groups), OR ≈ RR.
- If it is **common**, the OR is always further from 1 than the RR. An OR of 3 with a control risk of 40% corresponds to an RR of about 1.7.
- **Case-control studies** can estimate only the OR (the investigator fixes the case/control ratio, so risks are meaningless). With incidence-density sampling of controls, the OR estimates the rate ratio without any rare-disease assumption.
- **Logistic regression** produces ORs. To get adjusted RRs or risk differences, use modified Poisson regression {{zou2004}} or compute marginal risks from the logistic model.
- ORs and HRs are [[non-collapsibility|non-collapsible]]: adjusting for a strong prognostic factor changes them even in a perfectly randomised trial.

[[rate|Rates]] use person-time in the denominator and are compared with rate ratios; [[hazard-ratio|hazard ratios]] are covered in the survival module.`,
      },
      {
        kind: 'callout',
        tone: 'pitfall',
        title: '"Cuts risk by 50%"',
        body: `A headline relative risk reduction of 50% could be 2% → 1% (ARR 1 point, NNT 100) or 40% → 20% (NNT 5). Whenever you see a relative effect, find the baseline risk and compute the absolute difference.`,
      },
    ],
    takeaways: [
      'RD, RR and OR answer different questions; report an absolute and a relative measure.',
      'NNT = 1/ARR, always with a time frame and a CI.',
      'OR ≈ RR only for rare outcomes; otherwise the OR exaggerates.',
      'Case-control studies give ORs; logistic regression gives ORs; use modified Poisson for adjusted RRs.',
      'ORs and HRs change with adjustment even without confounding (non-collapsibility).',
    ],
  },

  // ───────────────────────────── 6 ─────────────────────────────
  {
    id: 'comparing-groups',
    n: 6,
    title: 'Comparing groups: choosing the test',
    tagline: 'Three questions select the method. Assumptions are checked with plots and design knowledge, not gatekeeping tests.',
    minutes: 25,
    objectives: [
      'Select a test from outcome type, data structure and number of groups',
      'Check assumptions without preliminary significance tests',
      'Use Welch’s t-test by default and explain why',
      'State what rank-based tests actually test',
      'Analyse an RCT with a baseline measurement using ANCOVA',
    ],
    sections: [
      {
        kind: 'text',
        title: 'Three questions',
        body: `1. **What type is the outcome?** (Module 1)
2. **How are observations related?** Independent groups, paired/matched, or clustered/repeated.
3. **How many groups, and do you need adjustment?**

| Outcome | 2 independent groups | 2 paired | 3+ groups | Adjusted |
|---|---|---|---|---|
| Continuous | Welch t-test | paired t-test | Welch ANOVA | linear regression / ANCOVA |
| Skewed continuous | t-test on log scale, or Mann–Whitney | Wilcoxon signed-rank | Kruskal–Wallis | regression on log y |
| Binary | χ² / Fisher | McNemar | χ² | logistic / modified Poisson |
| Ordinal | Mann–Whitney | Wilcoxon signed-rank | Kruskal–Wallis | ordinal logistic |
| Count | rate ratio | — | — | negative binomial |
| Time-to-event | log-rank | — | log-rank | Cox |

Clustered or repeated outcomes of any type need [[mixed-model|mixed models]] or [[gee|GEE]] (Module 10). The interactive [Test Finder](#/finder) walks through the same logic.`,
      },
      {
        kind: 'text',
        title: 'Checking assumptions properly',
        body: `**Independence** matters most and is judged from the design: who could have influenced whom, who was measured twice, who shares a clinic.

**Normality** matters least for comparing means. The t-test relies on the sampling distribution of the mean, which is close to normal for moderate samples unless the data are extremely skewed {{lumley2002,fagerland2012}}. Check with a histogram or Q–Q plot and subject knowledge.

**Do not use significance tests as gatekeepers.** Testing normality (Shapiro–Wilk) or equal variances (Levene) first, then choosing the main test from the result, distorts the error rates of the final test {{rochon2012,zimmerman2004}}. In small samples these tests miss important departures; in large samples they flag trivial ones.

**Use [[welch|Welch’s t-test]] by default.** It does not assume equal variances, controls α when variances and group sizes differ, and loses almost nothing when they are equal {{delacre2017,ruxton2006}}.`,
      },
      {
        kind: 'callout',
        tone: 'rule',
        title: 'What a "non-parametric" test is testing',
        body: `The [[mann-whitney|Mann–Whitney]] test asks whether a randomly chosen value from one group tends to exceed one from the other. It is a test of medians **only** if the two distributions have the same shape; groups with equal medians but different spreads can produce p < 0.05 {{hart2001}}. Rank tests also have their own assumptions (independence; symmetry for the signed-rank test) and still need an effect estimate: report a Hodges–Lehmann shift with CI, not just p.`,
      },
      {
        kind: 'text',
        title: 'Paired data',
        body: `When each patient provides both measurements, analyse the **within-patient differences**. This removes stable between-patient variation, so the SE is usually much smaller than an unpaired comparison would give. Treating paired data as independent is both wrong and wasteful. Treating independent groups as paired is simply wrong.

**A pre–post change is not a treatment effect.** Without a control group, improvement can come from [[regression-to-the-mean|regression to the mean]] (patients enrolled when their values were high), natural history, or co-interventions {{barnett2005}}.`,
      },
      {
        kind: 'text',
        title: 'Randomised trials with a baseline measurement',
        body: `Three options for an outcome measured at baseline and follow-up:

| Analysis | Unbiased in an RCT? | Power |
|---|---|---|
| Compare follow-up values | Yes | Lowest when baseline–outcome correlation is high |
| Compare change scores | Yes | Better only if the correlation is > 0.5 |
| **[[ancova|ANCOVA]]**: follow-up ~ treatment + baseline | Yes | **Highest in all cases** |

ANCOVA is the recommended primary analysis {{vickers2001}}. Include stratification factors used in the randomisation {{kahan2012}}. Do **not** test baseline balance: in a properly randomised trial any imbalance is by definition due to chance, so p-values on Table 1 answer no useful question {{senn1994}}.`,
      },
      {
        kind: 'text',
        title: 'Three or more groups',
        body: `A global ANOVA or Kruskal–Wallis test asks only "are any different?". Usually you want specific comparisons: plan them in advance (each arm vs control: Dunnett; all pairs: Tukey or Games–Howell). If groups are **ordered** (doses, age bands, tertiles of exposure) test for a trend with regression — more powerful and closer to the clinical question.`,
      },
    ],
    takeaways: [
      'Outcome type + data structure + number of groups selects the method.',
      'Judge independence from the design; it is the assumption that matters most.',
      'Do not choose the test from Shapiro–Wilk or Levene results.',
      'Welch’s t-test is the default for two independent means.',
      'Mann–Whitney tests stochastic superiority, not medians, unless shapes match.',
      'For RCTs with a baseline measurement, use ANCOVA and never test baseline balance.',
    ],
  },
];
