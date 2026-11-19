import { useMemo, useState } from 'react';
import { Shuffle } from 'lucide-react';
import { Chart, Legend } from '../components/charts';
import { Button, Slider, Stat } from '../components/ui';
import { createRng, mean, quantile, rnorm, sd } from '../lib/stats';
import { fmt } from '../lib/utils';
import { Insight, LabGrid, LabShell } from './LabShell';
import type { LabProps } from './registry';

const N = 400;

export default function Distribution({ embedded }: LabProps) {
  const [sigma, setSigma] = useState(0.6);
  const [seed, setSeed] = useState(3);

  const data = useMemo(() => {
    const rng = createRng(seed);
    const z = Array.from({ length: N }, () => rnorm(rng));
    // Length-of-stay-like variable: median ≈ 5 days, log-normal with shape σ
    return z.map((v) => 5 * Math.exp(sigma * v));
  }, [sigma, seed]);

  const m = mean(data);
  const s = sd(data);
  const med = quantile(data, 0.5);
  const q1 = quantile(data, 0.25);
  const q3 = quantile(data, 0.75);
  const maxX = Math.min(Math.max(...data), quantile(data, 0.99) * 1.15);
  const bins = 30;
  const w = maxX / bins;
  const counts = new Array(bins).fill(0);
  data.forEach((x) => {
    const b = Math.min(bins - 1, Math.floor(x / w));
    if (x <= maxX) counts[b]++;
  });
  const maxC = Math.max(...counts);
  const skewed = m < 2 * s;

  return (
    <LabShell id="distribution" embedded={embedded}>
      <LabGrid
        controls={
          <>
            <Slider label="Skew (log-scale SD, σ)" value={sigma} onChange={setSigma} min={0.05} max={1.3} step={0.05} format={(v) => v.toFixed(2)} hint="0.05 ≈ symmetric; 1.0 ≈ typical length of stay or cost data" />
            <Button variant="outline" size="sm" onClick={() => setSeed((x) => x + 1)}>
              <Shuffle className="h-4 w-4" /> New sample
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Mean (SD)" value={`${fmt(m, 1)} (${fmt(s, 1)})`} />
              <Stat label="Median (IQR)" value={`${fmt(med, 1)} (${fmt(q1, 1)}–${fmt(q3, 1)})`} />
              <Stat label="Mean − 2 SD" value={fmt(m - 2 * s, 1)} tone={m - 2 * s < 0 ? 'bad' : undefined} sub={m - 2 * s < 0 ? 'impossible for days' : undefined} />
              <Stat label="SE of the mean" value={fmt(s / Math.sqrt(N), 2)} sub={`SD/√${N}`} />
            </div>
          </>
        }
      >
        <Chart
          ariaLabel={`Histogram of ${N} simulated stays; mean ${fmt(m, 1)}, median ${fmt(med, 1)}`}
          x={[0, maxX]}
          y={[0, maxC * 1.1]}
          xLabel="Length of stay (days)"
          yLabel="Patients"
          height={260}
        >
          {(sx, sy) => (
            <>
              {counts.map((c, i) => (
                <rect key={i} x={sx(i * w) + 1} y={sy(c)} width={Math.max(0, sx(w) - sx(0) - 2)} height={sy(0) - sy(c)} rx={2} fill="var(--s1)" opacity={0.85}>
                  <title>{`${fmt(i * w, 1)}–${fmt((i + 1) * w, 1)} days: ${c} patients`}</title>
                </rect>
              ))}
              <line x1={sx(med)} x2={sx(med)} y1={sy(0)} y2={sy(maxC * 1.08)} stroke="var(--s3)" strokeWidth={2.5} />
              <line x1={sx(m)} x2={sx(m)} y1={sy(0)} y2={sy(maxC * 1.08)} stroke="var(--s2)" strokeWidth={2.5} strokeDasharray="5 3" />
            </>
          )}
        </Chart>
        <Legend items={[{ label: `Median ${fmt(med, 1)}`, color: 'var(--s3)' }, { label: `Mean ${fmt(m, 1)}`, color: 'var(--s2)', dashed: true }]} />
        <Insight tone={skewed ? 'warn' : 'good'}>
          {skewed
            ? `Mean (${fmt(m, 1)}) < 2 × SD (${fmt(2 * s, 1)}): strongly skewed. Summarise with median (IQR); for analysis consider the log scale.`
            : 'Close to symmetric: mean and median almost coincide, and mean (SD) is a fair summary.'}
        </Insight>
      </LabGrid>
    </LabShell>
  );
}
