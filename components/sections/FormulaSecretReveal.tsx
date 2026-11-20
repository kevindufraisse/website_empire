'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'

/**
 * Le moment « secret » de la page, sans la formule. Kevin (20 novembre 2026) :
 * la formule embrouille sur la home — elle se donne dans la masterclass.
 * Il reste la règle n°1, l'exception, et le renvoi vers la masterclass
 * (le bloc email #home-masterclass plus haut dans la page).
 */
export default function FormulaSecretReveal() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const goMasterclass = () => {
    trackAmplitude('home_rule_masterclass_clicked')
    document.getElementById('home-masterclass')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const appear = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.5, ease: 'easeOut' as const, delay },
  })

  return (
    <section
      id="formula-reveal"
      data-formula-reveal
      aria-label={fr ? 'La règle n°1' : 'Rule #1'}
      className="relative w-full overflow-hidden bg-black py-24 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 65% 45% at 50% 52%, rgb(var(--empire-rgb) / 0.08), transparent)' }}
      />
      <div className="container relative mx-auto flex max-w-3xl flex-col items-center px-4 text-center">
        <motion.h2
          {...appear(0)}
          className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          <span className="text-empire">{fr ? 'Règle n°1 :' : 'Rule #1:'}</span>
          <br />
          {fr ? 'on ne parle pas d’Empire Internet.' : 'you do not talk about Empire Internet.'}
        </motion.h2>
        <motion.p {...appear(0.15)} className="mt-7 text-xl font-semibold text-white sm:text-2xl">
          {fr ? 'Aujourd’hui, on fait une exception.' : 'Today, we make an exception.'}
        </motion.p>
        <motion.p {...appear(0.25)} className="mt-3 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
          {fr
            ? 'Il existe une formule derrière les contenus qui font des vues. Kevin te la donne en entier dans la masterclass — 30 minutes, gratuite.'
            : 'There is a formula behind the content that gets seen. Kevin gives it to you in full in the masterclass — 30 minutes, free.'}
        </motion.p>
        <motion.button
          {...appear(0.35)}
          type="button"
          onClick={goMasterclass}
          className="group mt-9 rounded-xl bg-empire px-8 py-4 font-bold text-black transition-all hover:scale-105"
        >
          {fr ? 'Recevoir la masterclass' : 'Get the masterclass'}{' '}
          <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </motion.button>
      </div>
    </section>
  )
}
