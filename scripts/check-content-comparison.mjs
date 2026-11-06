import assert from 'node:assert/strict'

export async function checkContentComparison(page) {
  await page.locator('#formula-secret[data-requested=false], #formula-secret[data-requested=true]').waitFor({ state: 'attached' })
  const section = page.locator('#home-comparison')
  const table = section.getByRole('table')
  assert.equal(await table.count(), 1, 'Included services must be directly comparable in a table')
  assert.equal(await section.locator('[data-comparison-price]').getAttribute('data-comparison-price'), '199')
  const cell = (row, option) => table.locator(`[data-comparison-row=${row}] [data-comparison-column=${option}]`)
  const normal = value => value.replace(/\s/g, '')
  assert((await section.locator('[data-comparison-basket]').innerText()).includes('4 vidéos courtes + 8 posts + 2 newsletters'))
  assert(normal(await cell('monthly', 'tools').innerText()).includes('155–253€'), 'Tool stack total must be the sum of the listed public prices')
  assert((await cell('monthly', 'tools').innerText()).includes('Sans compter votre temps'))
  assert(normal(await cell('monthly', 'freelance').innerText()).includes('4540–7040€'), 'Five trades are needed to match the scope')
  assert(normal(await cell('monthly', 'freelance').innerText()).includes('dès1129€'), 'Production-only floor stays visible but labelled')
  assert(normal(await cell('monthly', 'agency').innerText()).includes('2500–7000€'))
  assert(normal(await cell('monthly', 'agency').innerText()).includes('4500€'))
  assert((await cell('monthly', 'agency').innerText()).includes('un réseau vidéo court + LinkedIn'))
  assert((await cell('monthly', 'agency').innerText()).includes('avec YouTube long'))
  assert(normal(await cell('monthly', 'empire').innerText()).includes('1690/2200'))
  assert((await cell('monthly', 'empire').innerText()).includes('sans engagement'))
  assert((await cell('engagement', 'agency').innerText()).includes('4 à 6 mois'))
  assert((await cell('effort', 'tools').innerText()).includes('15 à 21 h'), 'Manual time remains a sourced, partial reference')
  assert((await cell('effort', 'freelance').innerText()).includes('temps total non publié'), 'A partial 46-minute brief must not be presented as the entire workload')
  assert((await cell('effort', 'empire').innerText()).includes('≈ 1 h / mois'))
  assert((await cell('effort', 'empire').innerText()).includes('Repère d’usage Empire'))
  assert((await cell('effort', 'agency').innerText()).includes('2–3 h / mois'))
  assert((await cell('frequency', 'agency').innerText()).includes('Selon devis'), 'No daily publishing is attributed to agencies')
  for (const row of ['ideas', 'method', 'posts', 'reels', 'review', 'visuals', 'newsletters', 'publishing', 'community', 'accounts', 'tracking', 'advanced']) {
    assert.equal(await table.locator(`[data-comparison-row=${row}] th[scope=row]`).count(), 1)
    assert.equal(await table.locator(`[data-comparison-row=${row}] td`).count(), 4)
  }
  assert.equal(await cell('advanced', 'empire').locator('[data-status=conditional]').count(), 1, 'Advanced formats are not unconditionally included in the monthly basket')
  assert((await section.locator('#comparison-format-note').innerText()).includes('ne sont pas ajoutés'))
  assert((await cell('publishing', 'tools').innerText()).includes('Vous programmez'))
  assert((await cell('community', 'freelance').innerText()).includes('Community manager'))
  assert((await cell('publishing', 'empire').innerText()).includes('7 réseaux'))
  assert((await section.locator('#comparison-scope').innerText()).includes('ne comptent pas comme de nouveaux contenus'))
  assert((await section.locator('[data-comparison-performance]').innerText()).includes('42 contenus originaux'))
  const picker = section.getByRole('group', { name: 'Comparer Empire avec' })
  if (await picker.isVisible()) {
    for (const [name, key] of [['Outils seuls', 'tools'], ['Agence', 'agency'], ['Freelances', 'freelance']]) {
      const button = picker.getByRole('button', { name, exact: true })
      await button.focus()
      await page.keyboard.press('Enter')
      assert.equal(await button.getAttribute('aria-pressed'), 'true')
      assert.equal(await table.getByRole('columnheader').count(), 3)
      assert(await table.locator(`[data-comparison-option=${key}]`).isVisible())
      assert(await table.locator('[data-comparison-option=empire]').isVisible())
      for (const row of ['monthly', 'publishing', 'work']) {
        // Read both boxes in one frame, even while focus triggers smooth page scrolling.
        const [other, empire] = await table.locator(`[data-comparison-row=${row}]`).evaluate(el =>
          [...el.querySelectorAll('td[data-mobile-visible=true]')].map(td => {
            const rect = td.getBoundingClientRect()
            return { y: rect.y, height: rect.height, width: rect.width }
          }))
        assert(other && empire && other.width > 0 && empire.width > 0 && Math.abs(other.y - empire.y) < 1 && Math.abs(other.height - empire.height) < 1, 'Mobile comparison preserves shared table rows')
      }
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), 'Switching comparison must not overflow horizontally')
    }
  } else {
    assert.equal(await table.getByRole('columnheader').count(), 5)
  }
  const urls = await section.locator('a[target=_blank]').evaluateAll(nodes => nodes.map(a => a.href))
  for (const url of [
    'https://clement-aouadene.fr/', 'https://studio.clicnstart.com/', 'https://www.webplume.net/tarifs/', 'https://www.myroragency.com/agence-personal-branding',
    'https://www.submagic.co/pricing', 'https://taplio.com/pricing', 'https://metricool.com/pricing/', 'https://manychat.com/pricing',
    'https://copylinker.fr/tarif-ghostwriter-linkedin/', 'https://www.transacts.fr/blog/tarif-community-manager', 'https://www.malt.fr/t/barometre-tarifs/web-graphic-design/graphiste',
    'https://studio-fragment.fr/', 'https://teazit.com/landing-page-abonnement-location-studio/',
  ]) assert(urls.includes(url), `Missing primary offer source: ${url}`)
  await section.getByRole('link', { name: 'Sources et calculs' }).focus()
  await page.keyboard.press('Enter')
  const details = section.locator('#comparison-method')
  assert(await details.evaluate(el => el.open), 'Source link must open the calculation')
  const sourceText = await details.innerText()
  assert(sourceText.includes('une estimation de la marque'))
  assert(sourceText.includes('aucun taux de continuité comparable'))
  const calculation = normal(sourceText)
  assert(calculation.includes('2500+2000=4500'))
  assert(calculation.includes('600+289+2×120=1129'))
  assert(calculation.includes('800+700+2000+800+240=4540'))
  assert(calculation.includes('1500+1000+3500+800+240=7040'))
  assert(sourceText.includes('Les dollars sont comptés pour un euro'))
  assert(calculation.includes('8posts×85crédits+4Reelsstandard×195+2newsletters×115=1690crédits'))
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), 'Sources must not overflow horizontally')
  await details.locator('summary').focus()
  await page.keyboard.press('Enter')
  assert(!(await details.evaluate(el => el.open)), 'Sources can be collapsed by keyboard')
}
