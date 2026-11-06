import assert from 'node:assert/strict'

export async function checkContentComparison(page) {
  await page.locator('#formula-secret[data-requested=false], #formula-secret[data-requested=true]').waitFor({ state: 'attached' })
  const section = page.locator('#home-comparison')
  assert.equal(await section.locator('input').count(), 0, 'Published benchmarks replace invented calculator defaults')
  assert.equal(await section.locator('[data-comparison-price]').getAttribute('data-comparison-price'), '199')
  assert((await section.innerText()).includes('8 posts LinkedIn par mois'))
  const money = section.locator('[data-comparison-axis=money]')
  assert((await money.locator('[data-comparison-cell=agency]').innerText()).includes('+ 900 € HT au démarrage'), 'Do not hide agency setup fees')
  assert((await money.locator('[data-comparison-cell=freelance]').innerText()).includes('600–1 250 €'))
  const time = section.locator('[data-comparison-axis=time]')
  assert((await time.locator('[data-comparison-cell=tools]').innerText()).includes('rédaction seule'), 'Writing time is not full account management')
  assert((await time.locator('[data-comparison-cell=freelance]').innerText()).includes('Hors démarrage'))
  assert((await time.locator('[data-comparison-cell=empire]').innerText()).includes('Pas encore de moyenne chronométrée'), 'Do not invent an Empire time benchmark')
  const video = await section.locator('[data-comparison-video]').innerText()
  assert(video.replace(/\s/g, '').includes('8posts+4Reelsstandard=1460crédits'))
  assert(video.includes('+ 289 € HT'))
  assert((await section.locator('[data-comparison-success]').innerText()).includes('Pas de taux de continuité mesuré'))
  assert.equal(await section.locator('[data-comparison-performance] h4').count(), 3)
  assert((await section.locator('[data-comparison-performance]').innerText()).includes('24 posts en 3 mois'))
  assert((await money.locator('[data-comparison-cell=empire]').innerText()).includes('597 €'))
  const urls = await section.locator('a[target=_blank]').evaluateAll(nodes => nodes.map(a => a.href))
  for (const url of ['https://clement-aouadene.fr/', 'https://ninasenoyer.fr/services/ghostwriter-linkedin/', 'https://klickbee.com/fr/services/agence-linkedin', 'https://studio.clicnstart.com/']) {
    assert(urls.includes(url), `Missing primary offer source: ${url}`)
  }
  // Source calculations are available by keyboard, including on narrow screens.
  await section.getByRole('link', { name: 'Voir le calcul' }).focus()
  await page.keyboard.press('Enter')
  const details = section.locator('#comparison-method')
  assert(await details.evaluate(el => el.open), 'The calculation link must open the source details')
  assert((await details.innerText()).includes('46 min'))
  assert((await details.innerText()).includes('3 900 € HT'))
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), 'Sources must not overflow horizontally')
  await details.locator('summary').focus()
  await page.keyboard.press('Enter')
  assert(!(await details.evaluate(el => el.open)), 'Sources can be collapsed by keyboard')
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), 'Comparison must not overflow horizontally')
}
