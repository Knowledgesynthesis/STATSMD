// Verifies every DOI in src/content/references.ts resolves on Crossref and that
// the registered title shares most of its words with the cited title.
// Usage: node scripts/check-references.mjs   (needs network access)
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/content/references.ts', import.meta.url), 'utf8');
const entries = [...src.matchAll(/citation: (['"])(.*?)\1, url: doi\('([^']+)'\)/g)].map((m) => ({ citation: m[2], doi: m[3] }));
const words = (s) => new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 3));
let bad = 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function lookup(doi) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, { headers: { 'User-Agent': 'statsmd-reference-check/1.0' } });
    if (res.status !== 429) return res;
    await sleep(2000 * (attempt + 1));
  }
  return { ok: false, status: 429 };
}
for (const { citation, doi } of entries) {
  await sleep(350);
  const res = await lookup(doi);
  if (!res.ok) { console.log(`FAIL ${doi}: HTTP ${res.status}`); bad++; continue; }
  const title = ((await res.json()).message.title?.[0] ?? '').replace(/^(statistics notes|research methods & reporting|education and debate)\s*:\s*/i, '');
  const t = words(title);
  const c = words(citation);
  const overlap = [...t].filter((w) => c.has(w)).length / Math.max(1, t.size);
  if (overlap < 0.6) { console.log(`MISMATCH ${doi}\n  crossref: ${title}\n  cited:    ${citation}`); bad++; }
}
console.log(`${entries.length - bad}/${entries.length} DOIs verified`);
process.exit(bad ? 1 : 0);
