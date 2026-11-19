import { ArrowLeft, ArrowRight, BookOpen, Link2, RotateCcw, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { decisionById, ROOT } from '../content/decision-tree';
import { methodsById } from '../content/methods';
import { modulesById } from '../content/modules';
import type { DecisionOption } from '../content/types';
import { Inline } from '../components/Prose';
import { Badge, Button, Card, LinkButton, Page, PageHeader } from '../components/ui';
import { navigate, useRoute } from '../lib/router';

/** The path through the tree is kept in the URL (?p=0.2.1) so a result can be shared. */
function walk(path: number[]) {
  const steps: { nodeId: string; choice: number; option: DecisionOption }[] = [];
  let nodeId = ROOT;
  for (const c of path) {
    const node = decisionById[nodeId];
    const option = node?.options[c];
    if (!option) break;
    steps.push({ nodeId, choice: c, option });
    if (option.result) return { steps, current: null, result: option.result };
    nodeId = option.next!;
  }
  return { steps, current: nodeId, result: null };
}

export default function Finder() {
  const { query } = useRoute();
  const path = (query.get('p') ?? '').split('.').filter((x) => x !== '').map(Number);
  const { steps, current, result } = walk(path);
  const [copied, setCopied] = useState(false);
  const go = (p: number[]) => navigate(p.length ? `/finder?p=${p.join('.')}` : '/finder');
  const node = current ? decisionById[current] : null;
  const primary = result ? methodsById[result.primary] : null;

  return (
    <Page className="max-w-4xl">
      <PageHeader eyebrow="Test Finder" title="Which analysis fits your question?">
        Answer a few questions about your goal, outcome and data structure. Each step explains why it matters.
      </PageHeader>

      {steps.length > 0 && (
        <ol className="mb-6 flex flex-wrap gap-2 text-sm" aria-label="Your answers so far">
          {steps.map((s, i) => (
            <li key={i}>
              <button type="button" onClick={() => go(path.slice(0, i))} className="rounded-full border border-line-strong bg-surface px-3 py-1 text-ink-2 hover:border-primary hover:text-ink" title="Change this answer">
                {s.option.label.length > 48 ? `${s.option.label.slice(0, 46)}…` : s.option.label}
              </button>
            </li>
          ))}
        </ol>
      )}

      {node && (
        <Card className="p-5 sm:p-6">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">Step {steps.length + 1}</div>
          <h2 className="text-xl font-bold">{node.question}</h2>
          {node.help && <p className="mt-1 text-sm text-ink-2">{node.help}</p>}
          <div className="mt-5 grid gap-2">
            {node.options.map((o, i) => (
              <button key={o.label} type="button" onClick={() => go([...path.slice(0, steps.length), i])} className="group flex items-center justify-between gap-3 rounded-xl border border-line-strong px-4 py-3 text-left transition-colors hover:border-primary hover:bg-primary-soft">
                <span>
                  <span className="block font-medium">{o.label}</span>
                  {o.detail && <span className="mt-0.5 block text-sm text-ink-2">{o.detail}</span>}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted group-hover:text-primary-text" />
              </button>
            ))}
          </div>
          {steps.length > 0 && (
            <Button variant="ghost" size="sm" className="mt-4" onClick={() => go(path.slice(0, steps.length - 1))}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          )}
        </Card>
      )}

      {result && primary && (
        <div className="space-y-4">
          <Card className="border-primary/40 p-5 sm:p-6">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary-text">Recommended</div>
            <h2 className="text-2xl font-bold">{primary.name}</h2>
            {primary.aka && <p className="text-sm text-muted">also called {primary.aka}</p>}
            <p className="mt-3"><Inline text={result.why} /></p>
            {result.watch && (
              <div className="mt-4 flex gap-2 rounded-lg bg-warn-soft p-3 text-sm">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warn-text" aria-hidden />
                <span><strong className="font-semibold">Watch out: </strong><Inline text={result.watch} /></span>
              </div>
            )}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="mb-1 text-sm font-semibold">Key assumptions</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-ink-2">{primary.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-semibold">Report</h3>
                <p className="text-sm text-ink-2">{primary.report}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <LinkButton href={`#/methods/${primary.id}`}>Full method card <ArrowRight className="h-4 w-4" /></LinkButton>
              {primary.module && modulesById[primary.module] && (
                <LinkButton variant="outline" href={`#/learn/${primary.module}`}><BookOpen className="h-4 w-4" /> Module {modulesById[primary.module].n}</LinkButton>
              )}
            </div>
          </Card>
          {result.also && result.also.length > 0 && (
            <Card className="p-5">
              <h3 className="mb-3 font-semibold">Also consider</h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {result.also.map((id) => {
                  const m = methodsById[id];
                  return (
                    <li key={id}>
                      <a href={`#/methods/${id}`} className="block rounded-lg border border-line p-3 hover:border-primary">
                        <span className="font-medium">{m.name}</span>
                        <Badge className="ml-2">{m.family}</Badge>
                        <span className="mt-1 block text-sm text-ink-2">{m.data}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => go(path.slice(0, steps.length - 1))}><ArrowLeft className="h-4 w-4" /> Change last answer</Button>
            <Button variant="outline" onClick={() => go([])}><RotateCcw className="h-4 w-4" /> Start over</Button>
            <Button
              variant="ghost"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href).then(() => setCopied(true), () => setCopied(false));
                setTimeout(() => setCopied(false), 1800);
              }}
            >
              <Link2 className="h-4 w-4" /> {copied ? 'Link copied' : 'Copy link to this result'}
            </Button>
          </div>
        </div>
      )}
    </Page>
  );
}
