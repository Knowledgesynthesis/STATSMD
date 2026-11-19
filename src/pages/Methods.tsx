import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, BookOpen, Search } from 'lucide-react';
import { methods, methodsById } from '../content/methods';
import { modulesById } from '../content/modules';
import { referencesById } from '../content/references';
import type { MethodFamily } from '../content/types';
import { Badge, Card, LinkButton, Page, PageHeader } from '../components/ui';
import NotFound from './NotFound';

const FAMILIES = [...new Set(methods.map((m) => m.family))] as MethodFamily[];

function MethodDetail({ id }: { id: string }) {
  const m = methodsById[id];
  if (!m) return <NotFound />;
  const mod = m.module ? modulesById[m.module] : undefined;
  return (
    <Page className="max-w-4xl">
      <a href="#/methods" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-2 hover:text-ink"><ArrowLeft className="h-4 w-4" /> Methods atlas</a>
      <div className="mb-2"><Badge tone="primary">{m.family}</Badge></div>
      <h1 className="text-3xl font-bold tracking-tight">{m.name}</h1>
      {m.aka && <p className="text-ink-2">also called {m.aka}</p>}
      <p className="mt-3 text-sm font-medium text-ink-2">Data: {m.data}</p>
      <div className="mt-6 space-y-5">
        <Card className="p-5"><h2 className="mb-1 font-semibold">When to use it</h2><p className="text-ink-2">{m.use}</p></Card>
        <div className="grid gap-5 md:grid-cols-2">
          <Card className="p-5">
            <h2 className="mb-2 font-semibold">Assumptions that matter</h2>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink-2">{m.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
          </Card>
          <Card className="p-5">
            <h2 className="mb-2 font-semibold">If they fail</h2>
            <p className="text-sm text-ink-2">{m.ifViolated}</p>
          </Card>
        </div>
        <Card className="p-5"><h2 className="mb-1 font-semibold">What to report</h2><p className="text-ink-2">{m.report}</p></Card>
        <Card className="border-bad/30 bg-bad-soft p-5">
          <h2 className="mb-2 flex items-center gap-2 font-semibold text-bad-text"><AlertTriangle className="h-4 w-4" /> Common mistakes</h2>
          <ul className="list-disc space-y-1.5 pl-5 text-sm">{m.pitfalls.map((p) => <li key={p}>{p}</li>)}</ul>
        </Card>
        <Card className="p-5"><h2 className="mb-1 font-semibold">Example</h2><p className="text-ink-2">{m.example}</p></Card>
        {m.alternatives.length > 0 && (
          <div>
            <h2 className="mb-2 font-semibold">Related methods</h2>
            <div className="flex flex-wrap gap-2">
              {m.alternatives.map((a) => (
                <a key={a} href={`#/methods/${a}`} className="rounded-full border border-line-strong px-3 py-1 text-sm hover:border-primary hover:bg-primary-soft">{methodsById[a].name}</a>
              ))}
            </div>
          </div>
        )}
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-2">Sources</h2>
          <ul className="space-y-1 text-sm text-ink-2">
            {m.refs.map((r) => (
              <li key={r}>
                {referencesById[r].citation} {referencesById[r].url && <a className="text-primary-text underline" href={referencesById[r].url} target="_blank" rel="noreferrer">link</a>}
              </li>
            ))}
          </ul>
        </div>
        {mod && <LinkButton variant="outline" href={`#/learn/${mod.id}`}><BookOpen className="h-4 w-4" /> Learn it: Module {mod.n}, {mod.title}</LinkButton>}
      </div>
    </Page>
  );
}

export default function Methods({ id }: { id?: string }) {
  const [q, setQ] = useState('');
  const [fam, setFam] = useState<MethodFamily | 'all'>('all');
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return methods.filter((m) => (fam === 'all' || m.family === fam) && (!s || [m.name, m.aka ?? '', m.data, m.use].join(' ').toLowerCase().includes(s)));
  }, [q, fam]);
  if (id) return <MethodDetail id={id} />;
  return (
    <Page>
      <PageHeader eyebrow="Reference" title="Methods atlas">
        {methods.length} methods, each with when to use it, the assumptions that actually matter, what to report and the usual mistakes. Not sure which you need? Use the <a href="#/finder" className="text-primary-text underline">Test Finder</a>.
      </PageHeader>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search methods</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: paired, count, survival, agreement…" className="h-10 w-full rounded-lg border border-line-strong bg-surface pl-9 pr-3" />
        </label>
        <select value={fam} onChange={(e) => setFam(e.target.value as MethodFamily | 'all')} className="h-10 rounded-lg border border-line-strong bg-surface px-3 text-sm" aria-label="Filter by family">
          <option value="all">All families</option>
          {FAMILIES.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div className="space-y-8">
        {FAMILIES.filter((f) => list.some((m) => m.family === f)).map((f) => (
          <section key={f}>
            <h2 className="mb-3 text-lg font-bold">{f}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.filter((m) => m.family === f).map((m) => (
                <a key={m.id} href={`#/methods/${m.id}`} className="group">
                  <Card className="h-full p-4 transition-colors group-hover:border-primary">
                    <h3 className="font-semibold leading-snug">{m.name}</h3>
                    <p className="mt-1 text-sm text-ink-2">{m.data}</p>
                  </Card>
                </a>
              ))}
            </div>
          </section>
        ))}
        {list.length === 0 && <p className="text-ink-2">No methods match “{q}”.</p>}
      </div>
    </Page>
  );
}
