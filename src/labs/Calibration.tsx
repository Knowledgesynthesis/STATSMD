import { useMemo, useState } from 'react';
import { Shuffle } from 'lucide-react';
import { Chart } from '../components/charts';
import { Button, Segmented, Slider, Stat } from '../components/ui';
import { auc, calibrationSlope, createRng, logistic, logisticFit, rnorm } from '../lib/stats';
import { fmt, pct } from '../lib/utils';
import { Insight, LabGrid, LabShell } from './LabShell';
import type { LabProps } from './registry';

const TRUE_BETA = [-2.0, 0.9, 0.6, 0.4];
const N_VAL = 4000;

function simulate(rng: () => number, n: number, noise: number) {
  const X: number[][] = [];
  const y: number[] = [];
  for (let i = 0; i < n; i++) {
    const row = Array.from({ length: 3 + noise }, () => rnorm(rng));
    const p = logistic(TRUE_BETA[0] + TRUE_BETA[1] * row[0] + TRUE_BETA[2] * row[1] + TRUE_BETA[3] * row[2]);
    X.push(row);
    y.push(rng() < p ? 1 : 0);
  }
  return { X, y };
}

export default function Calibration({ embedded }: LabProps) {
  const [nDev, setNDev] = useState(200);
  const [noise, setNoise] = useState(12);
  const [shrink, setShrink] = useState<'none' | 'shrunk'>('none');
  const [seed, setSeed] = useState(1);

  const res = useMemo(() => {
    const rng = createRng(seed * 977 + nDev + noise * 31);
    const dev = simulate(rng, nDev, noise);
    const val = simulate(createRng(424242 + noise), N_VAL, noise);
    const fit = logisticFit(dev.X, dev.y);
    const df = dev.X[0].length;
    // Heuristic uniform shrinkage (van Houwelingen & le Cessie): (χ² − df) / χ²
    const s = shrink === 'shrunk' ? Math.max(0, Math.min(1, (fit.lrChi2 - df) / fit.lrChi2)) : 1;
    const lpDev = dev.X.map((x) => x.reduce((a, v, j) => a + v * fit.coef[j + 1], 0));
    const meanLp = lpDev.reduce((a, b) => a + b, 0) / lpDev.length;
    const predictor = (x: number[]) => {
      const lp = x.reduce((a, v, j) => a + v * fit.coef[j + 1], 0);
      return logistic(fit.coef[0] + meanLp * (1 - s) + s * lp);
    };
    const pDev = dev.X.map(predictor);
    const pVal = val.X.map(predictor);
    const cal = calibrationSlope(pVal, val.y);
    // Calibration plot: 10 groups by predicted risk
    const order = pVal.map((p, i) => [p, val.y[i]] as const).sort((a, b) => a[0] - b[0]);
    const groups = Array.from({ length: 10 }, (_, g) => {
      const slice = order.slice(Math.floor((g * N_VAL) / 10), Math.floor(((g + 1) * N_VAL) / 10));
      return { pred: slice.reduce((a, r) => a + r[0], 0) / slice.length, obs: slice.reduce((a, r) => a + r[1], 0) / slice.length };
    });
    return {
      events: dev.y.reduce((a, b) => a + b, 0),
      params: df,
      aucDev: auc(pDev, dev.y),
      aucVal: auc(pVal, val.y),
      slope: cal.slope,
      shrinkage: s,
      groups,
      converged: fit.converged,
    };
  }, [nDev, noise, shrink, seed]);

  const epp = res.events / res.params;
  const overfit = res.slope < 0.85;

  return (
    <LabShell id="calibration" embedded={embedded}>
      <LabGrid
        controls={
          <>
            <Slider label="Development sample size" value={nDev} onChange={setNDev} min={100} max={3000} step={50} />
            <Slider label="Noise predictors (no true effect)" value={noise} onChange={setNoise} min={0} max={25} hint="Plus 3 genuine predictors" />
            <Segmented label="Coefficient shrinkage" value={shrink} onChange={setShrink} options={[{ value: 'none', label: 'Maximum likelihood' }, { value: 'shrunk', label: 'Uniform shrinkage' }]} />
            <Button variant="outline" size="sm" onClick={() => setSeed((s) => s + 1)}>
              <Shuffle className="h-4 w-4" /> New development sample
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Events / parameter" value={fmt(epp, 1)} tone={epp < 10 ? 'warn' : undefined} sub={`${res.events} events, ${res.params} params`} />
              <Stat label="Shrinkage factor" value={fmt(res.shrinkage, 2)} sub={shrink === 'none' ? 'not applied' : 'applied'} />
            </div>
          </>
        }
      >
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Apparent AUC" value={fmt(res.aucDev, 3)} sub="development data" />
          <Stat label="Validation AUC" value={fmt(res.aucVal, 3)} sub={`new patients, n = ${N_VAL.toLocaleString()}`} />
          <Stat label="Calibration slope" value={fmt(res.slope, 2)} tone={overfit ? 'bad' : 'good'} sub="ideal = 1" />
        </div>
        <div>
          <div className="mb-1 text-sm font-medium">Calibration in new patients (deciles of predicted risk)</div>
          <Chart ariaLabel={`Calibration plot, slope ${fmt(res.slope, 2)}`} x={[0, 1]} y={[0, 1]} xLabel="Predicted risk" yLabel="Observed risk" xFormat={(v) => `${Math.round(v * 100)}%`} yFormat={(v) => `${Math.round(v * 100)}%`} height={280}>
            {(sx, sy) => (
              <>
                <line x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(1)} stroke="var(--axis)" strokeDasharray="4 3" />
                <path d={res.groups.map((g, i) => `${i ? 'L' : 'M'}${sx(g.pred)},${sy(g.obs)}`).join('')} fill="none" stroke="var(--s1)" strokeWidth={2} />
                {res.groups.map((g, i) => (
                  <circle key={i} cx={sx(g.pred)} cy={sy(g.obs)} r={5} fill="var(--s1)" stroke="var(--surface)" strokeWidth={2}>
                    <title>{`predicted ${pct(g.pred, 0)}, observed ${pct(g.obs, 0)}`}</title>
                  </circle>
                ))}
              </>
            )}
          </Chart>
        </div>
        <Insight tone={overfit ? 'bad' : 'good'}>
          {overfit
            ? `Overfitting: the apparent AUC (${fmt(res.aucDev, 2)}) overstates the validation AUC (${fmt(res.aucVal, 2)}), and the slope of ${fmt(res.slope, 2)} means high risks are predicted too high and low risks too low. ${shrink === 'none' ? 'Try uniform shrinkage, more patients, or fewer candidate predictors.' : 'Shrinkage helps, but cannot fully rescue a sample this small.'}`
            : `Well calibrated (slope ${fmt(res.slope, 2)}) and little optimism (apparent ${fmt(res.aucDev, 2)} vs validation ${fmt(res.aucVal, 2)}). Overfitting shows up far more clearly in the calibration slope than in the AUC.`}
        </Insight>
      </LabGrid>
    </LabShell>
  );
}
