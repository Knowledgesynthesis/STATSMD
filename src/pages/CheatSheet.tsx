import { Printer } from 'lucide-react';
import { Prose } from '../components/Prose';
import { Button, Card, Page, PageHeader } from '../components/ui';

const SECTIONS: { title: string; body: string }[] = [
  {
    title: 'Choosing the analysis',
    body: `| Outcome | 2 independent groups | Paired | 3+ groups | Adjusted / several predictors | Clustered or repeated |
|---|---|---|---|---|---|
| Continuous | Welch t | paired t | Welch ANOVA | linear regression; ANCOVA in RCTs | mixed model / GEE |
| Skewed positive | t on log scale; Mann–Whitney | Wilcoxon signed-rank | Kruskal–Wallis | regression on log y; gamma GLM | mixed model on log y |
| Binary | N−1 χ²; Fisher if expected < 1 | McNemar | χ² | logistic (OR); modified Poisson (RR) | GEE / mixed logistic |
| Ordinal | Mann–Whitney | Wilcoxon signed-rank | Kruskal–Wallis | proportional-odds regression | mixed ordinal model |
| Count / rate | rate ratio | — | — | negative binomial + offset | NB mixed model / GEE |
| Time-to-event | KM + log-rank | — | log-rank | Cox; RMST if non-PH | frailty / robust SE |

Matched case-control → conditional logistic. Competing events → cumulative incidence. Agreement → Bland–Altman, ICC, κ — never r.`,
  },
  {
    title: 'Effect measures from a 2×2 table',
    body: `| Measure | Formula | Null |
|---|---|---|
| Risk (treated / control) | a/(a+b) , c/(c+d) | — |
| Risk difference (RD) | a/(a+b) − c/(c+d) | 0 |
| Risk ratio (RR) | [a/(a+b)] / [c/(c+d)] | 1 |
| Odds ratio (OR) | ad / bc | 1 |
| NNT | 1 / ARR, with a time frame | ∞ |
| OR → RR | RR = OR / (1 − p₀ + p₀·OR) | — |

Report an absolute and a relative measure. OR ≈ RR only for rare outcomes.`,
  },
  {
    title: 'Reading a result',
    body: `- Effect estimate in clinical units, **95% CI**, exact p — in that order of importance.
- Compare the whole CI with the minimal clinically important difference: clear benefit / trivial / inconclusive / informative null.
- p is computed assuming H₀; it is not P(H₀), not the effect size, not the false-positive risk.
- p = 0.05 ≈ 4.3 bits of surprise; Bayes factor ≤ 2.5.
- Non-significant + wide CI = inconclusive. To claim similarity, use an equivalence or non-inferiority margin.
- Subgroups: test the interaction; never compare subgroup p-values.
- HR = ratio of instantaneous rates, not a risk ratio. Add absolute survival or RMST.`,
  },
  {
    title: 'Diagnostic tests',
    body: `| Quantity | Formula |
|---|---|
| Sensitivity | TP / (TP + FN) |
| Specificity | TN / (TN + FP) |
| PPV | TP / (TP + FP) — depends on prevalence |
| NPV | TN / (TN + FN) |
| LR+ / LR− | sens / (1 − spec) ; (1 − sens) / spec |
| Post-test odds | pre-test odds × LR (odds = p / (1 − p)) |`,
  },
  {
    title: 'Sample size in your head',
    body: `- Two means, α = 0.05 two-sided, 80% power: **n per group ≈ 16 / d²** where d = Δ / SD (90% power: ≈ 21 / d²).
- n ∝ 1/Δ²: halve the difference → four times the patients.
- CI width ∝ 1/√n: halve the width → four times the patients.
- Cluster trials: multiply by 1 + (m − 1)·ICC. Attrition: divide by (1 − dropout).
- Zero events in n: 95% upper bound ≈ 3/n.`,
  },
  {
    title: 'Red flags when appraising',
    body: `- p-values without estimates or CIs; "trend towards significance"
- Baseline p-values in an RCT; change scores instead of ANCOVA
- Paired, matched or clustered data analysed as independent
- Dichotomised continuous variables; stepwise or univariable-screened covariates
- Relative effects only; no time frame for risks or NNT
- Primary outcome differs from the registry; many unadjusted endpoints
- Immortal time (exposure defined after time zero); 1 − KM with competing risks
- Prediction model reported with AUC only; no calibration; no full equation`,
  },
  {
    title: 'Reporting guidelines',
    body: `| Design | Guideline |
|---|---|
| RCT / protocol | CONSORT 2025 / SPIRIT 2025 |
| Observational | STROBE; TARGET 2025 for target trial emulation |
| Diagnostic accuracy | STARD 2015 (appraise: QUADAS-2) |
| Prediction model | TRIPOD+AI 2024 (appraise: PROBAST+AI 2025) |
| Systematic review | PRISMA 2020 (certainty: GRADE) |
| Estimands | ICH E9(R1) |`,
  },
];

export default function CheatSheet() {
  return (
    <Page>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader eyebrow="Reference" title="Cheat sheet">One page for journal club, protocol writing and peer review. Prints cleanly.</PageHeader>
        <Button variant="outline" onClick={() => window.print()} className="no-print"><Printer className="h-4 w-4" /> Print</Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {SECTIONS.map((s, i) => (
          <Card key={s.title} className={`p-5 ${i === 0 ? 'lg:col-span-2' : ''} break-inside-avoid`}>
            <h2 className="mb-3 font-bold">{s.title}</h2>
            <Prose className="text-sm">{s.body}</Prose>
          </Card>
        ))}
      </div>
    </Page>
  );
}
