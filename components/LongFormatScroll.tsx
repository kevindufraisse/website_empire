'use client'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useRef } from 'react'
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion'
import { LongVideoFormat } from './LongVideoFormat'
import FormatRail from './FormatRail'
import s from './FormatJourney.module.css'

/** Last format in the same discovery journey. Scroll reveals the ranking and
 * advances the YouTube timeline, then holds the completed composition. */
export default function LongFormatScroll() {
  const ref = useRef<HTMLElement>(null)
  const reduced = !!usePrefersReducedMotion()
  const settled = useMotionValue(.567)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const animated = useTransform(scrollYProgress, [0, .10, .72, 1], [.540, .540, .567, .567])
  const p = reduced ? settled : animated
  return <section id="formula-youtube" ref={ref} className={s.longStory} data-story="long-format" data-scroll-discovery="youtube" data-static={reduced} aria-labelledby="long-format-title">
    <div data-viewport-stage className={s.longSticky}>
      <header className={s.longHeading}><h2 id="long-format-title">Nous mettons votre idée dans le bon format.</h2></header>
      <div className={s.longBody} data-scene="formats" data-format="5" aria-hidden="false">
        <div className={s.longScreen} data-format-preview="long"><LongVideoFormat p={p}/></div>
        <div className={s.longCopy}><h3>Votre sujet mérite plus ?<br/>Passez au format long.</h3><p>Réaction, classement ou réponse client : développez votre point de vue dans une vidéo YouTube.</p></div>
        <FormatRail active={6}/>
      </div>
      {!reduced && <div className={s.longCue} aria-hidden="true">Continuez la découverte<div><motion.i style={{scaleX:scrollYProgress}}/></div></div>}
    </div>
  </section>
}
