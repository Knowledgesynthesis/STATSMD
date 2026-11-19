import { useState } from 'react';
import { Chart, Legend } from '../components/charts';
import { linePath } from '../components/chart-utils';
import { Slider, Stat } from '../components/ui';
import { fmt, pct } from '../lib/utils';
import { Insight, LabGrid, LabShell } from './LabShell';
import type { LabProps } from './registry';

const riskFromOR = (or: number, p0: number) => (or * p0) / (1 - p0 + or * p0);

export default function OrVsRr({ embedded }: LabProps) {
  const [logOr, setLogOr] = useState(Math.log(2.5));
  const [p0, setP0] = useState(0.05);
  const or = Math.exp(logOr);
  const p1 = riskFromOR(or, p0);
  const rr = p1 / p0;
  const grid = Array.from({ length: 99 }, (_, i) => 0.005 + (i * 0.9) / 98);
  const rrCurve = grid.map((x) => ({ x, y: riskFromOR(or, x) / x }));
  const yMax = Math.max(or, 1 / or, 1.2) * 1.08;
  const yMin = Math.min(or, 1 / or, 0.8) / 1.08;
  const gap = Math.abs(or - rr) / rr;

  return (
    <LabShell id="or-vs-rr" embedded={embedded}>
      <LabGrid
        controls={
          <>
            <Slider label="Odds ratio" value={logOr} onChange={setLogOr} min={Math.log(0.2)} max={Math.log(6)} step={0.01} format={(v) => fmt(Math.exp(v), 2)} />
            <Slider label="Baseline (control) risk" value={p0} onChange={setP0} min={0.005} max={0.9} step={0.005} format={(v) => pct(v, 1)} />
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Risk, exposed" value={pct(p1, 1)} />
              <Stat label="Risk ratio" value={fmt(rr, 2)} />
              <Stat label="Risk difference" value={`${p1 >= p0 ? '+' : '−'}${pct(Math.abs(p1 - p0), 1)}`} />
              <Stat label="OR vs RR" value={`${fmt(100 * gap, 0)}% apart`} tone={gap > 0.2 ? 'warn' : undefined} />
            </div>
          </>
        }
      >
        <Chart ariaLabel={`Risk ratio implied by OR ${fmt(or)} across baseline risks`} x={[0, 0.9]} y={[yMin, yMax]} xLabel="Baseline risk" yLabel="Ratio" xFormat={(v) => `${Math.round(v * 100)}%`} height={260}>
          {(sx, sy) => (
            <>
              <line x1={sx(0)} x2={sx(0.9)} y1={sy(1)} y2={sy(1)} stroke="var(--axis)" />
              <line x1={sx(0)} x2={sx(0.9)} y1={sy(or)} y2={sy(or)} stroke="var(--s2)" strokeWidth={2} strokeDasharray="5 3" />
              <path d={linePath(rrCurve, sx, sy)} fill="none" stroke="var(--s1)" strokeWidth={2} />
              <line x1={sx(p0)} x2={sx(p0)} y1={sy(rr)} y2={sy(or)} stroke="var(--ink-2)" strokeDasharray="2 2" />
              <circle cx={sx(p0)} cy={sy(rr)} r={5} fill="var(--s1)" stroke="var(--surface)" strokeWidth={2} />
            </>
          )}
        </Chart>
        <Legend items={[{ label: `Odds ratio (fixed at ${fmt(or)})`, color: 'var(--s2)', dashed: true }, { label: 'Implied risk ratio', color: 'var(--s1)' }]} />
        <Insight tone={gap > 0.2 ? 'warn' : 'good'}>
          {gap <= 0.1
            ? `At a baseline risk of ${pct(p0, 1)}, OR ${fmt(or)} ≈ RR ${fmt(rr)}: the rare-outcome approximation holds.`
            : `At a baseline risk of ${pct(p0, 0)}, OR ${fmt(or)} corresponds to RR ${fmt(rr)}. Reading this OR as "${fmt(or, 1)} times the risk" would overstate the effect by ${fmt(100 * gap, 0)}%.`}
        </Insight>
      </LabGrid>
    </LabShell>
  );
}
