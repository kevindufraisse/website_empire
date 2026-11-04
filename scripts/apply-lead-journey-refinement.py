from pathlib import Path
import hashlib

path=Path('components/FormulaScrollStory.tsx')
raw=path.read_bytes()
assert hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()=='0649707a0e1ecc7203b5208f66b711f9589c8f22', 'Formula source changed; review before applying'
text=raw.decode()
text=text.replace("import LeadMagnetScene from './LeadMagnetScene'", "import LeadMagnetScene from './LeadMagnetScene'\nimport LongFormatScene from './LongFormatScene'")
text=text.replace('(t - .28) / .418 * 63','(t - .28) / .315 * 63')
text=text.replace('  const settled = useMotionValue(1)\n','')
text=text.replace('<LeadMagnetScene p={settled} staticMode/>','<LeadMagnetScene staticMode/>\n    <LongFormatScene/>')
start=text.index('function CreationStory() {')
end=text.index('function DistributionStory()',start)
text=text[:start]+'''function CreationStory() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: rawP } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // The native lead-magnet comparison and YouTube example follow this short-format story.
  const timeline = useTransform(rawP, [0, .37, 1], [0, .28, .595])
  const p = useTransform(timeline, [0, .535, .595], [0, .535, .535])
  const [extra, setExtra] = useState(0), [phase, setPhase] = useState(0), [kind, setKind] = useState(0)
  useMotionValueEvent(timeline, 'change', t => { setExtra(t >= .535 ? 1 : 0); setPhase(t < .28 ? 0 : 1) })
  useMotionValueEvent(p, 'change', v => setKind(v < .35 ? 0 : v < .415 ? 1 : v < .475 ? 2 : 3))
  const title = phase === 0 ? 'Dès que vous avez une idée, partagez-la.' : 'Nous mettons votre idée dans le bon format.'
  return <section ref={ref} className={`${s.story} ${r.story} ${stable.creation}`} data-story="formula" data-story-part="creation" data-focus="story" data-step={phase === 0 ? 'message' : 'format'} aria-label="De votre idée à votre contenu">
    {([['reaction', 30.5], ['tierlist', 38.5], ['faq', 44.5]] as const).map(([name, at]) => <span key={name} id={`formula-${name}`} className={s.anchor} style={{ top: `calc(${anchorAt(at)}% - ${anchorAt(at)}svh)` }}/>) }
    <span id="formula-clone" className={s.anchor} style={{ top: `calc(${rawAt(.565)}% - ${rawAt(.565)}svh)` }}/>
    <span id="formula-format" className={s.anchor} style={{ top: `calc(${anchorAt(30.5)}% - ${anchorAt(30.5)}svh)` }}/>
    <div data-viewport-stage className={s.sticky}>
      <div className={`${s.headline} ${r.headline}`} data-story-title><h2>{title}</h2></div>
      <div className={`${s.stage} ${r.stage}`}>
        <Chat p={p} active={phase === 0}/>
        <Formats p={p} cloneP={timeline} active={phase === 1} kind={extra === 1 ? 4 : kind}/>
      </div>
      <div className={s.progress}><span><ArrowDown size={12}/>Continuez la découverte</span><div><motion.i style={{ scaleX: rawP }}/></div><small>Démonstration illustrée</small></div>
    </div>
  </section>
}

'''+text[end:]
old='<CreationStory/><SecretFormatsGate/><DistributionStory/><CloneAppStory/><ClaudeMcpDemo/>'
assert old in text
text=text.replace(old,'<CreationStory/><LeadMagnetScene/><LongFormatScene/><SecretFormatsGate/><DistributionStory/><CloneAppStory/><ClaudeMcpDemo/>')
assert 'p={leadP}' not in text and 'p={settled}' not in text
path.write_text(text)

path=Path('scripts/check-homepage-story.mjs')
text=path.read_text()
old='  if (t > .698 && t < .768) {'
assert old in text
text=text.replace(old,'''  if (t >= .595 && t < .628) {
    await page.locator('#formula-youtube').evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }))
  } else if (t >= .628 && t <= .698) {
    await page.locator('#formula-lead-magnet').evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }))
  } else if (t > .698 && t < .768) {''')
text=text.replace('(t - .28) / .418 * .63','(t - .28) / .315 * .63')
old='        assert(Math.abs(column.x - firstPreview.x) < 3, `${name}: short/long column shifts`)'
assert old in text
text=text.replace(old,'''        if (kind !== 5) assert(Math.abs(column.x - firstPreview.x) < 3, `${name}: short-format column shifts`)
        else if (viewport.width > 760) assert(column.x < viewport.width / 2, `${name}: YouTube preview must stay on the left`)''')
path.write_text(text)

path=Path('components/StableHomeJourney.module.css')
text=path.read_text()
assert '.creation[data-story="formula"]{height:1000svh}' in text
path.write_text(text.replace('.creation[data-story="formula"]{height:1000svh}', '.creation[data-story="formula"]{height:850svh}'))

path=Path('.github/workflows/homepage-smoke.yml')
text=path.read_text()
anchor="      - 'components/LeadMagnetScene*'"
assert anchor in text
text=text.replace(anchor,anchor+"\n      - 'components/LeadMagnetComparison*'\n      - 'components/LeadMagnetJourney*'\n      - 'components/LongFormatScene*'")
path.write_text(text)
print('Applied bounded journey changes; no Academy, API, payments or customer automations modified.')
