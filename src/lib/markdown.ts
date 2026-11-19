/** Parser for the small markdown dialect used in course content (see content/types.ts). */

export const INLINE =
  /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|\[\[[^\]]+\]\]|\{\{[^}]+\}\}|\[[^\]]+\]\([^)\s]+\))/g;

export type Block =
  | { t: 'p'; text: string }
  | { t: 'h'; text: string }
  | { t: 'ul' | 'ol'; items: string[] }
  | { t: 'quote'; text: string }
  | { t: 'code'; text: string }
  | { t: 'table'; head: string[]; rows: string[][] };

/** Split a table row on '|' except inside [[term|label]] links. */
export function splitCells(row: string): string[] {
  const out: string[] = [];
  let buf = '';
  let depth = 0;
  for (let i = 0; i < row.length; i++) {
    if (row.startsWith('[[', i)) depth++;
    if (row.startsWith(']]', i)) depth = Math.max(0, depth - 1);
    if (row[i] === '|' && depth === 0) {
      out.push(buf.trim());
      buf = '';
    } else buf += row[i];
  }
  out.push(buf.trim());
  return out;
}

export function parseBlocks(src: string): Block[] {
  const lines = src.trim().split('\n');
  const blocks: Block[] = [];
  let i = 0;
  const cells = (l: string) => splitCells(l.trim().replace(/^\||\|$/g, ''));
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') {
      i++;
      continue;
    }
    if (line.startsWith('```')) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]);
      i++;
      blocks.push({ t: 'code', text: buf.join('\n') });
      continue;
    }
    if (line.startsWith('### ')) {
      blocks.push({ t: 'h', text: line.slice(4) });
      i++;
      continue;
    }
    if (line.trim().startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        if (!/^\s*\|[\s:|-]+\|\s*$/.test(lines[i])) rows.push(cells(lines[i]));
        i++;
      }
      blocks.push({ t: 'table', head: rows[0], rows: rows.slice(1) });
      continue;
    }
    const listMatch = (l: string) => (/^\s*- /.test(l) ? 'ul' : /^\s*\d+\. /.test(l) ? 'ol' : null);
    const kind = listMatch(line);
    if (kind) {
      const items: string[] = [];
      while (i < lines.length && listMatch(lines[i]) === kind) {
        let item = lines[i].replace(/^\s*(- |\d+\. )/, '');
        i++;
        // continuation lines (indented, not a new item)
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !listMatch(lines[i])) item += ' ' + lines[i++].trim();
        items.push(item);
      }
      blocks.push({ t: kind, items });
      continue;
    }
    if (line.startsWith('> ')) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) buf.push(lines[i++].slice(2));
      blocks.push({ t: 'quote', text: buf.join(' ') });
      continue;
    }
    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !listMatch(lines[i]) &&
      !lines[i].startsWith('### ') &&
      !lines[i].startsWith('```') &&
      !lines[i].trim().startsWith('|') &&
      !lines[i].startsWith('> ')
    )
      buf.push(lines[i++].trim());
    blocks.push({ t: 'p', text: buf.join(' ') });
  }
  return blocks;
}
