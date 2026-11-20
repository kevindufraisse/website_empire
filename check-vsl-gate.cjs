const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const { stripTypeScriptTypes } = require('node:module')
const source = fs.readFileSync(process.argv[2] || 'components/VideoEmailGate.tsx', 'utf8')
const head = source.split('/** Formulaire')[0].replace(/^import .*$/gm, '').replace(/export /g, '')
const code = stripTypeScriptTypes(head)
function run({ stored = null, search = '', funnel = 'academy', reject = false } = {}) {
  const calls = [], events = []
  const storage = new Map(stored === null ? [] : [['empire_vsl_email_v1', stored]])
  const context = { URLSearchParams, window: { location: { search }, localStorage: { getItem: k => storage.get(k) || null, setItem: (k,v) => storage.set(k,v) } }, fetch: (url, init) => { calls.push({url, ...init, body: JSON.parse(init.body)}); return reject ? Promise.reject(new Error('offline')) : Promise.resolve({ok:true}) }, trackAmplitude: (...a) => events.push(a) }
  vm.runInNewContext(code, context)
  return { unlocked: context.adoptEmailFromUrl(funnel), calls, events, storage }
}
let r = run({stored:'known@example.com'})
assert.equal(r.unlocked, true)
assert.equal(r.calls.length, 1, 'an existing Empire viewer must be sent to the Academy endpoint')
assert.equal(r.calls[0].body.funnel, 'academy')
assert.equal(r.calls[0].body.email, 'known@example.com')
assert.equal(r.calls[0].keepalive, true)
assert.equal(r.events.length, 0, 'restoring an email is not a new email submission')
r = run({search:'?email=NEW%40EXAMPLE.COM', funnel:'empire'})
assert.equal(r.unlocked, true)
assert.equal(r.calls[0].body.email, 'new@example.com')
assert.equal(r.calls[0].body.funnel, 'empire')
r = run({stored:'old@example.com', search:'?email=new@example.com'})
assert.equal(r.calls[0].body.email, 'new@example.com')
assert.equal(r.storage.get('empire_vsl_email_v1'), 'new@example.com')
for (const args of [{}, {search:'?email=invalid'}, {stored:'invalid'}]) {
  r = run(args); assert.equal(r.unlocked, false); assert.equal(r.calls.length, 0)
}
r = run({stored:'known@example.com', search:'?email=invalid'})
assert.equal(r.calls[0].body.email, 'known@example.com')
r = run({stored:'known@example.com', reject:true})
assert.equal(r.unlocked, true, 'network failure preserves access already granted')
setImmediate(() => console.log('PASS: cross-funnel tagging, URL email replacement, validation, analytics and offline access'))
