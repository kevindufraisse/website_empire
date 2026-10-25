'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { createHash } = require('node:crypto');
const root = path.resolve(__dirname, '..');
const load = (file, globals) => {
  const mod = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'), { compilerOptions: { esModuleInterop:true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, { module:mod, exports:mod.exports, console, ...globals });
  return mod.exports;
};
const sent = [];
const capi = load('lib/metaCapi.ts', { require, process: { env: { META_CAPI_TOKEN:'offline_fixture', META_TEST_EVENT_CODE:'TEST_OFFLINE' } }, URLSearchParams, AbortController, setTimeout, clearTimeout,
  fetch: async (_url, opts) => { sent.push({ data:JSON.parse(opts.body.get('data')),test_event_code:opts.body.get('test_event_code') });return new Response('{"events_received":1}'); } });
const sha = value => createHash('sha256').update(value).digest('hex');
const identity = capi.matchingData({ email:' TEST @example.com ',phone:'06 12 34 56 78',first_name:' Jean ',last_name:' Dupont ',user_id:'fixture-user' });
assert.equal(identity.em,sha('test@example.com'));assert.equal(identity.ph,sha('33612345678'));assert.equal(identity.fn,sha('jean'));assert.equal(identity.ln,sha('dupont'));assert.equal(identity.external_id,sha('fixture-user'));
assert.equal(capi.hashPhone('123'),undefined);assert.equal(capi.hashPhone('+12345678901234567890'),undefined);
assert.equal(capi.matchingData({identity:{em:identity.em,ph:identity.ph},email:'someoneelse@example.com'}).ph,undefined);
assert.deepEqual(Object.keys(capi.matchingData({identity:{em:'not-a-hash'}})),[]);
const pending = [];
const route = load('app/api/meta/event/route.ts',{ URL, require(name) {
  if(name==='@/lib/metaCapi')return capi;
  if(name==='@vercel/functions')return {waitUntil:p=>pending.push(p)};
  if(name==='next/server')return {NextResponse:{json:(body,opts)=>{const res=new Response(JSON.stringify(body),opts);res.cookies={set(){}};return res;}}};
  throw Error(name);
} });
(async()=>{
  for(const name of ['CompleteRegistration','InitiateCheckout']) {
    const id=`${name}.offline-fixture`;
    const res=await route.POST(new Request('https://www.empire-internet.com/api/meta/event',{ method:'POST',headers:{origin:'https://app.empire-internet.com','x-forwarded-for':'192.0.2.1','user-agent':'Offline fixture browser'},body:JSON.stringify({event_name:name,event_id:id,event_source_url:name==='CompleteRegistration'?'https://www.empire-internet.com/partenaire':'https://app.empire-internet.com/join/academy',identity,attribution:{fbp:'fb.1.123.fixture',fbc:'fb.1.123.click',utm_campaign:'fixture'},custom_data:name==='InitiateCheckout'?{value:497,currency:'EUR'}:{content_name:'portes_ouvertes'}})}));
    assert.equal(res.status,200);await Promise.all(pending);
    const event=sent.at(-1).data[0];assert.equal(event.event_id,id);assert.equal(event.user_data.em,identity.em);assert.equal(event.user_data.ph,identity.ph);assert.equal(event.user_data.client_ip_address,'192.0.2.1');assert.equal(sent.at(-1).test_event_code,'TEST_OFFLINE');
  }
  const Stripe = require('stripe');
  const webhook = load('app/api/meta/stripe-webhook/route.ts', { process: { env: { STRIPE_META_WEBHOOK_SECRET:'whsec_offline_fixture', META_TEST_EVENT_CODE:'TEST_OFFLINE' } }, require(name) {
    if(name==='stripe')return Stripe;
    if(name==='@/lib/metaCapi')return capi;
    if(name==='next/server')return {NextResponse:{json:(body,opts)=>new Response(JSON.stringify(body),opts)}};
    throw Error(name);
  } });
  const payload=JSON.stringify({type:'checkout.session.completed',created:Math.floor(Date.now()/1000),data:{object:{id:'cs_test_offline_fixture',livemode:false,payment_status:'paid',amount_total:49700,currency:'eur',metadata:{pack:'partner',meta_fbp:'fb.1.123.fixture',meta_fbc:'fb.1.123.click',utm_campaign:'fixture',meta_source_url:'https://app.empire-internet.com/join/academy'},customer_details:{email:'test@example.com',phone:'+33612345678'}}}});
  const signature=Stripe.webhooks.generateTestHeaderString({payload,secret:'whsec_offline_fixture'});
  assert.equal((await webhook.POST(new Request('https://www.empire-internet.com/api/meta/stripe-webhook',{method:'POST',headers:{'stripe-signature':signature},body:payload}))).status,200);
  assert.equal(sent.at(-1).data[0].event_id,'cs_test_offline_fixture');

  const masked=sent.map(payload=>JSON.parse(JSON.stringify(payload,(_key,value)=>typeof value==='string'&&/^[a-f0-9]{64}$/.test(value)?'[SHA-256 masqué]':value)));
  if(process.argv.includes('--samples')) {
    fs.mkdirSync(path.join(root,'docs'),{recursive:true});
    fs.writeFileSync(path.join(root,'docs/meta-payloads-offline.json'),JSON.stringify({notice:'Captures du transport simulé avec identité fictive complète, aucun envoi à Meta. Le formulaire WebinarJam actuel ne fournit pas ces coordonnées au site. IP/UA achat non persistés dans Stripe.',payloads:masked},null,2)+'\n');
  }
  console.log('Meta matching: normalized hashes, stale identity isolation, two real event handlers, CAPI payloads and test code passed (no network)');
})().catch(err=>{console.error(err);process.exitCode=1;});
