import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, writeFile, appendFile } from 'node:fs/promises'
import { chromium, webkit } from 'playwright'

const base = 'http://127.0.0.1:3100'
const out = 'artifacts/homepage'
const doneKey = 'empire-masterclass-requested-v16'
const testEmail = 'homepage-smoke@example.invalid'
await mkdir(out, { recursive: true })
const server = spawn('npm', ['run', 'dev', '--', '--hostname', '127.0.0.1', '--port', '3100'], {
  stdio: ['ignore', 'pipe', 'pipe'], detached: true,
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
})
for (const stream of [server.stdout, server.stderr]) stream.on('data', data => {
  process.stdout.write(data)
  appendFile(`${out}/server.log`, data).catch(() => {})
})
const report = []
const browsers = []
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
  if (t >= .595 && t < .628) {
    await page.locator('#formula-youtube').evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }))
  } else if (t >= .628 && t <= .698) {
    await page.locator('#formula-lead-magnet').evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }))
  } else if (t > .698 && t < .768) {
    await page.locator('#formula-secret').evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }))
  } else {
    await page.evaluate(t => {
      const creation = t <= .698
      const el = document.querySelector(creation ? '[data-story="formula"]' : '[data-story="distribution"]')
      if (!el) throw new Error('Missing animated story')
      const raw = creation ? (t <= .28 ? t / .28 * .37 : .37 + (t - .28) / .315 * .63) : (t - .768) / .432
      const top = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: top + raw * (el.getBoundingClientRect().height - innerHeight), behavior: 'instant' })
    }, t)
  }
  await page.waitForTimeout(450)
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
async function contextFor(browser, viewport, reducedMotion = 'no-preference') {
  const context = await browser.newContext({ viewport, locale: 'fr-FR', reducedMotion })
  // Start without any bypass/session flags. Block all third-party traffic.
  await context.route('**/*', route => {
    const url = route.request().url()
    if (url.startsWith(base) || url.startsWith('data:') || url.startsWith('blob:')) return route.continue()
    return route.abort()
  })
  return context
}
async function open(page) {
  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.locator('[data-story="formula"]').waitFor()
  // DOMContentLoaded includes server-rendered controls. Wait for the shared
  // completion hook to hydrate before filling a controlled React input.
  await page.locator('#formula-secret[data-requested="false"]').waitFor({ state: 'attached' })
  const reject = page.getByRole('button', { name: /Tout refuser|Continuer sans accepter/i }).first()
  if (await reject.isVisible().catch(() => false)) await reject.click()
}
async function testInitialReceipt(browser, viewport, name) {
  const context = await contextFor(browser, viewport)
  const page = await context.newPage()
  let requests = 0
  await page.route('**/api/home-masterclass', route => {
    requests++
    assert.equal(route.request().postDataJSON().email, testEmail)
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
  })
  try {
    await open(page)
    const form = page.locator('#home-masterclass')
    await form.locator('input[type="email"]').fill(testEmail)
    assert.equal(await form.locator('input[type="email"]').inputValue(), testEmail)
    await form.getByRole('button', { name: 'Recevoir la masterclass gratuite' }).click()
    await form.getByRole('status').waitFor()
    assert.equal(requests, 1)
    await page.waitForTimeout(250)
    const y = await page.evaluate(() => scrollY)
    await page.waitForTimeout(3000)
    assert(Math.abs(await page.evaluate(() => scrollY) - y) < 3, `${name}: initial success caused a timed scroll`)
    assert(await form.getByRole('status').isVisible(), `${name}: receipt disappeared`)
    assert.equal(await page.locator('[data-discovery-gate="true"], [data-locked="true"]').count(), 0)
    await screenshot(page, `${name}-initial-receipt`)
  } catch (error) {
    await screenshot(page, `${name}-initial-failure`).catch(() => {})
    await writeFile(`${out}/${name}-initial-failure.html`, await page.content()).catch(() => {})
    await writeFile(`${out}/${name}-initial-diagnostics.json`, JSON.stringify({ requests, error: String(error), form: await page.locator('#home-masterclass').innerText() }, null, 2)).catch(() => {})
    throw error
  } finally { await context.close() }
}
try {
  await ready()
  const chromiumBrowser = await chromium.launch({ headless: true })
  browsers.push(chromiumBrowser)
  const webkitBrowser = await webkit.launch({ headless: true })
  browsers.push(webkitBrowser)
  const cases = [
    ['desktop', { width: 1440, height: 1000 }, chromiumBrowser],
    ['laptop', { width: 1280, height: 720 }, chromiumBrowser],
    ['mobile', { width: 390, height: 844 }, chromiumBrowser],
    ['mobile-small', { width: 375, height: 667 }, chromiumBrowser],
    ['webkit-mobile', { width: 390, height: 844 }, webkitBrowser],
  ]
  for (const [name, viewport, browser] of cases) {
    const context = await contextFor(browser, viewport)
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    let requests = 0
    await page.route('**/api/home-masterclass', async route => {
      requests++
      const body = route.request().postDataJSON()
      assert.equal(body.email, testEmail)
      await route.fulfill({ status: requests === 1 ? 503 : 200, contentType: 'application/json', body: JSON.stringify({ success: requests !== 1 }) })
    })
    try {
      await open(page)
      assert.deepEqual(await page.locator('[data-home-section]').evaluateAll(nodes => nodes.map(n => n.dataset.homeSection)), ['demo', 'community', 'tracking', 'testimonials', 'results', 'trial', 'cost', 'comparison', 'apply'])
      assert.equal(await page.locator('[data-story="formula"] nav').count(), 0)
      assert.equal(await page.locator('[data-discovery-gate="true"], [data-locked="true"]').count(), 0)
      const secret = page.locator('#formula-secret')
      assert.equal(await secret.evaluate(el => !!el.closest('[data-viewport-stage]')), false, 'Form must not live inside a pinned scene')
      assert.equal(await secret.evaluate(el => getComputedStyle(el).position), 'relative')
      await at(page, .18)
      assert.equal((await page.locator('[data-story="formula"] [data-story-title]').innerText()).trim(), 'Dès que vous avez une idée, partagez-la.')
      await screenshot(page, `${name}-chat`)
      let firstPreview
      for (const [t, kind] of [[.32, 0], [.385, 1], [.445, 2], [.505, 3], [.565, 4], [.614, 5]]) {
        await at(page, t)
        const scene = page.locator(`[data-scene="formats"][data-format="${kind}"][aria-hidden="false"]`)
        await scene.waitFor({ state: 'visible' })
        const preview = await inside(page, scene.locator('[data-format-preview]>div'), `${name} format ${kind}`)
        const column = await scene.locator('[data-format-preview]').boundingBox()
        if (!firstPreview) firstPreview = column
        if (kind !== 5) assert(Math.abs(column.x - firstPreview.x) < 3, `${name}: short-format column shifts`)
        else if (viewport.width > 760) assert(column.x < viewport.width / 2, `${name}: YouTube preview must stay on the left`)
        assert(preview.width > 50)
        if (kind === 0 || kind === 5) await screenshot(page, `${name}-${kind === 0 ? 'short' : 'long'}`)
      }
      await at(page, .681)
      await page.locator('[data-scene="lead-magnet"]').waitFor({ state: 'visible' })
      await screenshot(page, `${name}-lead-magnet`)
      await at(page, .698)
      assert(Number(await page.locator('[data-scene="lead-magnet"]').evaluate(el => getComputedStyle(el).opacity)) > .95, 'Final result must not fade into an empty frame')
      await at(page, .735)
      const input = secret.locator('input[type="email"]')
      await input.waitFor({ state: 'visible' })
      await screenshot(page, `${name}-secret-new`)
      await input.fill(testEmail)
      const originalInput = await input.elementHandle()
      // Deliberately overshoot the animated sections and return: same input node and draft.
      await at(page, 1.15)
      await at(page, .18)
      await at(page, .735)
      assert(await originalInput.evaluate(el => el.isConnected), `${name}: scroll remounted the form`)
      assert.equal(await input.inputValue(), testEmail)
      if (viewport.width < 761) {
        // A viewport-height change approximates opening/closing a mobile keyboard.
        await input.focus()
        await page.setViewportSize({ width: viewport.width, height: 480 })
        await page.waitForTimeout(250)
        assert.equal(await input.inputValue(), testEmail)
        await page.setViewportSize(viewport)
        await at(page, .735)
        assert(await originalInput.evaluate(el => el.isConnected), `${name}: resize remounted the form`)
        assert.equal(await input.inputValue(), testEmail)
      }
      assert.equal(requests, 0)
      const submit = secret.getByRole('button', { name: 'Recevoir la masterclass gratuite' })
      await submit.scrollIntoViewIfNeeded()
      await submit.click()
      await secret.getByRole('alert').waitFor({ state: 'visible' })
      assert.equal(await input.inputValue(), testEmail)
      assert.equal(await page.evaluate(key => localStorage.getItem(key), doneKey), null)
      const heightBefore = await secret.evaluate(el => el.offsetHeight)
      await submit.click()
      await secret.getByRole('button', { name: 'Tester gratuitement' }).waitFor({ state: 'visible' })
      assert.equal(requests, 2)
      assert.equal(await page.evaluate(key => localStorage.getItem(key), doneKey), '1')
      assert(await secret.evaluate(el => el.offsetHeight) >= heightBefore - 2, `${name}: success collapsed its section`)
      await page.waitForTimeout(250)
      const y = await page.evaluate(() => scrollY)
      await page.waitForTimeout(3000)
      assert(Math.abs(await page.evaluate(() => scrollY) - y) < 3, `${name}: success imposed a timed scroll`)
      await secret.getByRole('status').waitFor({ state: 'visible' })
      await at(page, .735)
      await screenshot(page, `${name}-secret-returning`)
      await page.evaluate(key => sessionStorage.removeItem(key), doneKey)
      await page.reload({ waitUntil: 'domcontentloaded' })
      await page.locator('[data-story="formula"]').waitFor()
      await at(page, .735)
      await secret.getByRole('button', { name: 'Tester gratuitement' }).waitFor({ state: 'visible' })
      assert.equal(await secret.locator('input[type="email"]').count(), 0)
      await secret.getByRole('link', { name: 'Continuer la découverte' }).click()
      await page.waitForTimeout(1200)
      await page.locator('[data-scene="diffusion"][aria-hidden="false"]').waitFor({ state: 'visible' })
      assert.equal(new URL(page.url()).hash, '#formula-diffusion')
      await at(page, .89)
      await screenshot(page, `${name}-diffusion`)
      await at(page, 1.07)
      assert.equal(await page.locator('[data-story="distribution"]').getAttribute('data-step'), 'multi-accounts')
      await at(page, 1.18)
      await page.locator('[data-scene="republication"][aria-hidden="false"]').waitFor({ state: 'visible' })
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), `${name}: horizontal overflow`)
      assert.deepEqual(errors, [], `${name}: browser errors`)
      await testInitialReceipt(browser, viewport, name)
      report.push({ name, viewport, result: 'passed', formsMocked: requests, persistentDraft: true, noTimedScroll: true, shortLongColumnAligned: true })
      console.log(`PASS ${name}: animations, persistent form, fast scroll, resize, error/success, stable receipt, returning visitor, section order`)
    } catch (error) {
      await screenshot(page, `${name}-failure`).catch(() => {})
      await writeFile(`${out}/${name}-failure.html`, await page.content()).catch(() => {})
      report.push({ name, result: 'failed', error: String(error), errors })
      throw error
    } finally { await context.close() }
  }
  const reduced = await contextFor(chromiumBrowser, { width: 390, height: 844 }, 'reduce')
  const page = await reduced.newPage()
  await page.goto(base, { waitUntil: 'domcontentloaded' })
  await page.locator('[data-story="accessible"]').waitFor({ state: 'visible' })
  assert.equal(await page.locator('[data-story="formula"], [data-story="distribution"]').count(), 0)
  assert.equal(await page.locator('[data-scene="lead-magnet"]').count(), 1)
  assert.equal(await page.locator('#formula-secret input[type="email"]').count(), 1)
  report.push({ name: 'reduced-motion', result: 'passed' })
  await reduced.close()
} finally {
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2))
  for (const browser of browsers) await browser.close()
  if (server.pid) { try { process.kill(-server.pid, 'SIGTERM') } catch {} }
}
