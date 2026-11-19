import { useMemo, useState } from 'react';
import { Chart, Legend, Readout } from '../components/charts';
import { stepPath } from '../components/chart-utils';
import { Segmented, Slider, Stat } from '../components/ui';
import { kaplanMeier, logRank, rmst, type KMStep, type SurvivalObs } from '../lib/stats';
import { fmt, formatP, pct } from '../lib/utils';
import { Insight, LabShell } from './LabShell';
import type { LabProps } from './registry';

// Freireich et al. (1963) remission data, as analysed by Gehan (1965): weeks in remission.
const MP_T = [6, 6, 6, 6, 7, 9, 10, 10, 11, 13, 16, 17, 19, 20, 22, 23, 25, 32, 32, 34, 35];
const MP_E = [1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0];
const PL_T = [1, 1, 2, 2, 3, 4, 4, 5, 5, 8, 8, 8, 8, 11, 11, 12, 12, 15, 17, 22, 23];

type Handling = 'correct' | 'as-events' | 'dropped';

const mp: SurvivalObs[] = MP_T.map((time, i) => ({ time, event: MP_E[i] as 0 | 1 }));
const pl: SurvivalObs[] = PL_T.map((time) => ({ time, event: 1 }));

function apply(data: SurvivalObs[], h: Handling): SurvivalObs[] {
  if (h === 'as-events') return data.map((d) => ({ ...d, event: 1 }));
  if (h === 'dropped') return data.filter((d) => d.event === 1);
  return data;
}

const at = (steps: KMStep[], t: number) => {
  let s = steps[0];
  for (const st of steps) if (st.time <= t) s = st;
  return s;
};

export default function KaplanMeier({ embedded }: LabProps) {
  const [handling, setHandling] = useState<Handling>('correct');
  const [tau, setTau] = useState(23);
  const [hover, setHover] = useState<number | null>(null);

  const g1 = useMemo(() => apply(mp, handling), [handling]);
  const km1 = useMemo(() => kaplanMeier(g1), [g1]);
  const km0 = useMemo(() => kaplanMeier(pl), []);
  const correct = useMemo(() => kaplanMeier(mp), []);
  const lr = logRank(g1, pl);
  const r1 = rmst(km1.steps, tau);
  const r0 = rmst(km0.steps, tau);
  const T = 36;
  const ticks = handling === 'correct' ? mp.filter((d) => d.event === 0) : [];
  const riskTimes = [0, 5, 10, 15, 20, 25, 30, 35];
  const nAtRisk = (data: SurvivalObs[], t: number) => data.filter((d) => d.time >= t).length;
  const band = km1.steps.flatMap((s, i) => {
    const next = km1.steps[i + 1]?.time ?? T;
    return [{ x: s.time, lo: s.lower, hi: s.upper }, { x: next, lo: s.lower, hi: s.upper }];
  });

  return (
    <LabShell id="km" embedded={embedded}>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <Segmented
          label="How censored patients are handled"
          value={handling}
          onChange={setHandling}
          options={[
            { value: 'correct', label: 'Kaplan–Meier (correct)' },
            { value: 'as-events', label: 'Count censored as relapses' },
            { value: 'dropped', label: 'Drop censored patients' },
          ]}
        />
      </div>
      <Chart ariaLabel="Kaplan–Meier curves for 6-MP and placebo" x={[0, T]} y={[0, 1]} xLabel="Weeks since randomisation" yLabel="In remission" yFormat={(v) => `${Math.round(v * 100)}%`} height={360} margin={{ bottom: 104, left: 58 }} onHoverX={setHover} hoverX={hover}>
        {(sx, sy, { ih }) => (
          <>
            <text x={-50} y={ih + 64} fill="var(--ink-2)" className="text-[11px] font-medium">At risk</text>
            {[{ label: '6-MP', data: g1, color: 'var(--s1)' }, { label: 'Placebo', data: pl, color: 'var(--s2)' }].map((row, ri) => (
              <g key={row.label}>
                <text x={-50} y={ih + 82 + ri * 16} fill={row.color} className="text-[11px] font-semibold">{row.label}</text>
                {riskTimes.map((t) => (
                  <text key={t} x={sx(t)} y={ih + 82 + ri * 16} textAnchor="middle" fill="var(--ink-2)" className="tabular text-[11px]">{nAtRisk(row.data, t)}</text>
                ))}
              </g>
            ))}
            {handling === 'correct' && (
              <path d={`M${band.map((b) => `${sx(b.x)},${sy(b.hi)}`).join('L')}L${[...band].reverse().map((b) => `${sx(b.x)},${sy(b.lo)}`).join('L')}Z`} fill="var(--s1)" opacity={0.12} />
            )}
            <line x1={0} x2={sx(T)} y1={sy(0.5)} y2={sy(0.5)} stroke="var(--axis)" strokeDasharray="3 3" />
            {handling !== 'correct' && <path d={stepPath(correct.steps.map((s) => ({ x: s.time, y: s.survival })), sx, sy, T)} fill="none" stroke="var(--s1)" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.6} />}
            <path d={stepPath(km0.steps.map((s) => ({ x: s.time, y: s.survival })), sx, sy, 23)} fill="none" stroke="var(--s2)" strokeWidth={2.5} />
            <path d={stepPath(km1.steps.map((s) => ({ x: s.time, y: s.survival })), sx, sy, handling === 'correct' ? 35 : Math.max(...g1.map((d) => d.time)))} fill="none" stroke="var(--s1)" strokeWidth={2.5} />
            {ticks.map((d, i) => (
              <line key={i} x1={sx(d.time)} x2={sx(d.time)} y1={sy(at(km1.steps, d.time).survival) - 5} y2={sy(at(km1.steps, d.time).survival) + 5} stroke="var(--s1)" strokeWidth={2} />
            ))}
            <line x1={sx(tau)} x2={sx(tau)} y1={0} y2={sy(0)} stroke="var(--s3)" strokeDasharray="2 3" />
          </>
        )}
      </Chart>
      <Legend items={[{ label: '6-MP (n = 21; ticks = censored)', color: 'var(--s1)' }, { label: 'Placebo (n = 21)', color: 'var(--s2)' }, ...(handling !== 'correct' ? [{ label: 'Correct KM for 6-MP', color: 'var(--s1)', dashed: true }] : []), { label: `RMST horizon τ = ${tau}`, color: 'var(--s3)', dashed: true }]} />
      <Readout>
        {hover != null
          ? `Week ${Math.round(hover)}: 6-MP ${pct(at(km1.steps, hover).survival, 0)}${handling === 'correct' ? ` (95% CI ${pct(at(km1.steps, hover).lower, 0)}–${pct(at(km1.steps, hover).upper, 0)})` : ''}, placebo ${pct(at(km0.steps, hover).survival, 0)}`
          : 'Hover the plot to read survival at any week.'}
      </Readout>
      <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Median, 6-MP" value={km1.median != null ? `${km1.median} wk` : 'not reached'} />
          <Stat label="Median, placebo" value={`${km0.median} wk`} />
          <Stat label="Log-rank" value={`χ² ${fmt(lr.statistic, 1)}`} sub={formatP(lr.p)} />
          <Stat label={`RMST difference to ${tau} wk`} value={`${fmt(r1 - r0, 1)} wk`} sub={`${fmt(r1, 1)} vs ${fmt(r0, 1)}`} />
        </div>
        <Slider label="RMST horizon τ (weeks)" value={tau} onChange={setTau} min={5} max={23} hint="Limited to 23 weeks: the last placebo patient relapsed then" />
      </div>
      <div className="mt-3">
        <Insight tone={handling === 'correct' ? 'good' : 'bad'}>
          {handling === 'correct'
            ? `Censored patients (ticks) count as "at risk" until they leave, then drop out without a step. Over the first ${tau} weeks, 6-MP patients averaged ${fmt(r1 - r0, 1)} more weeks in remission.`
            : handling === 'as-events'
              ? 'Treating censored patients as relapses invents events and drags the 6-MP curve down — the effect is underestimated.'
              : 'Dropping censored patients discards the people who did best, so the curve falls too fast. Both mistakes bias the comparison.'}
        </Insight>
      </div>
    </LabShell>
  );
}
