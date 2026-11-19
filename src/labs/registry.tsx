import React, { Suspense, lazy } from 'react';
import type { LabId } from '../content/types';

export interface LabProps {
  embedded?: boolean;
}

const registry: Record<LabId, React.LazyExoticComponent<React.ComponentType<LabProps>>> = {
  'variable-sorter': lazy(() => import('./VariableSorter')),
  distribution: lazy(() => import('./Distribution')),
  'ci-coverage': lazy(() => import('./CICoverage')),
  'p-dance': lazy(() => import('./PDance')),
  power: lazy(() => import('./Power')),
  'two-by-two': lazy(() => import('./TwoByTwo')),
  'or-vs-rr': lazy(() => import('./OrVsRr')),
  agreement: lazy(() => import('./Agreement')),
  regression: lazy(() => import('./Regression')),
  simpson: lazy(() => import('./Simpson')),
  rtm: lazy(() => import('./RegressionToMean')),
  km: lazy(() => import('./KaplanMeier')),
  diagnostic: lazy(() => import('./Diagnostic')),
  calibration: lazy(() => import('./Calibration')),
  multiplicity: lazy(() => import('./Multiplicity')),
  forest: lazy(() => import('./Forest')),
};

export function Lab({ id, embedded }: { id: LabId; embedded?: boolean }) {
  const C = registry[id];
  return (
    <Suspense fallback={<div className="h-72 animate-pulse rounded-xl border border-line bg-surface" aria-label="Loading lab" />}>
      <C embedded={embedded} />
    </Suspense>
  );
}
