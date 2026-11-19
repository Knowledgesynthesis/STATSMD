import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock, Target } from 'lucide-react';
import { modules, modulesById } from '../content/modules';
import { questions } from '../content/questions';
import { referencesById } from '../content/references';
import { Prose } from '../components/Prose';
import { QuestionCard } from '../components/QuestionCard';
import { Button, Callout, Card, LinkButton, Page } from '../components/ui';
import { Lab } from '../labs/registry';
import { useProgress } from '../lib/progress';
import NotFound from './NotFound';

export default function ModulePage({ id }: { id: string }) {
  const m = modulesById[id];
  const { lessons, toggleLesson } = useProgress();
  if (!m) return <NotFound />;
  const prev = modules.find((x) => x.n === m.n - 1);
  const next = modules.find((x) => x.n === m.n + 1);
  const qs = questions.filter((q) => q.module === m.id);
  const done = !!lessons[m.id];
  const cited = [...new Set(m.sections.flatMap((s) => (s.kind === 'lab' ? [] : [...s.body.matchAll(/\{\{([^}]+)\}\}/g)].flatMap((x) => x[1].split(',').map((v) => v.trim())))))].filter((r) => referencesById[r]);

  return (
    <Page className="max-w-4xl">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-2">
        <a href="#/learn" className="hover:text-ink">Course</a> <span aria-hidden>›</span> Module {m.n}
      </nav>
      <header className="mb-8">
        <div className="mb-2 text-sm font-semibold text-primary-text">Module {m.n} of {modules.length}</div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{m.title}</h1>
        <p className="mt-3 text-lg text-ink-2">{m.tagline}</p>
        <div className="mt-3 flex items-center gap-4 text-sm text-muted">
          <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {m.minutes} min</span>
          <button type="button" onClick={() => document.getElementById('quick-check')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-1 hover:text-ink"><Target className="h-4 w-4" /> {qs.length} questions</button>
        </div>
      </header>

      <Card className="mb-8 p-4 sm:p-5">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-2">After this module you can</h2>
        <ul className="space-y-1.5 text-sm">
          {m.objectives.map((o) => (
            <li key={o} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-text" aria-hidden /> {o}</li>
          ))}
        </ul>
      </Card>

      <div className="space-y-8">
        {m.sections.map((s, i) => {
          if (s.kind === 'text')
            return (
              <section key={i}>
                {s.title && <h2 className="mb-3 text-xl font-bold tracking-tight">{s.title}</h2>}
                <Prose>{s.body}</Prose>
              </section>
            );
          if (s.kind === 'callout')
            return (
              <Callout key={i} tone={s.tone} title={s.title}>
                <Prose className="text-[0.95rem]">{s.body}</Prose>
              </Callout>
            );
          return (
            <figure key={i}>
              <Lab id={s.lab} embedded />
              {s.caption && <figcaption className="mt-2 text-sm text-ink-2">{s.caption}</figcaption>}
            </figure>
          );
        })}
      </div>

      <section className="mt-10 rounded-xl border border-primary/30 bg-primary-soft p-5">
        <h2 className="mb-2 font-bold">Key takeaways</h2>
        <ul className="space-y-1.5 text-sm">
          {m.takeaways.map((t) => (
            <li key={t} className="flex gap-2"><span aria-hidden className="text-primary-text">→</span> {t}</li>
          ))}
        </ul>
      </section>

      <section id="quick-check" className="mt-10 scroll-mt-20">
        <h2 className="mb-1 text-xl font-bold tracking-tight">Quick check</h2>
        <p className="mb-4 text-sm text-ink-2">Answers are saved; missed questions return in <a href="#/quiz?mode=review" className="text-primary-text underline">review</a>.</p>
        <div className="space-y-4">
          {qs.map((q, i) => <QuestionCard key={q.id} q={q} index={i} />)}
        </div>
      </section>

      {cited.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-2">Sources for this module</h2>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-ink-2">
            {cited.map((r) => (
              <li key={r}>
                {referencesById[r].citation}{' '}
                {referencesById[r].url && <a href={referencesById[r].url} target="_blank" rel="noreferrer" className="text-primary-text underline">link</a>}
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        <Button variant={done ? 'secondary' : 'primary'} onClick={() => toggleLesson(m.id)} aria-pressed={done}>
          {done ? <CheckCircle2 className="h-4 w-4 text-good-text" /> : <Circle className="h-4 w-4" />}
          {done ? 'Completed' : 'Mark module complete'}
        </Button>
        <div className="flex gap-2">
          {prev && <LinkButton variant="outline" href={`#/learn/${prev.id}`}><ArrowLeft className="h-4 w-4" /> {prev.n}</LinkButton>}
          {next && <LinkButton href={`#/learn/${next.id}`}>Next: {next.title.length > 28 ? `${next.title.slice(0, 26)}…` : next.title} <ArrowRight className="h-4 w-4" /></LinkButton>}
        </div>
      </div>
    </Page>
  );
}
