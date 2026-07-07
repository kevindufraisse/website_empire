'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ArrowRight, Check } from 'lucide-react'
import { CtaReassurance } from '@/components/ui/cta-reassurance'
import OnboardingLink from '@/components/OnboardingLink'

const TASKS: { fr: string; en: string; hours: string; cost: string; empire?: { fr: string; en: string } }[] = [
  { fr: '30 sujets viraux prouvés', en: '30 proven viral topics', hours: '12h', cost: '600€' },
  { fr: '7 tournages vidéo (setup, lumière, cadrage)', en: '7 video shoots (setup, lighting, framing)', hours: '7h', cost: '1 400€' },
  { fr: 'Découpage des vidéos', en: 'Video cutting', hours: '15h', cost: '750€' },
  { fr: 'Ajout de b-rolls', en: 'Adding b-rolls', hours: '10h', cost: '500€' },
  { fr: '30 Shorts / Reels / TikTok', en: '30 Shorts / Reels / TikToks', hours: '90h', cost: '3 000€' },
  { fr: '4 montages YouTube (20 min)', en: '4 YouTube edits (20 min)', hours: '12h', cost: '800€', empire: { fr: 'Illimité', en: 'Unlimited' } },
  { fr: '30 posts LinkedIn', en: '30 LinkedIn posts', hours: '30h', cost: '3 000€' },
  { fr: '12 carrousels', en: '12 carousels', hours: '24h', cost: '960€', empire: { fr: 'Illimité', en: 'Unlimited' } },
  { fr: '30 newsletters', en: '30 newsletters', hours: '60h', cost: '3 000€' },
  { fr: 'Correction des fautes', en: 'Proofreading', hours: '8h', cost: '400€' },
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
              ? <>Économisez <span className="text-empire">288h et 15 410€ par mois.</span></>
              : <>Save <span className="text-empire">288h and €15,410 per month.</span></>}
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            {fr
              ? "Être présent sur un seul réseau, c'est ouvrir votre boutique 1 jour sur 7. Voici ce que coûte l'omniprésence — et la meilleure façon de l'obtenir."
              : 'Being on one platform is opening your shop 1 day out of 7. Here\u2019s what omnipresence costs — and the best way to get it.'}
          </p>
        </motion.div>

        {/* Single comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden mb-10"
        >
          <div className="px-5 md:px-8 py-5">
            {/* Header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 md:gap-x-6 pb-2 border-b border-white/10 mb-1">
              <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">{fr ? 'À produire chaque mois' : 'To produce every month'}</span>
              <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider text-right w-12 md:w-16">{fr ? 'Votre temps' : 'Your time'}</span>
              <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider text-right w-16 md:w-20">{fr ? 'Coût freelance' : 'Freelance cost'}</span>
              <span className="text-[11px] text-empire font-semibold uppercase tracking-wider text-right w-16 md:w-20">{fr ? 'Avec Empire' : 'With Empire'}</span>
            </div>

            {/* Task rows */}
            {TASKS.map((task, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 md:gap-x-6 py-1.5 border-b border-white/[0.04] last:border-0">
                <span className="text-[13px] text-neutral-300">{fr ? task.fr : task.en}</span>
                <span className="text-[13px] text-neutral-500 text-right w-12 md:w-16 font-mono">{task.hours}</span>
                <span className="text-[13px] text-neutral-500 text-right w-16 md:w-20 font-mono">{task.cost}</span>
                <span className="inline-flex items-center justify-end gap-1 text-[12px] text-empire text-right w-16 md:w-20 whitespace-nowrap">
                  <Check size={12} className="shrink-0" />
                  {task.empire ? (fr ? task.empire.fr : task.empire.en) : fr ? 'Inclus' : 'Included'}
                </span>
              </div>
            ))}

            {/* Total */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 md:gap-x-6 pt-3 mt-2 border-t border-white/20 pb-1">
              <span className="text-sm font-bold text-white">{fr ? 'TOTAL chaque mois' : 'TOTAL every month'}</span>
              <span className="text-sm font-bold text-white text-right w-12 md:w-16 font-mono">288h</span>
              <span className="text-sm font-bold text-red-400 text-right w-16 md:w-20 font-mono">15 410€</span>
              <span className="text-sm font-bold text-empire text-right w-16 md:w-20 font-mono whitespace-nowrap">{fr ? '1h / sem' : '1h / wk'}</span>
            </div>
            <p className="text-[11px] text-neutral-600 text-right">
              {fr ? '= presque 2 temps pleins, ou le salaire d\u2019une équipe' : '= almost 2 full-time jobs, or a whole team\u2019s salary'}
            </p>
          </div>

          {/* Empire row — the better solution */}
          <div className="border-t border-empire/30 bg-empire/[0.07] px-5 md:px-8 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-base font-bold text-empire mb-1">
                  {fr ? 'Avec Empire : le même volume, géré pour vous' : 'With Empire: the same volume, handled for you'}
                </p>
                <p className="text-[13px] text-neutral-300">
                  {fr
                    ? '166+ contenus publiés par mois. Vous ? 1h de parole par semaine — c\u2019est tout.'
                    : '166+ pieces published per month. You? 1 hour of talking a week — that\u2019s it.'}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-2xl font-black text-empire font-mono leading-none">1h</p>
                  <p className="text-[10px] text-neutral-500">{fr ? 'de parole / semaine' : 'of talking / week'}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-empire font-mono leading-none">166+</p>
                  <p className="text-[10px] text-neutral-500">{fr ? 'contenus / mois' : 'pieces / month'}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {(fr
                ? ['Posts LinkedIn rédigés à votre voix', 'Vidéos montées + Shorts découpés', 'Newsletters écrites et envoyées', 'Publié quotidiennement sur 6+ plateformes']
                : ['LinkedIn posts written in your voice', 'Videos edited + Shorts cut', 'Newsletters written and sent', 'Published daily on 6+ platforms']
              ).map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="text-empire shrink-0" size={14} />
                  <span className="text-[12px] text-neutral-300">{item}</span>
                </div>
              ))}
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
