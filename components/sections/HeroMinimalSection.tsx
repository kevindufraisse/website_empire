'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import OnboardingLink from '@/components/OnboardingLink'

export default function HeroMinimalSection() {
  const { lang } = useLanguage()

  const copy =
    lang === 'fr'
      ? {
          title: 'Parlez. On publie.',
          line1: '1 interview par semaine → LinkedIn, Instagram, TikTok, YouTube, X, newsletter.',
          line2: 'Rédigé, monté, planifié, vérifié par des humains.',
          cta: 'Essayer 7 jours',
          guarantee: 'Satisfait ou remboursé',
        }
      : {
          title: 'You talk. We publish.',
          line1: '1 interview a week → LinkedIn, Instagram, TikTok, YouTube, X, newsletter.',
          line2: 'Written, edited, scheduled, reviewed by humans.',
          cta: 'Try 7 days',
          guarantee: 'Satisfaction guaranteed',
        }

  return (
    <section className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-black via-transparent to-[#0f0f0f] pt-28 pb-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.12),transparent)]" />
      <div className="container relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl"
          >
            {copy.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            className="mt-6 text-base text-neutral-300 sm:text-lg"
          >
            {copy.line1}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
            className="mt-2 text-base text-neutral-400 sm:text-lg"
          >
            {copy.line2}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
            className="mt-10 flex justify-center"
          >
            <OnboardingLink className="group flex w-full shrink-0 flex-col items-center gap-1 rounded-xl bg-empire px-8 py-4 text-center font-bold text-black shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.3)] transition-all hover:scale-105 sm:w-auto">
              <span className="flex items-center gap-2">
                {copy.cta}
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
              <span className="text-[11px] font-semibold opacity-70">{copy.guarantee}</span>
            </OnboardingLink>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
