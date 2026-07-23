'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ArrowRight, X, Check } from 'lucide-react'
import { CtaReassurance } from '@/components/ui/cta-reassurance'
import OnboardingLink from '@/components/OnboardingLink'

type ComparisonRow = {
  dimensionFr: string
  dimensionEn: string
  oldFr: string
  oldEn: string
  newFr: string
  newEn: string
}

const COMPARISONS: ComparisonRow[] = [
  {
    dimensionFr: 'Volume de contenu',
    dimensionEn: 'Content volume',
    oldFr: 'Quelques posts par mois, un seul réseau',
    oldEn: 'A few posts per month, one platform',
    newFr: 'Contenu quotidien sur 7 réseaux',
    newEn: 'Daily content on 7 platforms',
  },
  {
    dimensionFr: 'Authenticité',
    dimensionEn: 'Authenticity',
    oldFr: 'Copié-collé de ChatGPT, voix générique',
    oldEn: 'ChatGPT copy-paste, generic voice',
    newFr: 'Entraîné sur des millions de données virales',
    newEn: 'Trained on millions of viral data points',
  },
  {
    dimensionFr: 'Sujets',
    dimensionEn: 'Topics',
    oldFr: 'Trouver les sujets soi-même',
    oldEn: 'Find topics yourself',
    newFr: 'Des sujets viraux toutes les semaines',
    newEn: 'Viral topics delivered every week',
  },
  {
    dimensionFr: 'Temps investi',
    dimensionEn: 'Time investment',
    oldFr: '10 à 15h par semaine minimum',
    oldEn: '10–15h per week minimum',
    newFr: '1h par mois, on gère le reste',
    newEn: '1h per month, we handle the rest',
  },
  {
    dimensionFr: 'Coût',
    dimensionEn: 'Cost',
    oldFr: 'Plusieurs freelances : 5 000€+/mois',
    oldEn: 'Multiple freelancers: €5,000+/mo',
    newFr: 'À partir de 199€/mois, tout inclus',
    newEn: 'From €199/mo, all-inclusive',
  },
  {
    dimensionFr: 'Scalabilité',
    dimensionEn: 'Scalability',
    oldFr: 'Recruter, former, manager plus de monde',
    oldEn: 'Hire, train, manage more people',
    newFr: 'Le système scale, pas votre charge',
    newEn: 'The system scales, not your workload',
  },
]

export default function QuickWinsSection() {
  const { lang, t } = useLanguage()
  const fr = lang === 'fr'
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.05),transparent)]" />

      <div ref={ref} className="relative z-10 container max-w-4xl mx-auto px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {fr
              ? <>Arrêtez de créer du contenu. <span className="text-empire">Laissez le système le faire.</span></>
              : <>Stop creating content. <span className="text-empire">Let the system do it.</span></>}
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            {fr
              ? 'Tout ce que vous faites manuellement ou déléguez à prix d\'or, Empire le fait pour vous dès le jour 1.'
              : 'Everything you do manually or outsource at a premium, Empire handles for you from day 1.'}
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden mb-12"
        >
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-white/10">
            <div className="px-5 py-4" />
            <div className="px-5 py-4 text-center border-l border-white/[0.06]">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {fr ? 'Sans Empire' : 'Without Empire'}
              </p>
            </div>
            <div className="px-5 py-4 text-center border-l border-empire/20 bg-empire/[0.04]">
              <p className="text-xs font-bold uppercase tracking-wider text-empire">
                {fr ? 'Avec Empire' : 'With Empire'}
              </p>
            </div>
          </div>

          {/* Rows */}
          {COMPARISONS.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
              className={`grid grid-cols-[1fr_1fr_1fr] ${i < COMPARISONS.length - 1 ? 'border-b border-white/[0.05]' : ''}`}
            >
              {/* Dimension */}
              <div className="px-5 py-4 flex items-center">
                <p className="text-sm font-semibold text-white">{fr ? row.dimensionFr : row.dimensionEn}</p>
              </div>

              {/* Old */}
              <div className="px-5 py-4 flex items-center gap-2 border-l border-white/[0.06]">
                <X size={14} className="shrink-0 text-red-400/70" />
                <p className="text-[13px] text-neutral-400">{fr ? row.oldFr : row.oldEn}</p>
              </div>

              {/* New */}
              <div className="px-5 py-4 flex items-center gap-2 border-l border-empire/20 bg-empire/[0.04]">
                <Check size={14} className="shrink-0 text-empire" />
                <p className="text-[13px] text-neutral-200 font-medium">{fr ? row.newFr : row.newEn}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
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
