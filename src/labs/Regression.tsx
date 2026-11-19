import { useMemo, useState } from 'react';
import { RotateCcw, Zap } from 'lucide-react';
import { Chart } from '../components/charts';
import { Button, Segmented, Stat } from '../components/ui';
import { createRng, linearFit, rnorm } from '../lib/stats';
import { fmt, formatP } from '../lib/utils';
import { Insight, LabShell } from './LabShell';
import type { LabProps } from './registry';

interface Pt { x: number; y: number }

function initial(): Pt[] {
  const rng = createRng(5);
  return Array.from({ length: 16 }, () => {
    const x = 30 + 40 * rng();
    return { x, y: 95 + 0.6 * x + 7 * rnorm(rng) };
  });
}

const X: [number, number] = [20, 90];
const Y: [number, number] = [90, 170];

export default function Regression({ embedded }: LabProps) {
  const [pts, setPts] = useState<Pt[]>(initial);
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const fit = useMemo(() => (pts.length >= 3 ? linearFit(pts.map((p) => p.x), pts.map((p) => p.y)) : null), [pts]);
  const worst = fit ? fit.cooksD.reduce((best, d, i) => (d > fit.cooksD[best] ? i : best), 0) : -1;
  // Cook's D > 0.5 deserves a look; > 1 is usually influential.
  const influential = fit && worst >= 0 && fit.cooksD[worst] > 0.5;

  const onClick = (x: number, y: number) => {
    if (mode === 'add') setPts((p) => [...p, { x, y }]);
    else {
      setPts((p) => {
        if (p.length <= 3) return p;
        let k = 0;
        let best = Infinity;
        p.forEach((q, i) => {
          const dist = ((q.x - x) / (X[1] - X[0])) ** 2 + ((q.y - y) / (Y[1] - Y[0])) ** 2;
          if (dist < best) {
            best = dist;
            k = i;
          }
        });
        return p.filter((_, i) => i !== k);
      });
    }
  };

  const band = fit ? Array.from({ length: 50 }, (_, i) => X[0] + ((X[1] - X[0]) * i) / 49).map((x) => ({ x, ...fit.band(x) })) : [];

  return (
    <LabShell id="regression" embedded={embedded}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Segmented label="Click action" value={mode} onChange={setMode} options={[{ value: 'add', label: 'Click adds a point' }, { value: 'remove', label: 'Click removes nearest' }]} />
        <Button variant="outline" size="sm" onClick={() => setPts((p) => [...p, { x: 88, y: 98 }])}>
          <Zap className="h-4 w-4" /> Add high-leverage outlier
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setPts(initial())}>
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
        <div>
          <Chart ariaLabel="Scatter plot with least-squares line; click to add points" x={X} y={Y} xLabel="Age (years)" yLabel="SBP (mmHg)" height={320} onClickData={onClick}>
            {(sx, sy) => (
              <>
                {fit && (
                  <>
                    <path d={`M${band.map((b) => `${sx(b.x)},${sy(Math.max(Y[0], Math.min(Y[1], b.ciHigh)))}`).join('L')}L${[...band].reverse().map((b) => `${sx(b.x)},${sy(Math.max(Y[0], Math.min(Y[1], b.ciLow)))}`).join('L')}Z`} fill="var(--s1)" opacity={0.14} />
                    <line x1={sx(X[0])} y1={sy(fit.predict(X[0]))} x2={sx(X[1])} y2={sy(fit.predict(X[1]))} stroke="var(--s1)" strokeWidth={2.5} />
                    {pts.map((p, i) => (
                      <line key={`r${i}`} x1={sx(p.x)} x2={sx(p.x)} y1={sy(p.y)} y2={sy(fit.fitted[i])} stroke="var(--muted)" strokeWidth={1} opacity={0.6} />
                    ))}
                  </>
                )}
                {pts.map((p, i) => (
                  <circle key={i} cx={sx(p.x)} cy={sy(Math.max(Y[0], Math.min(Y[1], p.y)))} r={i === worst && influential ? 7 : 5} fill={i === worst && influential ? 'var(--s2)' : 'var(--surface)'} stroke={i === worst && influential ? 'var(--s2)' : 'var(--s1)'} strokeWidth={2}>
                    {fit && <title>{`age ${fmt(p.x, 0)}, SBP ${fmt(p.y, 0)} — leverage ${fmt(fit.leverage[i], 2)}, Cook’s D ${fmt(fit.cooksD[i], 2)}`}</title>}
                  </circle>
                ))}
              </>
            )}
          </Chart>
          <p className="mt-1 text-xs text-muted">Grey lines are residuals; the shaded band is the 95% CI for the mean SBP at each age.</p>
        </div>
        {fit && (
          <div className="space-y-2">
            <Stat label="Slope (mmHg per year)" value={fmt(fit.slope, 2)} sub={`95% CI ${fmt(fit.slopeCI[0], 2)} to ${fmt(fit.slopeCI[1], 2)}`} />
            <Stat label="R²" value={fmt(fit.r2, 2)} sub={`n = ${fit.n}, ${formatP(fit.pSlope)}`} />
            <Stat label="Residual SD" value={`${fmt(fit.residualSE, 1)} mmHg`} />
            <Stat label="Max Cook’s distance" value={fmt(fit.cooksD[worst], 2)} tone={influential ? 'warn' : undefined} sub={`leverage ${fmt(fit.leverage[worst], 2)}`} />
          </div>
        )}
      </div>
      <div className="mt-3">
        <Insight tone={influential ? 'warn' : 'neutral'}>
          {influential
            ? `The orange point has Cook’s distance ${fmt(fit!.cooksD[worst], 2)} (> 0.5): it combines unusual x (high leverage) with a large residual, so it pulls the line. Check it — do not just delete it.`
            : 'Each mmHg of slope is the mean change in SBP per year of age. Points far out on the x-axis have the most leverage: try the outlier button.'}
        </Insight>
      </div>
    </LabShell>
  );
}
