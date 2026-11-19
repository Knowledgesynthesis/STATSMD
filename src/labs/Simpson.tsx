import { useState } from 'react';
import { Slider, Stat } from '../components/ui';
import { mantelHaenszelOR } from '../lib/stats';
import { fmt, pct } from '../lib/utils';
import { Insight, LabGrid, LabShell } from './LabShell';
import type { LabProps } from './registry';

const N = 1000; // patients per severity stratum

function Bar({ label, t, u, max }: { label: string; t: number; u: number; max: number }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-ink-2">{label}</div>
      {[
        { k: 'Treated', v: t, color: 'var(--s1)' },
        { k: 'Untreated', v: u, color: 'var(--s2)' },
      ].map((r) => (
        <div key={r.k} className="flex items-center gap-2">
          <span className="w-20 shrink-0 text-xs text-ink-2">{r.k}</span>
          <div className="h-4 flex-1 rounded-sm bg-surface-2">
            <div className="h-4 rounded-sm" style={{ width: `${Math.min(100, (100 * r.v) / max)}%`, background: r.color }} />
          </div>
          <span className="tabular w-12 text-right text-xs font-medium">{pct(r.v, 1)}</span>
        </div>
      ))}
    </div>
  );
}

export default function Simpson({ embedded }: LabProps) {
  const [treatSevere, setTreatSevere] = useState(0.8);
  const [treatMild, setTreatMild] = useState(0.2);
  const [riskMild, setRiskMild] = useState(0.05);
  const [riskSevere, setRiskSevere] = useState(0.3);
  const [rr, setRr] = useState(0.7);

  const stratum = (pTreat: number, base: number) => {
    const nt = N * pTreat;
    const nu = N - nt;
    const dt = nt * Math.min(1, base * rr);
    const du = nu * base;
    return { nt, nu, dt, du, rt: nt ? dt / nt : NaN, ru: nu ? du / nu : NaN };
  };
  const mild = stratum(treatMild, riskMild);
  const severe = stratum(treatSevere, riskSevere);
  const crudeT = (mild.dt + severe.dt) / (mild.nt + severe.nt);
  const crudeU = (mild.du + severe.du) / (mild.nu + severe.nu);
  const crudeRR = crudeT / crudeU;
  const mh = mantelHaenszelOR(
    [mild, severe].map((s) => ({ a: s.dt, b: s.nt - s.dt, c: s.du, d: s.nu - s.du })),
  );
  const reversed = (crudeRR > 1) !== (rr > 1) && rr !== 1;

  const max = Math.max(riskSevere, crudeT, crudeU, 0.05) * 1.1;

  return (
    <LabShell id="simpson" embedded={embedded}>
      <LabGrid
        controls={
          <>
            <Slider label="Severe patients treated" value={treatSevere} onChange={setTreatSevere} min={0.05} max={0.95} step={0.05} format={(v) => pct(v, 0)} />
            <Slider label="Mild patients treated" value={treatMild} onChange={setTreatMild} min={0.05} max={0.95} step={0.05} format={(v) => pct(v, 0)} />
            <Slider label="Mortality if untreated: mild" value={riskMild} onChange={setRiskMild} min={0.01} max={0.3} step={0.01} format={(v) => pct(v, 0)} />
            <Slider label="Mortality if untreated: severe" value={riskSevere} onChange={setRiskSevere} min={0.05} max={0.6} step={0.01} format={(v) => pct(v, 0)} />
            <Slider label="True treatment effect (RR, same in both strata)" value={rr} onChange={setRr} min={0.4} max={1.5} step={0.05} format={(v) => fmt(v, 2)} />
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Bar label="Mild stratum" t={mild.rt} u={mild.ru} max={max} />
          <Bar label="Severe stratum" t={severe.rt} u={severe.ru} max={max} />
          <Bar label="Everyone (crude)" t={crudeT} u={crudeU} max={max} />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="RR within each stratum" value={fmt(rr, 2)} />
          <Stat label="Crude RR" value={fmt(crudeRR, 2)} tone={reversed ? 'bad' : undefined} />
          <Stat label="Mantel–Haenszel OR" value={fmt(mh, 2)} sub="severity-adjusted" />
          <Stat label="Treated who are severe" value={pct(severe.nt / (severe.nt + mild.nt), 0)} />
        </div>
        <Insight tone={reversed ? 'bad' : 'neutral'}>
          {reversed
            ? `Simpson’s paradox: treatment ${rr < 1 ? 'helps' : 'harms'} in both strata (RR ${fmt(rr, 2)}), yet the crude RR is ${fmt(crudeRR, 2)} because sicker patients receive treatment more often. Severity is a confounder, so the stratified estimate answers the causal question.`
            : Math.abs(crudeRR - rr) / rr > 0.1
              ? `Confounding distorts the crude RR (${fmt(crudeRR, 2)}) away from the true RR (${fmt(rr, 2)}). Make treatment depend more strongly on severity to see a reversal.`
              : 'With similar treatment rates in both strata there is little confounding: crude and stratified estimates agree.'}
        </Insight>
      </LabGrid>
    </LabShell>
  );
}
