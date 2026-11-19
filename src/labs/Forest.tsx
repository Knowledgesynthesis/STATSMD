import { useMemo, useState } from 'react';
import { Shuffle } from 'lucide-react';
import { Chart } from '../components/charts';
import { Button, Slider, Stat } from '../components/ui';
import { createRng, metaAnalysis, rnorm } from '../lib/stats';
import { fmt, formatP } from '../lib/utils';
import { Insight, LabGrid, LabShell } from './LabShell';
import type { LabProps } from './registry';

const SES = [0.12, 0.18, 0.22, 0.28, 0.32, 0.38, 0.45, 0.5];
const NAMES = ['Trial A', 'Trial B', 'Trial C', 'Trial D', 'Trial E', 'Trial F', 'Trial G', 'Trial H'];

export default function Forest({ embedded }: LabProps) {
  const [logRR, setLogRR] = useState(Math.log(0.8));
  const [tau, setTau] = useState(0.15);
  const [seed, setSeed] = useState(4);

  const ys = useMemo(() => {
    const rng = createRng(seed * 37);
    const u = SES.map(() => rnorm(rng));
    const e = SES.map(() => rnorm(rng));
    return SES.map((se, i) => logRR + tau * u[i] + se * e[i]);
  }, [logRR, tau, seed]);

  const m = metaAnalysis(ys, SES);
  const rows = NAMES.map((name, i) => ({ name, y: ys[i], lo: ys[i] - 1.96 * SES[i], hi: ys[i] + 1.96 * SES[i], w: m.weightsRandom[i] }));
  const xr: [number, number] = [Math.log(0.15), Math.log(6)];
  const clamp = (v: number) => Math.max(xr[0], Math.min(xr[1], v));
  const K = rows.length;
  const piCrosses = m.random.pi[0] < 0 && m.random.pi[1] > 0;

  return (
    <LabShell id="forest" embedded={embedded}>
      <LabGrid
        controls={
          <>
            <Slider label="True average RR" value={logRR} onChange={setLogRR} min={Math.log(0.4)} max={Math.log(1.3)} step={0.01} format={(v) => fmt(Math.exp(v), 2)} />
            <Slider label="Between-study SD of true log RR (τ)" value={tau} onChange={setTau} min={0} max={0.6} step={0.01} format={(v) => fmt(v, 2)} />
            <Button variant="outline" size="sm" onClick={() => setSeed((s) => s + 1)}>
              <Shuffle className="h-4 w-4" /> New set of trials
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="I²" value={`${fmt(100 * m.I2, 0)}%`} sub={`Q = ${fmt(m.Q, 1)}, ${formatP(m.pQ)}`} />
              <Stat label="τ² (Paule–Mandel)" value={fmt(m.tau2PM, 3)} sub={`true τ² = ${fmt(tau * tau, 3)}`} />
            </div>
          </>
        }
      >
        <Chart
          ariaLabel={`Forest plot of ${K} trials; pooled RR ${fmt(Math.exp(m.random.est))}`}
          x={xr}
          y={[-3.6, K + 0.5]}
          xLog={false}
          xTicks={[0.25, 0.5, 1, 2, 4].map(Math.log)}
          xFormat={(v) => fmt(Math.exp(v), Math.exp(v) < 1 ? 2 : 0)}
          xLabel="Risk ratio (log scale) — left of 1 favours treatment"
          yTicks={[]}
          margin={{ left: 70, right: 16 }}
          height={360}
        >
          {(sx, sy) => {
            const diamond = (est: number, lo: number, hi: number, y: number, color: string) => (
              <path d={`M${sx(clamp(lo))},${sy(y)}L${sx(est)},${sy(y) - 7}L${sx(clamp(hi))},${sy(y)}L${sx(est)},${sy(y) + 7}Z`} fill={color} />
            );
            return (
              <>
                <line x1={sx(0)} x2={sx(0)} y1={sy(K + 0.5)} y2={sy(-3.6)} stroke="var(--axis)" />
                {rows.map((r, i) => {
                  const y = K - i;
                  const size = 4 + 16 * Math.sqrt(r.w);
                  return (
                    <g key={r.name}>
                      <text x={-8} y={sy(y)} dy="0.32em" textAnchor="end" fill="var(--ink-2)" className="text-[11px]">{r.name}</text>
                      <line x1={sx(clamp(r.lo))} x2={sx(clamp(r.hi))} y1={sy(y)} y2={sy(y)} stroke="var(--ink-2)" strokeWidth={1.5} />
                      <rect x={sx(r.y) - size / 2} y={sy(y) - size / 2} width={size} height={size} fill="var(--s1)">
                        <title>{`${r.name}: RR ${fmt(Math.exp(r.y))} (${fmt(Math.exp(r.lo))}–${fmt(Math.exp(r.hi))}), weight ${fmt(100 * r.w, 0)}%`}</title>
                      </rect>
                    </g>
                  );
                })}
                <text x={-8} y={sy(-0.6)} dy="0.32em" textAnchor="end" fill="var(--ink)" className="text-[11px] font-semibold">Common</text>
                {diamond(m.fixed.est, m.fixed.ci[0], m.fixed.ci[1], -0.6, 'var(--muted)')}
                <text x={-8} y={sy(-1.8)} dy="0.32em" textAnchor="end" fill="var(--ink)" className="text-[11px] font-semibold">Random</text>
                {diamond(m.random.est, m.random.ciHK[0], m.random.ciHK[1], -1.8, 'var(--s2)')}
                <text x={-8} y={sy(-3)} dy="0.32em" textAnchor="end" fill="var(--ink)" className="text-[11px] font-semibold">Prediction</text>
                <line x1={sx(clamp(m.random.pi[0]))} x2={sx(clamp(m.random.pi[1]))} y1={sy(-3)} y2={sy(-3)} stroke="var(--s2)" strokeWidth={4} strokeLinecap="round" opacity={0.6} />
              </>
            );
          }}
        </Chart>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Common-effect RR" value={fmt(Math.exp(m.fixed.est))} sub={`${fmt(Math.exp(m.fixed.ci[0]))}–${fmt(Math.exp(m.fixed.ci[1]))}`} />
          <Stat label="Random-effects RR (HK CI)" value={fmt(Math.exp(m.random.est))} sub={`${fmt(Math.exp(m.random.ciHK[0]))}–${fmt(Math.exp(m.random.ciHK[1]))}`} />
          <Stat label="DerSimonian–Laird Wald CI" value={`${fmt(Math.exp(m.randomDL.ci[0]))}–${fmt(Math.exp(m.randomDL.ci[1]))}`} sub="often too narrow" />
          <Stat label="95% prediction interval" value={`${fmt(Math.exp(m.random.pi[0]))}–${fmt(Math.exp(m.random.pi[1]))}`} tone={piCrosses ? 'warn' : undefined} />
        </div>
        <Insight tone={piCrosses ? 'warn' : 'neutral'}>
          {piCrosses
            ? `The average effect is RR ${fmt(Math.exp(m.random.est))}, but the prediction interval (${fmt(Math.exp(m.random.pi[0]))} to ${fmt(Math.exp(m.random.pi[1]))}) crosses 1: in some settings the treatment may not help. I² = ${fmt(100 * m.I2, 0)}% alone would not tell you this.`
            : `Little heterogeneity: the prediction interval (${fmt(Math.exp(m.random.pi[0]))} to ${fmt(Math.exp(m.random.pi[1]))}) stays on one side of 1. Increase τ to see it widen far more than the CI.`}
        </Insight>
      </LabGrid>
    </LabShell>
  );
}
