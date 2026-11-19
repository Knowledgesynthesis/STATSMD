import { useMemo, useState } from 'react';
import { Chart } from '../components/charts';
import { Slider, Stat } from '../components/ui';
import { createRng, mean, pearson, rnorm, sd } from '../lib/stats';
import { fmt } from '../lib/utils';
import { Insight, LabShell } from './LabShell';
import type { LabProps } from './registry';

const N = 120;
const LIMIT = 1.0;

export default function Agreement({ embedded }: LabProps) {
  const [bias, setBias] = useState(0.3);
  const [prop, setProp] = useState(0.05);
  const [noise, setNoise] = useState(0.6);

  const pts = useMemo(() => {
    const rng = createRng(42);
    return Array.from({ length: N }, () => {
      const truth = 12 + 2.2 * rnorm(rng);
      const lab = truth + 0.15 * rnorm(rng);
      const dev = bias + (1 + prop) * truth - prop * 12 + noise * rnorm(rng);
      return { lab, dev };
    });
  }, [bias, prop, noise]);

  const diffs = pts.map((p) => p.dev - p.lab);
  const means = pts.map((p) => (p.dev + p.lab) / 2);
  const b = mean(diffs);
  const s = sd(diffs);
  const lo = b - 1.96 * s;
  const hi = b + 1.96 * s;
  const r = pearson(pts.map((p) => p.lab), pts.map((p) => p.dev));
  const outside = diffs.filter((d) => Math.abs(d) > LIMIT).length;
  const ok = lo >= -LIMIT && hi <= LIMIT;
  const range: [number, number] = [5, 19];
  const dLim = Math.max(2.5, Math.abs(lo) * 1.2, Math.abs(hi) * 1.2);

  return (
    <LabShell id="agreement" embedded={embedded}>
      <div className="grid gap-3 sm:grid-cols-3">
        <Slider label="Systematic bias (g/dL)" value={bias} onChange={setBias} min={-1.5} max={1.5} step={0.05} format={(v) => fmt(v, 2)} />
        <Slider label="Proportional error" value={prop} onChange={setProp} min={-0.2} max={0.2} step={0.01} format={(v) => `${fmt(100 * v, 0)}%`} />
        <Slider label="Random error SD (g/dL)" value={noise} onChange={setNoise} min={0.05} max={1.5} step={0.05} format={(v) => fmt(v, 2)} />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1 text-sm font-medium">Device vs laboratory (line of equality)</div>
          <Chart ariaLabel={`Scatter of device vs laboratory haemoglobin, r = ${fmt(r, 3)}`} x={range} y={range} xLabel="Laboratory Hb (g/dL)" yLabel="Device Hb (g/dL)" height={260}>
            {(sx, sy) => (
              <>
                <line x1={sx(range[0])} y1={sy(range[0])} x2={sx(range[1])} y2={sy(range[1])} stroke="var(--axis)" strokeDasharray="4 3" />
                {pts.map((p, i) => (
                  <circle key={i} cx={sx(p.lab)} cy={sy(Math.min(range[1], Math.max(range[0], p.dev)))} r={3} fill="var(--s1)" opacity={0.7} />
                ))}
              </>
            )}
          </Chart>
        </div>
        <div>
          <div className="mb-1 text-sm font-medium">Bland–Altman plot</div>
          <Chart ariaLabel={`Bland–Altman plot: bias ${fmt(b, 2)}, limits ${fmt(lo, 2)} to ${fmt(hi, 2)}`} x={range} y={[-dLim, dLim]} xLabel="Mean of the two methods (g/dL)" yLabel="Device − lab (g/dL)" height={260}>
            {(sx, sy) => (
              <>
                <rect x={sx(range[0])} width={sx(range[1]) - sx(range[0])} y={sy(LIMIT)} height={sy(-LIMIT) - sy(LIMIT)} fill="var(--good)" opacity={0.08} />
                <line x1={sx(range[0])} x2={sx(range[1])} y1={sy(0)} y2={sy(0)} stroke="var(--axis)" />
                {pts.map((_, i) => (
                  <circle key={i} cx={sx(means[i])} cy={sy(Math.max(-dLim, Math.min(dLim, diffs[i])))} r={3} fill={Math.abs(diffs[i]) > LIMIT ? 'var(--bad)' : 'var(--s1)'} opacity={0.75} />
                ))}
                {[
                  { v: b, label: `bias ${fmt(b, 2)}` },
                  { v: hi, label: `+1.96 SD ${fmt(hi, 2)}` },
                  { v: lo, label: `−1.96 SD ${fmt(lo, 2)}` },
                ].map((l) => (
                  <g key={l.label}>
                    <line x1={sx(range[0])} x2={sx(range[1])} y1={sy(l.v)} y2={sy(l.v)} stroke="var(--s2)" strokeWidth={l.v === b ? 2 : 1.5} strokeDasharray={l.v === b ? undefined : '5 3'} />
                    <text x={sx(range[1]) - 4} y={sy(l.v) - 4} textAnchor="end" fill="var(--ink-2)" className="text-[10px]">{l.label}</text>
                  </g>
                ))}
              </>
            )}
          </Chart>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Pearson r" value={fmt(r, 3)} />
        <Stat label="Bias" value={`${fmt(b, 2)} g/dL`} />
        <Stat label="95% limits of agreement" value={`${fmt(lo, 2)} to ${fmt(hi, 2)}`} tone={ok ? 'good' : 'bad'} />
        <Stat label="Pairs beyond ±1 g/dL" value={`${outside} / ${N}`} />
      </div>
      <div className="mt-3">
        <Insight tone={ok ? 'good' : r > 0.9 ? 'warn' : 'bad'}>
          {ok
            ? 'Limits of agreement fall inside the ±1 g/dL clinical limit (green band): the device could replace the laboratory for this purpose.'
            : r > 0.9
              ? `r = ${fmt(r, 2)} looks excellent, yet individual readings can differ by up to ${fmt(Math.max(Math.abs(lo), Math.abs(hi)), 1)} g/dL — beyond the ±1 g/dL clinical limit. Correlation is not agreement.`
              : 'Both correlation and agreement are poor.'}
        </Insight>
      </div>
    </LabShell>
  );
}
