'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const ts = require('typescript');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const yes = JSON.stringify({ version: 1, marketing: true, analytics: true, at: Date.now() });
const consentHeader = 'empire_consent_v1=' + encodeURIComponent(yes);
const baseline = process.argv.includes('--baseline');
function load(file, globals) {
  const source = baseline ? execFileSync('git', ['show', `origin/master:${file}`], { cwd: root, encoding: 'utf8' }) : fs.readFileSync(path.join(root, file), 'utf8');
  const mod = { exports: {} };
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText,
    { module: mod, exports: mod.exports, URL, URLSearchParams, console, ...globals, require: name => name.endsWith('marketingConsent') ? load('lib/marketingConsent.ts', globals) : globals.require(name) });
  return mod.exports;
}
function browser(cookies = {}, blocked = false) {
  const jar = { empire_consent_v1: encodeURIComponent(yes), ...cookies }, calls = [], pixels = [];
  const location = { origin: 'https://www.empire-internet.com', hostname: 'www.empire-internet.com', protocol: 'https:', pathname: '/academy', search: '', href: 'https://www.empire-internet.com/academy?email=private@example.test' };
  const document = {
    get cookie() { if (blocked) throw new Error('blocked'); return Object.entries(jar).map(([k, v]) => `${k}=${v}`).join(';'); },
    set cookie(value) { if (value.includes('max-age=0')) return; if (blocked) throw new Error('blocked'); const [k, ...v] = value.split(';')[0].split('='); jar[k] = v.join('='); },
  };
  const api = load('lib/meta.ts', { document, location, window: { fbq: (...args) => pixels.push(args) },
    fetch: async (_, options) => calls.push(JSON.parse(options.body)) });
  return { ...api, location, calls, pixels, jar };
}
function endpoint() {
  const events = [], pending = [];
  const route = load('app/api/meta/event/route.ts', { require(name) {
    if (name === 'next/server') return { NextResponse: { json: (body, options) => new Response(JSON.stringify(body), options) } };
    if (name === '@vercel/functions') return { waitUntil: p => pending.push(p) };
    if (name === '@/lib/metaCapi') return { matchingData: () => ({}), sendCapiEvent: async e => { events.push(e); return { ok: true }; } };
    throw new Error(name);
  } });
  return { events, async send(source, name = 'CompleteRegistration') {
    const res = await route.POST(new Request('https://www.empire-internet.com/api/meta/event', { method: 'POST', headers: { cookie: consentHeader }, body: JSON.stringify({ event_name: name, event_id: 'fixture', event_source_url: source }) }));
    await Promise.all(pending); return res;
  } };
}
const tests = [];
const test = (name, run) => tests.push({ name, run });
test('malformed, null and array cookies never interrupt capture or registration', () => {
  for (const cookie of ['%', 'null', '[]', '{"fbc":123}']) {
    const b = browser({ empire_attr: cookie });
    b.location.search = '?fbclid=new_click';
    b.captureAttribution(); b.trackMeta('CompleteRegistration');
    assert.equal(b.calls.length, 1);
  }
});
test('blocked storage does not break signup', () => {
  const b = browser({}, true); b.captureAttribution(); b.trackMeta('CompleteRegistration');
  assert.equal(b.calls.length, 1);
});
test('new shared click wins over stale pixel cookie and remains stable', () => {
  const b = browser({ empire_attr: encodeURIComponent(JSON.stringify({ fbc: 'fb.1.200.new' })), _fbc: 'fb.1.100.old' });
  assert.equal(b.readAttribution().fbc, 'fb.1.200.new');
  b.location.search = '?fbclid=next'; b.captureAttribution();
  const first = b.readAttribution().fbc;
  b.captureAttribution(); assert.equal(b.readAttribution().fbc, first);
});
test('new campaign drops old fields and survives navigation', () => {
  const b = browser({ empire_attr: encodeURIComponent(JSON.stringify({ utm_content: 'old', utm_term: 'old' })) });
  b.location.search = '?utm_campaign=C3&utm_content=ad_42'; b.captureAttribution();
  b.location.search = ''; b.captureAttribution();
  assert.equal(b.readAttribution().utm_content, 'ad_42'); assert.equal(b.readAttribution().utm_term, undefined);
});
test('browser cannot declare Purchase', () => {
  const b = browser(); b.trackMeta('Purchase', { value: 497 });
  assert.equal(b.calls.length, 0); assert.equal(b.pixels.length, 0);
});
test('browser strips private URL query', () => {
  const b = browser(); b.trackMeta('CompleteRegistration');
  assert.equal(b.calls[0].event_source_url, 'https://www.empire-internet.com/academy');
});
test('public endpoint strips URL query and refuses lookalike source domains', async () => {
  const f = endpoint();
  await f.send('https://app.empire-internet.com/join/academy?session=private#private');
  assert.equal(f.events[0].event_source_url, 'https://app.empire-internet.com/join/academy');
  for (const source of ['https://fakeempire-internet.com/academy', 'http://app.empire-internet.com/academy']) {
    await f.send(source); assert.equal(f.events.at(-1).event_source_url, undefined);
  }
});
test('public endpoint cannot declare Purchase', async () => {
  const f = endpoint(); assert.equal((await f.send('https://www.empire-internet.com', 'Purchase')).status, 400);
  assert.equal(f.events.length, 0);
});
(async () => {
  let failed = 0;
  for (const { name, run } of tests) { try { await run(); } catch (e) { failed++; console.error(`FAIL ${name}: ${e.message}`); } }
  console.log(`Meta browser: ${tests.length - failed}/${tests.length} passed (no network)`);
  process.exitCode = failed ? 1 : 0;
})();

