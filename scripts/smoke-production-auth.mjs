// Production checks: no account login, no fixtures and no business data mutations.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
const base = (process.argv[2] ?? 'https://fexpo.lat').replace(/\/$/, '');
const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;
assert.ok(clientId, 'Set NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID');
async function json(path, status, init) {
  const r = await fetch(`${base}${path}`, { ...init, signal: AbortSignal.timeout(30_000) });
  const body = await r.json();
  assert.equal(r.status, status, JSON.stringify(body));
  return body;
}
const html = await fetch(`${base}/acceso`, { signal: AbortSignal.timeout(30_000) });
assert.equal(html.status, 200);
assert.doesNotMatch(await html.text(), /Falta configurar NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID/);
const health = await json('/api/v1/health/ready', 200);
assert.equal(health.data.database, 'up');
await json('/api/v1/auth/me', 401);
const invalid = await json('/api/v1/auth/google', 401, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ idToken: 'invalid-production-auth-smoke', device: {
    id: '00000000-0000-4000-8000-000000000011', platform: 'web',
  } }),
});
assert.equal(invalid.error.code, 'INVALID_GOOGLE_TOKEN');
console.log('OK HTTPS access page and real backend proxy: readiness, private route and invalid Google token');

const browser = await chromium.launch({ headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {}),
});
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [], oauthErrors = [], responses = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => {
    if (/origin_mismatch|origin.*not allowed/i.test(m.text())) oauthErrors.push(m.text());
  });
  page.on('response', r => {
    if (r.url().startsWith('https://accounts.google.com/gsi/'))
      responses.push({ path: new URL(r.url()).pathname, status: r.status() });
  });
  await page.goto(`${base}/acceso`, { waitUntil: 'domcontentloaded' });
  const button = page.frameLocator('iframe[src*="accounts.google.com/gsi/button"]').first().getByRole('button').first();
  await button.waitFor({ state: 'visible', timeout: 25_000 });
  const frame = page.frames().find(f => f.url().includes('/gsi/button'));
  assert.equal(new URL(frame.url()).searchParams.get('client_id'), clientId);
  assert.equal(await page.getByText('Falta configurar NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID', { exact: false }).count(), 0);
  assert.equal(await page.locator('input[type=password]').count(), 0);
  await mkdir('test-results/production-auth', { recursive: true });
  await page.screenshot({ path: 'test-results/production-auth/acceso.png', fullPage: true });
  const [popup] = await Promise.all([page.waitForEvent('popup'), button.click()]);
  await popup.waitForLoadState('domcontentloaded');
  const url = new URL(popup.url());
  assert.equal(url.hostname, 'accounts.google.com');
  assert.equal(url.searchParams.get('client_id'), clientId);
  assert.equal(url.searchParams.get('origin'), base);
  assert.doesNotMatch(await popup.locator('body').innerText(), /origin_mismatch/i);
  assert.deepEqual(errors, []);
  assert.deepEqual(oauthErrors, []);
  assert.ok(responses.some(r => r.path === '/gsi/button' && r.status === 200));
  await writeFile('test-results/production-auth/report.json', JSON.stringify({
    base, clientId, errors, oauthErrors, responses, buttonVisible: true,
    popupOrigin: url.searchParams.get('origin'), realUserLoginTested: false,
  }, null, 2));
  console.log('OK mobile Google button and popup use the production client and origin, without configuration errors');
  console.log('No credentials entered; login completion and panel roles require a real account.');
} finally { await browser.close(); }
