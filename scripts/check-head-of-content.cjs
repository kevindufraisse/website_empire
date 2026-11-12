// Offline checks: no Slack message, no CRM contact, no production credentials.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const { randomUUID } = require('node:crypto')
const root = path.resolve(__dirname, '..')
function load(file, mocks = {}, globals = {}) {
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const module = { exports: {} }
  const context = vm.createContext({ module, exports: module.exports, require: name => mocks[name] || require(name), URL, Error, AbortSignal, console: { error() {}, warn() {} }, ...globals })
  new vm.Script(code, { filename: file }).runInContext(context)
  return module.exports
}
const core = load('lib/head-of-content.ts')
const candidate = () => ({ submissionId: randomUUID(), firstName: 'Test', lastName: 'Candidature', email: 'test@example.com', phone: '06 00 00 00 00', situation: 'freelance', experience: 'starting', availability: '5to10', project: 'Je souhaite aider des entrepreneurs à produire du contenu et à développer leur activité.', profileUrl: '', consent: true, company: '' })
let checks = 0
function ok(value, message) { assert.ok(value, message); checks++ }
async function run() {
  const valid = core.validateCandidate(candidate())
  ok(valid.candidate?.phone === '+33600000000', 'French phone normalized')
  for (const [input, expected] of [['+33 (0)6 00 00 00 00', '+33600000000'], ['0032 470 00 00 00', '+32470000000'], ['+39 06 12345678', '+390612345678'], ['letters0600000000', null], ['++33600000000', null]]) ok(core.normalizeCandidatePhone(input) === expected, `Phone ${input}`)
  for (const [field, value] of [['firstName', 42], ['firstName', 'a'.repeat(61)], ['email', 'bad-email'], ['phone', '1234'], ['situation', '__proto__'], ['experience', 'constructor'], ['availability', 'toString'], ['project', 'short'], ['project', 'a'.repeat(1001)], ['consent', 'true'], ['profileUrl', 'javascript:alert(1)'], ['profileUrl', 'https://user:pass@example.com'], ['submissionId', 'bad']]) {
    ok(Boolean(core.validateCandidate({ ...candidate(), [field]: value }).error), `Reject malformed ${field}`)
  }
  ok(core.validateCandidate({ company: 'bot' }).honeypot === true, 'Honeypot detected')
  ok(core.validateCandidate({ ...candidate(), email: 'TEST@EXAMPLE.COM', profileUrl: 'linkedin.com/in/test' }).candidate?.profileUrl === 'https://linkedin.com/in/test', 'Optional profile normalized')
  const c = valid.candidate
  const payload = core.candidateSlackPayload({ ...c, project: '<!channel> <script>unsafe</script>' }, 'C0123456789')
  ok(payload.blocks[3].text.type === 'plain_text' && payload.mrkdwn === false, 'Candidate cannot inject Slack markup')
  ok(payload.blocks.find(b => b.type === 'actions').elements[0].url === 'https://wa.me/33600000000', 'WhatsApp contact link normalized')
  const summary = core.candidateSummary(c)
  ok([c.email, c.phone, c.project, 'Freelance', '5 à 10', c.submissionId].every(value => summary.includes(value)), 'All qualification answers retained')
  let deliveries = 0
  const send = async () => { deliveries++; await new Promise(resolve => setTimeout(resolve, 5)) }
  await Promise.all([core.deliverCandidateOnce(c, send), core.deliverCandidateOnce(c, send)])
  await core.deliverCandidateOnce(c, send)
  ok(deliveries === 1, 'Concurrent and repeated submission delivered once')
  await assert.rejects(core.deliverCandidateOnce({ ...c, project: c.project + 'Changed' }, send), /submission_conflict/); checks++
  const retry = { ...c, submissionId: randomUUID() }
  await assert.rejects(core.deliverCandidateOnce(retry, async () => { throw Error('offline') })); checks++
  await core.deliverCandidateOnce(retry, send)
  ok(deliveries === 2, 'Failed delivery can be retried')
  for (let n = 0; n < 5; n++) assert.equal(core.allowCandidateRequest('test-ip', 1), true)
  ok(core.allowCandidateRequest('test-ip', 2) === false, 'Burst limit enforced')
  ok(core.allowCandidateRequest('test-ip', 900002) === true, 'Burst limit expires')

  const env = { NODE_ENV: 'production', ACADEMY_SLACK_BOT_TOKEN: 'offline-test-token', ACADEMY_SLACK_CHANNEL: 'C0123456789' }
  let calls = 0, crmCalls = 0, mode = 'success', tasks = [], submitted
  const route = load('app/api/head-of-content/apply/route.ts', {
    'next/server': { NextResponse: { json: (body, options = {}) => ({ body, status: options.status || 200, headers: options.headers }) } },
    '@vercel/functions': { waitUntil: task => tasks.push(task) },
    '@/lib/folk': { createFolkPerson: async body => { crmCalls++; ok(body.description.includes('Je souhaite') && body.noteMarkdown === body.description, 'CRM copy contains full answers'); return { id: 'test' } } },
    '@/lib/head-of-content': core,
  }, { process: { env }, fetch: async (url, options) => { calls++; submitted = JSON.parse(options.body); if (mode === 'network') throw Error('network'); return { ok: true, status: 200, json: async () => mode === 'success' ? { ok: true } : { ok: false, error: 'not_in_channel' } } } })
  const request = (body, headers = {}, raw) => ({ headers: new Headers({ 'content-type': 'application/json', origin: 'https://www.empire-internet.com', 'x-vercel-forwarded-for': randomUUID(), ...headers }), text: async () => raw ?? JSON.stringify(body) })
  ok((await route.POST(request(candidate(), { origin: 'https://unrelated.example' }))).status === 403, 'Cross-site submission rejected')
  ok((await route.POST(request(candidate(), { 'content-type': 'text/plain' }))).status === 415, 'Invalid content type rejected')
  ok((await route.POST(request(null, {}, '{'))).status === 400, 'Malformed JSON rejected')
  ok((await route.POST(request(null, {}, 'a'.repeat(12001)))).status === 413, 'Oversize body rejected')
  ok((await route.POST(request({ ...candidate(), consent: false }))).status === 400, 'Server requires consent')
  ok((await route.POST(request({ company: 'spam' }))).body.success === true && calls === 0 && crmCalls === 0, 'Honeypot has no side effects')
  const savedToken = env.ACADEMY_SLACK_BOT_TOKEN; delete env.ACADEMY_SLACK_BOT_TOKEN
  ok((await route.POST(request(candidate()))).status === 503 && calls === 0, 'Missing configuration never claims success')
  env.ACADEMY_SLACK_BOT_TOKEN = savedToken
  const form = candidate()
  mode = 'rejected'
  ok((await route.POST(request(form))).status === 503 && crmCalls === 0, 'Slack API rejection never claims success')
  mode = 'network'
  ok((await route.POST(request(form))).status === 503 && crmCalls === 0, 'Network failure never claims success')
  mode = 'success'
  ok((await route.POST(request(form))).body.success === true, 'Confirmed Slack delivery succeeds')
  await Promise.all(tasks)
  ok(submitted.channel === 'C0123456789' && crmCalls === 1, 'Only configured channel receives applicant')
  const before = calls
  ok((await route.POST(request(form))).body.success === true && calls === before && crmCalls === 1, 'Client retry does not duplicate CRM or Slack')
  ok((await route.POST(request({ ...form, lastName: 'Changed' }))).status === 409, 'Altered retry rejected')
  console.log(`${checks} Head of Content checks passed (offline).`)
}
run().catch(error => { console.error(error); process.exit(1) })
