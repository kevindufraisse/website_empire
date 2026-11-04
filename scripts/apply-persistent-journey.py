from pathlib import Path

path = Path('components/FormulaScrollStory.tsx')
text = path.read_text()
assert 'function CreationStory()' in text and 'function DistributionStory()' in text, 'Unexpected story revision; refusing to overwrite'
text = text.replace("import stable from './StableHomeJourney.module.css'", "import stable from './StableHomeJourney.module.css'\nimport journey from './LeadMagnetJourney.module.css'\nimport IdeaMessagesStory from './IdeaMessagesStory'")
text = text.replace("const rawAt = (t: number) => t <= .28 ? t / .28 * 37 : 37 + (t - .28) / .418 * 63", "const rawAt = (t: number) => Math.max(0, Math.min(1, (t - .305) / .285)) * 100")
text = text.replace("const [visible, setVisible] = useState(false)\n  useMotionValueEvent(p, 'change', v => setVisible(v >= start && v < end))", "const [visible, setVisible] = useState(() => p.get() >= start && p.get() < end)\n  useMotionValueEvent(p, 'change', v => setVisible(v >= start && v < end))")
start = text.index('function AccessibleStory()')
end = text.index('function DistributionStory()')
replacement = '''function LongFormatStory() {
  const settled = useMotionValue(.558)
  return <section id="formula-youtube" className={journey.longSection} data-story="long-format" aria-labelledby="long-format-title">
    <header className={journey.heading}><h2 id="long-format-title">Votre sujet mérite plus ?<br/><em>Passez au format long.</em></h2></header>
    <div className={journey.longGrid} data-scene="formats" data-format="5" aria-hidden="false">
      <div className={journey.longPreview} data-format-preview="long"><LongVideoFormat p={settled}/></div>
      <div className={journey.longCopy}><h3>Le même sujet.<br/>Plus de place pour l’expliquer.</h3><p>Réaction, classement ou réponse client : développez votre point de vue dans une vidéo YouTube.</p></div>
    </div>
  </section>
}

function AccessibleStory() {
  return <><div data-story="accessible">
    <IdeaMessagesStory/>
    <section className={s.accessible}><h2 id="formula-format">Nous mettons votre idée dans le bon format.</h2><p>Un lien devient une réaction. Un classement devient une tier list. Une question client devient une réponse en vidéo.</p></section>
    <LeadMagnetScene staticMode/>
    <LongFormatStory/>
    <SecretFormatsGate staticMode/>
    <section className={s.accessible}>
      <h2 id="formula-diffusion">Nous adaptons et diffusons vos vidéos et vos textes sur tous vos réseaux.</h2><p>{NETWORKS.join(' · ')}. Les miniatures et les visuels accompagnent les publications.</p>
      <h3>Publiez la même vidéo sur plusieurs comptes, instantanément.</h3><p>Connectez vos comptes principaux et secondaires.</p>
      <h3>Nous republions automatiquement vos meilleurs contenus.</h3><p>Les contenus qui fonctionnent reviennent dans votre calendrier. Les scènes et les chiffres de la démonstration sont illustratifs.</p>
    </section>
  </div><CloneAppStory/><ClaudeMcpDemo/></>
}

function CreationStory() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: rawP } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const timeline = useTransform(rawP, [0, 1], [.305, .590])
  const p = useTransform(timeline, v => Math.min(v, .535))
  const [kind, setKind] = useState(0)
  useMotionValueEvent(timeline, 'change', v => setKind(v < .35 ? 0 : v < .415 ? 1 : v < .475 ? 2 : v < .535 ? 3 : 4))
  return <section ref={ref} className={`${s.story} ${r.story} ${journey.shortStory}`} data-story="formula" data-story-part="creation" data-step="format" aria-label="Les formats courts">
    {([['reaction', .32], ['tierlist', .385], ['faq', .445], ['clone', .565]] as const).map(([name, t]) => <span key={name} id={`formula-${name}`} className={s.anchor} style={{ top: `calc(${rawAt(t)}% - ${rawAt(t)}svh)` }}/>)}
    <span id="formula-format" className={s.anchor}/>
    <div data-viewport-stage className={s.sticky}>
      <div className={`${s.headline} ${r.headline}`} data-story-title><h2>Nous mettons votre idée dans le bon format.</h2></div>
      <div className={`${s.stage} ${r.stage}`}><Formats p={p} cloneP={timeline} active kind={kind}/></div>
      <div className={s.progress}><span><ArrowDown size={12}/>Continuez la découverte</span><div><motion.i style={{ scaleX: rawP }}/></div><small>Démonstration illustrée</small></div>
    </div>
  </section>
}

'''
text = text[:start] + replacement + text[end:]
old = 'return <><CreationStory/><SecretFormatsGate/><DistributionStory/><CloneAppStory/><ClaudeMcpDemo/></>'
assert text.count(old) == 1
text = text.replace(old, 'return <><IdeaMessagesStory/><CreationStory/><LeadMagnetScene/><LongFormatStory/><SecretFormatsGate/><DistributionStory/><CloneAppStory/><ClaudeMcpDemo/></>')
path.write_text(text)

# Keep the previous full-homepage regressions, updating only their navigation to
# the new native sections and checking left alignment instead of exact pixels.
path = Path('scripts/check-homepage-story.mjs')
text = path.read_text()
start = text.index('async function at(page, t)')
end = text.index('async function inside(', start)
text = text[:start] + '''async function at(page, t) {
  const native = t < .28 ? '#formula-ideas' : t >= .595 && t < .628 ? '#formula-youtube' : t >= .628 && t <= .698 ? '#formula-lead-messages' : t > .698 && t < .768 ? '#formula-secret' : null
  if (native) {
    await page.locator(native).evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }))
  } else {
    await page.evaluate(t => {
      const creation = t < .595
      const el = document.querySelector(creation ? '[data-story="formula"]' : '[data-story="distribution"]')
      if (!el) throw new Error('Missing animated story')
      const raw = creation ? (t - .305) / .285 : (t - .768) / .432
      window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + raw * (el.getBoundingClientRect().height - innerHeight), behavior: 'instant' })
    }, t)
  }
  await page.waitForTimeout(450)
}
''' + text[end:]
text = text.replace("(await page.locator('[data-story=\"formula\"] [data-story-title]').innerText()).trim()", "(await page.locator('#formula-ideas h2').innerText()).replace(/\\s+/g, ' ').trim()")
old = 'assert(Math.abs(column.x - firstPreview.x) < 3, `${name}: short/long column shifts`)'
assert old in text
text = text.replace(old, 'if (kind < 5) assert(Math.abs(column.x - firstPreview.x) < 3, `${name}: short format column shifts`)\n        else assert(column.x < viewport.width / 2, `${name}: long player must stay in the left column`)')
path.write_text(text)

path = Path('.github/workflows/homepage-smoke.yml')
text = path.read_text()
text = text.replace("      - 'components/LeadMagnetScene*'", "      - 'components/LeadMagnetScene*'\n      - 'components/LeadMagnetComparison*'\n      - 'components/LeadMagnetJourney*'\n      - 'components/IdeaMessagesStory*'")
path.write_text(text)
print('Applied native message sections, side-by-side comparison order, and retained homepage regression checks.')
