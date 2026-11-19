import React from 'react';
import { FlaskConical, Maximize2 } from 'lucide-react';
import { labsById } from '../content/labs';
import { cn } from '../lib/utils';

/** Frame shared by every lab: header, controls column and output column. */
export function LabShell({ id, embedded, children }: { id: string; embedded?: boolean; children: React.ReactNode }) {
  const meta = labsById[id];
  return (
    <section aria-labelledby={`lab-${id}`} className={cn('rounded-xl border border-line-strong bg-surface', embedded ? 'my-2' : '')}>
      <header className="flex items-start justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <div className="mb-0.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary-text">
            <FlaskConical className="h-3.5 w-3.5" aria-hidden /> Interactive lab
          </div>
          <h3 id={`lab-${id}`} className="font-semibold leading-snug">{meta?.title}</h3>
          {!embedded && meta && <p className="mt-0.5 text-sm text-ink-2">{meta.summary}</p>}
        </div>
        {embedded && (
          <a href={`#/labs/${id}`} className="no-print inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-ink-2 hover:bg-surface-2 hover:text-ink" aria-label={`Open ${meta?.title} on its own page`}>
            <Maximize2 className="h-3.5 w-3.5" /> Open
          </a>
        )}
      </header>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

/** Two-column layout: controls (narrow) and output (wide); stacks on mobile. */
export function LabGrid({ controls, children }: { controls: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
      <div className="space-y-4">{controls}</div>
      <div className="min-w-0 space-y-4">{children}</div>
    </div>
  );
}

/** Dynamic one-line teaching point that updates with the controls. */
export function Insight({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'good' | 'bad' | 'warn' }) {
  const cls = {
    neutral: 'border-line bg-surface-2 text-ink',
    good: 'border-good/40 bg-good-soft text-ink',
    bad: 'border-bad/40 bg-bad-soft text-ink',
    warn: 'border-warn/50 bg-warn-soft text-ink',
  }[tone];
  return (
    <p className={cn('rounded-lg border px-3 py-2 text-sm', cls)} aria-live="polite">
      {children}
    </p>
  );
}
