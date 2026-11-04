import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, writeFile, appendFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const base = 'http://127.0.0.1:3100'
const out = 'artifacts/homepage'
const doneKey = 'empire-masterclass-requested-v16'
await mkdir(out, { recursive: true })
const server = spawn('npm', ['run', 'dev', '--', '--hostname', '127.0.0.1', '--port', '3100'], {
  stdio: ['ignore', 'pipe', 'pipe'], detached: true,
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
})
for (const stream of [server.stdout, server.stderr]) stream.on('data', data => {
  process.stdout.write(data)
  appendFile(`${out}/server.log`, data).catch(() => {})
})
let browser
const report = []
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
async function ready() {
  const deadline = Date.now() + 150000
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Next server exited: ${server.exitCode}`)
    try { if ((await fetch(base)).ok) return } catch {}
    await delay(750)
  }
  throw new Error('Local homepage did not start')
}
async function at(page, t) {
  await page.evaluate(t => {
    const el = document.querySelector('[data-story="formula"]')
    if (!el) throw new Error('Missing animated story')
    const raw = t <= .28 ? t / .28 * .21 : .21 + (t - .28) / .92 * .79
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + raw * (el.getBoundingClientRect().height - innerHeight), behavior: 'instant' })
  }, t)
  await page.waitForTimeout(500)
}
async function inside(page, locator, label) {
  await locator.waitFor({ state: 'visible' })
  const box = await locator.boundingBox()
  const { width, height } = page.viewportSize()
  assert(box && box.width > 20 && box.height > 20, `${label}: missing or collapsed`)
  assert(box.x >= -2 && box.x + box.width <= width + 2, `${label}: horizontal overflow ${JSON.stringify(box)}`)
  assert(box.y >= 60 && box.y + box.height <= height + 2, `${label}: outside viewport ${JSON.stringify(box)}`)
  return box
}
async function screenshot(page, name) { await page.screenshot({ path: `${out}/${name}.png`, fullPage: false }) }
async function contextFor(viewport, reducedMotion = 'no-preference') {
  const context = await browser.newContext({ viewport, locale: 'fr-FR', reducedMotion })
  await context.addInitScript(() => sessionStorage.setItem('empire-discovery-passed-v18', '1'))
  // The test only talks to its local server. No analytics, public accounts or customer data.
  await context.route('**/*', route => {
    const url = route.request().url()
    if (url.startsWith(base) || url.startsWith('data:') || url.startsWith('blob:')) return route.continue()
    return route.abort()
  })
  return context
}
try {
  await ready()
  browser = await chromium.launch({ headless: true })
  for (const [name, viewport] of [
    ['desktop', { width: 1440, height: 1000 }],
    ['laptop', { width: 1280, height: 720 }],
    ['mobile', { width: 390, height: 844 }],
    ['mobile-small', { width: 375, height: 667 }],
  ]) {
    const context = await contextFor(viewport)
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    let requests = 0
    await page.route('**/api/home-masterclass', async route => {
      requests++
      const body = route.request().postDataJSON()
      assert.equal(body.email, 'homepage-smoke@example.invalid')
      await route.fulfill({ status: requests === 1 ? 503 : 200, contentType: 'application/json', body: JSON.stringify({ success: requests !== 1 }) })
    })
    try {
      await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 120000 })
      await page.locator('[data-story="formula"]').waitFor()
      const reject = page.getByRole('button', { name: /Tout refuser|Continuer sans accepter/i }).first()
      if (await reject.isVisible().catch(() => false)) await reject.click()
      assert.deepEqual(await page.locator('[data-home-section]').evaluateAll(nodes => nodes.map(n => n.dataset.homeSection)), ['demo', 'community', 'tracking', 'testimonials', 'results', 'trial', 'cost', 'comparison', 'apply'])
      assert.equal(await page.locator('[data-story="formula"] nav').count(), 0)
      await at(page, .18)
      assert.equal(await page.locator('[data-story-title]').innerText(), 'Dès que vous avez une idée, partagez-la.')
      await screenshot(page, `${name}-chat`)
      let firstPreview
      for (const [t, kind] of [[.32, 0], [.385, 1], [.445, 2], [.505, 3], [.565, 4], [.614, 5]]) {
        await at(page, t)
        const scene = page.locator(`[data-scene="formats"][data-format="${kind}"][aria-hidden="false"]`)
        await scene.waitFor({ state: 'visible' })
        const preview = await inside(page, scene.locator('[data-format-preview]>div'), `${name} format ${kind}`)
        const column = await scene.locator('[data-format-preview]').boundingBox()
        if (!firstPreview) firstPreview = column
        assert(Math.abs(column.x - firstPreview.x) < 3, `${name}: short/long column shifts`)
        assert(preview.width > 50)
        if (kind === 0 || kind === 5) await screenshot(page, `${name}-${kind === 0 ? 'short' : 'long'}`)
      }
      await at(page, .681)
      await page.locator('[data-scene="lead-magnet"]').waitFor({ state: 'visible' })
      assert((await page.locator('[data-scene="lead-magnet"]').innerText()).includes('GUIDE'))
      await screenshot(page, `${name}-lead-magnet`)
      await at(page, .735)
      let secret = page.locator('[data-scene="secret"]')
      await secret.locator('input[type="email"]').waitFor({ state: 'visible' })
      assert.equal(await page.locator('[data-story-title]').count(), 0)
      assert.equal(await secret.getAttribute('data-requested'), 'false')
      await inside(page, secret.getByRole('button', { name: 'Recevoir la masterclass gratuite' }), `${name} masterclass CTA`)
      await screenshot(page, `${name}-secret-new`)
      await secret.locator('input[type="email"]').fill('homepage-smoke@example.invalid')
      await secret.getByRole('button', { name: 'Recevoir la masterclass gratuite' }).click()
      await secret.getByRole('alert').waitFor({ state: 'visible' })
      assert.equal(await page.evaluate(key => localStorage.getItem(key), doneKey), null)
      await secret.getByRole('button', { name: 'Recevoir la masterclass gratuite' }).click()
      await secret.getByRole('button', { name: 'Tester gratuitement' }).waitFor({ state: 'visible' })
      assert.equal(requests, 2)
      assert.equal(await page.evaluate(key => localStorage.getItem(key), doneKey), '1')
      await screenshot(page, `${name}-secret-returning`)
      // A returning visitor is recognized even after the session-only flag is cleared.
      await page.evaluate(key => sessionStorage.removeItem(key), doneKey)
      await page.reload({ waitUntil: 'domcontentloaded' })
      await page.locator('[data-story="formula"]').waitFor()
      await at(page, .735)
      secret = page.locator('[data-scene="secret"]')
      await secret.getByRole('button', { name: 'Tester gratuitement' }).waitFor({ state: 'visible' })
      assert.equal(await secret.locator('input[type="email"]').count(), 0)
      await secret.getByRole('link', { name: 'Continuer la découverte' }).click()
      await page.waitForFunction(() => document.querySelector('[data-story="formula"]')?.getAttribute('data-step') === 'diffusion')
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), `${name}: page overflows horizontally`)
      assert.deepEqual(errors, [], `${name}: browser errors`)
      report.push({ name, viewport, result: 'passed', formsMocked: requests, shortLongColumnAligned: true })
      console.log(`PASS ${name}: formats, layout, conditional CTA, failed/successful form, persisted state, section order`)
    } catch (error) {
      await screenshot(page, `${name}-failure`).catch(() => {})
      await writeFile(`${out}/${name}-failure.html`, await page.content()).catch(() => {})
      report.push({ name, result: 'failed', error: String(error), errors })
      throw error
    } finally { await context.close() }
  }
  const reduced = await contextFor({ width: 390, height: 844 }, 'reduce')
  const page = await reduced.newPage()
  await page.goto(base, { waitUntil: 'domcontentloaded' })
  await page.locator('[data-story="accessible"]').waitFor({ state: 'visible' })
  assert.equal(await page.locator('[data-story="formula"]').count(), 0)
  assert.equal(await page.locator('[data-scene="lead-magnet"]').count(), 1)
  assert.equal(await page.locator('[data-scene="secret"] input[type="email"]').count(), 1)
  report.push({ name: 'reduced-motion', result: 'passed' })
  await reduced.close()
} finally {
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2))
  await browser?.close()
  if (server.pid) { try { process.kill(-server.pid, 'SIGTERM') } catch {} }
}
