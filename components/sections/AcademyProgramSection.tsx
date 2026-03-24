'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Play, PenLine, Users } from 'lucide-react'

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
    tag: 'Semaine 1 · Jours 1–7',
    title: 'Comprendre la viralité',
    desc: "Psychologie de l'attention, hooks, mécanique des millions de vues. Pourquoi certains contenus explosent.",
    color: 'from-blue-500/10 to-transparent border-blue-500/20',
    tagColor: 'text-blue-400',
  },
  {
    tag: 'Semaine 2 · Jours 8–14',
    title: 'Créer sur tous les réseaux',
    desc: 'Formats par plateforme, rythme, systèmes de production. Instagram, LinkedIn, TikTok, YouTube.',
    color: 'from-purple-500/10 to-transparent border-purple-500/20',
    tagColor: 'text-purple-400',
  },
  {
    tag: 'Semaine 3 · Jours 15–21',
    title: 'Devenir Head of Viralité',
    desc: 'Transformer les vues en clients, générer des RDV, construire une activité à 3 000€/mois en 4h/semaine.',
    color: 'from-empire/15 to-transparent border-empire/30',
    tagColor: 'text-empire',
  },
]

const tools = [
  {
    icon: Play,
    label: 'Vidéos pré-enregistrées',
    desc: 'Une leçon courte et actionnable chaque jour. Tu avances à ton rythme, accès à vie.',
  },
  {
    icon: PenLine,
    label: 'Exercices & challenges quotidiens',
    desc: 'Chaque jour, une action concrète. Tu ne regardes pas — tu fais.',
  },
  {
    icon: Users,
    label: 'Groupe privé',
    desc: "Tu postes, tu reçois des feedbacks, tu vois les résultats des autres. C'est là que les meilleurs se révèlent.",
  },
]

export default function AcademyProgramSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-gradient-to-b from-black to-[#0f0f0f] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_50%_100%,rgba(218,252,104,0.04),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto">
          <FadeInBlock>
            <div className="text-center mb-16">
              <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">Le programme</p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                21 jours. Une action{' '}
                <span className="text-empire">concrète par jour.</span>
              </h2>
            </div>
          </FadeInBlock>

          {/* Semaines */}
          <FadeInBlock delay={0.1}>
            <div className="grid md:grid-cols-3 gap-5 mb-12">
              {weeks.map((week, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${week.color} border`}
                >
                  <p className={`text-xs font-bold tracking-widest uppercase mb-3 ${week.tagColor}`}>{week.tag}</p>
                  <h3 className="text-lg font-bold text-white mb-2">{week.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{week.desc}</p>
                </motion.div>
              ))}
            </div>
          </FadeInBlock>

          {/* Outils */}
          <FadeInBlock delay={0.2}>
            <div className="grid md:grid-cols-3 gap-5">
              {tools.map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="flex gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:border-empire/25 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-empire/15 border border-empire/25 flex items-center justify-center flex-shrink-0">
                    <tool.icon className="text-empire" size={18} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">{tool.label}</p>
                    <p className="text-neutral-400 text-xs leading-relaxed">{tool.desc}</p>
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
