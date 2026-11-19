import { ArrowRight, BookOpen, CheckCircle2, Compass, FlaskConical, GraduationCap, RefreshCw, Target } from 'lucide-react';
import { cases } from '../content/cases';
import { labs } from '../content/labs';
import { methods } from '../content/methods';
import { modules } from '../content/modules';
import { questions } from '../content/questions';
import { references } from '../content/references';
import { Card, LinkButton, Page, ProgressBar } from '../components/ui';
import { isDue, mastery, useProgress } from '../lib/progress';

const labCount = (m: (typeof modules)[number]) => m.sections.filter((s) => s.kind === 'lab').length;

const CURRENT = [
  { name: 'CONSORT 2025 & SPIRIT 2025', what: 'Updated trial reporting and protocol checklists (open science, harms, estimands).' },
  { name: 'ICH E9(R1) estimands', what: 'Intercurrent events and what "the treatment effect" means.' },
  { name: 'TARGET 2025', what: 'Reporting standard for observational target trial emulations.' },
  { name: 'TRIPOD+AI 2024 · PROBAST+AI 2025', what: 'Reporting and appraisal of prediction models, regression or ML.' },
  { name: 'ASA statements on p-values', what: 'Six principles; estimation over thresholds.' },
  { name: 'Riley 2020 sample-size criteria', what: 'Replacing “10 events per variable” for prediction models.' },
];

export default function Home() {
  const { lessons, questions: qs, cases: cs } = useProgress();
  const done = modules.filter((m) => lessons[m.id]).length;
  const next = modules.find((m) => !lessons[m.id]) ?? modules[0];
  const due = questions.filter((q) => qs[q.id] && isDue(qs[q.id]) && !qs[q.id].lastCorrect).length;
  const overall = mastery(questions.map((q) => q.id), qs);
  const started = done > 0 || Object.keys(qs).length > 0;

  return (
    <Page className="py-10 sm:py-16">
      <section className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-center">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-text">Medical statistics, evidence-based</p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Choose the right analysis. Read results correctly.</h1>
          <p className="mt-4 max-w-xl text-lg text-ink-2">
            A {modules.length}-module course with {labs.length} interactive labs, a decision-tree Test Finder, {cases.length} multi-step clinical cases and a spaced-repetition question bank — every claim cited to current guidance.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href={`#/learn/${next.id}`} size="lg">
              {done ? 'Continue' : 'Start the course'} <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="#/finder" variant="outline" size="lg">
              <Compass className="h-4 w-4" /> Find a test
            </LinkButton>
          </div>
          <dl className="mt-8 grid max-w-lg grid-cols-3 gap-4 text-sm sm:grid-cols-5">
            {[
              [modules.length, 'modules'],
              [labs.length, 'labs'],
              [methods.length, 'methods'],
              [questions.length, 'questions'],
              [references.length, 'sources'],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="text-2xl font-bold text-ink">{n}</dd>
                <dd className="text-ink-2">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Card className="p-5 sm:p-6">
          {started ? (
            <>
              <h2 className="mb-4 font-semibold">Your progress</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="mb-1 flex justify-between"><span>Modules completed</span><span className="tabular font-semibold">{done} / {modules.length}</span></div>
                  <ProgressBar value={done / modules.length} label="Modules completed" />
                </div>
                <div>
                  <div className="mb-1 flex justify-between"><span>Questions mastered</span><span className="tabular font-semibold">{Math.round(overall * 100)}%</span></div>
                  <ProgressBar value={overall} label="Questions mastered" />
                </div>
                <div className="flex justify-between"><span>Cases solved</span><span className="tabular font-semibold">{Object.keys(cs).length} / {cases.length}</span></div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <LinkButton href={`#/learn/${next.id}`} size="sm">Next: {next.n}. {next.title.split(':')[0]}</LinkButton>
                {due > 0 && (
                  <LinkButton href="#/quiz?mode=review" size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4" /> {due} to review
                  </LinkButton>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="mb-3 font-semibold">How it works</h2>
              <ol className="space-y-3 text-sm">
                {[
                  [GraduationCap, 'Learn', 'Short modules: concept, worked example, pitfalls, then a lab you can play with.'],
                  [Target, 'Check', 'Quick questions after each module; missed ones come back for review.'],
                  [BookOpen, 'Apply', 'Multi-step cases: identify the design, pick the method, interpret the output.'],
                  [Compass, 'Use', 'The Test Finder and cheat sheet for your own analyses and journal clubs.'],
                ].map(([Icon, t, d]) => {
                  const I = Icon as typeof Target;
                  return (
                    <li key={t as string} className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-text"><I className="h-4 w-4" /></span>
                      <span><strong className="font-semibold">{t as string}.</strong> <span className="text-ink-2">{d as string}</span></span>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
        </Card>
      </section>

      <section className="mt-16">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">The course</h2>
          <a href="#/learn" className="text-sm font-medium text-primary-text hover:underline">All modules →</a>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <li key={m.id}>
              <a href={`#/learn/${m.id}`} className="group flex h-full gap-3 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-primary">
                <span className="tabular mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-bold text-ink-2 group-hover:bg-primary-soft group-hover:text-primary-text">
                  {lessons[m.id] ? <CheckCircle2 className="h-4 w-4 text-good-text" aria-label="Completed" /> : m.n}
                </span>
                <span>
                  <span className="block font-semibold leading-snug">{m.title}</span>
                  <span className="mt-0.5 block text-sm text-ink-2">{m.minutes} min{labCount(m) ? ` · ${labCount(m)} lab${labCount(m) === 1 ? '' : 's'}` : ''}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <h2 className="mb-1 flex items-center gap-2 font-semibold"><FlaskConical className="h-5 w-5 text-primary-text" /> Labs that make the ideas visible</h2>
          <p className="mb-4 text-sm text-ink-2">Every lab runs real calculations — validated against R/SciPy reference values — on simulated or published data.</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {labs.slice(0, 8).map((l) => (
              <li key={l.id}><a href={`#/labs/${l.id}`} className="block rounded-lg border border-line px-3 py-2 text-sm font-medium hover:border-primary hover:bg-primary-soft">{l.title}</a></li>
            ))}
          </ul>
          <a href="#/labs" className="mt-3 inline-block text-sm font-medium text-primary-text hover:underline">All {labs.length} labs →</a>
        </Card>
        <Card className="p-5 sm:p-6">
          <h2 className="mb-1 font-semibold">Up to date with current guidance</h2>
          <p className="mb-4 text-sm text-ink-2">Content reflects the standards journals, regulators and reviewers use now.</p>
          <ul className="space-y-2.5 text-sm">
            {CURRENT.map((c) => (
              <li key={c.name} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-good-text" aria-hidden />
                <span><strong className="font-semibold">{c.name}</strong> — <span className="text-ink-2">{c.what}</span></span>
              </li>
            ))}
          </ul>
          <a href="#/references" className="mt-3 inline-block text-sm font-medium text-primary-text hover:underline">All {references.length} sources →</a>
        </Card>
      </section>
    </Page>
  );
}
