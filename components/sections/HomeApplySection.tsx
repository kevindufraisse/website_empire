'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { useReveal } from '@/hooks/useReveal'

/**
 * Dernier argument avant le formulaire. Le prospect arrive ici avec la formule
 * complète (FormulaBar) sous les yeux : on lui montre le partage des rôles.
 * À gauche, ce qu'il apporte (son message, 20 minutes). À droite, ce
 * qu'Empire prend en charge, terme par terme. Pas de boîte, pas de coche :
 * une colonne de texte et l'email, puis le « contrat » en face.
 */

export default function HomeApplySection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  const [ref, isInView] = useReveal('-100px')

  if (autopilot) return null

  return (
    <section ref={ref} id="rejoindre" className="relative w-full overflow-hidden bg-black py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgb(var(--empire-rgb)_/_0.10),transparent)]" />
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-empire">
            {fr ? 'Rejoindre Empire' : 'Join Empire'}
          </p>
          <h2 className="text-3xl font-extrabold leading-[1.08] text-white sm:text-4xl md:text-5xl">
            {fr
              ? 'Le même système qui me garantit 10M de vues par mois en 15 min par semaine.'
              : 'The same system that guarantees me 10M views a month in 15 min a week.'}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-neutral-400 md:text-lg">
            {fr
              ? 'Testez gratuitement. Un membre de l\'équipe vous contacte pour vous proposer la meilleure offre.'
              : 'Try it free. A team member will reach out to find the best offer for you.'}
          </p>
          <div className="mt-8">
            <a
              href="/postuler"
              className="group inline-flex items-center gap-2 rounded-xl bg-empire px-8 py-4 text-base font-bold text-black shadow-[0_0_30px_rgb(var(--empire-rgb)_/_0.35)] transition-all hover:brightness-110"
            >
              {fr ? 'Recevoir un accès' : 'Get access'}
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>
            <p className="mt-3 text-[13px] text-neutral-500">
              {fr ? 'Essai gratuit · sans engagement · on vous contacte sous 24h' : 'Free trial · no commitment · we contact you within 24h'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
