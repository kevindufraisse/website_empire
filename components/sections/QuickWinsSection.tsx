'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ArrowRight, Check } from 'lucide-react'
import { CtaReassurance } from '@/components/ui/cta-reassurance'
import OnboardingLink from '@/components/OnboardingLink'

const TASKS: { fr: string; en: string; hours: string; cost: string }[] = [
  { fr: '30 sujets viraux prouvés', en: '30 proven viral topics', hours: '12h', cost: '600€' },
  { fr: 'Découpage des vidéos', en: 'Video cutting & clipping', hours: '15h', cost: '750€' },
  { fr: 'Ajout de b-rolls', en: 'Adding b-rolls', hours: '10h', cost: '500€' },
  { fr: '30 Shorts / Reels / TikTok', en: '30 Shorts / Reels / TikToks', hours: '90h', cost: '3 000€' },
  { fr: '4 montages YouTube (20 min)', en: '4 YouTube edits (20 min)', hours: '12h', cost: '800€' },
  { fr: '30 posts LinkedIn', en: '30 LinkedIn posts', hours: '30h', cost: '3 000€' },
  { fr: '12 carrousels', en: '12 carousels', hours: '24h', cost: '960€' },
  { fr: '30 newsletters', en: '30 newsletters', hours: '60h', cost: '3 000€' },
  { fr: 'Correction et relecture', en: 'Proofreading & QA', hours: '8h', cost: '400€' },
  { fr: 'Community management', en: 'Community management', hours: '20h', cost: '1 000€' },
]

export default function QuickWinsSection() {
  const { lang, t } = useLanguage()
  const fr = lang === 'fr'
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.05),transparent)]" />

      <div ref={ref} className="relative z-10 container max-w-3xl mx-auto px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {fr
              ? <>Économisez <span className="text-empire">281h et 14 010€ par mois.</span></>
              : <>Save <span className="text-empire">281h and €14,010 per month.</span></>}
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            {fr
              ? "Être présent sur un seul réseau, c'est ouvrir votre boutique 1 jour sur 7. Voici ce que coûte l'omniprésence — et la meilleure façon de l'obtenir."
              : 'Being on one platform is opening your shop 1 day out of 7. Here\u2019s what omnipresence costs — and the best way to get it.'}
          </p>
        </motion.div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden mb-10"
        >
          <div className="px-4 md:px-8 py-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-x-3 md:gap-x-6">
              {/* Header */}
              <span className="pb-2.5 border-b border-white/10 text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">{fr ? 'À produire chaque mois' : 'To produce every month'}</span>
              <span className="pb-2.5 border-b border-white/10 text-[11px] text-neutral-500 font-semibold uppercase tracking-wider text-right whitespace-nowrap">{fr ? 'En freelance' : 'Freelance'}</span>
              <span className="pb-2.5 border-b border-white/10 text-[11px] text-empire font-semibold uppercase tracking-wider text-right whitespace-nowrap">{fr ? 'Avec Empire' : 'With Empire'}</span>

              {/* All rows — no collapse */}
              {TASKS.map((task, i) => (
                <div key={i} className="contents">
                  <span className="py-2 border-b border-white/[0.04] text-[13px] text-neutral-300 self-center">{fr ? task.fr : task.en}</span>
                  <span className="py-2 border-b border-white/[0.04] text-[12px] text-neutral-500 text-right font-mono whitespace-nowrap self-center">{task.hours} · <span className="line-through decoration-red-400/40">{task.cost}</span></span>
                  <span className="py-2 border-b border-white/[0.04] inline-flex items-center justify-end gap-1 text-[12px] text-empire whitespace-nowrap">
                    <Check size={12} className="shrink-0" />
                    {fr ? 'Inclus' : 'Included'}
                  </span>
                </div>
              ))}
            </div>

            {/* Total row */}
            <div className="grid grid-cols-2 gap-4 pt-4 mt-2 border-t border-white/10">
              <div>
                <p className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider mb-1">{fr ? 'En freelance' : 'Freelance'}</p>
                <p className="text-lg md:text-xl font-bold text-red-400 font-mono leading-tight">14 010€<span className="text-[11px] font-medium text-neutral-500">{fr ? '/mois' : '/mo'}</span></p>
                <p className="text-[11px] text-neutral-600 mt-0.5">{fr ? '+ 281h de votre temps' : '+ 281h of your time'}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-empire font-semibold uppercase tracking-wider mb-1">{fr ? 'Avec Empire' : 'With Empire'}</p>
                <p className="text-lg md:text-xl font-bold text-empire font-mono leading-tight">{fr ? 'dès 175€' : 'from €175'}<span className="text-[11px] font-medium text-empire/60">{fr ? '/mois' : '/mo'}</span></p>
                <p className="text-[11px] text-neutral-400 mt-0.5">{fr ? '+ 1h de parole par mois' : '+ 1h of talking a month'}</p>
              </div>
            </div>

            <p className="mt-3 text-center text-[13px] text-white">
              {fr
                ? <>Vous économisez <span className="font-bold text-empire">plus de 13 800€ et 280h</span> chaque mois.</>
                : <>You save <span className="font-bold text-empire">over €13,800 and 280h</span> every month.</>}
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <OnboardingLink className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-empire text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgb(var(--empire-rgb)_/_0.3)]">
            {t.common.startNow}
            <ArrowRight size={20} />
          </OnboardingLink>
          <CtaReassurance className="mt-4 px-2" />
        </motion.div>
      </div>
    </section>
  )
}
