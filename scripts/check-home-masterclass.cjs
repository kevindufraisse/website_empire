// Run without live credentials: exercise the route against a stubbed CRM.
const fs = require('node:fs')
const vm = require('node:vm')
const assert = require('node:assert/strict')
const ts = require('typescript')
const source = ts.transpileModule(fs.readFileSync('app/api/home-masterclass/route.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
class ValidationError extends Error {}
function route({ configured = true, contactError, tagError, tagId } = {}) {
  const calls = []
  const exports = {}
  const crm = {
    ValidationError,
    createOrUpdateContact: async payload => { calls.push(['contact', payload]); if (contactError) throw contactError; return { id: 42 } },
    addTagToContact: async (contact, tag) => { calls.push(['tag', contact, tag]); if (tagError) throw tagError },
  }
  vm.runInNewContext(source, {
    exports, process: { env: { SYSTEMEIO_API_KEY: configured ? 'test-placeholder' : '', SYSTEMEIO_TAG_HOME_GATE: tagId } },
    console: { error() {} },
    require: name => name === 'next/server' ? { NextResponse: { json: (body, init) => ({ body, status: init?.status || 200 }) } } : crm,
  })
  return { post: input => exports.POST({ json: async () => input }), calls, raw: exports.POST }
}
;(async () => {
  for (const input of [null, [], 'email', {}, {email:'broken'}, {email:{}}]) {
    const r = route(); assert.equal((await r.post(input)).status,400); assert.equal(r.calls.length,0)
  }
  const malformed=route(); assert.equal((await malformed.raw({json:async()=>{throw new Error('bad JSON')}})).status,400)
  const bot=route(); assert.equal((await bot.post({company:'spam',email:'lead@example.test'})).status,200); assert.equal(bot.calls.length,0)
  const missing=route({configured:false}); assert.equal((await missing.post({email:'lead@example.test'})).status,503); assert.equal(missing.calls.length,0)
  const ok=route(); assert.equal((await ok.post({email:' LEAD@EXAMPLE.TEST ',locale:'en'})).status,200)
  assert.equal(ok.calls[0][1].email,'lead@example.test'); assert.equal(ok.calls[0][1].locale,'en'); assert.deepEqual(ok.calls[1],['tag',42,2179856])
  const custom=route({tagId:'123'}); await custom.post({email:'lead@example.test'}); assert.equal(custom.calls[1][2],123)
  const fail=route({tagError:new Error('upstream failed')}); assert.equal((await fail.post({email:'lead@example.test'})).status,502)
  const rejected=route({contactError:new ValidationError('invalid email')}); assert.equal((await rejected.post({email:'lead@example.test'})).status,400); assert.equal(rejected.calls.length,1)
  console.log('Home masterclass: validation, honeypot, configuration, workflow tag and upstream failure checks passed.')
})().catch(error=>{console.error(error);process.exitCode=1})
