'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { useReveal } from '@/hooks/useReveal'

type Variant = 'academy-to-empire' | 'empire-to-legende'

const COPY: Record<Variant, { fr: { headline: string; sub: string; cta: string }; en: { headline: string; sub: string; cta: string }; href: string; textClass: string; bgClass: string }> = {
  'academy-to-empire': {
    fr: {
      headline: 'Vous savez maintenant le faire.',
      sub: 'Empire le fait avec vous.',
      cta: 'Recevoir un accès',
    },
    en: {
      headline: 'Now you know how.',
      sub: 'Empire does it with you.',
      cta: 'Get access',
    },
    href: '/postuler',
    textClass: 'text-empire',
    bgClass: 'bg-empire',
  },
  'empire-to-legende': {
    fr: {
      headline: 'Plus le temps pour l\u2019heure hebdo\u202F?',
      sub: 'Légende : 1 h par mois, on gère le reste.',
      cta: 'Découvrir Légende',
    },
    en: {
      headline: 'No time for the weekly hour?',
      sub: 'Legend: 1 hour a month, we handle the rest.',
      cta: 'Discover Legend',
    },
    href: '/legende',
    textClass: 'text-autopilot',
    bgClass: 'bg-autopilot',
  },
}

export default function CrossSellCTA({ variant }: { variant: Variant }) {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  const [ref, inView] = useReveal('-60px')
  const c = COPY[variant]
  const t = fr ? c.fr : c.en

  if (variant === 'empire-to-legende' && autopilot) return null

  return (
    <section ref={ref} className="py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="container max-w-2xl text-center"
      >
        <p className="text-neutral-500 text-sm font-semibold uppercase tracking-widest mb-3">
          {fr ? 'Étape suivante' : 'Next step'}
        </p>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
          {t.headline}{' '}
          <span className={c.textClass}>{t.sub}</span>
        </h3>
        <a
          href={c.href}
          className={`mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-black transition-all hover:brightness-110 hover:scale-[1.02] ${c.bgClass}`}
        >
          {t.cta}
          <ArrowRight size={17} />
        </a>
      </motion.div>
    </section>
  )
}
