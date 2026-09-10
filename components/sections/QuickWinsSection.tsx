'use client'
import { motion } from 'framer-motion'
import { useReveal } from '@/hooks/useReveal'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { X, Minus, Check } from 'lucide-react'
import WaitlistEmailCta from '@/components/WaitlistEmailCta'

type Cell = { fr: string; en: string }

type ComparisonRow = {
  dimension: Cell
  /** Seul, sans aide. */
  alone: Cell
  /** Avec des freelances (monteur, rédacteur, CM). */
  freelance: Cell
  /** Avec Empire. */
  empire: Cell
}

/**
 * Trois façons de faire du contenu : seul, avec des freelances, avec Empire.
 * Chaque ligne est une dimension de la formule (sujets, format, temps, coût,
 * visibilité). La colonne Empire est la seule qui répond à tout.
 */
const COMPARISONS: ComparisonRow[] = [
  {
    dimension: { fr: 'Quoi filmer', en: 'What to shoot' },
    alone: { fr: 'Deviner, tester, recommencer', en: 'Guess, test, start over' },
    freelance: { fr: 'Vous devez leur dire quoi faire', en: 'You have to tell them what to do' },
    empire: { fr: 'Les formats mesurés chaque semaine, prêts à filmer', en: 'Formats measured every week, ready to shoot' },
  },
  {
    dimension: { fr: 'Temps investi', en: 'Time invested' },
    alone: { fr: '10-15 h/semaine', en: '10-15 h/week' },
    freelance: { fr: '5 h/semaine à briefer, relire, relancer', en: '5 h/week briefing, proofreading, chasing' },
    empire: { fr: '20 min/semaine, on gère le reste', en: '20 min/week, we handle the rest' },
  },
  {
    dimension: { fr: 'Volume', en: 'Volume' },
    alone: { fr: 'Quelques posts, un réseau', en: 'A few posts, one network' },
    freelance: { fr: 'Ce que le budget permet', en: 'Whatever the budget allows' },
    empire: { fr: 'Chaque idée en 10+ contenus, 7 réseaux', en: 'Every idea into 10+ pieces, 7 networks' },
  },
  {
    dimension: { fr: 'Sujets', en: 'Topics' },
    alone: { fr: 'La page blanche', en: 'The blank page' },
    freelance: { fr: 'La page blanche (c\'est vous qui briefez)', en: 'The blank page (you write the brief)' },
    empire: { fr: 'Le brief des sujets qui montent, chaque matin', en: 'A brief of rising topics, every morning' },
  },
  {
    dimension: { fr: 'Résultat', en: 'Result' },
    alone: { fr: 'Des vues, peut-être', en: 'Views, maybe' },
    freelance: { fr: 'Des vues, sans savoir ce qu\'elles rapportent', en: 'Views, with no idea what they bring in' },
    empire: { fr: 'Des leads tracés du reel au rendez-vous', en: 'Leads tracked from the reel to the meeting' },
  },
  {
    dimension: { fr: 'Coût', en: 'Cost' },
    alone: { fr: 'Votre temps (le plus cher)', en: 'Your time (the most expensive)' },
    freelance: { fr: 'Monteur + rédacteur + CM : 5 000 €+/mois', en: 'Editor + writer + CM: €5,000+/month' },
    empire: { fr: 'Un abonnement, une équipe, un rapport hebdo', en: 'One subscription, one team, a weekly report' },
  },
]

const COLUMNS = [
  { key: 'alone', label: { fr: 'Seul', en: 'Alone' } },
  { key: 'freelance', label: { fr: 'Freelances', en: 'Freelancers' } },
  { key: 'empire', label: { fr: 'Empire', en: 'Empire' } },
] as const

export default function QuickWinsSection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  const [ref, isInView] = useReveal('-80px')

  if (autopilot) return null

  const t = (c: Cell) => (fr ? c.fr : c.en)

  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.05),transparent)]" />

      <div ref={ref} className="relative z-10 container max-w-5xl mx-auto px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-12"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-empire">
            {fr ? 'Étape 5 · Le prix' : 'Step 5 · The price'}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {fr
              ? <>Seul, avec des freelances, <span className="text-empire">ou avec Empire.</span></>
              : <>Alone, with freelancers, <span className="text-empire">or with Empire.</span></>}
          </h2>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="rounded-2xl border border-white/[0.14] bg-[#141414] overflow-hidden mb-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          {/* Header - desktop only. Sur mobile chaque ligne porte ses propres
              libellés, donc pas d'en-tête à faire tenir sur 3 colonnes. */}
          <div className="hidden border-b border-white/10 md:grid md:grid-cols-[0.9fr_1fr_1fr_1.25fr]">
            <div className="px-5 py-4" />
            {COLUMNS.map((c) => (
              <div
                key={c.key}
                className={`px-5 py-4 text-center border-l ${
                  c.key === 'empire' ? 'border-empire/20 bg-empire/[0.06]' : 'border-white/[0.06]'
                }`}
              >
                <p className={`text-xs font-bold uppercase tracking-wider ${c.key === 'empire' ? 'text-empire' : 'text-neutral-500'}`}>
                  {t(c.label)}
                </p>
              </div>
            ))}
          </div>

          {/* Rows */}
          {COMPARISONS.map((row, i) => (
            <motion.div
              key={row.dimension.en}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
              className={`md:grid md:grid-cols-[0.9fr_1fr_1fr_1.25fr] ${i < COMPARISONS.length - 1 ? 'border-b border-white/[0.06]' : ''}`}
            >
              {/* Dimension : titre de la ligne sur mobile, première colonne sur md+ */}
              <div className="flex items-center px-4 pt-4 pb-2 md:px-5 md:py-4">
                <p className="text-sm font-bold text-white">{t(row.dimension)}</p>
              </div>

              {COLUMNS.map((c) => {
                const isEmpire = c.key === 'empire'
                const isAlone = c.key === 'alone'
                const Icon = isEmpire ? Check : isAlone ? X : Minus
                return (
                  <div
                    key={c.key}
                    className={`flex min-w-0 items-start gap-2.5 px-4 py-2 md:items-center md:border-l md:px-5 md:py-4 ${
                      isEmpire
                        ? 'mb-0 border-t border-empire/20 bg-empire/[0.06] pt-3 pb-4 md:border-t-0 md:pt-4'
                        : 'md:border-white/[0.06]'
                    }`}
                  >
                    <Icon
                      size={14}
                      className={`mt-0.5 shrink-0 md:mt-0 ${
                        isEmpire ? 'text-empire' : isAlone ? 'text-red-400/70' : 'text-neutral-500'
                      }`}
                    />
                    <div className="min-w-0">
                      {/* Libellé de colonne, mobile uniquement */}
                      <p className={`text-[10px] font-bold uppercase tracking-wider md:hidden ${isEmpire ? 'text-empire' : 'text-neutral-500'}`}>
                        {t(c.label)}
                      </p>
                      <p
                        className={`text-[13px] leading-snug [overflow-wrap:anywhere] ${
                          isEmpire ? 'font-medium text-neutral-100' : 'text-neutral-400'
                        }`}
                      >
                        {t(row[c.key])}
                      </p>
                    </div>
                  </div>
                )
              })}
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
