import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, RotateCcw, X } from 'lucide-react';
import { cases, casesById } from '../content/cases';
import { modulesById } from '../content/modules';
import { Cite, Inline, Prose } from '../components/Prose';
import { Badge, Button, Card, LinkButton, Page, PageHeader } from '../components/ui';
import { useProgress } from '../lib/progress';
import { cn } from '../lib/utils';
import NotFound from './NotFound';

const LEVEL = { 1: 'Core', 2: 'Applied', 3: 'Advanced' } as const;

function CaseRunner({ id }: { id: string }) {
  const c = casesById[id];
  const record = useProgress((s) => s.recordCase);
  const [picks, setPicks] = useState<number[]>([]);
  if (!c) return <NotFound />;
  const step = picks.length;
  const finished = step === c.steps.length;
  const score = picks.filter((p, i) => c.steps[i].options[p]?.correct).length;
  const idx = cases.findIndex((x) => x.id === id);
  const nextCase = cases[idx + 1];

  const choose = (k: number) => {
    const next = [...picks, k];
    setPicks(next);
    if (next.length === c.steps.length) record(c.id, next.filter((p, i) => c.steps[i].options[p]?.correct).length, c.steps.length);
  };

  return (
    <Page className="max-w-3xl">
      <a href="#/cases" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-2 hover:text-ink"><ArrowLeft className="h-4 w-4" /> All cases</a>
      <div className="mb-2 flex flex-wrap gap-2">
        <Badge tone="primary">{LEVEL[c.level]}</Badge>
        {c.modules.map((m) => <Badge key={m}>Module {modulesById[m].n}</Badge>)}
      </div>
      <h1 className="text-3xl font-bold tracking-tight">{c.title}</h1>
      <Card className="mt-6 p-5"><Prose>{c.scenario}</Prose></Card>
      <ol className="mt-6 space-y-5">
        {c.steps.slice(0, Math.min(step + 1, c.steps.length)).map((s, si) => {
          const picked = picks[si];
          const answered = picked !== undefined;
          return (
            <li key={si}>
              <Card className="p-5">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">Step {si + 1} of {c.steps.length}</div>
                <p className="mb-3 font-medium"><Inline text={s.prompt} /></p>
                <div className="space-y-2">
                  {s.options.map((o, k) => {
                    const isPicked = picked === k;
                    return (
                      <button
                        key={k}
                        type="button"
                        disabled={answered}
                        onClick={() => choose(k)}
                        className={cn(
                          'w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                          !answered && 'border-line-strong hover:border-primary hover:bg-primary-soft',
                          answered && o.correct && 'border-good bg-good-soft',
                          answered && isPicked && !o.correct && 'border-bad bg-bad-soft',
                          answered && !o.correct && !isPicked && 'border-line opacity-75',
                        )}
                      >
                        <span className="flex items-start gap-2">
                          {answered && (o.correct ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-good-text" /> : isPicked ? <X className="mt-0.5 h-4 w-4 shrink-0 text-bad-text" /> : <span className="w-4 shrink-0" />)}
                          <span>
                            <Inline text={o.text} />
                            {answered && (isPicked || o.correct) && <span className="mt-1 block text-ink-2"><Inline text={o.feedback} /></span>}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Card>
            </li>
          );
        })}
      </ol>
      {finished && (
        <Card className="mt-6 border-primary/40 p-5">
          <div className="mb-1 flex items-center gap-2 font-bold">
            <CheckCircle2 className="h-5 w-5 text-good-text" /> {score} of {c.steps.length} correct on first attempt
          </div>
          <p className="text-ink-2">
            <Inline text={c.debrief} />
            {c.refs && <Cite ids={c.refs} />}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setPicks([])}><RotateCcw className="h-4 w-4" /> Try again</Button>
            {nextCase && <LinkButton href={`#/cases/${nextCase.id}`}>Next case <ArrowRight className="h-4 w-4" /></LinkButton>}
          </div>
        </Card>
      )}
    </Page>
  );
}

export default function Cases({ id }: { id?: string }) {
  const results = useProgress((s) => s.cases);
  if (id) return <CaseRunner key={id} id={id} />;
  return (
    <Page>
      <PageHeader eyebrow="Practice" title="Clinical cases">
        Realistic studies, worked step by step: identify the design and data structure, choose the analysis, then interpret the output and spot the trap.
      </PageHeader>
      <div className="grid gap-3 md:grid-cols-2">
        {cases.map((c) => {
          const r = results[c.id];
          return (
            <a key={c.id} href={`#/cases/${c.id}`} className="group">
              <Card className="h-full p-5 transition-colors group-hover:border-primary">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge tone="primary">{LEVEL[c.level]}</Badge>
                  <span className="text-xs text-muted">{c.steps.length} steps · {c.modules.map((m) => `M${modulesById[m].n}`).join(', ')}</span>
                  {r && <Badge tone={r.score === r.total ? 'good' : 'warn'}>{r.score}/{r.total}</Badge>}
                </div>
                <h2 className="font-semibold leading-snug">{c.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-ink-2">{c.scenario}</p>
              </Card>
            </a>
          );
        })}
      </div>
    </Page>
  );
}
