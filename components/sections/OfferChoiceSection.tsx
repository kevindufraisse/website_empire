'use client'

import { motion } from 'framer-motion'
import { ArrowRight, GraduationCap, Sparkles, Crown } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { useReveal } from '@/hooks/useReveal'
import OnboardingLink from '@/components/OnboardingLink'

const CHOICES = [
  {
    id: 'academy',
    icon: GraduationCap,
    titleFr: 'Je veux apprendre',
    titleEn: 'I want to learn',
    subFr: 'Academy',
    subEn: 'Academy',
    href: '/academy',
    color: 'text-academy',
    border: 'border-academy/30 hover:border-academy/60',
    bg: 'hover:bg-academy/5',
  },
  {
    id: 'empire',
    icon: Sparkles,
    titleFr: 'Je veux être accompagné',
    titleEn: 'I want to be coached',
    subFr: 'Empire',
    subEn: 'Empire',
    href: '#pricing',
    color: 'text-empire',
    border: 'border-empire/40 hover:border-empire/70',
    bg: 'bg-empire/5 hover:bg-empire/10',
    highlight: true,
  },
  {
    id: 'legende',
    icon: Crown,
    titleFr: 'Je veux tout déléguer',
    titleEn: 'I want to delegate everything',
    subFr: 'Légende',
    subEn: 'Legend',
    href: '/legende',
    color: 'text-autopilot',
    border: 'border-autopilot/30 hover:border-autopilot/60',
    bg: 'hover:bg-autopilot/5',
  },
] as const

export default function OfferChoiceSection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  const [ref, inView] = useReveal('-80px')

  if (autopilot) return null

  return (
    <section ref={ref} id="choose-offer" className="relative w-full py-16 md:py-24 bg-[#0a0a0a]">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-neutral-500 mb-3">
            {fr ? 'Avant de choisir' : 'Before you choose'}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            {fr ? 'Vous préférez apprendre ou déléguer ?' : 'Would you rather learn or delegate?'}
          </h2>
          <p className="mt-3 text-neutral-400">
            {fr
              ? 'Trois niveaux d\'implication. Une seule question.'
              : 'Three levels of involvement. One question.'}
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CHOICES.map((c, i) => {
              const Icon = c.icon
              const title = fr ? c.titleFr : c.titleEn
              const sub = fr ? c.subFr : c.subEn
              return (
                <motion.a
                  key={c.id}
                  href={c.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.08 * i }}
                  className={`group flex flex-col items-center gap-3 rounded-2xl border px-5 py-7 transition-all ${c.border} ${c.bg}`}
                >
                  <Icon className={c.color} size={28} />
                  <span className="text-lg font-bold text-white">{title}</span>
                  <span className={`text-sm font-semibold ${c.color}`}>→ {sub}</span>
                </motion.a>
              )
            })}
          </div>

          <div className="mt-10">
            <OnboardingLink className="inline-flex items-center gap-2 rounded-xl bg-empire px-8 py-4 text-base font-bold text-black transition-all hover:brightness-110 hover:scale-[1.02]">
              {fr ? 'Démarrer Empire gratuitement' : 'Start Empire for free'}
              <ArrowRight size={17} />
            </OnboardingLink>
            <p className="mt-3 text-xs text-neutral-500">
              {fr ? '7 jours gratuits · Sans engagement' : '7 days free · No commitment'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('open-offer-quiz'))}
            className="mt-6 text-sm text-neutral-400 underline-offset-4 hover:text-white hover:underline"
          >
            {fr ? 'Pas sûr ? Faire le quiz « Quelle offre pour vous ? »' : 'Not sure? Take the « Which offer for you? » quiz'}
          </button>
        </motion.div>
      </div>
    </section>
  )
}
