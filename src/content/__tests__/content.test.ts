/**
 * Content integrity: every cross-reference resolves, every quiz item has one
 * keyed answer, every decision path ends in a real method, tables are well formed.
 */
import { describe, expect, it } from 'vitest';
import { cases } from '../cases';
import { decisionById, decisionTree, ROOT } from '../decision-tree';
import { glossary, glossaryById } from '../glossary';
import { labs, labsById } from '../labs';
import { methods, methodsById } from '../methods';
import { modules, modulesById } from '../modules';
import { questions } from '../questions';
import { references, referencesById } from '../references';
import { parseBlocks } from '../../lib/markdown';

/** Every free-text field that is rendered through <Prose>/<Inline>. */
function allTexts(): { where: string; text: string }[] {
  const out: { where: string; text: string }[] = [];
  for (const m of modules) {
    m.sections.forEach((s, i) => {
      if (s.kind === 'text' || s.kind === 'callout') out.push({ where: `${m.id}#${i}`, text: s.body });
    });
    m.takeaways.forEach((t) => out.push({ where: `${m.id} takeaway`, text: t }));
  }
  for (const g of glossary) out.push({ where: `glossary ${g.id}`, text: g.def + ' ' + (g.example ?? '') });
  for (const q of questions) out.push({ where: `question ${q.id}`, text: [q.stem, ...q.options, q.why].join(' ') });
  for (const c of cases) {
    out.push({ where: `case ${c.id}`, text: c.scenario + ' ' + c.debrief });
    c.steps.forEach((s) => out.push({ where: `case ${c.id} step`, text: [s.prompt, ...s.options.flatMap((o) => [o.text, o.feedback])].join(' ') }));
  }
  for (const n of decisionTree) {
    out.push({ where: `node ${n.id}`, text: [n.question, n.help ?? '', ...n.options.flatMap((o) => [o.label, o.detail ?? '', o.result?.why ?? '', o.result?.watch ?? ''])].join(' ') });
  }
  return out;
}

const unique = (xs: string[]) => new Set(xs).size === xs.length;

describe('ids are unique', () => {
  it.each([
    ['references', references.map((r) => r.id)],
    ['glossary', glossary.map((g) => g.id)],
    ['methods', methods.map((m) => m.id)],
    ['modules', modules.map((m) => m.id)],
    ['questions', questions.map((q) => q.id)],
    ['cases', cases.map((c) => c.id)],
    ['decision nodes', decisionTree.map((n) => n.id)],
    ['labs', labs.map((l) => l.id)],
  ])('%s', (_, ids) => expect(unique(ids)).toBe(true));
});

describe('inline links resolve', () => {
  const texts = allTexts();
  it('every [[glossary]] link exists', () => {
    const missing: string[] = [];
    for (const { where, text } of texts)
      for (const m of text.matchAll(/\[\[([^\]|]+)(\|[^\]]+)?\]\]/g)) if (!glossaryById[m[1].trim()]) missing.push(`${where}: ${m[1]}`);
    expect(missing).toEqual([]);
  });
  it('every {{citation}} exists', () => {
    const missing: string[] = [];
    for (const { where, text } of texts)
      for (const m of text.matchAll(/\{\{([^}]+)\}\}/g))
        for (const id of m[1].split(',').map((s) => s.trim())) if (!referencesById[id]) missing.push(`${where}: ${id}`);
    expect(missing).toEqual([]);
  });
  it('internal route links point to known routes', () => {
    const bad: string[] = [];
    for (const { where, text } of texts)
      for (const m of text.matchAll(/\]\((#\/[^)]+)\)/g))
        if (!/^#\/(finder|learn|labs|methods|cases|quiz|glossary|references|cheatsheet)/.test(m[1])) bad.push(`${where}: ${m[1]}`);
    expect(bad).toEqual([]);
  });
  it('markdown tables have consistent column counts', () => {
    const bad: string[] = [];
    for (const { where, text } of texts)
      for (const b of parseBlocks(text)) if (b.t === 'table') b.rows.forEach((r, i) => r.length !== b.head.length && bad.push(`${where} row ${i}: ${r.length} vs ${b.head.length}`));
    expect(bad).toEqual([]);
  });
  it('no unbalanced bold markers', () => {
    const bad = allTexts().filter(({ text }) => (text.match(/\*\*/g)?.length ?? 0) % 2 !== 0).map((t) => t.where);
    expect(bad).toEqual([]);
  });
});

describe('references', () => {
  it('every reference is cited somewhere', () => {
    const cited = new Set<string>();
    const blob = allTexts().map((t) => t.text).join(' ');
    for (const m of blob.matchAll(/\{\{([^}]+)\}\}/g)) m[1].split(',').forEach((id) => cited.add(id.trim()));
    methods.forEach((m) => m.refs.forEach((r) => cited.add(r)));
    questions.forEach((q) => q.refs?.forEach((r) => cited.add(r)));
    cases.forEach((c) => c.refs?.forEach((r) => cited.add(r)));
    expect(references.filter((r) => !cited.has(r.id)).map((r) => r.id)).toEqual([]);
  });
  it('structured ref lists resolve', () => {
    const missing = [
      ...methods.flatMap((m) => m.refs.filter((r) => !referencesById[r]).map((r) => `method ${m.id}: ${r}`)),
      ...questions.flatMap((q) => (q.refs ?? []).filter((r) => !referencesById[r]).map((r) => `q ${q.id}: ${r}`)),
      ...cases.flatMap((c) => (c.refs ?? []).filter((r) => !referencesById[r]).map((r) => `case ${c.id}: ${r}`)),
    ];
    expect(missing).toEqual([]);
  });
});

describe('glossary', () => {
  it('see-also and module links resolve', () => {
    const bad = glossary.flatMap((g) => [
      ...(g.see ?? []).filter((s) => !glossaryById[s]).map((s) => `${g.id} → ${s}`),
      ...(g.module && !modulesById[g.module] ? [`${g.id} module ${g.module}`] : []),
    ]);
    expect(bad).toEqual([]);
  });
});

describe('methods', () => {
  it('alternatives and modules resolve, no self-reference', () => {
    const bad = methods.flatMap((m) => [
      ...m.alternatives.filter((a) => !methodsById[a] || a === m.id).map((a) => `${m.id} alt ${a}`),
      ...(m.module && !modulesById[m.module] ? [`${m.id} module ${m.module}`] : []),
    ]);
    expect(bad).toEqual([]);
  });
  it('every method is reachable from the Test Finder', () => {
    const reachable = new Set<string>();
    decisionTree.forEach((n) => n.options.forEach((o) => o.result && [o.result.primary, ...(o.result.also ?? [])].forEach((id) => reachable.add(id))));
    expect(methods.filter((m) => !reachable.has(m.id)).map((m) => m.id)).toEqual([]);
  });
});

describe('decision tree', () => {
  it('each option has exactly one of next/result, and targets exist', () => {
    const bad: string[] = [];
    for (const n of decisionTree)
      for (const o of n.options) {
        if (!!o.next === !!o.result) bad.push(`${n.id}: "${o.label}" needs exactly one of next/result`);
        if (o.next && !decisionById[o.next]) bad.push(`${n.id} → missing node ${o.next}`);
        if (o.result) [o.result.primary, ...(o.result.also ?? [])].forEach((id) => !methodsById[id] && bad.push(`${n.id}: missing method ${id}`));
        if (o.result?.also?.includes(o.result.primary)) bad.push(`${n.id}: primary repeated in also`);
      }
    expect(bad).toEqual([]);
  });
  it('every node is reachable from the root and the graph is acyclic', () => {
    const seen = new Set<string>();
    const visit = (id: string, path: string[]) => {
      expect(path).not.toContain(id);
      seen.add(id);
      decisionById[id].options.forEach((o) => o.next && visit(o.next, [...path, id]));
    };
    visit(ROOT, []);
    expect(decisionTree.filter((n) => !seen.has(n.id)).map((n) => n.id)).toEqual([]);
  });
});

describe('modules', () => {
  it('are numbered 1..n without gaps', () => expect(modules.map((m) => m.n)).toEqual(modules.map((_, i) => i + 1)));
  it('embed only known labs', () => {
    const bad = modules.flatMap((m) => m.sections.filter((s) => s.kind === 'lab' && !labsById[s.lab]).map((s) => `${m.id}: ${(s as { lab: string }).lab}`));
    expect(bad).toEqual([]);
  });
  it('every lab is embedded in at least one module', () => {
    const used = new Set(modules.flatMap((m) => m.sections.flatMap((s) => (s.kind === 'lab' ? [s.lab] : []))));
    expect(labs.filter((l) => !used.has(l.id)).map((l) => l.id)).toEqual([]);
  });
  it('each module has at least 3 quiz questions', () => {
    const thin = modules.filter((m) => questions.filter((q) => q.module === m.id).length < 3).map((m) => m.id);
    expect(thin).toEqual([]);
  });
});

describe('questions', () => {
  it('are well formed', () => {
    const bad: string[] = [];
    for (const q of questions) {
      if (!modulesById[q.module]) bad.push(`${q.id}: module ${q.module}`);
      if (q.answer < 0 || q.answer >= q.options.length) bad.push(`${q.id}: answer index`);
      if (q.options.length < 3) bad.push(`${q.id}: < 3 options`);
      if (!unique(q.options)) bad.push(`${q.id}: duplicate options`);
      if (q.why.length < 40) bad.push(`${q.id}: explanation too short`);
    }
    expect(bad).toEqual([]);
  });
});

describe('cases', () => {
  it('each step has exactly one correct option and feedback for every option', () => {
    const bad: string[] = [];
    for (const c of cases) {
      c.modules.forEach((m) => !modulesById[m] && bad.push(`${c.id}: module ${m}`));
      c.steps.forEach((s, i) => {
        if (s.options.filter((o) => o.correct).length !== 1) bad.push(`${c.id} step ${i}: correct count`);
        s.options.forEach((o) => o.feedback.length < 15 && bad.push(`${c.id} step ${i}: thin feedback`));
      });
    }
    expect(bad).toEqual([]);
  });
});
