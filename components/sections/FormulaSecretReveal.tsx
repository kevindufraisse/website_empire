'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { MasterclassForm } from '@/components/sections/HomeMasterclassGate'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Le moment « secret » de la page, façon Fight Club (Kevin, 20 novembre
 * 2026) : les mots des deux règles se découvrent au fil du scroll, puis
 * l'exception, puis l'email à saisir SUR PLACE pour recevoir la
 * masterclass — aucune remontée de page. La formule n'est jamais montrée.
 */

function Word({ children, range, progress }: { children: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  )
}

function RuleLine({ label, words, progress, from, to }: {
  label: string; words: string[]; progress: MotionValue<number>; from: number; to: number
}) {
  const step = (to - from) / (words.length + 1)
  return (
    <p className="text-left text-2xl font-extrabold uppercase leading-snug tracking-tight text-white sm:text-4xl md:text-[2.6rem] md:leading-[1.2]">
      <Word range={[from, from + step]} progress={progress}>{label}</Word>
      <br />
      {words.map((w, i) => (
        <Word key={i} range={[from + step * (i + 1), from + step * (i + 2)]} progress={progress}>{w}</Word>
      ))}
    </p>
  )
}

export default function FormulaSecretReveal() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const still = usePrefersReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const endOpacity = useTransform(scrollYProgress, [0.62, 0.78], [0, 1])
  const endY = useTransform(scrollYProgress, [0.62, 0.78], [18, 0])

  const r1 = fr
    ? { label: 'La 1re règle d’Empire est :', words: ['il', 'est', 'interdit', 'de', 'parler', 'd’Empire.'] }
    : { label: 'The 1st rule of Empire is:', words: ['you', 'do', 'not', 'talk', 'about', 'Empire.'] }
  const r2 = fr
    ? { label: 'La 2e règle d’Empire est :', words: ['il', 'est', 'interdit', 'de', 'parler', 'd’Empire.'] }
    : { label: 'The 2nd rule of Empire is:', words: ['you', 'do', 'not', 'talk', 'about', 'Empire.'] }

  const ending = (
    <div className="mt-14 text-center md:mt-16">
      <p className="text-xl font-semibold text-white sm:text-2xl">
        {fr ? 'Aujourd’hui, on fait une exception.' : 'Today, we make an exception.'}
      </p>
      <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-neutral-400 sm:text-lg">
        {fr
          ? 'La formule complète est dans la masterclass. 30 minutes, gratuite.'
          : 'The full formula is in the masterclass. 30 minutes, free.'}
      </p>
      {/* L'email se donne ici même : pas de renvoi plus haut dans la page. */}
      <div className="mx-auto mt-7 w-full max-w-md text-left">
        <MasterclassForm idPrefix="rules" />
      </div>
    </div>
  )

  if (still) {
    return (
      <section id="formula-reveal" data-formula-reveal aria-label={fr ? 'Les règles' : 'The rules'} className="relative w-full overflow-hidden bg-black py-28">
        <div className="container relative mx-auto flex max-w-2xl flex-col px-5">
          <RuleLine {...r1} progress={scrollYProgress} from={0} to={0} />
          <div className="mt-10"><RuleLine {...r2} progress={scrollYProgress} from={0} to={0} /></div>
          {ending}
        </div>
      </section>
    )
  }

  return (
    <section
      ref={ref}
      id="formula-reveal"
      data-formula-reveal
      aria-label={fr ? 'Les règles' : 'The rules'}
      className="relative w-full bg-black"
      style={{ height: '260svh' }}
    >
      <div className="sticky top-0 flex h-svh min-h-[620px] w-full flex-col items-center justify-center overflow-hidden px-5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 65% 45% at 50% 52%, rgb(var(--empire-rgb) / 0.08), transparent)' }}
        />
        <div className="relative flex w-full max-w-2xl flex-col">
          <RuleLine {...r1} progress={scrollYProgress} from={0.04} to={0.3} />
          <div className="mt-10 md:mt-12">
            <RuleLine {...r2} progress={scrollYProgress} from={0.32} to={0.58} />
          </div>
          <motion.div style={{ opacity: endOpacity, y: endY }}>{ending}</motion.div>
        </div>
      </div>
    </section>
  )
}
