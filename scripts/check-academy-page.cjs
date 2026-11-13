// Render the real page and intake without network or credentials.
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const assert = require('node:assert/strict')
const ts = require('typescript')
const { renderToStaticMarkup } = require('react-dom/server')
const { createElement } = require('react')
const root = path.resolve(__dirname, '..')
const cache = new Map()
function load(filename) {
  if (cache.has(filename)) return cache.get(filename)
  const module = { exports: {} }
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText
  const mockedRequire = name => {
    if (name.endsWith('.css')) return { default: new Proxy({}, { get: (_, key) => String(key) }), __esModule: true }
    // The shared CTA imports these labels; no trial or payment is opened here.
    if (name === '@/lib/startTrial') return {}
    if (name.startsWith('@/') || name.startsWith('.')) {
      const file = name.startsWith('@/') ? path.join(root, name.slice(2)) : path.resolve(path.dirname(filename), name)
      return load(['', '.tsx', '.ts'].map(ext => file + ext).find(file => fs.existsSync(file)))
    }
    return require(name)
  }
  vm.runInNewContext(code, { module, exports: module.exports, require: mockedRequire, console }, { filename })
  cache.set(filename, module.exports)
  return module.exports
}
const page = load(path.join(root, 'app/academy/page.tsx'))
const html = renderToStaticMarkup(createElement(page.default))
assert.equal((html.match(/<video /g) || []).length, 5, 'Five verified bootcamp and partner videos remain')
for (const name of ['Amélie Faligot', 'Sébastien Min', 'Marc Dufraisse', 'Frère de Kevin']) assert.ok(html.includes(name), name)
for (const name of ['Olivier', 'Julien', 'Sophie', 'Emmanuelle', 'Gaidig']) assert.ok(!html.includes(name), `Excluded software customer: ${name}`)
assert.ok(!/[↗→←]/.test(html), 'No arrows on the intake or application CTA')
for (const name of ['firstName', 'lastName', 'email', 'phone', 'situation', 'monthlyHours', 'currentIncome', 'incomeGoal', 'experience', 'networks', 'strength', 'profileUrl', 'favoriteCreator', 'project', 'startWhen', 'consent', 'company']) assert.ok(html.includes(`name="${name}"`), `Application field retained: ${name}`)
assert.equal((html.match(/<fieldset/g) || []).length, 4)
assert.equal((html.match(/<fieldset[^>]*hidden=""[^>]*disabled=""/g) || []).length, 3, 'Only the first step is initially enabled')
assert.ok(html.includes('<dialog') && html.includes('Candidature Head of Content'), 'Application lives in a native modal')
assert.ok(html.includes('id="candidature"') && html.includes('type="submit"'))
assert.ok(html.includes('bg-empire') && html.includes('shadow-['), 'The real shared site button is rendered')
assert.ok(!html.includes('head-of-content/academy.css') && !html.includes('head-of-content/academy.js'), 'No legacy microsite assets')
console.log('Academy native page: testimonials, shared CTA, all intake fields and initial steps verified (offline).')

assert.ok(!html.includes('8k3Y2wvixY3wN02apY6lo2SQvWcwZDSZhC02LiCGthvFo'), 'Old software testimonial excluded')
