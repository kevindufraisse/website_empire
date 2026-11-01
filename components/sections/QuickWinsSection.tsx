'use client'
import { motion } from 'framer-motion'
import { useReveal } from '@/hooks/useReveal'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { Minus, Check } from 'lucide-react'
import EmpireSalesCta from '@/components/EmpireSalesCta'

type Cell = { fr: string; en: string }

type ComparisonRow = {
  dimension: Cell
  chatgpt: Cell
  tools: Cell
  empire: Cell
}

// Compare the standard workflows, not every custom integration or future feature.
const COMPARISONS: ComparisonRow[] = [
  {
    dimension: { fr: 'Trouver un sujet', en: 'Find a topic' },
    chatgpt: { fr: 'Brainstorming et recherche dans une conversation', en: 'Brainstorming and research in a conversation' },
    tools: { fr: 'Idées et contenus à réunir dans vos outils', en: 'Gather your ideas and content across tools' },
    empire: { fr: 'Vos liens, vocaux et votre veille deviennent des sujets', en: 'Your links, voice notes and research become topics' },
  },
  {
    dimension: { fr: 'Donner une forme', en: 'Choose a format' },
    chatgpt: { fr: 'Angles, plans, scripts et textes à affiner', en: 'Angles, outlines, scripts and text to refine' },
    tools: { fr: 'Montage et sous-titres dans CapCut', en: 'Editing and captions in CapCut' },
    empire: { fr: 'Formats guidés, montage et déclinaisons à partir de votre prise', en: 'Guided formats, editing and adaptations from your recording' },
  },
  {
    dimension: { fr: 'Publier', en: 'Publish' },
    chatgpt: { fr: 'Contenus à transférer vers votre circuit de publication', en: 'Move content into your publishing workflow' },
    tools: { fr: 'Planification et publication multiréseau dans Buffer', en: 'Multi-channel scheduling and publishing in Buffer' },
    empire: { fr: 'Vous validez, puis publiez sur vos réseaux connectés', en: 'Approve, then publish on your connected channels' },
  },
  {
    dimension: { fr: 'Ce que vous pilotez', en: 'What you manage' },
    chatgpt: { fr: 'Les échanges, le choix des formats et la production', en: 'Prompts, format selection and production' },
    tools: { fr: 'Les fichiers, les exports et le passage d’un outil à l’autre', en: 'Files, exports and moving between tools' },
    empire: { fr: 'Votre point de vue, votre enregistrement, votre validation', en: 'Your point of view, your recording, your approval' },
  },
  {
    dimension: { fr: 'Budget', en: 'Budget' },
    chatgpt: { fr: 'Selon l’offre choisie, puis vos outils de production', en: 'Your chosen plan, plus your production tools' },
    tools: { fr: 'Des offres distinctes pour le montage et la diffusion', en: 'Separate plans for editing and publishing' },
    empire: { fr: 'Un budget de crédits selon les contenus que vous produisez', en: 'A credit budget based on the content you produce' },
  },
  {
    dimension: { fr: 'Le bon usage', en: 'Best fit' },
    chatgpt: { fr: 'Réfléchir et écrire avec un assistant polyvalent', en: 'Think and write with a versatile assistant' },
    tools: { fr: 'Construire votre propre chaîne de production', en: 'Build your own production workflow' },
    empire: { fr: 'Relier le sujet, la production et la diffusion au même endroit', en: 'Connect topics, production and distribution in one place' },
  },
]

const COLUMNS = [
  { key: 'chatgpt', label: { fr: 'ChatGPT', en: 'ChatGPT' } },
  { key: 'tools', label: { fr: 'CapCut + Buffer', en: 'CapCut + Buffer' } },
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
            {fr ? 'Outils ou chaîne complète ?' : 'Tools or a complete workflow?'}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {fr
              ? <>Des outils pour chaque tâche.<br /><span className="text-empire">Empire pour les relier.</span></>
              : <>Tools for every task.<br /><span className="text-empire">Empire to connect them.</span></>}
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-400 md:text-lg">
            {fr
              ? 'ChatGPT vous aide à réfléchir et à écrire. CapCut monte. Buffer programme. Empire réunit le parcours, du premier sujet au contenu publié.'
              : 'ChatGPT helps you think and write. CapCut edits. Buffer schedules. Empire connects the journey, from the first topic to published content.'}
          </p>
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
                const Icon = isEmpire ? Check : Minus
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
                        isEmpire ? 'text-empire' : 'text-neutral-500'
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

        <p className="mx-auto -mt-6 mb-10 max-w-3xl text-center text-[11px] leading-relaxed text-neutral-500">
          {fr ? 'Comparaison des parcours standards, hors intégrations sur mesure. Fonctions selon les offres. Références : ' : 'Standard workflows, excluding custom integrations. Features vary by plan. References: '}
          <a href="https://openai.com/chatgpt/use-cases/writing-with-ai/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">ChatGPT</a>{' · '}
          <a href="https://www.capcut.com/tools/add-subtitles-to-video" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">CapCut</a>{' · '}
          <a href="https://buffer.com/publish" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Buffer</a>.
        </p>
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <EmpireSalesCta source="home-comparison" />
        </motion.div>
      </div>
    </section>
  )
}
