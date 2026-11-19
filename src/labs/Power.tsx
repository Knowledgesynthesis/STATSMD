import { useState } from 'react';
import { Chart, Legend, Readout } from '../components/charts';
import { linePath, type Scale } from '../components/chart-utils';
import { NumberField, Segmented, Slider, Stat } from '../components/ui';
import {
  inflateForDropout,
  normalPdf,
  normalQuantile,
  powerTwoMeans,
  powerTwoProportions,
  sampleSizeTwoMeans,
  sampleSizeTwoProportions,
} from '../lib/stats';
import { fmt, pct } from '../lib/utils';
import { Insight, LabGrid, LabShell } from './LabShell';
import type { LabProps } from './registry';

export default function Power({ embedded }: LabProps) {
  const [mode, setMode] = useState<'means' | 'props'>('means');
  const [delta, setDelta] = useState(5);
  const [sdv, setSd] = useState(12);
  const [p1, setP1] = useState(0.2);
  const [p2, setP2] = useState(0.14);
  const [alpha, setAlpha] = useState<'0.05' | '0.01' | '0.005'>('0.05');
  const [target, setTarget] = useState(0.9);
  const [dropout, setDropout] = useState(0.1);
  const [hover, setHover] = useState<number | null>(null);

  const a = Number(alpha);
  const ss = mode === 'means' ? sampleSizeTwoMeans({ delta, sd: sdv, alpha: a, power: target }) : sampleSizeTwoProportions({ p1, p2, alpha: a, power: target });
  const nPer = ss.n1;
  const nRecruit = inflateForDropout(nPer, dropout);
  const powerAt = (n: number) => (mode === 'means' ? powerTwoMeans({ delta, sd: sdv, n1: n, alpha: a }) : powerTwoProportions({ p1, p2, n, alpha: a }));
  const nMax = Math.max(20, Math.ceil(nPer * 2.2));
  const curve = Array.from({ length: 120 }, (_, i) => {
    const n = 2 + ((nMax - 2) * i) / 119;
    return { x: n, y: powerAt(n) };
  });

  // Sampling distribution of the z statistic under H0 and H1 at the planned n.
  const za = normalQuantile(1 - a / 2);
  const ncp = za + normalQuantile(target);
  const zs = Array.from({ length: 161 }, (_, i) => -4 + (i * (ncp + 8)) / 160);
  const h0 = zs.map((z) => ({ x: z, y: normalPdf(z) }));
  const h1 = zs.map((z) => ({ x: z, y: normalPdf(z, ncp) }));
  const betaArea = zs.filter((z) => z <= za).map((z) => ({ x: z, y: normalPdf(z, ncp) }));
  const alphaArea = zs.filter((z) => z >= za).map((z) => ({ x: z, y: normalPdf(z) }));
  const area = (pts: { x: number; y: number }[], sx: Scale, sy: Scale) =>
    pts.length ? `${linePath(pts, sx, sy)}L${sx(pts[pts.length - 1].x)},${sy(0)}L${sx(pts[0].x)},${sy(0)}Z` : '';

  const effectText = mode === 'means' ? `Δ = ${delta} with SD ${sdv} (d = ${fmt(delta / sdv, 2)})` : `${pct(p1, 0)} vs ${pct(p2, 0)} (ARR ${pct(Math.abs(p1 - p2), 1)})`;

  return (
    <LabShell id="power" embedded={embedded}>
      <LabGrid
        controls={
          <>
            <Segmented label="Outcome type" value={mode} onChange={setMode} options={[{ value: 'means', label: 'Two means' }, { value: 'props', label: 'Two proportions' }]} />
            {mode === 'means' ? (
              <div className="grid grid-cols-2 gap-2">
                <NumberField label="Difference to detect (Δ)" value={delta} onChange={(v) => setDelta(Math.max(0.01, v))} step={0.5} min={0.01} />
                <NumberField label="SD of outcome" value={sdv} onChange={(v) => setSd(Math.max(0.01, v))} step={0.5} min={0.01} />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <NumberField label="Control risk" value={p1} onChange={(v) => setP1(Math.min(0.99, Math.max(0.001, v)))} step={0.01} min={0.001} max={0.99} />
                <NumberField label="Treatment risk" value={p2} onChange={(v) => setP2(Math.min(0.99, Math.max(0.001, v)))} step={0.01} min={0.001} max={0.99} />
              </div>
            )}
            <div>
              <div className="mb-1 text-sm font-medium text-ink-2">Two-sided α</div>
              <Segmented label="Alpha" value={alpha} onChange={setAlpha} options={[{ value: '0.05', label: '0.05' }, { value: '0.01', label: '0.01' }, { value: '0.005', label: '0.005' }]} />
            </div>
            <Slider label="Target power" value={target} onChange={setTarget} min={0.5} max={0.99} step={0.01} format={(v) => pct(v, 0)} />
            <Slider label="Expected dropout" value={dropout} onChange={setDropout} min={0} max={0.4} step={0.01} format={(v) => pct(v, 0)} />
          </>
        }
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Stat label="Per group (analysed)" value={Number.isFinite(nPer) ? nPer.toLocaleString() : '—'} />
          <Stat label="Per group (recruit)" value={Number.isFinite(nRecruit) ? nRecruit.toLocaleString() : '—'} sub={`+${pct(dropout, 0)} dropout`} />
          <Stat label="Total to recruit" value={Number.isFinite(nRecruit) ? (2 * nRecruit).toLocaleString() : '—'} />
        </div>
        <div>
          <div className="mb-1 text-sm font-medium">Power vs sample size</div>
          <Chart ariaLabel="Power curve" x={[0, nMax]} y={[0, 1]} xLabel="Patients per group" yLabel="Power" yFormat={(v) => `${Math.round(v * 100)}%`} height={220} onHoverX={setHover} hoverX={hover}>
            {(sx, sy) => (
              <>
                <line x1={0} x2={sx(nMax)} y1={sy(target)} y2={sy(target)} stroke="var(--axis)" strokeDasharray="3 3" />
                <path d={linePath(curve, sx, sy)} fill="none" stroke="var(--s1)" strokeWidth={2} />
                {Number.isFinite(nPer) && nPer <= nMax && <circle cx={sx(nPer)} cy={sy(powerAt(nPer))} r={5} fill="var(--s1)" stroke="var(--surface)" strokeWidth={2} />}
              </>
            )}
          </Chart>
          <Readout>{hover != null ? `n = ${Math.round(hover)} per group → power ${pct(powerAt(Math.max(2, hover)), 0)}` : 'Hover the curve to read power at other sample sizes.'}</Readout>
        </div>
        <div>
          <div className="mb-1 text-sm font-medium">Test statistic under H₀ and under the target effect</div>
          <Chart ariaLabel="Null and alternative sampling distributions" x={[-4, ncp + 4]} y={[0, 0.45]} xLabel="z statistic" height={200} yTicks={[]} margin={{ left: 12 }}>
            {(sx, sy) => (
              <>
                <path d={area(betaArea, sx, sy)} fill="var(--s2)" opacity={0.25} />
                <path d={area(alphaArea, sx, sy)} fill="var(--bad)" opacity={0.45} />
                <path d={linePath(h0, sx, sy)} fill="none" stroke="var(--muted)" strokeWidth={2} />
                <path d={linePath(h1, sx, sy)} fill="none" stroke="var(--s2)" strokeWidth={2} />
                <line x1={sx(za)} x2={sx(za)} y1={sy(0)} y2={sy(0.43)} stroke="var(--ink)" strokeDasharray="4 3" />
                <text x={sx(za) + 4} y={sy(0.42)} fill="var(--ink-2)" className="text-[11px]">critical value {fmt(za, 2)}</text>
              </>
            )}
          </Chart>
          <Legend items={[{ label: 'H₀ (no effect)', color: 'var(--muted)' }, { label: 'H₁ (target effect)', color: 'var(--s2)' }]} />
          <p className="mt-1 text-xs text-muted">Orange shading = β (effects missed). Red tail = α/2 (false positives). The unshaded part of the orange curve is the power.</p>
        </div>
        <Insight>
          To detect {effectText} with {pct(target, 0)} power at two-sided α = {alpha}, analyse {Number.isFinite(nPer) ? nPer : '—'} per group and recruit {Number.isFinite(nRecruit) ? nRecruit : '—'}. Halving the difference would need about four times as many.
        </Insight>
      </LabGrid>
    </LabShell>
  );
}
