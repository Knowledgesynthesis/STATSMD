import { useMemo, useState } from 'react';
import { Chart } from '../components/charts';
import { Slider, Stat } from '../components/ui';
import { createRng, mean, rnorm } from '../lib/stats';
import { fmt } from '../lib/utils';
import { Insight, LabGrid, LabShell } from './LabShell';
import type { LabProps } from './registry';

const N = 1500;
const MU = 140;
const SD_TRUE = 14;

export default function RegressionToMean({ embedded }: LabProps) {
  const [noise, setNoise] = useState(9);
  const [cut, setCut] = useState(160);

  const people = useMemo(() => {
    const rng = createRng(77);
    return Array.from({ length: N }, () => {
      const t = MU + SD_TRUE * rnorm(rng);
      return { first: t + noise * rnorm(rng), second: t + noise * rnorm(rng) };
    });
  }, [noise]);

  const sel = people.filter((p) => p.first > cut);
  const m1 = sel.length ? mean(sel.map((p) => p.first)) : NaN;
  const m2 = sel.length ? mean(sel.map((p) => p.second)) : NaN;
  const reliability = SD_TRUE ** 2 / (SD_TRUE ** 2 + noise ** 2);
  const R: [number, number] = [90, 200];

  return (
    <LabShell id="rtm" embedded={embedded}>
      <LabGrid
        controls={
          <>
            <Slider label="Enrolment threshold (first SBP >)" value={cut} onChange={setCut} min={140} max={185} format={(v) => `${v} mmHg`} />
            <Slider label="Measurement variability (SD)" value={noise} onChange={setNoise} min={0} max={20} step={0.5} format={(v) => `${v} mmHg`} hint="Within-person variation: device error plus day-to-day fluctuation" />
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Enrolled" value={sel.length} sub={`of ${N}`} />
              <Stat label="Reliability" value={fmt(reliability, 2)} sub="true var / total var" />
              <Stat label="Mean at enrolment" value={Number.isFinite(m1) ? fmt(m1, 1) : '—'} />
              <Stat label="Mean at re-test (no treatment)" value={Number.isFinite(m2) ? fmt(m2, 1) : '—'} tone="good" />
            </div>
          </>
        }
      >
        <Chart ariaLabel="First vs second SBP measurement" x={R} y={R} xLabel="First SBP (mmHg)" yLabel="Second SBP (mmHg)" height={300}>
          {(sx, sy) => (
            <>
              <rect x={sx(cut)} y={0} width={sx(R[1]) - sx(cut)} height={sy(R[0])} fill="var(--s2)" opacity={0.07} />
              <line x1={sx(R[0])} y1={sy(R[0])} x2={sx(R[1])} y2={sy(R[1])} stroke="var(--axis)" strokeDasharray="4 3" />
              {people.map((p, i) => (
                <circle key={i} cx={sx(Math.min(R[1], Math.max(R[0], p.first)))} cy={sy(Math.min(R[1], Math.max(R[0], p.second)))} r={p.first > cut ? 2.4 : 1.6} fill={p.first > cut ? 'var(--s2)' : 'var(--muted)'} opacity={p.first > cut ? 0.8 : 0.3} />
              ))}
              <line x1={sx(cut)} x2={sx(cut)} y1={0} y2={sy(R[0])} stroke="var(--s2)" strokeWidth={1.5} />
            </>
          )}
        </Chart>
        <Insight tone={noise > 0 && sel.length > 0 ? 'warn' : 'neutral'}>
          {noise === 0
            ? 'With no measurement variability, re-measured values equal the first ones: no regression to the mean.'
            : sel.length === 0
              ? 'Nobody exceeds this threshold.'
              : `Enrolled patients "improved" by ${fmt(m1 - m2, 1)} mmHg with no treatment at all. The fall grows as the threshold rises and as measurement variability increases. Only a randomised control group separates this from a real effect.`}
        </Insight>
      </LabGrid>
    </LabShell>
  );
}
