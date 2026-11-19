# StatsMD

An interactive, evidence-based course in medical statistics: choose the right analysis, check its assumptions properly, and interpret p-values, confidence intervals, risks, odds, hazards and diagnostic accuracy correctly.

**Live:** https://statsmd.vercel.app

| | |
|---|---|
| **Course** | 17 modules, from data types to a full appraisal workflow, each with objectives, worked examples, pitfalls and key takeaways |
| **Labs** | 16 interactive simulations and calculators (CI coverage, p-value dance, power, 2×2 measures, OR vs RR, Bland–Altman, regression influence, Simpson’s paradox, regression to the mean, Kaplan–Meier, diagnostic Bayes, calibration, multiplicity, forest plot…) |
| **Test Finder** | Decision tree covering 32 methods, with shareable result links |
| **Methods atlas** | When to use each method, the assumptions that matter, what to do when they fail, what to report, common mistakes |
| **Cases** | 14 multi-step clinical cases (design → method → interpretation → trap) |
| **Question bank** | 67 questions with explanations and spaced-repetition review |
| **Reference** | 109-term glossary with in-lesson definition popovers, printable cheat sheet, 113 cited sources |

## Evidence base

Content follows current guidance — CONSORT 2025, SPIRIT 2025, TARGET 2025, STROBE, STARD 2015, TRIPOD+AI 2024, PROBAST+AI 2025, PRISMA 2020, ICH E9(R1), the ASA statements on p-values, and the Cochrane Handbook (v6.5) — plus methodological papers for specific recommendations (e.g., Welch’s t-test by default, N − 1 χ², no preliminary assumption tests, Riley sample-size criteria, RMST and competing risks). Every claim links to its source on the [References](https://statsmd.vercel.app/#/references) page.

## How correctness is checked

| Check | What it verifies | Command |
|---|---|---|
| Statistical engine | Distributions, t/χ²/Fisher/McNemar tests, effect-measure CIs, power, Kaplan–Meier, log-rank, OLS, logistic regression, AUC, p-value adjustment and meta-analysis match SciPy / statsmodels / lifelines reference values | `npm test` |
| Content integrity | Every glossary link, citation, method alternative and decision-tree branch resolves; every quiz item has one keyed answer; every case step has one correct option; markdown tables are well formed; every source is cited | `npm test` |
| References | Every DOI resolves on Crossref and its registered title matches the citation | `npm run check:refs` |
| End to end | All 93 routes at desktop and phone widths: no console errors, no exceptions, no horizontal overflow; Test Finder, case, quiz, popover, lab and theme interactions | `npm run smoke -- http://localhost:4173` |

## Development

```bash
npm install
npm run dev          # http://localhost:5173
npm run check        # lint + unit/content tests + production build
npm run build && npx vite preview --port 4173 &
npm run smoke -- http://localhost:4173   # needs Playwright installed
```

Stack: React 19, TypeScript, Vite 7, Tailwind CSS 4, Zustand (progress in localStorage). Charts are hand-built SVG; the statistics engine has no dependencies. Routing is hash-based, so any static host works.

## Project layout

```
src/
  content/        course data: modules-*.ts, questions, cases, methods, decision-tree, glossary, references, labs
  labs/           one component per interactive lab (lazy-loaded)
  lib/stats/      statistics engine + reference-value tests
  lib/            markdown dialect, router, progress store, formatting
  components/     layout, prose renderer, charts, UI primitives
  pages/          routes
scripts/          smoke.mjs (Playwright), check-references.mjs (Crossref)
docs/             original product brief and plan
```

## Adding content

Lesson text uses a small markdown dialect (documented in `src/content/types.ts`): `**bold**`, `[[glossary-id]]` for definition popovers, `{{ref-id}}` for citations, pipe tables, lists. Add the source to `references.ts` first; `npm test` fails on any broken link, uncited source or malformed item.

## Deployment

Vercel builds `main` automatically (`npm run build`, output `dist/`; see `vercel.json`). Pull requests get preview deployments.

## Scope

StatsMD teaches methods and appraisal. For your own study’s analysis plan, involve a statistician early.

No licence file has been added yet; add one before others reuse the code or content.
