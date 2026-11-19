import { useState } from 'react';
import { Check, RotateCcw, X } from 'lucide-react';
import { Button } from '../components/ui';
import { cn } from '../lib/utils';
import { Insight, LabShell } from './LabShell';
import type { LabProps } from './registry';

type T = 'continuous' | 'binary' | 'nominal' | 'ordinal' | 'count' | 'time';
const TYPES: { id: T; label: string }[] = [
  { id: 'continuous', label: 'Continuous' },
  { id: 'binary', label: 'Binary' },
  { id: 'nominal', label: 'Nominal' },
  { id: 'ordinal', label: 'Ordinal' },
  { id: 'count', label: 'Count' },
  { id: 'time', label: 'Time-to-event' },
];

const ITEMS: { v: string; accept: T[]; why: string }[] = [
  { v: 'Systolic blood pressure (mmHg)', accept: ['continuous'], why: 'A measurement on a continuous scale.' },
  { v: 'Died within 30 days (yes/no), everyone followed for 30 days', accept: ['binary'], why: 'Fixed follow-up for all, so a binary outcome is appropriate.' },
  { v: 'Relapse (yes/no) with follow-up ranging from 2 months to 5 years', accept: ['time'], why: 'Unequal follow-up means a yes/no summary ignores how long people were observed. Analyse time to relapse with censoring.' },
  { v: 'NYHA functional class (I–IV)', accept: ['ordinal'], why: 'Ordered categories with unequal spacing.' },
  { v: 'Number of asthma exacerbations in 12 months', accept: ['count'], why: 'Non-negative integer counts; model as a rate, allowing for overdispersion.' },
  { v: 'Blood group (A, B, AB, O)', accept: ['nominal'], why: 'Unordered categories.' },
  { v: 'Single pain item rated 0–10', accept: ['ordinal', 'continuous'], why: 'Strictly ordinal. With 11 levels it is often analysed as approximately continuous; check the distribution and say what you assumed.' },
  { v: 'BMI category (under / normal / over / obese)', accept: ['ordinal'], why: 'Ordinal — but it is a categorised continuous variable. Analyse BMI itself where possible.' },
  { v: 'Glasgow Coma Scale total (3–15)', accept: ['ordinal'], why: 'An ordinal sum score; equal steps do not mean equal clinical change.' },
  { v: 'Hospital length of stay (days)', accept: ['continuous', 'count'], why: 'Either: a skewed continuous outcome (often log-transformed) or a count of days (negative binomial). It is never normal.' },
  { v: 'Ward of admission (5 wards)', accept: ['nominal'], why: 'Unordered categories — and a clustering variable, since patients on a ward share care.' },
  { v: 'Time from surgery to discharge, some still in hospital at study end', accept: ['time'], why: 'Patients still in hospital are censored; ignoring them biases LOS downwards.' },
];

export default function VariableSorter({ embedded }: LabProps) {
  const [answers, setAnswers] = useState<Record<number, T>>({});
  const done = Object.keys(answers).length;
  const score = ITEMS.filter((it, i) => answers[i] && it.accept.includes(answers[i])).length;
  return (
    <LabShell id="variable-sorter" embedded={embedded}>
      <ol className="space-y-3">
        {ITEMS.map((it, i) => {
          const a = answers[i];
          const ok = a ? it.accept.includes(a) : null;
          return (
            <li key={i} className="rounded-lg border border-line p-3">
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className="text-sm font-medium">{it.v}</span>
                {ok !== null && (ok ? <Check className="h-5 w-5 shrink-0 text-good-text" aria-label="Correct" /> : <X className="h-5 w-5 shrink-0 text-bad-text" aria-label="Incorrect" />)}
              </div>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label={`Type of: ${it.v}`}>
                {TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    disabled={!!a}
                    aria-pressed={a === t.id}
                    onClick={() => setAnswers((s) => ({ ...s, [i]: t.id }))}
                    className={cn(
                      'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                      a === t.id
                        ? ok
                          ? 'border-good bg-good-soft text-good-text'
                          : 'border-bad bg-bad-soft text-bad-text'
                        : a && it.accept.includes(t.id)
                          ? 'border-good/60 text-good-text'
                          : 'border-line-strong text-ink-2 enabled:hover:bg-surface-2',
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              {a && <p className="mt-2 text-xs text-ink-2">{it.why}</p>}
            </li>
          );
        })}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Insight tone={done === ITEMS.length ? (score >= 10 ? 'good' : 'warn') : 'neutral'}>
          {done === 0 ? 'Pick a type for each variable.' : `${score} of ${done} correct so far${done === ITEMS.length ? ` — ${score >= 10 ? 'well done' : 'review the explanations above'}.` : '.'}`}
        </Insight>
        {done > 0 && (
          <Button variant="outline" size="sm" onClick={() => setAnswers({})}>
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        )}
      </div>
    </LabShell>
  );
}
