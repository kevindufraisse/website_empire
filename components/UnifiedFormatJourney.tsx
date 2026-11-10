'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import FormatRail from './FormatRail'
import LeadMagnetComparison from './LeadMagnetComparison'
import LeadMagnetConversation from './LeadMagnetConversation'
import { LongVideoFormat } from './LongVideoFormat'
import base from './FormulaScrollStory.module.css'
import refinement from './HomeStoryRefinement.module.css'
import s from './UnifiedFormatJourney.module.css'

type Progress = MotionValue<number>
type Phase = 'short' | 'comparison' | 'instagram' | 'long'
const phaseAt = (p: number): Phase => p < .40 ? 'short' : p < .72 ? 'comparison' : p < .88 ? 'instagram' : 'long'
const kindAt = (p: number) => Math.min(4, Math.floor(Math.max(0, p) / .08))
const ANCHORS = [['format', 0], ['reaction', .04], ['tierlist', .12], ['faq', .20], ['devine', .28], ['clone', .36], ['lead-magnet', .50], ['lead-messages', .80], ['youtube', .94]] as const

/** All seven formats share ONE pinned viewport. The native document scroll is
 * never intercepted. 32% of the travel is dedicated to comparing the real edits. */
export default function UnifiedFormatJourney({ renderShort }: {
  renderShort: (p: Progress, timeline: Progress, kind: number, active: boolean) => ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: progress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const shortTimeline = useTransform(progress, [0, .08, .16, .24, .32, .40, 1], [.305, .350, .415, .475, .535, .590, .590])
  const shortP = useTransform(shortTimeline, p => Math.min(p, .535))
  const messageP = useTransform(progress, [.72, .88], [0, 1])
  const longP = useTransform(progress, [.88, .92, .97, 1], [.540, .547, .567, .567])
  const [phase, setPhase] = useState<Phase>(() => phaseAt(progress.get()))
  const [kind, setKind] = useState(() => kindAt(progress.get()))
  const sync = (p: number) => { setPhase(phaseAt(p)); setKind(kindAt(p)) }
  useEffect(() => { sync(progress.get()) }, [progress])
  useMotionValueEvent(progress, 'change', sync)
  const title = phase === 'comparison' ? 'Le même script. De l’anglais au français.' : phase === 'instagram' ? 'Ils commentent. Tu réponds automatiquement.' : phase === 'long' ? 'Le même sujet, aussi en vidéo YouTube.' : 'Nous mettons ton idée dans le bon format.'
  const active = phase === 'short' ? kind : phase === 'long' ? 6 : 5
  return <section ref={ref} className={`${base.story} ${refinement.story} ${s.story}`} data-story="formula" data-unified-formats data-journey-phase={phase} data-step="format" aria-label="Sept formats à découvrir au scroll">
    {ANCHORS.map(([id, p]) => <span key={id} id={`formula-${id}`} className={s.anchor} style={{ top: `calc(${p * 100}% - ${p * 100}svh)` }}/>) }
    <div className={s.sticky} data-viewport-stage data-format-viewport>
      <header className={s.heading} data-story-title><h2>{title}</h2></header>
      <div className={`${base.stage} ${refinement.stage} ${s.frame}`}>
        <div className={`${s.pane} ${s.short}`} data-journey-pane="short" aria-hidden={phase !== 'short'}>{renderShort(shortP, shortTimeline, kind, phase === 'short')}</div>
        <section className={`${s.pane} ${s.comparison}`} data-journey-pane="comparison" data-scene="lead-magnet" aria-hidden={phase !== 'comparison'}>
          <div className={s.comparisonInner}><LeadMagnetComparison/></div>
        </section>
        <section className={`${s.pane} ${s.instagram}`} data-journey-pane="instagram" aria-hidden={phase !== 'instagram'}><LeadMagnetConversation p={messageP}/></section>
        <section className={`${s.pane} ${s.long}`} data-journey-pane="long" data-scene="formats" data-format="5" aria-hidden={phase !== 'long'}>
          <div className={s.longScreen} data-format-preview="long"><LongVideoFormat p={longP}/></div>
          <div className={s.longCopy}><h3>Plus de place pour<br/>ton point de vue.</h3><p>Réaction, classement ou réponse client : développe ton sujet, sans changer de parcours.</p></div>
        </section>
        <div className={s.rail} data-unified-rail><FormatRail active={active}/></div>
      </div>
      <div className={s.cue}><span>Continue à scroller</span><div><motion.i style={{ scaleX: progress }}/></div><small>Démonstration illustrée</small></div>
    </div>
  </section>
}
