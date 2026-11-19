import { useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';
import type { Question } from '../content/types';
import { useProgress } from '../lib/progress';
import { cn } from '../lib/utils';
import { Cite, Inline } from './Prose';
import { Badge } from './ui';

/** Stable per-question shuffle so the keyed answer is not always in the same slot. */
function shuffled(q: Question): number[] {
  let h = 2166136261;
  for (const ch of q.id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const idx = q.options.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    const j = h % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

const LEVEL = { 1: 'Core', 2: 'Applied', 3: 'Advanced' } as const;

export function QuestionCard({ q, index, onAnswered }: { q: Question; index?: number; onAnswered?: (correct: boolean) => void }) {
  const order = useMemo(() => shuffled(q), [q]);
  const [picked, setPicked] = useState<number | null>(null);
  const record = useProgress((s) => s.recordAnswer);
  const answered = picked !== null;
  const correct = picked === q.answer;

  const choose = (i: number) => {
    if (answered) return;
    setPicked(i);
    record(q.id, i === q.answer);
    onAnswered?.(i === q.answer);
  };

  return (
    <div className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      <div className="mb-2 flex items-center gap-2 text-xs text-muted">
        {index !== undefined && <span className="font-semibold text-ink-2">Q{index + 1}</span>}
        <Badge>{LEVEL[q.level]}</Badge>
      </div>
      <p className="mb-3 font-medium leading-relaxed"><Inline text={q.stem} /></p>
      <div className="space-y-2" role="radiogroup" aria-label="Answer options">
        {order.map((i, k) => {
          const isKey = i === q.answer;
          const isPicked = i === picked;
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={isPicked}
              disabled={answered}
              onClick={() => choose(i)}
              className={cn(
                'flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                !answered && 'border-line-strong hover:border-primary hover:bg-primary-soft',
                answered && isKey && 'border-good bg-good-soft',
                answered && isPicked && !isKey && 'border-bad bg-bad-soft',
                answered && !isKey && !isPicked && 'border-line opacity-70',
              )}
            >
              <span className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line-strong text-[11px] font-semibold text-ink-2">
                {answered && isKey ? <Check className="h-3.5 w-3.5 text-good-text" /> : answered && isPicked ? <X className="h-3.5 w-3.5 text-bad-text" /> : String.fromCharCode(65 + k)}
              </span>
              <span><Inline text={q.options[i]} /></span>
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={cn('mt-3 rounded-lg p-3 text-sm', correct ? 'bg-good-soft' : 'bg-bad-soft')} aria-live="polite">
          <div className={cn('mb-1 font-semibold', correct ? 'text-good-text' : 'text-bad-text')}>{correct ? 'Correct' : 'Not quite'}</div>
          <p className="leading-relaxed text-ink">
            <Inline text={q.why} />
            {q.refs && q.refs.length > 0 && <Cite ids={q.refs} />}
          </p>
        </div>
      )}
    </div>
  );
}
