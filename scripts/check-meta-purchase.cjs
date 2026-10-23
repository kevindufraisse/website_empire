'use strict';
// Signed Stripe requests + real CAPI serialization, with network replaced by a recorder.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const ts = require('typescript');
const Stripe = require('stripe');
const root = path.resolve(__dirname, '..');
const baseline = process.argv.includes('--baseline');
const read = (file) => baseline
  ? execFileSync('git', ['show', `origin/master:${file}`], { cwd: root, encoding: 'utf8' })
  : fs.readFileSync(path.join(root, file), 'utf8');
const quiet = { log() {}, warn() {}, error() {} };
function load(file, globals) {
  const mod = { exports: {} };
  vm.runInNewContext(ts.transpileModule(read(file), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText, { module: mod, exports: mod.exports, console: quiet, ...globals });
  return mod.exports;
}
function fixture() {
  const calls = [];
  const env = { STRIPE_META_WEBHOOK_SECRET: 'whsec_fixture', META_CAPI_TOKEN: 'fixture_token' };
  const network = { status: 200, fail: false };
  const capi = load('lib/metaCapi.ts', {
    require, process: { env }, URLSearchParams,
    fetch: async (url, options) => {
      calls.push({ url, params: Object.fromEntries(options.body), data: JSON.parse(options.body.get('data'))[0] });
      if (network.fail) throw new Error('network unavailable');
      return new Response(JSON.stringify({ events_received: 1 }), { status: network.status });
    },
  });
  const route = load('app/api/meta/stripe-webhook/route.ts', {
    process: { env }, require(name) {
      if (name === 'stripe') return Stripe;
      if (name === '@/lib/metaCapi') return capi;
      if (name === 'next/server') return { NextResponse: { json: (body, options) => new Response(JSON.stringify(body), options) } };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  async function send(session = {}, type = 'checkout.session.completed', signature = true) {
    const payload = JSON.stringify({ id: 'evt_fixture', type, created: 1792674000, data: { object: {
      id: 'cs_fixture', livemode: true, payment_status: 'paid', amount_total: 29700, currency: 'eur',
      metadata: { pack: 'bootcamp', utm_content: 'ad_42', utm_campaign: 'C3', meta_fbc: 'fb.1.123.click' },
      customer_details: { email: ' Buyer@example.test ', phone: '+33612345678' }, ...session,
    } } });
    const header = signature ? Stripe.webhooks.generateTestHeaderString({ payload, secret: 'whsec_fixture' }) : 'invalid';
    return route.POST(new Request('https://www.empire-internet.com/api/meta/stripe-webhook', {
      method: 'POST', headers: { 'stripe-signature': header }, body: payload,
    }));
  }
  return { send, calls, env, network };
}
const tests = [];
const test = (name, run) => tests.push({ name, run });
test('paid signed checkout sends its actual amount, currency and attribution once', async () => {
  const f = fixture();
  assert.equal((await f.send()).status, 200);
  assert.equal(f.calls.length, 1);
  const { data } = f.calls[0];
  assert.equal(data.event_name, 'Purchase');
  assert.equal(data.event_id, 'Purchase.cs_fixture');
  assert.equal(data.custom_data.value, 297);
  assert.equal(data.custom_data.currency, 'EUR');
  assert.equal(data.custom_data.utm_content, 'ad_42');
  assert.equal(data.custom_data.content_name, 'academy_bootcamp');
  assert.equal(data.user_data.fbc, 'fb.1.123.click');
  assert.match(data.user_data.em, /^[a-f0-9]{64}$/);
});
test('Stripe retries and delayed payment use the same deduplication ID', async () => {
  const f = fixture();
  await f.send(); await f.send({}, 'checkout.session.async_payment_succeeded');
  assert.equal(f.calls[0].data.event_id, f.calls[1].data.event_id);
});
test('unpaid checkout and unrelated event do not send Purchase', async () => {
  const f = fixture();
  await f.send({ payment_status: 'unpaid' });
  await f.send({}, 'customer.created');
  assert.equal(f.calls.length, 0);
});
test('invalid signature is rejected before sending any event', async () => {
  const f = fixture();
  assert.equal((await f.send({}, undefined, false)).status, 400);
  assert.equal(f.calls.length, 0);
});
test('missing webhook secret returns failure', async () => {
  const f = fixture(); delete f.env.STRIPE_META_WEBHOOK_SECRET;
  assert.equal((await f.send()).status, 500);
  assert.equal(f.calls.length, 0);
});
test('missing CAPI token keeps the Stripe retry alive', async () => {
  const f = fixture(); delete f.env.META_CAPI_TOKEN;
  assert.equal((await f.send()).status, 502);
  assert.equal(f.calls.length, 0);
});
test('Meta rejection and network failure return failure for a Stripe retry', async () => {
  const f = fixture(); f.network.status = 400;
  assert.equal((await f.send()).status, 502);
  f.network.fail = true;
  assert.equal((await f.send()).status, 502);
});
test('Stripe test payment never enters live campaign reporting', async () => {
  const f = fixture();
  await f.send({ livemode: false });
  assert.equal(f.calls.length, 0);
});
test('Stripe test payment may be sent only with Meta Test Events code', async () => {
  const f = fixture(); f.env.META_TEST_EVENT_CODE = 'TEST_fixture';
  await f.send({ livemode: false });
  assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0].params.test_event_code, 'TEST_fixture');
});
test('legacy customer_email remains usable for matching', async () => {
  const f = fixture();
  await f.send({ customer_details: null, customer_email: 'buyer@example.test' });
  assert.match(f.calls[0].data.user_data.em, /^[a-f0-9]{64}$/);
});
test('unknown product cannot create an Academy sale', async () => {
  const f = fixture();
  await f.send({ metadata: { pack: 'unrelated' } });
  assert.equal(f.calls.length, 0);
});
test('public thank-you page cannot declare an unverified purchase', () => {
  const code = read('app/academy/merci/AcademyThankYouClient.tsx');
  assert.doesNotMatch(code, /fbq.*['"]Purchase['"]|academy_purchase_confirmed/);
});
(async () => {
  let failed = 0;
  for (const { name, run } of tests) {
    try { await run(); } catch (e) { failed++; console.error(`FAIL ${name}: ${e.message}`); }
  }
  console.log(`Meta Purchase: ${tests.length - failed}/${tests.length} passed (no network)`);
  process.exitCode = failed ? 1 : 0;
})();
