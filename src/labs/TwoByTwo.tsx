import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { NumberField, Segmented, Stat } from '../components/ui';
import { chiSquareTest, effectMeasures, fisherExact } from '../lib/stats';
import { fmt, pct, pValue } from '../lib/utils';
import { Insight, LabShell } from './LabShell';
import type { LabProps } from './registry';

const PRESETS = [
  { label: 'Trial', a: 20, b: 80, c: 35, d: 65 },
  { label: 'Small counts', a: 3, b: 22, c: 0, d: 24 },
  { label: 'Common outcome', a: 60, b: 40, c: 40, d: 60 },
  { label: 'Null-ish', a: 10, b: 90, c: 12, d: 88 },
];

export default function TwoByTwo({ embedded }: LabProps) {
  const [t, setT] = useState(PRESETS[0]);
  const [design, setDesign] = useState<'cohort' | 'cc'>('cohort');
  const { a, b, c, d } = t;
  const valid = a + b > 0 && c + d > 0 && a + c > 0 && b + d > 0;
  const em = valid ? effectMeasures({ a, b, c, d }) : null;
  const chi = valid ? chiSquareTest([[a, b], [c, d]]) : null;
  const chiN1 = valid ? chiSquareTest([[a, b], [c, d]], { nMinus1: true }) : null;
  const yates = valid ? chiSquareTest([[a, b], [c, d]], { yates: true }) : null;
  const fisher = valid ? fisherExact({ a, b, c, d }) : null;
  const set = (k: 'a' | 'b' | 'c' | 'd') => (v: number) => setT((s) => ({ ...s, label: '', [k]: Math.round(v) }));
  const cc = design === 'cc';
  const ci = (x: [number, number], digits = 2) => `${fmt(x[0], digits)} to ${fmt(x[1], digits)}`;

  return (
    <LabShell id="two-by-two" embedded={embedded}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Segmented label="Study design" value={design} onChange={setDesign} options={[{ value: 'cohort', label: 'Trial / cohort' }, { value: 'cc', label: 'Case-control' }]} />
        <div className="flex flex-wrap gap-1">
          {PRESETS.map((p) => (
            <button key={p.label} type="button" onClick={() => setT(p)} className={`rounded-md border px-2.5 py-1 text-xs font-medium ${t.label === p.label ? 'border-primary bg-primary-soft text-primary-text' : 'border-line-strong text-ink-2 hover:bg-surface-2'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-ink-2">
                <th />
                <th className="pb-1 font-medium">{cc ? 'Cases' : 'Event'}</th>
                <th className="pb-1 font-medium">{cc ? 'Controls' : 'No event'}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="pr-2 text-left text-xs font-medium text-ink-2">{cc ? 'Exposed' : 'Treated / exposed'}</th>
                <td className="p-1"><NumberField label="a" value={a} onChange={set('a')} /></td>
                <td className="p-1"><NumberField label="b" value={b} onChange={set('b')} /></td>
              </tr>
              <tr>
                <th scope="row" className="pr-2 text-left text-xs font-medium text-ink-2">{cc ? 'Unexposed' : 'Control / unexposed'}</th>
                <td className="p-1"><NumberField label="c" value={c} onChange={set('c')} /></td>
                <td className="p-1"><NumberField label="d" value={d} onChange={set('d')} /></td>
              </tr>
            </tbody>
          </table>
          {chi && (
            <div className="mt-3 rounded-lg bg-surface-2 p-3 text-xs text-ink-2">
              <div className="mb-1 font-semibold text-ink">Expected counts</div>
              <div className="tabular grid grid-cols-2 gap-1">
                {chi.expected.flat().map((e, i) => (
                  <span key={i} className={e < 1 ? 'font-semibold text-bad-text' : e < 5 ? 'font-semibold text-warn-text' : ''}>{'abcd'[i]}: {fmt(e, 1)}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        {!valid || !em || !chi || !chiN1 || !yates || !fisher ? (
          <Insight tone="warn">Each row and column needs at least one observation.</Insight>
        ) : (
          <div className="space-y-4">
            {!cc ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Stat label="Risk, treated" value={pct(em.risk1)} sub={`${a}/${a + b}`} />
                <Stat label="Risk, control" value={pct(em.risk0)} sub={`${c}/${c + d}`} />
                <Stat label="Risk difference" value={pct(em.rd)} sub={`95% CI ${pct(em.rdCI[0])} to ${pct(em.rdCI[1])}`} />
                <Stat label="Risk ratio" value={fmt(em.rr)} sub={`95% CI ${ci(em.rrCI)}`} />
                <Stat label="Odds ratio" value={fmt(em.or)} sub={`95% CI ${ci(em.orCI)}`} />
                <Stat label={em.nnt.kind === 'none' ? 'NNT' : em.nnt.kind} value={Number.isFinite(em.nnt.value) ? fmt(em.nnt.value, 1) : '∞'} sub={em.nnt.ciText} />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Stat label="Odds ratio" value={fmt(em.or)} sub={`95% CI ${ci(em.orCI)}`} />
                <Stat label="Exposure odds, cases" value={fmt(a / Math.max(c, 0.5))} sub={`${a}:${c}`} />
                <Stat label="Exposure odds, controls" value={fmt(b / Math.max(d, 0.5))} sub={`${b}:${d}`} />
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs text-ink-2">
                    <th className="py-1.5 font-medium">Test</th>
                    <th className="py-1.5 font-medium">Statistic</th>
                    <th className="py-1.5 font-medium">p</th>
                    <th className="py-1.5 font-medium">Note</th>
                  </tr>
                </thead>
                <tbody className="tabular">
                  <tr className="border-b border-line"><td className="py-1.5">Pearson χ²</td><td>{fmt(chi.statistic)}</td><td>{pValue(chi.p)}</td><td className="text-xs text-ink-2">Classic</td></tr>
                  <tr className="border-b border-line font-medium"><td className="py-1.5">“N − 1” χ²</td><td>{fmt(chiN1.statistic)}</td><td>{pValue(chiN1.p)}</td><td className="text-xs text-ink-2">Recommended if all expected ≥ 1</td></tr>
                  <tr className="border-b border-line"><td className="py-1.5">Yates-corrected χ²</td><td>{fmt(yates.statistic)}</td><td>{pValue(yates.p)}</td><td className="text-xs text-ink-2">Over-conservative</td></tr>
                  <tr><td className="py-1.5">Fisher exact</td><td>—</td><td>{pValue(fisher.p)}</td><td className="text-xs text-ink-2">If any expected &lt; 1</td></tr>
                </tbody>
              </table>
            </div>
            {em.correctionApplied && (
              <p className="flex items-start gap-2 text-xs text-warn-text">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> A zero cell: 0.5 was added to every cell for the RR and OR (Haldane–Anscombe). Interpret with caution.
              </p>
            )}
            <Insight tone={chi.minExpected < 1 ? 'bad' : 'neutral'}>
              {cc
                ? 'Case-control: the investigator fixed the number of cases and controls, so risks, RD, RR and NNT are not estimable. The odds ratio is.'
                : chi.minExpected < 1
                  ? 'An expected count is below 1: use Fisher’s exact test.'
                  : `${em.rd === 0 ? 'No difference in risk.' : `Treatment ${em.rd < 0 ? 'lowers' : 'raises'} the risk by ${fmt(100 * Math.abs(em.rd), 1)} percentage points (relative change ${em.rr >= 1 ? '+' : '−'}${fmt(100 * Math.abs(em.rr - 1), 0)}%).`} ${Math.max(em.risk0, em.risk1) > 0.1 ? `The outcome is common (${pct(Math.max(em.risk0, em.risk1), 0)}), so the OR (${fmt(em.or)}) lies further from 1 than the RR (${fmt(em.rr)}) — do not read it as a risk ratio.` : `The outcome is uncommon (≤ 10%), so OR (${fmt(em.or)}) ≈ RR (${fmt(em.rr)}).`}`}
            </Insight>
          </div>
        )}
      </div>
    </LabShell>
  );
}
