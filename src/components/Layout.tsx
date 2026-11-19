import { useState } from 'react';
import { BookOpen, ChevronDown, Compass, FlaskConical, GraduationCap, Menu, Monitor, Moon, Sun, Target, X, Library } from 'lucide-react';
import { useProgress, type Theme } from '../lib/progress';
import { useRoute } from '../lib/router';
import { cn } from '../lib/utils';

const NAV = [
  { to: '/learn', label: 'Learn', icon: GraduationCap },
  { to: '/finder', label: 'Test Finder', icon: Compass },
  { to: '/labs', label: 'Labs', icon: FlaskConical },
  { to: '/cases', label: 'Cases', icon: BookOpen },
  { to: '/quiz', label: 'Quiz', icon: Target },
];
const REFERENCE = [
  { to: '/methods', label: 'Methods atlas' },
  { to: '/glossary', label: 'Glossary' },
  { to: '/cheatsheet', label: 'Cheat sheet' },
  { to: '/references', label: 'References' },
];

function Logo() {
  return (
    <a href="#/" className="flex items-center gap-2 font-bold tracking-tight" aria-label="StatsMD home">
      <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden>
        <rect width="64" height="64" rx="14" fill="var(--primary)" />
        <path d="M10 46c6 0 9-26 22-26s16 26 22 26" fill="none" stroke="var(--primary-ink)" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <span className="text-lg">StatsMD</span>
    </a>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useProgress();
  const next: Record<Theme, Theme> = { system: 'dark', dark: 'light', light: 'system' };
  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
  return (
    <button
      type="button"
      onClick={() => setTheme(next[theme])}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-2 hover:bg-surface-2 hover:text-ink"
      aria-label={`Theme: ${theme}. Switch to ${next[theme]}`}
      title={`Theme: ${theme}`}
    >
      <Icon className="h-[18px] w-[18px]" />
    </button>
  );
}

export function Header() {
  const { path } = useRoute();
  // Menus remember the path they were opened on, so navigating closes them.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const [refOpenOn, setRefOpenOn] = useState<string | null>(null);
  const open = openOn === path;
  const refOpen = refOpenOn === path;
  const setOpen = (f: (o: boolean) => boolean) => setOpenOn(f(open) ? path : null);
  const setRefOpen = (v: boolean | ((o: boolean) => boolean)) => setRefOpenOn((typeof v === 'function' ? v(refOpen) : v) ? path : null);
  const active = (to: string) => path === to || path.startsWith(`${to}/`);
  const refActive = REFERENCE.some((r) => active(r.to));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/75">
      <a href="#/" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }} className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2">
        Skip to content
      </a>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a key={n.to} href={`#${n.to}`} aria-current={active(n.to) ? 'page' : undefined} className={cn('rounded-lg px-3 py-1.5 text-sm font-medium transition-colors', active(n.to) ? 'bg-primary-soft text-primary-text' : 'text-ink-2 hover:bg-surface-2 hover:text-ink')}>
              {n.label}
            </a>
          ))}
          <div className="relative">
            <button type="button" aria-expanded={refOpen} onClick={() => setRefOpen((o) => !o)} className={cn('inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium', refActive ? 'bg-primary-soft text-primary-text' : 'text-ink-2 hover:bg-surface-2 hover:text-ink')}>
              Reference <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {refOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded-xl border border-line-strong bg-surface p-1 shadow-xl" onMouseLeave={() => setRefOpen(false)}>
                {REFERENCE.map((r) => (
                  <a key={r.to} href={`#${r.to}`} className={cn('block rounded-lg px-3 py-2 text-sm', active(r.to) ? 'bg-primary-soft text-primary-text' : 'text-ink hover:bg-surface-2')}>
                    {r.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-2 hover:bg-surface-2 md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t border-line bg-surface px-4 pb-4 pt-2 md:hidden">
          <ul className="grid grid-cols-2 gap-1">
            {NAV.map((n) => {
              const Icon = n.icon;
              return (
                <li key={n.to}>
                  <a href={`#${n.to}`} className={cn('flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium', active(n.to) ? 'bg-primary-soft text-primary-text' : 'text-ink hover:bg-surface-2')}>
                    <Icon className="h-4 w-4" /> {n.label}
                  </a>
                </li>
              );
            })}
            {REFERENCE.map((r) => (
              <li key={r.to}>
                <a href={`#${r.to}`} className={cn('flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium', active(r.to) ? 'bg-primary-soft text-primary-text' : 'text-ink hover:bg-surface-2')}>
                  <Library className="h-4 w-4" /> {r.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="no-print mt-16 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-ink-2 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>StatsMD · evidence-based medical statistics · content reviewed November 2026</p>
        <p className="text-xs text-muted">For learning and appraisal. For your own study, involve a statistician early.</p>
      </div>
    </footer>
  );
}
