import { ArrowLeft, BookOpen, FlaskConical } from 'lucide-react';
import { labs, labsById } from '../content/labs';
import { modulesById } from '../content/modules';
import type { LabId } from '../content/types';
import { Card, LinkButton, Page, PageHeader } from '../components/ui';
import { Lab } from '../labs/registry';
import NotFound from './NotFound';

export default function Labs({ id }: { id?: string }) {
  if (id) {
    const meta = labsById[id];
    if (!meta) return <NotFound />;
    const mod = modulesById[meta.module];
    return (
      <Page>
        <a href="#/labs" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-2 hover:text-ink"><ArrowLeft className="h-4 w-4" /> All labs</a>
        <Lab id={id as LabId} />
        {mod && (
          <div className="mt-6">
            <LinkButton variant="outline" href={`#/learn/${mod.id}`}><BookOpen className="h-4 w-4" /> The concepts behind it: Module {mod.n}, {mod.title}</LinkButton>
          </div>
        )}
      </Page>
    );
  }
  return (
    <Page>
      <PageHeader eyebrow="Interactive labs" title="Learn by changing the numbers">
        Each lab runs the real calculation as you move a slider. Statistical routines are unit-tested against R and SciPy reference values.
      </PageHeader>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {labs.map((l) => {
          const mod = modulesById[l.module];
          return (
            <a key={l.id} href={`#/labs/${l.id}`} className="group">
              <Card className="h-full p-5 transition-colors group-hover:border-primary">
                <FlaskConical className="mb-3 h-5 w-5 text-primary-text" aria-hidden />
                <h2 className="font-semibold">{l.title}</h2>
                <p className="mt-1 text-sm text-ink-2">{l.summary}</p>
                {mod && <p className="mt-3 text-xs text-muted">Module {mod.n} · {mod.title}</p>}
              </Card>
            </a>
          );
        })}
      </div>
    </Page>
  );
}
