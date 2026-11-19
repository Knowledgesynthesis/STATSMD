import { useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { references } from '../content/references';
import { Page, PageHeader } from '../components/ui';
import { useRoute } from '../lib/router';
import { cn } from '../lib/utils';

export default function References() {
  const { query } = useRoute();
  const target = query.get('r');
  useEffect(() => {
    if (!target) return;
    const t = setTimeout(() => document.getElementById(`r-${target}`)?.scrollIntoView({ block: 'center' }), 50);
    return () => clearTimeout(t);
  }, [target]);
  const sorted = [...references].sort((a, b) => a.citation.localeCompare(b.citation));
  return (
    <Page className="max-w-4xl">
      <PageHeader eyebrow="Evidence base" title="References">
        Every statement in the course is traceable to one of these {references.length} sources: reporting guidelines, regulatory guidance, methodological papers and standard texts. DOIs are checked against Crossref.
      </PageHeader>
      <ol className="space-y-2">
        {sorted.map((r) => (
          <li key={r.id} id={`r-${r.id}`} className={cn('scroll-mt-24 rounded-lg border bg-surface p-3 text-sm', target === r.id ? 'border-primary ring-2 ring-primary/30' : 'border-line')}>
            <div className="flex items-start justify-between gap-3">
              <span>
                <span className="mr-2 font-semibold text-ink">{r.short}</span>
                <span className="text-ink-2">{r.citation}</span>
                {r.note && <span className="mt-1 block text-xs text-muted">{r.note}</span>}
              </span>
              {r.url && (
                <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary-text hover:underline" aria-label={`Open ${r.short}`}>
                  Open <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Page>
  );
}
