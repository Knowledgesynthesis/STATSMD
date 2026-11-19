import { useState } from 'react';
import { Chart } from '../components/charts';
import { linePath } from '../components/chart-utils';
import { Slider, Stat } from '../components/ui';
import { fmt, pct } from '../lib/utils';
import { Insight, LabGrid, LabShell } from './LabShell';
import type { LabProps } from './registry';

const SETTINGS = [
  { label: 'Population screening', prev: 0.005 },
  { label: 'Primary care', prev: 0.05 },
  { label: 'Emergency department', prev: 0.2 },
  { label: 'Specialist clinic', prev: 0.5 },
];

const COLORS = { tp: 'var(--s1)', fn: 'var(--bad)', fp: 'var(--s2)', tn: 'var(--surface-2)' };

export default function Diagnostic({ embedded }: LabProps) {
  const [sens, setSens] = useState(0.9);
  const [spec, setSpec] = useState(0.9);
  const [logPrev, setLogPrev] = useState(Math.log10(0.05));
  const prev = 10 ** logPrev;

  const tp = sens * prev;
  const fn = (1 - sens) * prev;
  const fp = (1 - spec) * (1 - prev);
  const tn = spec * (1 - prev);
  const ppv = tp / (tp + fp);
  const npv = tn / (tn + fn);
  const lrPos = sens / (1 - spec);
  const lrNeg = (1 - sens) / spec;

  // Natural-frequency grid of 1,000 people
  const per = 1000;
  const counts = { tp: Math.round(tp * per), fn: Math.round(fn * per), fp: Math.round(fp * per) };
  const cells: (keyof typeof COLORS)[] = [
    ...Array(counts.tp).fill('tp'),
    ...Array(counts.fn).fill('fn'),
    ...Array(counts.fp).fill('fp'),
  ];
  while (cells.length < per) cells.push('tn');
  cells.length = per;

  const curve = Array.from({ length: 120 }, (_, i) => {
    const p = 10 ** (-3 + (i * 3) / 119);
    const a = sens * p;
    const b = (1 - spec) * (1 - p);
    return { x: p, y: a / (a + b) };
  });

  return (
    <LabShell id="diagnostic" embedded={embedded}>
      <LabGrid
        controls={
          <>
            <Slider label="Sensitivity" value={sens} onChange={setSens} min={0.5} max={0.995} step={0.005} format={(v) => pct(v, 1)} />
            <Slider label="Specificity" value={spec} onChange={setSpec} min={0.5} max={0.995} step={0.005} format={(v) => pct(v, 1)} />
            <Slider label="Prevalence (pre-test probability)" value={logPrev} onChange={setLogPrev} min={-3} max={Math.log10(0.6)} step={0.01} format={(v) => pct(10 ** v, 10 ** v < 0.01 ? 2 : 1)} />
            <div className="flex flex-wrap gap-1">
              {SETTINGS.map((s) => (
                <button key={s.label} type="button" onClick={() => setLogPrev(Math.log10(s.prev))} className="rounded-md border border-line-strong px-2 py-1 text-xs text-ink-2 hover:bg-surface-2">
                  {s.label} ({pct(s.prev, s.prev < 0.01 ? 1 : 0)})
                </button>
              ))}
            </div>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="PPV" value={pct(ppv, 1)} tone={ppv < 0.5 ? 'warn' : undefined} sub="P(disease | positive)" />
          <Stat label="NPV" value={pct(npv, 2)} sub="P(no disease | negative)" />
          <Stat label="LR+" value={fmt(lrPos, 1)} sub={lrPos >= 10 ? 'strong rule-in' : lrPos >= 5 ? 'moderate' : 'weak'} />
          <Stat label="LR−" value={fmt(lrNeg, 2)} sub={lrNeg <= 0.1 ? 'strong rule-out' : lrNeg <= 0.2 ? 'moderate' : 'weak'} />
        </div>
        <div className="grid gap-4 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
          <div>
            <div className="mb-1 text-sm font-medium">1,000 people tested</div>
            <svg viewBox="0 0 400 250" className="w-full" role="img" aria-label={`Of 1000 people: ${counts.tp} true positives, ${counts.fp} false positives, ${counts.fn} false negatives`}>
              {cells.map((c, i) => (
                <rect key={i} x={(i % 40) * 10 + 0.75} y={Math.floor(i / 40) * 10 + 0.75} width={8.5} height={8.5} rx={1.5} fill={COLORS[c]} />
              ))}
            </svg>
            <ul className="mt-2 grid grid-cols-2 gap-1 text-xs text-ink-2">
              <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm" style={{ background: COLORS.tp }} />True positive {counts.tp}</li>
              <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm" style={{ background: COLORS.fp }} />False positive {counts.fp}</li>
              <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm" style={{ background: COLORS.fn }} />False negative {counts.fn}</li>
              <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-line-strong" style={{ background: COLORS.tn }} />True negative {per - counts.tp - counts.fp - counts.fn}</li>
            </ul>
          </div>
          <div>
            <div className="mb-1 text-sm font-medium">PPV across prevalence</div>
            <Chart ariaLabel="PPV as a function of prevalence" x={[0.001, 1]} xLog y={[0, 1]} xTicks={[0.001, 0.01, 0.1, 1]} xFormat={(v) => pct(v, v < 0.01 ? 1 : 0)} yFormat={(v) => `${Math.round(v * 100)}%`} xLabel="Prevalence (log scale)" yLabel="PPV" height={230}>
              {(sx, sy) => (
                <>
                  <path d={linePath(curve, sx, sy)} fill="none" stroke="var(--s1)" strokeWidth={2} />
                  <circle cx={sx(prev)} cy={sy(ppv)} r={5} fill="var(--s1)" stroke="var(--surface)" strokeWidth={2} />
                </>
              )}
            </Chart>
          </div>
        </div>
        <Insight tone={ppv < 0.5 ? 'warn' : 'neutral'}>
          {`At ${pct(prev, prev < 0.01 ? 2 : 1)} prevalence, ${counts.tp + counts.fp > 0 ? `${counts.fp} of every ${counts.tp + counts.fp} positives are false` : 'almost no one tests positive'}. A positive result raises the probability from ${pct(prev, 1)} to ${pct(ppv, 1)}; a negative lowers it to ${pct(1 - npv, 2)}. Post-test odds = pre-test odds × LR.`}
        </Insight>
      </LabGrid>
    </LabShell>
  );
}
