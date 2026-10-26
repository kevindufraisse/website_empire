const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(require('node:path').join(__dirname, '../app/api/demo-email/route.ts'), 'utf8');
class ValidationError extends Error {}
function route({fail, configured = true, tagPromise, mutant = false} = {}) {
  const calls = [];
  const module = {exports:{}};
  const api = {
    ValidationError,
    ensureTagByName: async name => {calls.push(['segment', name]); return 19;},
    createOrUpdateContact: async data => {calls.push(['contact', data]); if(fail === 'email')throw new ValidationError(); if(fail === 'contact')throw new Error('Provider unavailable'); return {id:12};},
    addTagToContact: async (id, tag) => {calls.push(['tag', id, tag]); if(fail === 'tag')throw new Error('Provider unavailable'); await tagPromise;},
  };
  const input = mutant ? source.replace('await addTagToContact(', 'void addTagToContact(') : source;
  vm.runInNewContext(ts.transpileModule(input, {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText, {
    module, exports:module.exports, process:{env:{SYSTEMEIO_API_KEY:configured?'fixture':undefined}},console:{error(){}},
    require(name){if(name==='@/lib/systemeio')return api; if(name==='next/server')return {NextResponse:{json:(data, opts)=>new Response(JSON.stringify(data),opts)}};throw Error(name);},
  });
  return {calls, post:body=>module.exports.POST(new Request('https://example.test/api/demo-email',{method:'POST',body}))};
}
async function waitsForCapture(mutant = false) {
  let release, settled = false;
  const tagPromise = new Promise(r=>{release=r});
  const r = route({tagPromise,mutant});
  const pending = r.post(JSON.stringify({firstName:' Test ',email:' Test@Example.test ',locale:'en'})).then(v=>{settled=true;return v});
  await new Promise(setImmediate);
  const wasPremature = settled;
  release();
  const response = await pending;
  assert.equal(wasPremature,false,'The choice must wait for the contact AND tag to be saved');
  assert.equal(response.status,200);
  assert.equal((await response.json()).success,true);
  assert.equal(r.calls[0][1],'empire-demo-requested');
  assert.equal(r.calls[1][1].email,'test@example.test');
  assert.equal(r.calls[1][1].locale,'en');
  assert.equal(r.calls[1][1].firstName,'Test');
}
(async()=>{
  for(const body of ['broken','null','[]','{}','{"email":3}','{"email":"invalid"}','{"email":"fixture@example.test"}','{"firstName":" ","email":"fixture@example.test"}','{"firstName":12,"email":"fixture@example.test"}']){const r=route();assert.equal((await r.post(body)).status,400);assert.equal(r.calls.length,0)}
  const bot=route();assert.equal((await bot.post(JSON.stringify({company:'spam'}))).status,200);assert.equal(bot.calls.length,0);
  const noKey=route({configured:false});assert.equal((await noKey.post('{"firstName":"Test","email":"fixture@example.test"}')).status,503);assert.equal(noKey.calls.length,0);
  for(const fail of ['email','contact','tag']){const r=route({fail});const response=await r.post('{"firstName":"Test","email":"fixture@example.test"}');assert.equal(response.status,fail==='email'?400:503);assert.notEqual((await response.json()).success,true)}
  await waitsForCapture();
  await assert.rejects(()=>waitsForCapture(true),/The choice must wait/);
  console.log('PASS demo capture: invalid input, bot, missing configuration, provider rejection, contact/tag failure, awaited save. Self-test rejects premature success. No network.');
})().catch(e=>{console.error(e);process.exitCode=1});
