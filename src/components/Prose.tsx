import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { glossaryById } from '../content/glossary';
import { referencesById } from '../content/references';
import { cn } from '../lib/utils';
import { INLINE, parseBlocks } from '../lib/markdown';

export function Inline({ text }: { text: string }) {
  const parts = text.split(INLINE).filter((p) => p !== '');
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}><Inline text={p.slice(2, -2)} /></strong>;
        if (p.startsWith('`') && p.endsWith('`')) return <code key={i}>{p.slice(1, -1)}</code>;
        if (p.startsWith('[[') && p.endsWith(']]')) {
          const [id, label] = p.slice(2, -2).split('|');
          return <TermLink key={i} id={id.trim()} label={label?.trim()} />;
        }
        if (p.startsWith('{{') && p.endsWith('}}')) {
          return <Cite key={i} ids={p.slice(2, -2).split(',').map((s) => s.trim())} />;
        }
        const link = p.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (link) {
          const external = /^https?:/.test(link[2]);
          return (
            <a key={i} href={link[2]} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
              {link[1]}
            </a>
          );
        }
        if (p.length > 2 && p.startsWith('*') && p.endsWith('*')) return <em key={i}>{p.slice(1, -1)}</em>;
        return <React.Fragment key={i}>{p}</React.Fragment>;
      })}
    </>
  );
}

export function Prose({ children, className }: { children: string; className?: string }) {
  const blocks = parseBlocks(children);
  return (
    <div className={cn('prose-md', className)}>
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'p':
            return <p key={i}><Inline text={b.text} /></p>;
          case 'h':
            return <h3 key={i}><Inline text={b.text} /></h3>;
          case 'quote':
            return <blockquote key={i}><Inline text={b.text} /></blockquote>;
          case 'code':
            return <pre key={i}><code>{b.text}</code></pre>;
          case 'ul':
          case 'ol': {
            const Tag = b.t;
            return (
              <Tag key={i}>
                {b.items.map((it, j) => (
                  <li key={j}><Inline text={it} /></li>
                ))}
              </Tag>
            );
          }
          case 'table':
            return (
              <div key={i} className="table-wrap">
                <table>
                  <thead>
                    <tr>{b.head.map((h, j) => <th key={j} scope="col"><Inline text={h} /></th>)}</tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>{r.map((c, k) => <td key={k}><Inline text={c} /></td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}

export function Cite({ ids }: { ids: string[] }) {
  return (
    <span className="whitespace-nowrap text-[0.8em]">
      {' '}
      (
      {ids.map((id, i) => {
        const r = referencesById[id];
        return (
          <React.Fragment key={id}>
            {i > 0 && '; '}
            <a href={`#/references?r=${id}`} className="!no-underline hover:!underline" title={r?.citation}>
              {r ? r.short : id}
            </a>
          </React.Fragment>
        );
      })}
      )
    </span>
  );
}

/** Inline glossary term: click/tap for a definition without leaving the page. */
export function TermLink({ id, label }: { id: string; label?: string }) {
  const term = glossaryById[id];
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number; flip: boolean } | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !btn.current) return;
    const r = btn.current.getBoundingClientRect();
    const width = Math.min(340, window.innerWidth - 24);
    const left = Math.min(Math.max(12, r.left), window.innerWidth - width - 12);
    const below = r.bottom + 8;
    const flip = below + 220 > window.innerHeight && r.top > 240;
    setPos({ top: flip ? r.top - 8 : below, left, width, flip });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== 'Escape') return;
      if (e instanceof MouseEvent && (pop.current?.contains(e.target as Node) || btn.current?.contains(e.target as Node))) return;
      setOpen(false);
    };
    const onScroll = () => setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
      window.removeEventListener('scroll', onScroll);
    };
  }, [open]);

  if (!term) return <span>{label ?? id}</span>;
  return (
    <>
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="cursor-help font-[inherit] text-inherit underline decoration-primary/60 decoration-dotted decoration-2 underline-offset-[3px] hover:decoration-primary"
      >
        {label ?? term.term}
      </button>
      {open && pos && (
        <div
          ref={pop}
          role="dialog"
          aria-label={term.term}
          className="fixed z-[60] rounded-xl border border-line-strong bg-surface p-4 text-left text-sm shadow-xl"
          style={{ top: pos.top, left: pos.left, width: pos.width, transform: pos.flip ? 'translateY(-100%)' : undefined }}
        >
          <div className="mb-1 flex items-start justify-between gap-3">
            <div className="font-semibold text-ink">{term.term}</div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close definition" className="text-muted hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="prose-md text-sm leading-relaxed text-ink-2">
            <p><Inline text={term.def} /></p>
          </div>
          <a href={`#/glossary?t=${term.id}`} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary-text" onClick={() => setOpen(false)}>
            Open in glossary <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </>
  );
}
