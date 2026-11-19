import { CheckCircle2, Clock, FlaskConical } from 'lucide-react';
import { modules } from '../content/modules';
import { questions } from '../content/questions';
import { Card, Page, PageHeader, ProgressBar } from '../components/ui';
import { mastery, useProgress } from '../lib/progress';

const PARTS = [
  { title: 'Foundations', range: [1, 5], blurb: 'Data, uncertainty, p-values, power and effect measures.' },
  { title: 'Choosing and running analyses', range: [6, 10], blurb: 'Tests, categorical data, agreement, regression and correlated data.' },
  { title: 'Causation, time and diagnosis', range: [11, 14], blurb: 'Confounding and bias, survival, diagnostic tests and prediction.' },
  { title: 'Integrity and synthesis', range: [15, 17], blurb: 'Multiplicity, meta-analysis and a full appraisal workflow.' },
];

export default function Learn() {
  const { lessons, questions: qs } = useProgress();
  const done = modules.filter((m) => lessons[m.id]).length;
  const totalMin = modules.reduce((s, m) => s + m.minutes, 0);
  return (
    <Page>
      <PageHeader eyebrow="Course" title="Learn medical statistics, in order">
        {modules.length} modules, about {Math.round(totalMin / 60)} hours. Each builds on the last; jump in anywhere if you know the earlier material.
      </PageHeader>
      <div className="mb-8 max-w-md">
        <div className="mb-1 flex justify-between text-sm"><span className="text-ink-2">Completed</span><span className="tabular font-semibold">{done} / {modules.length}</span></div>
        <ProgressBar value={done / modules.length} label="Course progress" />
      </div>
      <div className="space-y-10">
        {PARTS.map((part, pi) => (
          <section key={part.title}>
            <h2 className="text-lg font-bold">Part {pi + 1}. {part.title}</h2>
            <p className="mb-3 text-sm text-ink-2">{part.blurb}</p>
            <div className="grid gap-3 md:grid-cols-2">
              {modules.filter((m) => m.n >= part.range[0] && m.n <= part.range[1]).map((m) => {
                const ids = questions.filter((q) => q.module === m.id).map((q) => q.id);
                const mas = mastery(ids, qs);
                const labs = m.sections.filter((s) => s.kind === 'lab').length;
                return (
                  <a key={m.id} href={`#/learn/${m.id}`} className="group">
                    <Card className="h-full p-4 transition-colors group-hover:border-primary sm:p-5">
                      <div className="flex items-start gap-3">
                        <span className="tabular inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-bold text-ink-2">
                          {lessons[m.id] ? <CheckCircle2 className="h-5 w-5 text-good-text" aria-label="Completed" /> : m.n}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold leading-snug">{m.title}</h3>
                          <p className="mt-1 text-sm text-ink-2">{m.tagline}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {m.minutes} min</span>
                            {labs > 0 && <span className="inline-flex items-center gap-1"><FlaskConical className="h-3.5 w-3.5" /> {labs} lab{labs > 1 ? 's' : ''}</span>}
                            <span>{ids.length} questions · {Math.round(mas * 100)}% mastered</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </a>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </Page>
  );
}
