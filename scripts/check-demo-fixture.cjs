// Run with: node scripts/check-demo-fixture.cjs
/* eslint-disable @typescript-eslint/no-require-imports -- Script Node autocontenido para comprobar los módulos TS reales. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');

// Execute the real TS modules in Node; only device storage is replaced.
function loader() {
  const cache = new Map();
  function load(file, base = root) {
    file = path.resolve(file);
    if (!path.extname(file)) file += '.ts';
    if (cache.has(file)) return cache.get(file).exports;
    const loadedModule = { exports: {} };
    cache.set(file, loadedModule);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
    }).outputText;
    const localRequire = (id) => {
      if (id === '@/lib/storage') return { safeStorage: { getItem: async () => null, setItem: async () => {}, removeItem: async () => {} } };
      if (id.startsWith('@/')) return load(path.join(base, 'src', id.slice(2)), base);
      if (id.startsWith('.')) return load(path.resolve(path.dirname(file), id), base);
      return require(id);
    };
    new Function('require', 'module', 'exports', code)(localRequire, loadedModule, loadedModule.exports);
    return loadedModule.exports;
  }
  return load;
}

async function main() {
  const load = loader();
  const fixture = load(path.join(root, 'src/data/demo-fixture.ts')).DEMO_FIXTURE;

  const web = load(path.join(root, 'src/store/demo-store.ts')).useDemoStore;
  web.getState().resetDemo();
  assert.equal(web.getState().points, 100);
  web.getState().confirmVisit('stand-sabor-andino');
  assert.equal(web.getState().points, 150);
  assert.equal(web.getState().missionProgress[fixture.mission.id], 3);
  const count = web.getState().recentVisits.length;
  web.getState().confirmVisit('stand-sabor-andino');
  assert.equal(web.getState().points, 150);
  assert.equal(web.getState().recentVisits.length, count);
  assert.equal(web.getState().nfcStage, 'duplicate');
  web.getState().resetDemo();
  web.getState().confirmVisit('stand-semilla-capital');
  assert.equal(web.getState().missionProgress[fixture.mission.id], 2);

  // Sibling checkout required to verify the actual shared contract.
  const mobileRoot = path.resolve(root, '../fexpo-expo-app');
  const mobileStands = load(path.join(mobileRoot, 'src/data/demo-data.ts'), mobileRoot).STANDS;
  for (const stand of fixture.stands) {
    const other = mobileStands.find((item) => item.id === stand.id);
    for (const key of ['name', 'boothCode', 'zoneId', 'category', 'activity', 'promotion', 'points']) assert.equal(stand[key], other[key], `${stand.id}: ${key}`);
  }
  const mobile = load(path.join(mobileRoot, 'src/store/visitor-store.ts'), mobileRoot).useVisitorStore;
  mobile.getState().reset();
  for (const stand of fixture.stands) mobile.getState().confirmVisit(stand.id);
  assert.equal(mobile.getState().points, 150);
  assert.equal(mobile.getState().missionProgress[fixture.mission.id], 3);
  mobile.getState().confirmVisit(fixture.stands[0].id);
  assert.equal(mobile.getState().points, 150);
  assert.equal(mobile.getState().recentVisits.length, 3);
  mobile.getState().reset();
  mobile.getState().registerVisitIntent(fixture.stands[0].id);
  mobile.getState().registerVisitIntent(fixture.stands[0].id);
  assert.equal(mobile.getState().points, 0);
  assert.equal(mobile.getState().recentVisits.length, 1);
  mobile.getState().applyServerCheckin(fixture.stands[0].id, { pointsAwarded: 50 });
  assert.equal(mobile.getState().points, 50);
  assert.equal(mobile.getState().recentVisits[0].pending, false);

  process.env.NEXT_PUBLIC_API_MODE = 'mock';
  const mockScope = loader()(path.join(root, 'src/features/admin/admin-scope.ts')).adminScopeService;
  assert.equal((await mockScope.getStand('stand-altura-labs')).name, 'Altura Labs');

  process.env.NEXT_PUBLIC_API_MODE = 'http';
  process.env.BACKEND_URL = 'https://example.invalid';
  const httpScope = loader()(path.join(root, 'src/features/admin/admin-scope.ts')).adminScopeService;
  global.fetch = async () => { throw new Error('offline'); };
  await assert.rejects(httpScope.getStand('5a000000-0000-4000-8000-000000000001'));

  process.env.NEXT_PUBLIC_AGENT_BACKEND_URL = 'https://example.invalid';
  const backendPanel = loader()(path.join(root, 'src/lib/panel-stands.ts'));
  const eventId = 'e0000000-0000-4000-8000-000000000001';
  const standId = '5a000000-0000-4000-8000-000000000001';
  let calls = 0;
  global.fetch = async (url) => {
    calls++;
    if (url.startsWith(`https://example.invalid/api/v1/events/${eventId}/stands`)) {
      return new Response(JSON.stringify({
        success: true,
        data: [],
        meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
      }), { status: 200 });
    }
    assert.equal(url, `https://example.invalid/api/v1/stands/${standId}`);
    return new Response(JSON.stringify({
      success: true,
      data: {
        id: standId,
        boothCode: 'A-01',
        displayName: 'Stand servido por API',
        description: null,
        company: { id: 'c0000000-0000-4000-8000-000000000001', displayName: 'Empresa API' },
        categories: [],
        tags: [],
        featured: false,
        activityHighlight: null,
        promotionHighlight: null,
        location: null,
      },
      meta: null,
    }), { status: 200 });
  };
  assert.equal((await backendPanel.listStands(eventId)).total, 0);
  assert.equal((await backendPanel.getStandById(standId)).displayName, 'Stand servido por API');
  assert.equal(calls, 2);
  await assert.rejects(backendPanel.listStands(''));
  global.fetch = async () => { throw new Error('offline'); };
  await assert.rejects(backendPanel.listStands(eventId));
  await assert.rejects(backendPanel.getStandById(standId));
  console.log('PASS: /demo isolation, /panel HTTP adapter, explicit admin mock, HTTP error propagation, web/mobile fixture parity.');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
