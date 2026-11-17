// Exercise the real route with Slack stubbed. No messages or payments are sent.
const assert = require('node:assert/strict')
const { randomUUID } = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

function load(file, overrides = {}, globals = {}) {
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const module = { exports: {} }
  vm.runInNewContext(code, { module, exports: module.exports, require: key => overrides[key] || require(key),
    URL, AbortSignal, Error, console: { error() {} }, ...globals }, { filename: file })
  return module.exports
}
const delivery = load('lib/head-of-content.ts', { './candidate-phone': load('lib/candidate-phone.ts') })
const legende = load('lib/legende.ts')
const intake = load('lib/legende-intake.ts', { './legende-phone': load('lib/legende-phone.ts'), './candidate-phone': load('lib/candidate-phone.ts'), './legende': legende })
const env = { ACADEMY_SLACK_BOT_TOKEN: 'offline', ACADEMY_SLACK_CHANNEL: 'C0123456789' }
const sent = []
let slackOk = true
const route = load('app/api/legende/apply/route.ts', {
  '@/lib/head-of-content': delivery, '@/lib/legende': legende, '@/lib/legende-intake': intake,
  'next/server': { NextResponse: Response },
}, { process: { env }, fetch: async (url, options) => {
  assert.equal(url, 'https://slack.com/api/chat.postMessage')
  sent.push(JSON.parse(options.body))
  return Response.json({ ok: slackOk })
} })
const origin = 'https://www.empire-internet.com'
function post(fields, headers = {}) {
  const request = new Request(origin + '/api/legende/apply', { method: 'POST',
    headers: { origin, 'content-type': 'application/json', 'x-forwarded-for': randomUUID(), ...headers },
    body: JSON.stringify(fields),
  })
  request.nextUrl = new URL(request.url)
  return route.POST(request)
}
const annual = () => ({ submissionId: randomUUID(), kind: 'legende', revenueBand: 300_000, name: 'Exemple',
  email: 'Exemple@example.org', project: 'Mon projet de contenu', website: '' })

async function run() {
  const a = annual()
  env.BETTER_CALL_KEVIN_BOOKING_URL = 'https://example.org/paid-session'
  const responses = await Promise.all([post(a), post(a)])
  for (const response of responses) assert.deepEqual(await response.json(), { success: true, kind: 'legende' })
  assert.equal(sent.length, 1)
  assert.equal(sent[0].channel, env.ACADEMY_SLACK_CHANNEL)
  const text = JSON.stringify(sent[0].blocks)
  for (const value of ['Légende', 'CA HT déclaré', 'De 300 000 € à moins de 500 000 €', 'exemple@example.org', a.project]) assert.ok(text.includes(value))
  assert.equal((await post({ ...a, project: 'Autre projet' })).status, 409)
  for (const revenueBand of [500_000, 1_000_000]) {
    assert.equal((await post({ ...annual(), revenueBand })).status, 200)
  }
  for (const revenueBand of [0, 100_000]) {
    assert.equal((await post({ ...annual(), revenueBand })).status, 400)
    const response = await post({ ...annual(), revenueBand, kind: 'consultation', channel: 'CLIENT-SUPPLIED' })
    assert.deepEqual(await response.json(), { success: true, kind: 'consultation', bookingUrl: env.BETTER_CALL_KEVIN_BOOKING_URL })
    const message = sent.at(-1)
    assert.equal(message.channel, env.ACADEMY_SLACK_CHANNEL)
    const summary = JSON.stringify(message.blocks)
    assert.ok(summary.includes('30 minutes à 500 €'))
    assert.ok(summary.includes(legende.revenueBands.find(band => band.minimum === revenueBand).fr))
  }
  delete env.BETTER_CALL_KEVIN_BOOKING_URL
  const consultation = () => ({ ...annual(), kind: 'consultation', revenueBand: 0 })
  assert.deepEqual(await (await post(consultation())).json(), { success: true, kind: 'consultation' })
  const count = sent.length
  for (const fields of [{ revenueBand: undefined, budget: 'annual' }, { revenueBand: null }, { revenueBand: '500000' }, { revenueBand: 123456 }, { revenueBand: false }, { kind: 'consultation' }, { email: 'bad' }, { submissionId: 'bad' }, { project: '' }])
    assert.equal((await post({ ...annual(), ...fields })).status, 400)
  assert.equal((await post(annual(), { origin: 'https://elsewhere.example' })).status, 403)
  assert.equal((await post({ website: 'bot' })).status, 200)
  assert.equal(sent.length, count)
  slackOk = false
  const retry = annual()
  assert.equal((await post(retry)).status, 503)
  slackOk = true
  assert.equal((await post(retry)).status, 200)
  const application = (overrides = {}) => ({
    ...annual(), version: 2, action: 'apply', phone: '06 12 34 56 78', scope: 'employer',
    company: 'Entreprise exemple', goal: 'Décrocher dix démonstrations', obstacle: 'Nous publions rarement',
    tried: 'Des vidéos en interne', timing: 'now', decision: 'sponsor', ...overrides,
  })
  for (const scope of ['owner','employer']) {
    const lead = application({ scope })
    assert.deepEqual(await (await post(lead)).json(), { success: true, kind: 'legende' })
    const summary = JSON.stringify(sent.at(-1))
    for (const field of ['+33612345678', lead.company, lead.goal, lead.obstacle, lead.tried, '300 000', 'Appel proposé', 'Dans le mois', 'la personne qui décide']) assert.ok(summary.includes(field), field)
    for (const [revenueBand, outcome] of [[100_000,'alternative'],['unknown','review']]) {
      const result = await (await post(application({ scope, revenueBand, kind: 'legende' }))).json()
      assert.deepEqual(result, { success: true, kind: outcome })
    }
  }
  for (const [phoneCountry, phone, expected] of [
    ['FR','06 12 34 56 78','+33612345678'], ['PT','912 345 678','+351912345678'],
    ['IT','02 3661 8300','+390236618300'], ['CA','(416) 555-0123','+14165550123'],
    ['CI','07 07 12 34 56','+2250707123456'], ['BE','0033 6 12 34 56 78','+33612345678'],
  ]) {
    assert.equal((await post(application({ phoneCountry, phone }))).status, 200)
    assert.ok(JSON.stringify(sent.at(-1).blocks).includes(expected), expected)
  }
  for (const phone of ['', '12', '01 23 45 67 89 01 23 45 67 89', 'tél 06 12 34 56 78'])
    assert.equal((await post(application({ phoneCountry: 'FR', phone }))).status, 400)
  assert.equal((await post(application({ phoneCountry: 'ZZ' }))).status, 400)
  // Budget : informatif, transmis à Slack, ne change jamais le résultat ; absent accepté (anciens formulaires).
  for (const [budget, label] of [['3to5k', 'De 3 000 € à 5 000 € par mois'], ['under1k', 'Moins de 1 000 € par mois']]) {
    assert.deepEqual(await (await post(application({ budget }))).json(), { success: true, kind: 'legende' })
    assert.ok(JSON.stringify(sent.at(-1)).includes('Prêt à investir pour régler son contenu') && JSON.stringify(sent.at(-1)).includes(label), label)
  }
  for (const budget of ['lots', '', 5000]) assert.equal((await post(application({ budget }))).status, 400, String(budget))
  assert.ok(!JSON.stringify((await post(application()), sent.at(-1))).includes('Prêt à investir'))
  const personal = application({ scope: 'personal', company: '', decision: '', revenueBand: undefined })
  assert.deepEqual(await (await post(personal)).json(), { success: true, kind: 'review' })
  assert.ok(!JSON.stringify(sent.at(-1)).includes('CA HT'))
  assert.ok(JSON.stringify(sent.at(-1)).includes('À examiner pour un rappel'))
  const below = application({ revenueBand: 0 })
  assert.deepEqual(await (await post(below)).json(), { success: true, kind: 'alternative' })
  assert.ok(!JSON.stringify(sent.at(-1)).includes('Séance à 500 € demandée'))
  env.BETTER_CALL_KEVIN_BOOKING_URL = 'https://example.org/paid-session'
  const optIn = { ...below, submissionId: randomUUID(), action: 'consultation' }
  const before = sent.length
  await Promise.all([post(optIn), post(optIn)])
  assert.equal(sent.length, before + 1)
  assert.deepEqual(await (await post(optIn)).json(), { success: true, kind: 'consultation', bookingUrl: env.BETTER_CALL_KEVIN_BOOKING_URL })
  for (const bad of [{ phone: '' }, { phone: 'abc' }, { revenueBand: null }, { revenueBand: '' },
    { goal: '' }, { tried: '' }, { obstacle: '' }, { decision: 'other' }, { scope: 'invalid' }, { timing: '' }, { action: 'consultation' }]) {
    assert.equal((await post(application(bad))).status, 400, JSON.stringify(bad))
  }
  slackOk = false
  const request = application()
  assert.equal((await post(request)).status, 503)
  slackOk = true
  assert.deepEqual(await (await post(request)).json(), { success: true, kind: 'legende' })
  delete env.ACADEMY_SLACK_BOT_TOKEN
  assert.equal((await post(annual())).status, 503)
  console.log('Légende: all revenue bands, qualification boundaries, Slack receipts, retries and duplicate submissions verified offline.')
}
run().catch(err => { console.error(err); process.exitCode = 1 })
