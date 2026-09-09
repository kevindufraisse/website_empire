'use client'
import { motion } from 'framer-motion'
import { useReveal } from '@/hooks/useReveal'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { X, Check } from 'lucide-react'
import WaitlistEmailCta from '@/components/WaitlistEmailCta'

type ComparisonRow = {
  dimensionFr: string
  dimensionEn: string
  oldFr: string
  oldEn: string
  newFr: string
  newEn: string
}

/**
 * La comparaison porte sur la promesse actuelle : la façon la plus simple de
 * trouver des clients avec du contenu. Chaque ligne oppose ce que fait
 * quelqu'un seul (ou avec des freelances) à ce que fait le système - formats
 * mesurés, téléphone + écouteurs, leads tracés. La ligne « Coût » ne cite pas
 * de prix : il vit sur la page d'accès, pas ici.
 */
const COMPARISONS: ComparisonRow[] = [
  {
    dimensionFr: 'Quoi filmer',
    dimensionEn: 'What to shoot',
    oldFr: 'Deviner, tester, recommencer',
    oldEn: 'Guess, test, start over',
    newFr: 'Les formats mesurés chaque semaine, prêts à filmer',
    newEn: 'Formats measured every week, ready to shoot',
  },
  {
    dimensionFr: 'Où et quand',
    dimensionEn: 'Where and when',
    oldFr: 'Un bureau, une caméra, une après-midi bloquée',
    oldEn: 'A desk, a camera, a blocked afternoon',
    newFr: 'Votre téléphone, dans un creux de la journée',
    newEn: 'Your phone, in a gap of your day',
  },
  {
    dimensionFr: 'Temps investi',
    dimensionEn: 'Time investment',
    oldFr: '10 à 15 h par semaine minimum',
    oldEn: '10-15h per week minimum',
    newFr: '20 min par semaine, on gère le reste',
    newEn: '20 min per week, we handle the rest',
  },
  {
    dimensionFr: 'Volume',
    dimensionEn: 'Volume',
    oldFr: 'Quelques posts par mois, un seul réseau',
    oldEn: 'A few posts per month, one platform',
    newFr: 'Chaque idée en 10+ contenus, sur 7 réseaux',
    newEn: 'Every idea as 10+ pieces, on 7 platforms',
  },
  {
    dimensionFr: 'Sujets',
    dimensionEn: 'Topics',
    oldFr: 'La page blanche, chaque semaine',
    oldEn: 'The blank page, every week',
    newFr: 'Le brief des sujets qui montent, chaque matin',
    newEn: 'A brief of rising topics, every morning',
  },
  {
    dimensionFr: 'Résultat',
    dimensionEn: 'Outcome',
    oldFr: 'Des vues, sans savoir ce qu\'elles rapportent',
    oldEn: 'Views, with no idea what they bring in',
    newFr: 'Des leads tracés du reel jusqu\'au rendez-vous',
    newEn: 'Leads tracked from the reel to the booked call',
  },
  {
    dimensionFr: 'Coût',
    dimensionEn: 'Cost',
    oldFr: 'Monteur, rédacteur, community manager : 5 000 €+/mois',
    oldEn: 'Editor, writer, community manager: €5,000+/mo',
    newFr: 'Un abonnement, une équipe, un rapport par semaine',
    newEn: 'One subscription, one team, one report a week',
  },
]

export default function QuickWinsSection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  const [ref, isInView] = useReveal('-80px')

  // The comparison is built around the self-serve offer (price, time invested).
  if (autopilot) return null

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
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-empire">
            {fr ? 'La formule, appliquée' : 'The formula, applied'}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {fr
              ? <>La façon la plus simple de trouver des clients <span className="text-empire">avec du contenu.</span></>
              : <>The simplest way to find clients <span className="text-empire">with content.</span></>}
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            {fr
              ? 'Pas plus de contenu : le bon format, tourné en 20 minutes, publié partout, et suivi jusqu\'au client.'
              : 'Not more content: the right format, shot in 20 minutes, published everywhere, and tracked all the way to the client.'}
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden mb-12"
        >
          {/* Table Header - sur mobile, pas de colonne vide à gauche : les
              deux en-têtes se partagent la largeur, la dimension devient le
              titre de chaque ligne. */}
          <div className="grid grid-cols-2 border-b border-white/10 md:grid-cols-[1fr_1fr_1fr]">
            <div className="hidden px-5 py-4 md:block" />
            <div className="px-4 py-3 text-center md:border-l md:border-white/[0.06] md:px-5 md:py-4">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {fr ? 'Sans Empire' : 'Without Empire'}
              </p>
            </div>
            <div className="border-l border-empire/20 bg-empire/[0.04] px-4 py-3 text-center md:px-5 md:py-4">
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
              className={`grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr] ${i < COMPARISONS.length - 1 ? 'border-b border-white/[0.05]' : ''}`}
            >
              {/* Dimension : pleine largeur sur mobile, première colonne sur md+ */}
              <div className="col-span-2 flex items-center px-4 pt-3 pb-1 md:col-span-1 md:px-5 md:py-4">
                <p className="text-sm font-semibold text-white">{fr ? row.dimensionFr : row.dimensionEn}</p>
              </div>

              {/* Old */}
              <div className="flex min-w-0 items-start gap-2 px-4 pb-3 pt-1 md:items-center md:border-l md:border-white/[0.06] md:px-5 md:py-4">
                <X size={14} className="mt-0.5 shrink-0 text-red-400/70 md:mt-0" />
                <p className="min-w-0 text-[13px] leading-snug text-neutral-400 [overflow-wrap:anywhere]">{fr ? row.oldFr : row.oldEn}</p>
              </div>

              {/* New */}
              <div className="flex min-w-0 items-start gap-2 border-l border-empire/20 bg-empire/[0.04] px-4 pb-3 pt-1 md:items-center md:px-5 md:py-4">
                <Check size={14} className="mt-0.5 shrink-0 text-empire md:mt-0" />
                <p className="min-w-0 text-[13px] font-medium leading-snug text-neutral-200 [overflow-wrap:anywhere]">{fr ? row.newFr : row.newEn}</p>
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
          <WaitlistEmailCta compact />
        </motion.div>
      </div>
    </section>
  )
}
