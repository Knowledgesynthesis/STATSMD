import React, { useCallback } from 'react';
import { linearScale, niceTicks, useWidth, type Scale } from './chart-utils';

export interface ChartProps {
  height?: number;
  x: [number, number];
  y: [number, number];
  xLabel?: string;
  yLabel?: string;
  xTicks?: number[];
  yTicks?: number[];
  xFormat?: (v: number) => string;
  yFormat?: (v: number) => string;
  xLog?: boolean;
  margin?: Partial<{ top: number; right: number; bottom: number; left: number }>;
  ariaLabel: string;
  children: (sx: Scale, sy: Scale, dims: { w: number; h: number; iw: number; ih: number }) => React.ReactNode;
  /** Pointer x in data units (null when leaving); enables a crosshair. */
  onHoverX?: (x: number | null) => void;
  hoverX?: number | null;
  onClickData?: (x: number, y: number) => void;
  className?: string;
}

export function Chart({
  height = 280,
  x,
  y,
  xLabel,
  yLabel,
  xTicks,
  yTicks,
  xFormat = (v) => String(+v.toFixed(6)),
  yFormat = (v) => String(+v.toFixed(6)),
  xLog,
  margin,
  ariaLabel,
  children,
  onHoverX,
  hoverX,
  onClickData,
  className,
}: ChartProps) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const m = { top: 12, right: 16, bottom: xLabel ? 44 : 28, left: yLabel ? 58 : 44, ...margin };
  const iw = Math.max(10, w - m.left - m.right);
  const ih = Math.max(10, height - m.top - m.bottom);
  const sx = linearScale(x, [0, iw], xLog);
  const sy = linearScale(y, [ih, 0]);
  const xt = xTicks ?? niceTicks(x[0], x[1], Math.max(3, Math.floor(iw / 80)));
  const yt = yTicks ?? niceTicks(y[0], y[1], Math.max(3, Math.floor(ih / 50)));

  const toData = useCallback(
    (e: React.PointerEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      const r = (e.currentTarget as SVGRectElement).getBoundingClientRect();
      return [sx.invert(e.clientX - r.left), sy.invert(e.clientY - r.top)] as const;
    },
    [sx, sy],
  );

  return (
    // The SVG is absolutely positioned so its pixel width never feeds back into layout:
    // the wrapper takes the container's width and the chart re-renders to match.
    <div ref={ref} className={className} style={{ position: 'relative', width: '100%', minWidth: 0, height }}>
      {w > 0 && <svg width={w} height={height} role="img" aria-label={ariaLabel} className="absolute inset-0 block select-none overflow-visible text-[11px]">
        <g transform={`translate(${m.left},${m.top})`}>
          {yt.map((t) => (
            <g key={`y${t}`} transform={`translate(0,${sy(t)})`}>
              <line x2={iw} stroke="var(--grid)" strokeWidth={1} />
              <text x={-8} dy="0.32em" textAnchor="end" fill="var(--muted)" className="tabular">
                {yFormat(t)}
              </text>
            </g>
          ))}
          {xt.map((t) => (
            <g key={`x${t}`} transform={`translate(${sx(t)},${ih})`}>
              <line y2={5} stroke="var(--axis)" />
              <text y={18} textAnchor="middle" fill="var(--muted)" className="tabular">
                {xFormat(t)}
              </text>
            </g>
          ))}
          <line x1={0} x2={iw} y1={ih} y2={ih} stroke="var(--axis)" />
          {xLabel && (
            <text x={iw / 2} y={ih + 38} textAnchor="middle" fill="var(--ink-2)" className="text-xs">
              {xLabel}
            </text>
          )}
          {yLabel && (
            <text transform={`translate(${-m.left + 14},${ih / 2}) rotate(-90)`} textAnchor="middle" fill="var(--ink-2)" className="text-xs">
              {yLabel}
            </text>
          )}
          {children(sx, sy, { w, h: height, iw, ih })}
          {hoverX != null && hoverX >= x[0] && hoverX <= x[1] && (
            <line x1={sx(hoverX)} x2={sx(hoverX)} y1={0} y2={ih} stroke="var(--ink-2)" strokeDasharray="3 3" pointerEvents="none" />
          )}
          {(onHoverX || onClickData) && (
            <rect
              width={iw}
              height={ih}
              fill="transparent"
              style={{ cursor: onClickData ? 'crosshair' : 'default', touchAction: onClickData ? 'none' : 'pan-y' }}
              onPointerMove={(e) => onHoverX?.(toData(e)[0])}
              onPointerLeave={() => onHoverX?.(null)}
              onClick={(e) => {
                if (!onClickData) return;
                const [dx, dy] = toData(e);
                onClickData(dx, dy);
              }}
            />
          )}
        </g>
      </svg>}
    </div>
  );
}

export function Legend({ items }: { items: { label: string; color: string; dashed?: boolean }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-1.5">
          <svg width="18" height="8" aria-hidden>
            <line x1="1" x2="17" y1="4" y2="4" stroke={it.color} strokeWidth="2.5" strokeDasharray={it.dashed ? '4 3' : undefined} strokeLinecap="round" />
          </svg>
          {it.label}
        </li>
      ))}
    </ul>
  );
}

/** Floating readout panel for hover values (kept inside the chart box). */
export function Readout({ children }: { children: React.ReactNode }) {
  return (
    <div className="tabular pointer-events-none mt-2 min-h-[1.5rem] text-xs text-ink-2" aria-live="polite">
      {children}
    </div>
  );
}
