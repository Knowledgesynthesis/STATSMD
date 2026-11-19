import { useMemo, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Chart } from '../components/charts';
import { Button, Segmented, Slider, Stat } from '../components/ui';
import { createRng, mean, rnormArray, sd, tQuantile } from '../lib/stats';
import { fmt } from '../lib/utils';
import { Insight, LabGrid, LabShell } from './LabShell';
import type { LabProps } from './registry';

const MU = 130;
const SIGMA = 18;
const SHOW = 100;

interface Interval {
  lo: number;
  hi: number;
  est: number;
  hit: boolean;
}

export default function CICoverage({ embedded }: LabProps) {
  const [n, setN] = useState(25);
  const [level, setLevel] = useState<'0.8' | '0.9' | '0.95' | '0.99'>('0.95');
  const [batches, setBatches] = useState(1);
  const [totals, setTotals] = useState({ hit: 0, all: 0 });

  const intervals = useMemo<Interval[]>(() => {
    const rng = createRng(1000 + batches * 7919 + n);
    const q = tQuantile(1 - (1 - Number(level)) / 2, n - 1);
    return Array.from({ length: SHOW }, () => {
      const xs = rnormArray(rng, n, MU, SIGMA);
      const m = mean(xs);
      const h = (q * sd(xs)) / Math.sqrt(n);
      return { est: m, lo: m - h, hi: m + h, hit: m - h <= MU && MU <= m + h };
    });
  }, [n, level, batches]);

  const hits = intervals.filter((i) => i.hit).length;
  const draw = () => {
    setTotals((t) => ({ hit: t.hit + hits, all: t.all + SHOW }));
    setBatches((b) => b + 1);
  };
  const xMin = MU - 30;
  const xMax = MU + 30;
  const avgWidth = intervals.reduce((s, i) => s + (i.hi - i.lo), 0) / SHOW;

  return (
    <LabShell id="ci-coverage" embedded={embedded}>
      <LabGrid
        controls={
          <>
            <Slider label="Sample size per study (n)" value={n} onChange={(v) => { setN(v); setTotals({ hit: 0, all: 0 }); }} min={5} max={200} step={1} />
            <div>
              <div className="mb-1 text-sm font-medium text-ink-2">Confidence level</div>
              <Segmented label="Confidence level" value={level} onChange={(v) => { setLevel(v); setTotals({ hit: 0, all: 0 }); }} options={[{ value: '0.8', label: '80%' }, { value: '0.9', label: '90%' }, { value: '0.95', label: '95%' }, { value: '0.99', label: '99%' }]} />
            </div>
            <div className="flex gap-2">
              <Button onClick={draw}>
                <Play className="h-4 w-4" /> Draw 100 more
              </Button>
              <Button variant="outline" onClick={() => setTotals({ hit: 0, all: 0 })} aria-label="Reset running total">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Captured (this batch)" value={`${hits} / ${SHOW}`} />
              <Stat label="Running coverage" value={totals.all ? `${fmt((100 * totals.hit) / totals.all, 1)}%` : '—'} sub={totals.all ? `${totals.all} intervals` : 'press Draw'} />
              <Stat label="Average CI width" value={`${fmt(avgWidth, 1)} mmHg`} />
              <Stat label="True SD / mean" value={`${SIGMA} / ${MU}`} />
            </div>
          </>
        }
      >
        <Chart ariaLabel={`${SHOW} confidence intervals; ${hits} contain the true mean`} x={[xMin, xMax]} y={[0, SHOW + 1]} xLabel="Mean SBP (mmHg) — dashed line is the true population mean" height={380} yTicks={[]} margin={{ left: 12 }}>
          {(sx, sy) => (
            <>
              {intervals.map((iv, i) => (
                <g key={i}>
                  <line x1={sx(Math.max(xMin, iv.lo))} x2={sx(Math.min(xMax, iv.hi))} y1={sy(i + 1)} y2={sy(i + 1)} stroke={iv.hit ? 'var(--s1)' : 'var(--bad)'} strokeWidth={iv.hit ? 1.5 : 2.5} opacity={iv.hit ? 0.65 : 1} />
                  <circle cx={sx(iv.est)} cy={sy(i + 1)} r={1.6} fill={iv.hit ? 'var(--s1)' : 'var(--bad)'} />
                </g>
              ))}
              <line x1={sx(MU)} x2={sx(MU)} y1={0} y2={sy(0)} stroke="var(--ink)" strokeDasharray="4 3" strokeWidth={1.5} />
            </>
          )}
        </Chart>
        <Insight tone={Math.abs(hits - Number(level) * 100) > 8 ? 'warn' : 'neutral'}>
          {hits} of {SHOW} intervals contain the true mean (red ones miss). The long-run share is {Number(level) * 100}% whatever n is — a larger n makes each interval narrower, not more likely to be right. Any single interval either contains {MU} or it does not.
        </Insight>
      </LabGrid>
    </LabShell>
  );
}
