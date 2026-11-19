// End-to-end smoke test: visits every route at desktop and phone widths and fails on
// console errors, uncaught exceptions, unexpected "Page not found", or horizontal overflow.
// It also drives the main interactions (Test Finder, a case, the quiz, term popovers, labs).
//
// Usage: npm run build && npx vite preview --port 4173 &  npx vite-node scripts/smoke.mjs http://localhost:4173
// Requires Playwright (`npm i -D playwright` or a global install).
import { createRequire } from 'node:module';
import { cases } from '../src/content/cases';
import { labs } from '../src/content/labs';
import { methods } from '../src/content/methods';
import { modules } from '../src/content/modules';

const { chromium } = createRequire(import.meta.url)('playwright');
const base = process.argv[2] ?? 'http://localhost:4173';
const routes = [
  '/', '/learn', '/finder', '/methods', '/labs', '/cases', '/quiz', '/quiz?mode=review', '/quiz?mode=module&m=survival',
  '/glossary', '/glossary?t=p-value', '/references', '/references?r=consort2025', '/cheatsheet',
  ...modules.map((m) => `/learn/${m.id}`),
  ...methods.map((m) => `/methods/${m.id}`),
  ...labs.map((l) => `/labs/${l.id}`),
  ...cases.map((c) => `/cases/${c.id}`),
];

const problems = [];
const browser = await chromium.launch();

for (const vp of [{ name: 'desktop', width: 1280, height: 900 }, { name: 'phone', width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  let current = '';
  page.on('console', (m) => m.type() === 'error' && problems.push(`[${vp.name}] console error on ${current}: ${m.text()}`));
  page.on('pageerror', (e) => problems.push(`[${vp.name}] exception on ${current}: ${e.message}`));
  for (const r of routes) {
    current = r;
    await page.goto(`${base}/#${r}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(150);
    const nf = await page.getByRole('heading', { name: 'Page not found' }).count();
    if (nf) problems.push(`[${vp.name}] ${r} rendered "Page not found"`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) problems.push(`[${vp.name}] ${r} overflows horizontally by ${overflow}px`);
  }
  // unknown route should show NotFound
  current = '/nope';
  await page.goto(`${base}/#/nope`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(300);
  if (!(await page.getByRole('heading', { name: 'Page not found' }).count())) problems.push(`[${vp.name}] unknown route did not show NotFound`);
  await page.close();
}

// Interaction checks (desktop)
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('pageerror', (e) => problems.push(`[interaction] exception: ${e.message}`));
page.on('console', (m) => m.type() === 'error' && problems.push(`[interaction] console: ${m.text()}`));

// Test Finder: continuous → independent → two groups → symmetric → Welch
await page.goto(`${base}/#/finder`);
for (const label of ['Estimate the effect', 'Continuous', 'Independent groups', 'Two groups, unadjusted', 'Roughly symmetric']) {
  await page.getByRole('button', { name: new RegExp(label) }).first().click();
}
const welch = await page.getByRole('heading', { name: /Welch/ }).waitFor({ timeout: 5000 }).then(() => true, () => false);
if (!welch) problems.push('[finder] did not reach Welch t-test');
if (!page.url().includes('p=')) problems.push('[finder] path not stored in URL');

// Case: answer all steps
await page.goto(`${base}/#/cases/matched-cc`);
for (let i = 0; i < 3; i++) {
  await page.locator('ol button:not([disabled])').first().click();
  await page.waitForTimeout(100);
}
const debrief = await page.getByText(/correct on first attempt/).waitFor({ timeout: 5000 }).then(() => true, () => false);
if (!debrief) problems.push('[case] debrief not shown after all steps');

// Quiz: answer and advance
await page.goto(`${base}/#/quiz`);
await page.getByRole('radiogroup', { name: 'Answer options' }).getByRole('radio').first().click();
await page.getByRole('button', { name: /Next|Finish/ }).click();
if (!(await page.getByText(/Question 2 of/).count())) problems.push('[quiz] did not advance');

// Glossary popover inside a lesson
await page.goto(`${base}/#/learn/p-values`);
await page.getByRole('button', { name: 'p-value', exact: true }).first().click();
if (!(await page.getByRole('dialog', { name: 'p-value' }).count())) problems.push('[prose] term popover did not open');

// Lab interactions: move a slider and press buttons without errors
await page.goto(`${base}/#/labs/power`);
await page.getByRole('radio', { name: 'Two proportions' }).click();
await page.goto(`${base}/#/labs/ci-coverage`);
await page.getByRole('button', { name: /Draw 100 more/ }).click();
await page.goto(`${base}/#/labs/km`);
await page.getByRole('radio', { name: /Drop censored/ }).click();
await page.goto(`${base}/#/labs/regression`);
await page.getByRole('button', { name: /high-leverage/ }).click();
if (!(await page.getByText(/Cook’s distance/).first().count())) problems.push('[regression] influence message missing');
await page.goto(`${base}/#/labs/calibration`);
await page.waitForTimeout(400);
const slope = await page.getByText('Calibration slope').first().count();
if (!slope) problems.push('[calibration] lab did not render');

// Theme toggle cycles and persists
await page.goto(`${base}/#/`);
const btn = page.getByRole('button', { name: /^Theme:/ });
await btn.click();
await btn.click();
await page.reload();
const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('statsmd-v3') ?? '{}').state?.theme);
if (stored !== 'light') problems.push(`[theme] expected persisted "light", got ${stored}`);

await browser.close();
const total = routes.length * 2 + 2;
if (problems.length) {
  console.log(problems.join('\n'));
  console.log(`\n${problems.length} problem(s) across ${total} page loads`);
  process.exit(1);
}
console.log(`OK: ${total} page loads at two viewports + interaction checks, no errors`);
