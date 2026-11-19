import React, { useId } from 'react';
import { AlertTriangle, BookMarked, Lightbulb, Stethoscope } from 'lucide-react';
import { cn } from '../lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-ink hover:opacity-90',
  secondary: 'bg-surface-2 text-ink hover:bg-line',
  outline: 'border border-line-strong bg-surface text-ink hover:bg-surface-2',
  ghost: 'text-ink-2 hover:bg-surface-2 hover:text-ink',
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-45 select-none';
const sizes = { sm: 'h-8 px-3', md: 'h-10 px-4', lg: 'h-12 px-5 text-base' };

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: keyof typeof sizes }) {
  return <button type="button" className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function LinkButton({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; size?: keyof typeof sizes }) {
  return <a className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-xl border border-line bg-surface', className)} {...props} />;
}

export function Badge({ className, tone = 'neutral', ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: 'neutral' | 'primary' | 'good' | 'warn' | 'bad' }) {
  const tones = {
    neutral: 'bg-surface-2 text-ink-2',
    primary: 'bg-primary-soft text-primary-text',
    good: 'bg-good-soft text-good-text',
    warn: 'bg-warn-soft text-warn-text',
    bad: 'bg-bad-soft text-bad-text',
  };
  return <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium', tones[tone], className)} {...props} />;
}

const calloutStyle = {
  pitfall: { icon: AlertTriangle, cls: 'border-bad/40 bg-bad-soft', label: 'text-bad-text', name: 'Pitfall' },
  rule: { icon: BookMarked, cls: 'border-primary/40 bg-primary-soft', label: 'text-primary-text', name: 'Rule' },
  example: { icon: Stethoscope, cls: 'border-line-strong bg-surface-2', label: 'text-ink-2', name: 'Worked example' },
  tip: { icon: Lightbulb, cls: 'border-warn/50 bg-warn-soft', label: 'text-warn-text', name: 'Practical tip' },
};

export function Callout({ tone, title, children }: { tone: keyof typeof calloutStyle; title: string; children: React.ReactNode }) {
  const s = calloutStyle[tone];
  const Icon = s.icon;
  return (
    <aside className={cn('rounded-xl border p-4 sm:p-5', s.cls)}>
      <div className={cn('mb-2 flex items-center gap-2 text-sm font-semibold', s.label)}>
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        <span>
          <span className="sr-only">{s.name}: </span>
          {title}
        </span>
      </div>
      {children}
    </aside>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: React.ReactNode }[];
  label: string;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('inline-flex flex-wrap gap-1 rounded-lg bg-surface-2 p-1', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            value === o.value ? 'bg-surface text-ink shadow-sm ring-1 ring-line' : 'text-ink-2 hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format = (v: number) => String(v),
  hint,
}: {
  label: React.ReactNode;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-ink-2">
          {label}
        </label>
        <output htmlFor={id} className="tabular text-sm font-semibold text-ink">
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  className,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-ink-2">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        value={Number.isFinite(value) ? value : ''}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (e.target.value === '' || !Number.isFinite(v)) return;
          onChange(max !== undefined ? Math.min(max, Math.max(min, v)) : Math.max(min, v));
        }}
        className="tabular h-10 w-full rounded-lg border border-line-strong bg-surface px-3 text-ink"
      />
    </div>
  );
}

export function Stat({ label, value, sub, tone }: { label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: 'good' | 'bad' | 'warn' }) {
  const toneCls = tone === 'good' ? 'text-good-text' : tone === 'bad' ? 'text-bad-text' : tone === 'warn' ? 'text-warn-text' : 'text-ink';
  return (
    <div className="rounded-lg border border-line bg-surface p-3">
      <div className="text-xs font-medium text-muted">{label}</div>
      <div className={cn('mt-0.5 text-lg font-semibold leading-tight', toneCls)}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-ink-2">{sub}</div>}
    </div>
  );
}

export function ProgressBar({ value, label, className }: { value: number; label: string; className?: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-surface-2', className)}
    >
      <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8">
      {eyebrow && <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-text">{eyebrow}</div>}
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {children && <div className="mt-3 max-w-3xl text-lg text-ink-2">{children}</div>}
    </div>
  );
}

export function Page({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12', className)}>{children}</div>;
}
