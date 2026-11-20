'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'

/**
 * Le moment « secret » de la page, façon Fight Club (demande de Kevin,
 * 20 novembre 2026) : les deux règles s'empilent — la deuxième apparaît
 * en scrollant —, puis l'exception, puis la masterclass qui donne la
 * formule. La formule elle-même n'est jamais montrée ici.
 */
export default function FormulaSecretReveal() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const goMasterclass = () => {
    trackAmplitude('home_rule_masterclass_clicked')
    document.getElementById('home-masterclass')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const appear = {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.6 },
    transition: { duration: 0.55, ease: 'easeOut' as const },
  }

  const Rule = ({ n }: { n: 1 | 2 }) => (
    <p className="text-left text-2xl font-extrabold uppercase leading-snug tracking-tight text-white sm:text-4xl md:text-[2.6rem] md:leading-[1.2]">
      {fr ? (
        <>
          <span className="text-empire">La {n === 1 ? '1re' : '2e'} règle d’Empire est :</span>
          <br />
          il est interdit de parler d’Empire.
        </>
      ) : (
        <>
          <span className="text-empire">The {n === 1 ? '1st' : '2nd'} rule of Empire is:</span>
          <br />
          you do not talk about Empire.
        </>
      )}
    </p>
  )

  return (
    <section
      id="formula-reveal"
      data-formula-reveal
      aria-label={fr ? 'Les règles' : 'The rules'}
      className="relative w-full overflow-hidden bg-black py-28 md:py-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 65% 45% at 50% 52%, rgb(var(--empire-rgb) / 0.08), transparent)' }}
      />
      <div className="container relative mx-auto flex max-w-2xl flex-col px-5">
        <motion.div {...appear}>
          <Rule n={1} />
        </motion.div>
        {/* La 2e règle entre en scène quand on continue de scroller : elle ne
            se déclenche qu'en arrivant dans la moitié haute de l'écran. */}
        <motion.div {...appear} viewport={{ once: true, margin: '0px 0px -45% 0px' }} className="mt-12 md:mt-16">
          <Rule n={2} />
        </motion.div>
        <motion.div {...appear} viewport={{ once: true, margin: '0px 0px -35% 0px' }} className="mt-16 md:mt-24 text-center">
          <p className="text-xl font-semibold text-white sm:text-2xl">
            {fr ? 'Aujourd’hui, on fait une exception.' : 'Today, we make an exception.'}
          </p>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-neutral-400 sm:text-lg">
            {fr
              ? 'La formule complète est dans la masterclass. 30 minutes, gratuite.'
              : 'The full formula is in the masterclass. 30 minutes, free.'}
          </p>
          <button
            type="button"
            onClick={goMasterclass}
            className="group mt-9 rounded-xl bg-empire px-8 py-4 font-bold text-black transition-all hover:scale-105"
          >
            {fr ? 'Recevoir la masterclass' : 'Get the masterclass'}{' '}
            <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
