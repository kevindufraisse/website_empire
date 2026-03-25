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

const platforms = [
  {
    name: 'Instagram',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: 'X',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: 'Threads',
    svg: (
      <svg viewBox="0 0 192 192" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M141.537 88.988c-.893-.452-1.804-.875-2.732-1.27-1.56-27.306-16.398-42.94-41.457-43.1h-.165c-14.985 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.077c8.25.053 14.474 2.452 18.503 7.129 2.933 3.405 4.893 8.11 5.865 14.05-7.314-1.243-15.224-1.625-23.68-1.14-23.82 1.372-39.134 15.264-38.105 34.568.519 9.792 5.397 18.216 13.733 23.719 7.047 4.652 16.123 6.927 25.557 6.412 12.457-.683 22.23-5.437 29.048-14.127 5.178-6.601 8.452-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.547 38.375-11.318 11.309-24.924 16.2-45.587 16.352-22.81-.17-40.06-7.484-51.275-21.742C20.168 139.965 14.74 120.681 14.537 96c.203-24.681 5.631-43.965 16.136-57.314C41.929 24.425 59.179 17.11 81.988 16.94c22.975.17 40.526 7.521 52.171 21.847 5.71 7.025 10.016 15.861 12.853 26.162l17.147-4.308c-3.44-12.7-8.853-23.626-16.22-32.687C133.036 9.641 111.202.196 82.07 0H81.942C52.867.19 31.277 9.642 16.773 28.08 3.867 44.487-2.79 67.316-3.007 95.932L-3 96l-0.007.068c.217 28.616 6.874 51.445 19.78 67.852C31.277 182.358 52.867 191.81 81.942 192h1.112c26.96-.173 44.555-6.708 59.05-21.19C161.08 151.866 160.51 128.12 154.26 113.54c-4.484-10.454-13.033-18.945-24.724-24.553zM98.44 129.507c-10.44.588-21.286-4.098-21.821-14.135-.464-7.441 5.229-15.745 22.394-16.735 1.966-.113 3.895-.168 5.79-.168 6.235 0 12.068.606 17.371 1.766-1.978 24.702-13.58 28.713-23.734 29.272z"/>
      </svg>
    ),
  },
]

const weeks = [
  {
    num: '01',
    tag: 'Semaine 1 · Jours 1–7',
    title: 'Comprendre la viralité',
    desc: "Psychologie de l'attention, hooks, mécanique des millions de vues. Pourquoi certains contenus explosent — et comment le reproduire.",
    highlight: false,
    platforms: false,
  },
  {
    num: '02',
    tag: 'Semaine 2 · Jours 8–14',
    title: 'Créer sur tous les réseaux',
    desc: 'Formats par plateforme, rythme, systèmes de production. Tu crées partout sans t\'épuiser.',
    highlight: false,
    platforms: true,
  },
  {
    num: '03',
    tag: 'Semaine 3 · Jours 15–21',
    title: 'Devenir Head of Viralité',
    desc: 'Transformer les vues en clients, générer des RDV, construire une activité qui tourne sans te vendre à plein temps.',
    highlight: true,
    platforms: false,
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
    label: 'Défis quotidiens',
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
                    <p className="text-sm text-neutral-400 leading-relaxed mb-4">{week.desc}</p>
                    {week.platforms && (
                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {platforms.map((p) => (
                          <div
                            key={p.name}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 hover:border-empire/30 hover:bg-empire/5 transition-all"
                          >
                            <span className="text-neutral-400">{p.svg}</span>
                            <span className="text-[10px] font-medium text-neutral-300">{p.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
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
