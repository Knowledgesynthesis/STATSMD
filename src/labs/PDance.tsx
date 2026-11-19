import { useMemo, useState } from 'react';
import { Play } from 'lucide-react';
import { Chart } from '../components/charts';
import { Button, Slider, Stat } from '../components/ui';
import { createRng, powerTwoMeans, rnormArray, sValue, tTest } from '../lib/stats';
import { fmt, formatP, pValue } from '../lib/utils';
import { Insight, LabGrid, LabShell } from './LabShell';
import type { LabProps } from './registry';

const REPS = 20;

export default function PDance({ embedded }: LabProps) {
  const [delta, setDelta] = useState(0.5);
  const [n, setN] = useState(32);
  const [seed, setSeed] = useState(11);

  const runs = useMemo(() => {
    const rng = createRng(seed * 131 + n);
    return Array.from({ length: REPS }, () => {
      const a = rnormArray(rng, n, delta, 1);
      const b = rnormArray(rng, n, 0, 1);
      return tTest(a, b);
    });
  }, [delta, n, seed]);

  const sig = runs.filter((r) => r.p < 0.05).length;
  const ps = runs.map((r) => r.p);
  const power = powerTwoMeans({ delta: Math.max(delta, 1e-6), sd: 1, n1: n });
  const lim = Math.max(1.2, ...runs.map((r) => Math.max(Math.abs(r.ci[0]), Math.abs(r.ci[1])))) * 1.05;

  return (
    <LabShell id="p-dance" embedded={embedded}>
      <LabGrid
        controls={
          <>
            <Slider label="True effect (in SD units)" value={delta} onChange={setDelta} min={0} max={1.2} step={0.05} format={(v) => v.toFixed(2)} hint="0 = the null hypothesis is true" />
            <Slider label="Patients per group" value={n} onChange={setN} min={8} max={200} />
            <Button onClick={() => setSeed((s) => s + 1)}>
              <Play className="h-4 w-4" /> Replicate 20 more times
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="p < 0.05" value={`${sig} / ${REPS}`} />
              <Stat label="True power" value={delta === 0 ? '— (α = 5%)' : `${fmt(100 * power, 0)}%`} />
              <Stat label="Smallest p" value={pValue(Math.min(...ps))} />
              <Stat label="Largest p" value={pValue(Math.max(...ps))} />
            </div>
          </>
        }
      >
        <Chart ariaLabel={`Twenty replications, ${sig} significant`} x={[-lim, lim]} y={[0, REPS + 1]} xLabel="Estimated mean difference with 95% CI (SD units)" height={360} yTicks={[]} margin={{ left: 12, right: 92 }}>
          {(sx, sy, { iw }) => (
            <>
              <line x1={sx(0)} x2={sx(0)} y1={0} y2={sy(0)} stroke="var(--axis)" />
              {delta > 0 && <line x1={sx(delta)} x2={sx(delta)} y1={0} y2={sy(0)} stroke="var(--ink)" strokeDasharray="4 3" />}
              {runs.map((r, i) => {
                const s = r.p < 0.05;
                const y = sy(REPS - i);
                return (
                  <g key={i}>
                    <line x1={sx(Math.max(-lim, r.ci[0]))} x2={sx(Math.min(lim, r.ci[1]))} y1={y} y2={y} stroke={s ? 'var(--s1)' : 'var(--muted)'} strokeWidth={2} />
                    <circle cx={sx(r.diff)} cy={y} r={3.5} fill={s ? 'var(--s1)' : 'var(--muted)'} />
                    <text x={iw + 8} y={y} dy="0.32em" className="tabular text-[11px]" fill={s ? 'var(--ink)' : 'var(--muted)'} fontWeight={s ? 600 : 400}>
                      {formatP(r.p)}
                    </text>
                  </g>
                );
              })}
            </>
          )}
        </Chart>
        <Insight tone={delta === 0 ? 'warn' : 'neutral'}>
          {delta === 0
            ? `No true effect: about 1 in 20 replications is "significant" anyway (${sig} here). Those are false positives.`
            : `Same truth every time, yet p ranged from ${pValue(Math.min(...ps))} to ${pValue(Math.max(...ps))} (S-values ${fmt(sValue(Math.max(...ps)), 1)}–${fmt(sValue(Math.min(...ps)), 1)} bits). With ${fmt(100 * power, 0)}% power, roughly ${fmt(100 - 100 * power, 0)}% of replications will "fail" — the CIs keep overlapping the true effect.`}
        </Insight>
      </LabGrid>
    </LabShell>
  );
}
