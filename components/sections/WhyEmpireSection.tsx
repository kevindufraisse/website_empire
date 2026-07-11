'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import OnboardingLink from '@/components/OnboardingLink'
import { Clock, TrendingDown, Flame, Eye, ArrowRight } from 'lucide-react'

export default function WhyEmpireSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const painPoints = fr
    ? [
        {
          icon: Clock,
          title: '1h pour un post. 3h pour un Reel.',
          desc: 'Vous passez vos soirées à écrire, monter, sous-titrer. Le lendemain, 200 vues. Le surlendemain, vous recommencez.',
        },
        {
          icon: TrendingDown,
          title: 'Vous abandonnez après 3 semaines.',
          desc: 'C\'est toujours le même scénario. Vous commencez motivé, puis la charge de travail vous rattrape. Vous arrêtez. Vos concurrents, non.',
        },
        {
          icon: Eye,
          title: 'Vous regardez les autres exploser.',
          desc: 'Des créateurs avec moins d\'expertise que vous génèrent des millions de vues. La différence ? Ils ont un système. Vous, non.',
        },
        {
          icon: Flame,
          title: 'Vous gérez tout en même temps.',
          desc: 'Clients, produit, admin, compta, recrutement... et en plus il faudrait poster tous les jours sur 7 réseaux ? C\'est impossible seul.',
        },
      ]
    : [
        {
          icon: Clock,
          title: '1h for a post. 3h for a Reel.',
          desc: 'You spend your evenings writing, editing, subtitling. Next day, 200 views. The day after, you start over.',
        },
        {
          icon: TrendingDown,
          title: 'You give up after 3 weeks.',
          desc: 'It\'s always the same pattern. You start motivated, then the workload catches up. You stop. Your competitors don\'t.',
        },
        {
          icon: Eye,
          title: 'You watch others blow up.',
          desc: 'Creators with less expertise than you generate millions of views. The difference? They have a system. You don\'t.',
        },
        {
          icon: Flame,
          title: 'You\'re managing everything at once.',
          desc: 'Clients, product, admin, accounting, hiring... and on top of that you should post daily on 7 platforms? It\'s impossible alone.',
        },
      ]

  return (
    <section className="relative w-full py-16 md:py-28 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.06),transparent)]" />

      <div ref={ref} className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <div className="inline-block px-4 py-2 rounded-full bg-empire/10 border border-empire/30">
            <p className="text-sm font-bold text-empire">
              {fr ? 'SANS EMPIRE' : 'WITHOUT EMPIRE'}
            </p>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl md:text-4xl font-bold text-white leading-tight text-center max-w-3xl mx-auto mb-4"
        >
          {fr ? (
            <>
              Vous déléguez votre compta, votre juridique, votre recrutement.{' '}
              <span className="text-empire">Pourquoi pas la meilleure stratégie marketing depuis 10 ans ?</span>
            </>
          ) : (
            <>
              You delegate your accounting, legal, hiring.{' '}
              <span className="text-empire">Why not the best marketing strategy of the last 10 years?</span>
            </>
          )}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-neutral-400 max-w-2xl mx-auto mb-12"
        >
          {fr
            ? 'Voici ce qui se passe si vous continuez sans système :'
            : 'Here\'s what happens if you keep going without a system:'}
        </motion.p>

        {/* Pain cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-12">
          {painPoints.map((point, i) => {
            const Icon = point.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="rounded-2xl border border-red-500/15 bg-red-500/[0.04] p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={18} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">{point.title}</p>
                    <p className="text-[13px] text-neutral-400 leading-relaxed">{point.desc}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Solution flip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="rounded-2xl border border-empire/30 bg-empire/[0.06] p-6 mb-6">
            <p className="text-lg md:text-xl font-bold text-white mb-2">
              {fr
                ? 'Avec Empire, vous parlez 1h par mois.'
                : 'With Empire, you talk 1h per month.'}
            </p>
            <p className="text-sm text-neutral-400">
              {fr
                ? 'Notre équipe s\'occupe du reste : rédaction, montage, sous-titrage, planification, publication sur 7 réseaux. Vous restez focus sur votre business.'
                : 'Our team handles the rest: writing, editing, subtitling, scheduling, publishing on 7 platforms. You stay focused on your business.'}
            </p>
          </div>

          <OnboardingLink className="inline-flex flex-col items-center px-8 py-4 rounded-2xl bg-empire text-black font-bold text-base md:text-lg hover:scale-[1.03] active:scale-100 transition-all shadow-[0_0_40px_rgb(var(--empire-rgb)_/_0.4)]">
            <span className="flex items-center gap-2">
              {fr ? 'Commencer gratuitement' : 'Start for free'}
              <ArrowRight size={20} />
            </span>
            <span className="text-[11px] font-semibold opacity-70">{fr ? 'Sans engagement · Annulez en 1 clic' : 'No commitment · Cancel in 1 click'}</span>
          </OnboardingLink>
        </motion.div>
      </div>
    </section>
  )
}
