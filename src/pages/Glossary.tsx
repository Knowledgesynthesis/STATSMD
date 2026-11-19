import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { glossary, glossaryById } from '../content/glossary';
import { modulesById } from '../content/modules';
import { Inline } from '../components/Prose';
import { Page, PageHeader } from '../components/ui';
import { useRoute } from '../lib/router';
import { cn } from '../lib/utils';

export default function Glossary() {
  const { query } = useRoute();
  const target = query.get('t');
  const [q, setQ] = useState('');
  const sorted = useMemo(() => [...glossary].sort((a, b) => a.term.localeCompare(b.term)), []);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? sorted.filter((g) => (g.term + ' ' + g.def).toLowerCase().includes(s)) : sorted;
  }, [q, sorted]);

  useEffect(() => {
    if (!target) return;
    const t = setTimeout(() => document.getElementById(`g-${target}`)?.scrollIntoView({ block: 'center' }), 50);
    return () => clearTimeout(t);
  }, [target]);

  const letters = [...new Set(list.map((g) => g.term[0].toUpperCase()))];

  return (
    <Page className="max-w-4xl">
      <PageHeader eyebrow="Reference" title="Glossary">
        {glossary.length} terms, defined precisely, with the module where each is taught. Terms are also clickable inside lessons.
      </PageHeader>
      <label className="relative mb-4 block">
        <span className="sr-only">Search the glossary</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search terms and definitions…" className="h-11 w-full rounded-lg border border-line-strong bg-surface pl-9 pr-3" />
      </label>
      <nav aria-label="Jump to letter" className="mb-6 flex flex-wrap gap-1 text-sm">
        {letters.map((l) => (
          <button key={l} type="button" onClick={() => document.getElementById(`letter-${l}`)?.scrollIntoView()} className="h-8 w-8 rounded-md text-ink-2 hover:bg-surface-2 hover:text-ink">{l}</button>
        ))}
      </nav>
      <dl className="space-y-3">
        {list.map((g, i) => {
          const first = i === 0 || list[i - 1].term[0].toUpperCase() !== g.term[0].toUpperCase();
          return (
            <div key={g.id} id={first ? `letter-${g.term[0].toUpperCase()}` : undefined} className="scroll-mt-20">
              <div id={`g-${g.id}`} className={cn('scroll-mt-24 rounded-xl border bg-surface p-4', target === g.id ? 'border-primary ring-2 ring-primary/30' : 'border-line')}>
                <dt className="font-semibold">{g.term}</dt>
                <dd className="mt-1 text-ink-2"><Inline text={g.def} /></dd>
                {g.example && <dd className="mt-2 text-sm italic text-ink-2">Example: {g.example}</dd>}
                <dd className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  {g.module && modulesById[g.module] && <a href={`#/learn/${g.module}`} className="font-medium text-primary-text hover:underline">Module {modulesById[g.module].n}</a>}
                  {g.see?.map((s) => (
                    <a key={s} href={`#/glossary?t=${s}`} onClick={() => setQ('')} className="text-ink-2 hover:text-ink hover:underline">→ {glossaryById[s].term}</a>
                  ))}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>
      {list.length === 0 && <p className="text-ink-2">No terms match “{q}”.</p>}
    </Page>
  );
}
