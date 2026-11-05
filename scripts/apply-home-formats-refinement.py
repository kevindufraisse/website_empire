from pathlib import Path

# Bounded one-shot edits against the reviewed homepage. Abort on unexpected source.
def change(path, before, after, count=1):
    p=Path(path); source=p.read_text()
    actual=source.count(before)
    assert actual == count, f'{path}: expected {count} matches, found {actual}: {before[:70]}'
    p.write_text(source.replace(before, after))

path='components/FormulaScrollStory.tsx'
change(path,"import LeadMagnetScene from './LeadMagnetScene'", "import LeadMagnetScene from './LeadMagnetScene'\nimport FormatRail from './FormatRail'\nimport LongFormatScroll from './LongFormatScroll'")
p=Path(path); source=p.read_text()
start=source.index('function LongFormatStory() {'); end=source.index('\nfunction AccessibleStory()',start)
source=source[:start]+source[end:]
assert source.count('<LongFormatStory/>')==2
source=source.replace('<LongFormatStory/>','<LongFormatScroll/>')
lines=source.splitlines()
indices=[i for i,line in enumerate(lines) if '<div className={`${s.formatShelf} ${r.shelf}`}' in line]
assert len(indices)==1
lines[indices[0]]='    <FormatRail active={kind}/>'
p.write_text('\n'.join(lines)+'\n')
change(path,'Nous adaptons et diffusons vos vidéos et vos textes sur tous vos réseaux.','Nous adaptons votre message à chaque format et le diffusons sur tous vos réseaux.',2)
change(path,'Nous republions automatiquement vos meilleurs contenus.','Republiez la même publication, encore et encore.',2)
change(path,'Le contenu qui fonctionne revient dans votre calendrier pour une nouvelle diffusion.','Vos meilleurs contenus reviennent automatiquement dans votre calendrier, pour être diffusés à nouveau.')
p=Path('components/HomeStoryRefinement.module.css'); p.write_text(p.read_text().replace('106px','128px'))

path='components/LeadMagnetScene.tsx'
change(path,"import scroll from './ScrollDiscovery.module.css'", "import scroll from './ScrollDiscovery.module.css'\nimport FormatRail from './FormatRail'\nimport formats from './FormatJourney.module.css'")
change(path,'<div className={`${scroll.sticky} ${scroll.compareSticky}`} data-scroll-stage>', '<div className={`${scroll.sticky} ${scroll.compareSticky} ${formats.withRail}`} data-scroll-stage>\n        <FormatRail active={5} floating/>')
change(path,'<div className={`${scroll.sticky} ${scroll.messageSticky}`} data-scroll-stage>', '<div className={`${scroll.sticky} ${scroll.messageSticky} ${formats.withRail}`} data-scroll-stage>\n        <FormatRail active={5} floating/>')

path='components/CloneAppStory.tsx'
change(path,"import s from './CloneAppStory.module.css'", "import s from './CloneAppStory.module.css'\nimport formats from './FormatJourney.module.css'")
change(path,'<small>04 · TEMPS / L’APPLICATION</small>','')
change(path,'<em>Tout le temps. Quand vous voulez.</em></h2>', '<em>Tout le temps. Quand vous voulez.</em></h2><p className={formats.appSource}>Depuis l’application Empire.</p>')

path='components/sections/EmpireCommunitySection.tsx'
change(path,'<span>06 · LA COMMUNAUTÉ EMPIRE</span>','')
change(path,"'Des créateurs qui partagent.'", "'Posez vos questions.'")
change(path,"'Des experts qui vous répondent.'", "'Nos experts vous répondent.'")
change(path,"'En live avec Kevin Dufraisse.'", "'Notre live hebdomadaire.'")
change(path,'Formats à tester, retours sur vos contenus et conseils en viralité. La communauté avance avec vous.','Rejoignez notre live hebdomadaire pour faire analyser vos contenus et préparer vos prochains tests.')
change(path,'Chaque semaine, avec Kevin Dufraisse. Vos contenus, vos prochains tests, les techniques de personal branding.','Chaque semaine, posez vos questions et échangez avec nos experts sur vos contenus et votre stratégie.')

path='components/sections/CompactIntegrations.tsx'
change(path," const clients=useTransform(p,v=>Math.round(clamp((v-.60)/.18)*2).toString())", " const clients=useTransform(p,v=>Math.round(clamp((v-.60)/.18)*2).toString())\n const revenue=useTransform(p,v=>Math.round(clamp((v-.60)/.18)*1000).toLocaleString('fr-FR'))")
change(path,'<small>LIENS TRACKÉS · CONVERSIONS</small><h3>Ce post vous a apporté<em> des clients.</em></h3><p>Un lien Empire dans votre post. Chaque clic, chaque contact, chaque client retrouve sa source.</p>', '<h3>Et surtout :<em> suivez ce qu’Empire vous rapporte.</em></h3><p>Reliez vos contenus aux clics, aux contacts et aux revenus grâce aux liens suivis et à vos outils connectés.</p>')
change(path,'<span className={s.customer}>C</span><div><b>Camille est devenue cliente.</b><span>Elle vient de votre Reel « Tier list ».</span></div>', '<span className={s.customer}>€</span><div><b><motion.span>{revenue}</motion.span> € de revenus attribués.</b><span>2 achats reliés à votre Reel « Tier list » · illustration.</span></div>')

# Extend the existing browser matrix, without removing its video/form/scroll tests.
path='scripts/check-leadmagnet-demo.mjs'
checks='''
   const long=page.locator('#formula-youtube')
   await at(page,'#formula-youtube',.24)
   await fits(page,long.locator('[data-format-preview="long"]'),`${name} YouTube player`)
   const beforeLong=await long.locator('[data-format-preview="long"]').innerText()
   await at(page,'#formula-youtube',.80)
   const afterLong=await long.locator('[data-format-preview="long"]').innerText()
   assert.notEqual(beforeLong,afterLong,'YouTube timeline must advance with page scroll')
   assert.deepEqual(await long.locator('[data-format-list] li span').allTextContents(),['Réaction','Tier list','FAQ','Devine','Clonage','Lead magnet','YouTube long'])
   assert.equal(await long.locator('[data-format-list]').getAttribute('data-active-format'),'YouTube long')
   assert.equal(await long.locator('[data-format-list] button').count(),0)
   if(viewport.width>1000) await fits(page,long.locator('[data-format-list]'),`${name} seven-format rail`)
   await page.screenshot({path:`${out}/${name}-youtube-scroll.png`})
   await at(page,'[data-story="team"]',.10)
   const team=page.locator('[data-story="team"]')
   assert.equal(await team.locator('[data-team-role]').count(),8)
   assert(await opacity(team.locator('[data-team-role]').first())>.99)
   await page.screenshot({path:`${out}/${name}-team-start.png`})
   await at(page,'[data-story="team"]',.86)
   assert(await opacity(team.locator('[data-team-role]').first())<.01)
   assert(await opacity(team.locator('[data-team-summary]'))>.99)
   await fits(page,team.locator('[data-team-core]'),`${name} Empire team core`)
   await fits(page,team.locator('[data-team-summary]'),`${name} team result`)
   await page.screenshot({path:`${out}/${name}-team-merged.png`})
   assert.equal(await page.locator('#home-comparison table').count(),0)
   assert((await page.locator('#home-comparison').innerText()).includes('Ce que vous faites'))
   assert((await page.locator('#empire-integrations').innerText()).includes('revenus attribués'))
'''
p=Path(path); source=p.read_text(); marker="   reports.push({name,result:'passed',"
assert source.count(marker)==1
p.write_text(source.replace(marker,checks+'\n'+marker))
print('Applied homepage-only edits; retained native scroll and existing browser regression tests.')
