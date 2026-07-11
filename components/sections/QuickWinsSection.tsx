'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ArrowRight, Check } from 'lucide-react'
import { CtaReassurance } from '@/components/ui/cta-reassurance'
import OnboardingLink from '@/components/OnboardingLink'

type PlanId = 'starter' | 'growth' | 'scale'

type Task = { fr: string; en: string; hours: string; cost: string }

const PLAN_TASKS: Record<PlanId, { tasks: Task[]; totalHours: string; totalCost: string; price: number }> = {
  starter: {
    tasks: [
      { fr: '15 posts LinkedIn', en: '15 LinkedIn posts', hours: '15h', cost: '1 500€' },
      { fr: '15 Reels & Shorts', en: '15 Reels & Shorts', hours: '30h', cost: '750€' },
      { fr: '4 newsletters', en: '4 newsletters', hours: '8h', cost: '400€' },
      { fr: 'Miniatures (Instagram, YouTube, LinkedIn)', en: 'Thumbnails (Instagram, YouTube, LinkedIn)', hours: '4h', cost: '200€' },
      { fr: 'Sous-titrage vidéos', en: 'Video subtitling', hours: '5h', cost: '250€' },
      { fr: 'Adaptation multi-plateformes (7 réseaux)', en: 'Multi-platform adaptation (7 networks)', hours: '10h', cost: '500€' },
      { fr: 'Stratégie éditoriale et calendrier', en: 'Editorial strategy & calendar', hours: '6h', cost: '500€' },
      { fr: 'Adaptation multilingue (FR, EN, ES)', en: 'Multilingual adaptation (FR, EN, ES)', hours: '12h', cost: '600€' },
      { fr: 'Veille sujets viraux', en: 'Viral topic research', hours: '6h', cost: '300€' },
      { fr: 'Community manager (montage, correction, planification)', en: 'Community manager (editing, QA, scheduling)', hours: '15h', cost: '750€' },
    ],
    totalHours: '111h',
    totalCost: '5 750€',
    price: 199,
  },
  growth: {
    tasks: [
      { fr: '25 posts LinkedIn', en: '25 LinkedIn posts', hours: '25h', cost: '2 500€' },
      { fr: '33 Reels & Shorts (dont 8 montés pro)', en: '33 Reels & Shorts (incl. 8 pro-edited)', hours: '66h', cost: '1 650€' },
      { fr: '4 newsletters', en: '4 newsletters', hours: '8h', cost: '400€' },
      { fr: '1 vidéo YouTube + 1 carrousel', en: '1 YouTube video + 1 carousel', hours: '6h', cost: '280€' },
      { fr: 'Miniatures (Instagram, YouTube, LinkedIn)', en: 'Thumbnails (Instagram, YouTube, LinkedIn)', hours: '6h', cost: '300€' },
      { fr: 'Sous-titrage vidéos', en: 'Video subtitling', hours: '10h', cost: '500€' },
      { fr: 'Adaptation multi-plateformes (7 réseaux)', en: 'Multi-platform adaptation (7 networks)', hours: '16h', cost: '800€' },
      { fr: 'Stratégie éditoriale et calendrier', en: 'Editorial strategy & calendar', hours: '8h', cost: '700€' },
      { fr: 'Adaptation multilingue (FR, EN, ES)', en: 'Multilingual adaptation (FR, EN, ES)', hours: '20h', cost: '1 000€' },
      { fr: 'Veille sujets viraux', en: 'Viral topic research', hours: '6h', cost: '300€' },
      { fr: 'Community manager (montage, correction, planification)', en: 'Community manager (editing, QA, scheduling)', hours: '25h', cost: '1 250€' },
    ],
    totalHours: '196h',
    totalCost: '9 680€',
    price: 499,
  },
  scale: {
    tasks: [
      { fr: '30 posts LinkedIn', en: '30 LinkedIn posts', hours: '30h', cost: '3 000€' },
      { fr: '48 Reels & Shorts (dont 18 montés pro)', en: '48 Reels & Shorts (incl. 18 pro-edited)', hours: '96h', cost: '2 400€' },
      { fr: '4 newsletters', en: '4 newsletters', hours: '8h', cost: '400€' },
      { fr: '4 vidéos YouTube', en: '4 YouTube videos', hours: '12h', cost: '800€' },
      { fr: '4 carrousels', en: '4 carousels', hours: '8h', cost: '320€' },
      { fr: 'Miniatures (Instagram, YouTube, LinkedIn)', en: 'Thumbnails (Instagram, YouTube, LinkedIn)', hours: '8h', cost: '400€' },
      { fr: 'Sous-titrage vidéos', en: 'Video subtitling', hours: '16h', cost: '800€' },
      { fr: 'Adaptation multi-plateformes (7 réseaux)', en: 'Multi-platform adaptation (7 networks)', hours: '24h', cost: '1 200€' },
      { fr: 'Stratégie éditoriale et calendrier', en: 'Editorial strategy & calendar', hours: '10h', cost: '900€' },
      { fr: 'Adaptation multilingue (FR, EN, ES)', en: 'Multilingual adaptation (FR, EN, ES)', hours: '30h', cost: '1 500€' },
      { fr: 'Veille sujets viraux', en: 'Viral topic research', hours: '6h', cost: '300€' },
      { fr: 'Community manager (montage, correction, planification)', en: 'Community manager (editing, QA, scheduling)', hours: '40h', cost: '2 000€' },
    ],
    totalHours: '288h',
    totalCost: '14 020€',
    price: 799,
  },
}

const PLAN_LABELS: Record<PlanId, string> = {
  starter: 'Starter',
  growth: 'Growth',
  scale: 'Scale',
}

export default function QuickWinsSection() {
  const { lang, t } = useLanguage()
  const fr = lang === 'fr'
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('growth')

  const plan = PLAN_TASKS[selectedPlan]

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
              ? <>Économisez <span className="text-empire">{plan.totalHours} et {plan.totalCost} par mois.</span></>
              : <>Save <span className="text-empire">{plan.totalHours} and {plan.totalCost} per month.</span></>}
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            {fr
              ? "Dès la première semaine. Nos clients passent en général de quelques posts sur un seul réseau à du contenu publié tous les jours sur tous les réseaux - avec moins d'effort qu'avant et plus de performance (parfois jusqu'à 10 000% de plus)."
              : 'From the first week. Our clients typically go from a few posts on one network to daily content across all platforms - with less effort than before and more performance (sometimes up to 10,000% more).'}
          </p>

          <div className="mt-6 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1">
            {(Object.keys(PLAN_LABELS) as PlanId[]).map((id) => (
              <button
                key={id}
                onClick={() => setSelectedPlan(id)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  selectedPlan === id ? 'bg-empire text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {PLAN_LABELS[id]}
              </button>
            ))}
          </div>
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

              {plan.tasks.map((task, i) => (
                <div key={`${selectedPlan}-${i}`} className="contents">
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
            <div className="pt-4 mt-2 border-t border-white/10 text-center">
              <p className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider mb-1">{fr ? 'Total en freelance' : 'Total as freelance'}</p>
              <p className="text-lg md:text-xl font-bold text-red-400 font-mono leading-tight">{plan.totalCost}<span className="text-[11px] font-medium text-neutral-500">{fr ? '/mois' : '/mo'}</span></p>
              <p className="text-[11px] text-neutral-600 mt-0.5">{fr ? `+ ${plan.totalHours} de votre temps` : `+ ${plan.totalHours} of your time`}</p>
              <p className="mt-2 text-[13px] text-white">
                {fr
                  ? <>Avec {PLAN_LABELS[selectedPlan]} : <span className="font-bold text-empire">{plan.price}€/mois</span> - et 1h de votre temps.</>
                  : <>With {PLAN_LABELS[selectedPlan]}: <span className="font-bold text-empire">€{plan.price}/mo</span> - and 1h of your time.</>}
              </p>
            </div>
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
