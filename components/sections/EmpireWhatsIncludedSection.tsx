'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { useReveal } from '@/hooks/useReveal'

const ITEMS = {
  fr: [
    'Sessions d\'enregistrement',
    'Recherche d\'angles',
    'Posts LinkedIn',
    'Reels',
    'Newsletters',
    'Adaptation multi-plateforme',
    'Publication',
    'Lives hebdomadaires',
    'Communauté',
    'Replays',
    'Revue stratégique',
    'Support',
  ],
  en: [
    'Recording sessions',
    'Angle research',
    'LinkedIn posts',
    'Reels',
    'Newsletters',
    'Multi-platform adaptation',
    'Publishing',
    'Weekly lives',
    'Community',
    'Replays',
    'Strategy review',
    'Support',
  ],
}

export default function EmpireWhatsIncludedSection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  const [ref, inView] = useReveal('-80px')

  if (autopilot) return null

  const items = fr ? ITEMS.fr : ITEMS.en

  return (
    <section ref={ref} id="included" className="relative w-full py-16 md:py-24 bg-black">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-empire mb-3">
              {fr ? 'Ce que vous achetez' : 'What you buy'}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {fr ? 'Qu\'est-ce que j\'achète exactement ?' : 'What exactly am I buying?'}
            </h2>
            <p className="mt-4 text-neutral-400">
              {fr
                ? 'Tout ce qu\'il faut pour ne plus gérer votre contenu seul.'
                : 'Everything you need to stop managing content alone.'}
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {items.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.04 * i, ease: 'easeOut' }}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-empire/15 text-empire">
                  <Check size={14} strokeWidth={2.5} />
                </span>
                <span className="text-sm md:text-base font-medium text-white">{item}</span>
              </motion.li>
            ))}
          </ul>

          <p className="mt-6 text-center text-sm text-neutral-500">
            {fr
              ? 'Lives, communauté et replays dès Intermédiaire. Revue stratégique dès Expert.'
              : 'Lives, community and replays from Intermediate. Strategy review from Expert.'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
