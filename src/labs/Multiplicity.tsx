import { useMemo, useState } from 'react';
import { Play } from 'lucide-react';
import { Chart } from '../components/charts';
import { Button, Slider, Stat } from '../components/ui';
import { createRng, normalQuantile, normalSf, pAdjust, rnorm, type AdjustMethod } from '../lib/stats';
import { fmt, pct } from '../lib/utils';
import { Insight, LabShell } from './LabShell';
import type { LabProps } from './registry';

const M = 20;
const METHODS: { id: 'none' | AdjustMethod; label: string }[] = [
  { id: 'none', label: 'Unadjusted' },
  { id: 'bonferroni', label: 'Bonferroni' },
  { id: 'holm', label: 'Holm' },
  { id: 'bh', label: 'Benjamini–Hochberg' },
];

function study(rng: () => number, k: number, ncp: number) {
  return Array.from({ length: M }, (_, i) => {
    const real = i < k;
    const z = rnorm(rng) + (real ? ncp : 0);
    return { real, p: 2 * normalSf(Math.abs(z)) };
  });
}

function decide(ps: number[], m: 'none' | AdjustMethod) {
  const adj = m === 'none' ? ps : pAdjust(ps, m);
  return adj.map((p) => p < 0.05);
}

export default function Multiplicity({ embedded }: LabProps) {
  const [k, setK] = useState(4);
  const [power, setPower] = useState(0.8);
  const [seed, setSeed] = useState(1);
  // Non-centrality giving the chosen per-test power for a two-sided z-test at α = 0.05
  const ncp = normalQuantile(0.975) + normalQuantile(power);

  const one = useMemo(() => study(createRng(seed), k, ncp), [seed, k, ncp]);
  const sim = useMemo(() => {
    const rng = createRng(99 + k * 7);
    const out = Object.fromEntries(METHODS.map((m) => [m.id, { anyFalse: 0, fdp: 0, tp: 0 }]));
    const R = 1000;
    for (let r = 0; r < R; r++) {
      const s = study(rng, k, ncp);
      const ps = s.map((x) => x.p);
      for (const m of METHODS) {
        const rej = decide(ps, m.id);
        const fp = rej.filter((v, i) => v && !s[i].real).length;
        const tp = rej.filter((v, i) => v && s[i].real).length;
        const o = out[m.id];
        if (fp > 0) o.anyFalse++;
        o.fdp += fp + tp > 0 ? fp / (fp + tp) : 0;
        o.tp += k ? tp / k : 0;
      }
    }
    return Object.fromEntries(Object.entries(out).map(([id, o]) => [id, { fwer: o.anyFalse / R, fdr: o.fdp / R, power: o.tp / R }]));
  }, [k, ncp]);

  const ps = one.map((x) => x.p);
  const sorted = one.map((x, i) => ({ ...x, i })).sort((a, b) => a.p - b.p);
  const rejections = Object.fromEntries(METHODS.map((m) => [m.id, decide(ps, m.id)]));

  return (
    <LabShell id="multiplicity" embedded={embedded}>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Slider label="Real effects among the 20 tests" value={k} onChange={setK} min={0} max={20} />
        <Slider label="Power of each test" value={power} onChange={setPower} min={0.2} max={0.95} step={0.05} format={(v) => pct(v, 0)} />
        <Button onClick={() => setSeed((s) => s + 1)}>
          <Play className="h-4 w-4" /> New study
        </Button>
      </div>
      <div className="mt-4">
        <div className="mb-1 text-sm font-medium">This study: 20 p-values, sorted (log scale)</div>
        <Chart ariaLabel="Sorted p-values with thresholds" x={[0.5, M + 0.5]} y={[-4, 0]} xTicks={[1, 5, 10, 15, 20]} yTicks={[-4, -3, -2, -1, 0]} yFormat={(v) => (v === 0 ? '1' : `1e${v}`)} xLabel="Rank of p-value" yLabel="p" height={240}>
          {(sx, sy) => (
            <>
              <line x1={sx(0.5)} x2={sx(M + 0.5)} y1={sy(Math.log10(0.05))} y2={sy(Math.log10(0.05))} stroke="var(--muted)" strokeDasharray="4 3" />
              <line x1={sx(0.5)} x2={sx(M + 0.5)} y1={sy(Math.log10(0.05 / M))} y2={sy(Math.log10(0.05 / M))} stroke="var(--bad)" strokeDasharray="4 3" />
              <path d={Array.from({ length: M }, (_, r) => `${r ? 'L' : 'M'}${sx(r + 0.5)},${sy(Math.log10((0.05 * (r + 1)) / M))}H${sx(r + 1.5)}`).join('')} fill="none" stroke="var(--s3)" strokeWidth={1.5} />
              {sorted.map((x, r) => (
                <circle key={x.i} cx={sx(r + 1)} cy={sy(Math.max(-4, Math.log10(x.p)))} r={5.5} fill={x.real ? 'var(--s1)' : 'var(--surface)'} stroke={x.real ? 'var(--s1)' : 'var(--ink-2)'} strokeWidth={2}>
                  <title>{`${x.real ? 'real effect' : 'null'}: p = ${x.p.toPrecision(2)}`}</title>
                </circle>
              ))}
            </>
          )}
        </Chart>
        <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2">
          <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full" style={{ background: 'var(--s1)' }} />Real effect</li>
          <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full border-2" style={{ borderColor: 'var(--ink-2)' }} />True null</li>
          <li>Grey dashed: 0.05 · Red dashed: Bonferroni 0.05/20 · Green steps: BH thresholds 0.05·rank/20</li>
        </ul>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="tabular w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-ink-2">
              <th className="py-1.5 font-medium">Method</th>
              <th className="font-medium">This study: true / false positives</th>
              <th className="font-medium">FWER*</th>
              <th className="font-medium">FDR*</th>
              <th className="font-medium">Power*</th>
            </tr>
          </thead>
          <tbody>
            {METHODS.map((m) => {
              const rej = rejections[m.id];
              const tp = rej.filter((v, i) => v && one[i].real).length;
              const fp = rej.filter((v, i) => v && !one[i].real).length;
              const s = sim[m.id];
              return (
                <tr key={m.id} className="border-b border-line">
                  <td className="py-1.5 font-medium">{m.label}</td>
                  <td>
                    <span className="text-good-text">{tp}</span> / <span className={fp ? 'font-semibold text-bad-text' : ''}>{fp}</span>
                  </td>
                  <td className={m.id === 'none' && s.fwer > 0.06 ? 'text-bad-text' : ''}>{pct(s.fwer, 0)}{m.id === 'bh' && <span className="ml-1 text-xs text-muted">(controls FDR, not FWER)</span>}</td>
                  <td>{pct(s.fdr, 1)}</td>
                  <td>{k ? pct(s.power, 0) : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-1 text-xs text-muted">* Long-run rates over 1,000 simulated studies with these settings.</p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat label="P(≥ 1 false positive), unadjusted" value={pct(sim.none.fwer, 0)} tone="bad" sub={k === 0 ? `theory: 1 − 0.95²⁰ = ${pct(1 - 0.95 ** 20, 0)}` : undefined} />
        <Stat label="Holm vs Bonferroni power" value={k ? `${pct(sim.holm.power, 0)} vs ${pct(sim.bonferroni.power, 0)}` : '—'} />
        <Stat label="BH power" value={k ? pct(sim.bh.power, 0) : '—'} sub={`FDR ${fmt(100 * sim.bh.fdr, 1)}%`} />
      </div>
      <div className="mt-3">
        <Insight tone={sim.none.fwer > 0.2 ? 'warn' : 'neutral'}>
          {`Unadjusted testing produces at least one false positive in ${pct(sim.none.fwer, 0)} of studies. Holm controls this at 5% and is never less powerful than Bonferroni; Benjamini–Hochberg accepts a controlled share of false discoveries in exchange for more power — suited to screening, not confirmatory claims.`}
        </Insight>
      </div>
    </LabShell>
  );
}

