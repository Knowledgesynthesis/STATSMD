import { useSyncExternalStore } from 'react';

/** Minimal hash router: deep links work on any static host without rewrites. */
export interface Route {
  path: string;
  parts: string[];
  query: URLSearchParams;
}

function read(): Route {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart = ''] = raw.split('?');
  const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
  return { path, parts: path.split('/').filter(Boolean), query: new URLSearchParams(queryPart) };
}

let current = read();
const listeners = new Set<() => void>();

window.addEventListener('hashchange', () => {
  const prev = current.path;
  current = read();
  if (current.path !== prev) window.scrollTo({ top: 0 });
  listeners.forEach((l) => l());
});

export function useRoute(): Route {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
  );
}

export function navigate(to: string) {
  window.location.hash = to.startsWith('#') ? to : `#${to}`;
}

export const href = (to: string) => `#${to}`;
