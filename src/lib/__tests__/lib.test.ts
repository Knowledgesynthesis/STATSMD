import { describe, expect, it } from 'vitest';
import { parseBlocks, splitCells } from '../markdown';
import { fmt, formatP, pValue } from '../utils';
import { BOX_INTERVAL_DAYS, isDue, mastery } from '../progress';

describe('formatting', () => {
  it('formats p-values without rounding across 0.05', () => {
    expect(formatP(0.0004)).toBe('p < 0.001');
    expect(formatP(0.049)).toBe('p = 0.049');
    expect(formatP(0.0175)).toBe('p = 0.018');
    expect(formatP(0.23)).toBe('p = 0.23');
    expect(formatP(0.999)).toBe('p > 0.99');
    expect(pValue(0.049)).toBe('0.049');
    expect(pValue(0.0001)).toBe('< 0.001');
  });
  it('uses a true minus sign and handles infinities', () => {
    expect(fmt(-1.234)).toBe('−1.23');
    expect(fmt(Infinity)).toBe('∞');
  });
});

describe('markdown dialect', () => {
  it('does not split table cells on pipes inside [[term|label]]', () => {
    expect(splitCells('[[nnt|NNT]] | 1 / ARR | ∞')).toEqual(['[[nnt|NNT]]', '1 / ARR', '∞']);
  });
  it('parses paragraphs, lists, headings and tables', () => {
    const b = parseBlocks('Intro line\ncontinues.\n\n- one\n- two\n\n### Head\n\n| A | B |\n|---|---|\n| 1 | 2 |');
    expect(b.map((x) => x.t)).toEqual(['p', 'ul', 'h', 'table']);
    expect(b[0]).toEqual({ t: 'p', text: 'Intro line continues.' });
    expect(b[3]).toEqual({ t: 'table', head: ['A', 'B'], rows: [['1', '2']] });
  });
});

describe('spaced repetition', () => {
  it('unseen questions are due; a fresh correct answer in box 3 is not', () => {
    expect(isDue(undefined)).toBe(true);
    const now = Date.now();
    expect(isDue({ box: 3, seen: 2, correct: 2, last: now, lastCorrect: true }, now)).toBe(false);
    expect(isDue({ box: 3, seen: 2, correct: 2, last: now - BOX_INTERVAL_DAYS[3] * 86_400_000, lastCorrect: true }, now)).toBe(true);
  });
  it('mastery counts questions whose last answer was correct', () => {
    expect(mastery(['a', 'b'], { a: { box: 2, seen: 1, correct: 1, last: 0, lastCorrect: true } })).toBe(0.5);
  });
});
