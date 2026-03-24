'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Play, PenLine, Users } from 'lucide-react'
import BorderBeam from '@/components/magicui/border-beam'
import { DotPattern } from '@/components/magicui/dot-pattern'

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

const weeks = [
  {
    num: '01',
    tag: 'Semaine 1 · Jours 1–7',
    title: 'Comprendre la viralité',
    desc: "Psychologie de l'attention, hooks, mécanique des millions de vues. Pourquoi certains contenus explosent — et comment le reproduire.",
    highlight: false,
  },
  {
    num: '02',
    tag: 'Semaine 2 · Jours 8–14',
    title: 'Créer sur tous les réseaux',
    desc: 'Formats par plateforme, rythme, systèmes de production. Instagram, LinkedIn, TikTok, YouTube — tu crées partout sans t\'épuiser.',
    highlight: false,
  },
  {
    num: '03',
    tag: 'Semaine 3 · Jours 15–21',
    title: 'Devenir Head of Viralité',
    desc: 'Transformer les vues en clients, générer des RDV, construire une activité qui tourne sans te vendre à plein temps.',
    highlight: true,
  },
]

const tools = [
  {
    icon: Play,
    label: 'Vidéos pré-enregistrées',
    desc: 'Une leçon courte et actionnable chaque jour. Tu avances à ton rythme, accès à vie.',
    glow: false,
  },
  {
    icon: PenLine,
    label: 'Exercices quotidiens',
    desc: 'Chaque jour, une action concrète. Tu ne regardes pas — tu fais.',
    glow: false,
  },
  {
    icon: Users,
    label: 'Groupe privé',
    desc: "Tu postes, tu reçois des feedbacks, tu vois les résultats des autres. C'est là que les meilleurs se révèlent.",
    glow: false,
  },
]

export default function AcademyProgramSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-gradient-to-b from-black to-[#0f0f0f] overflow-hidden">
      <DotPattern className="opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_60%,rgba(218,252,104,0.05),transparent)]" />

      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto">

          {/* Title */}
          <FadeInBlock>
            <div className="text-center mb-16">
              <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">Le programme</p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Ce que tu apprends,{' '}
                <span className="text-empire">semaine par semaine.</span>
              </h2>
            </div>
          </FadeInBlock>

          {/* Weeks — timeline layout */}
          <FadeInBlock delay={0.1}>
            <div className="relative">
              {/* Connecting line desktop */}
              <div className="hidden md:block absolute top-9 left-[calc(16.66%-1px)] right-[calc(16.66%-1px)] h-px bg-gradient-to-r from-empire/20 via-empire/50 to-empire" />

              <div className="grid md:grid-cols-3 gap-5">
                {weeks.map((week, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.5 }}
                    viewport={{ once: true }}
                    className={`relative p-6 rounded-2xl border overflow-hidden transition-all ${
                      week.highlight
                        ? 'bg-gradient-to-br from-empire/15 to-empire/5 border-empire/60 shadow-[0_0_40px_rgba(218,252,104,0.12)]'
                        : 'bg-gradient-to-br from-white/8 to-white/[0.02] border-white/10'
                    }`}
                  >
                    {week.highlight && <BorderBeam size={300} duration={8} />}

                    {/* Step number */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm mb-5 border-2 relative z-10 ${
                      week.highlight
                        ? 'bg-empire text-black border-empire shadow-[0_0_16px_rgba(218,252,104,0.5)]'
                        : 'bg-white/5 text-empire border-empire/30'
                    }`}>
                      {week.num}
                    </div>

                    <p className="text-[10px] font-bold tracking-widest uppercase text-empire/70 mb-2">{week.tag}</p>
                    <h3 className={`text-lg font-bold mb-2 ${week.highlight ? 'text-empire' : 'text-white'}`}>
                      {week.title}
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">{week.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeInBlock>

          {/* Tools */}
          <FadeInBlock delay={0.25}>
            <div className="mt-10 grid md:grid-cols-3 gap-4">
              {tools.map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="group flex gap-4 p-5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-empire/30 hover:bg-empire/5 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-empire/10 border border-empire/20 flex items-center justify-center flex-shrink-0 group-hover:bg-empire/20 group-hover:border-empire/40 transition-all">
                    <tool.icon className="text-empire" size={17} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1 group-hover:text-empire transition-colors">{tool.label}</p>
                    <p className="text-neutral-500 text-xs leading-relaxed">{tool.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeInBlock>

        </div>
      </div>
    </section>
  )
}
