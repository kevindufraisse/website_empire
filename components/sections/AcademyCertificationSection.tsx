'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, Linkedin } from 'lucide-react'
import BorderBeam from '@/components/magicui/border-beam'

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

const levels = [
  {
    tier: 'Bronze',
    emoji: '🥉',
    color: {
      border: 'border-white/10',
      bg: 'from-white/[0.04] to-transparent',
      badge: 'bg-white/8 text-neutral-400 border-white/15',
      glow: '',
      label: 'text-neutral-300',
      check: 'text-neutral-500',
      perkText: 'text-neutral-400',
    },
    title: 'Certifié Empire',
    subtitle: 'Programme complété',
    criteria: 'Tu as suivi le bootcamp et appliqué les exercices.',
    perks: [
      'Certification officielle Empire Internet',
      'Badge ajoutable sur LinkedIn',
      'Accès au groupe alumni',
    ],
    highlight: false,
  },
  {
    tier: 'Argent',
    emoji: '🥈',
    color: {
      border: 'border-white/25',
      bg: 'from-white/[0.08] to-white/[0.02]',
      badge: 'bg-white/10 text-white border-white/25',
      glow: 'shadow-[0_0_30px_rgba(255,255,255,0.04)]',
      label: 'text-white',
      check: 'text-white/60',
      perkText: 'text-neutral-300',
    },
    title: 'Certifié Expert',
    subtitle: '1M de vues dans le mois',
    criteria: 'Tu as généré 1 000 000 de vues sur le mois écoulé, toutes plateformes.',
    perks: [
      'Certification Expert officielle',
      'Badge LinkedIn "Certifié Expert Viralité"',
      'Autorisé à travailler avec des clients',
      'Accès au réseau partenaires Empire',
    ],
    highlight: false,
  },
  {
    tier: 'Or',
    emoji: '🥇',
    color: {
      border: 'border-empire/50',
      bg: 'from-empire/15 to-empire/[0.03]',
      badge: 'bg-empire/20 text-empire border-empire/40',
      glow: 'shadow-[0_0_50px_rgba(218,252,104,0.18)]',
      label: 'text-empire',
      check: 'text-empire',
      perkText: 'text-white font-medium',
    },
    title: 'Certifié Elite',
    subtitle: '1M de vues + résultats clients',
    criteria: 'Tu as généré 1M+ de vues et prouvé tes résultats sur des missions clients réelles.',
    perks: [
      'Certification Elite officielle',
      'Badge LinkedIn "Certifié Elite Empire"',
      'Travailler avec tes propres clients',
      'Recevoir des clients Empire Internet',
      'Premier client garanti après le bootcamp',
    ],
    highlight: true,
  },
]

export default function AcademyCertificationSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-gradient-to-b from-[#0f0f0f] to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(218,252,104,0.04),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <FadeInBlock>
            <div className="text-center mb-6">
              <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">Certification</p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                Prouve tes résultats.{' '}
                <span className="text-empire">Obtiens ta certification.</span>
              </h2>
              <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto">
                À la fin du bootcamp, tu peux passer les certifications Empire Internet — ajoutables sur ton profil LinkedIn. Les niveaux sont basés sur tes vrais résultats.
              </p>
            </div>
          </FadeInBlock>

          {/* LinkedIn badge hint */}
          <FadeInBlock delay={0.1}>
            <div className="flex items-center justify-center gap-2.5 mb-14 py-3 px-5 rounded-full bg-[#0A66C2]/10 border border-[#0A66C2]/25 w-fit mx-auto">
              <Linkedin className="text-[#0A66C2]" size={16} />
              <p className="text-sm text-neutral-300">
                Toutes les certifications sont <span className="text-white font-semibold">ajoutables directement sur LinkedIn</span>
              </p>
            </div>
          </FadeInBlock>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {levels.map((level, i) => (
              <FadeInBlock key={i} delay={0.1 + i * 0.1}>
                <div className={`relative h-full p-7 rounded-2xl bg-gradient-to-br ${level.color.bg} border ${level.color.border} ${level.color.glow} overflow-hidden flex flex-col`}>
                  {level.highlight && <BorderBeam size={300} duration={9} />}

                  {/* Tier badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${level.color.badge}`}>
                      {level.emoji} {level.tier}
                    </span>
                    {level.highlight && (
                      <span className="text-[10px] font-bold text-empire bg-empire/10 border border-empire/30 px-2 py-0.5 rounded-full">
                        MEILLEUR NIVEAU
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl font-black mb-1 ${level.color.label}`}>{level.title}</h3>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-4">{level.subtitle}</p>

                  {/* Criteria */}
                  <div className="p-3 rounded-xl bg-white/5 border border-white/8 mb-5">
                    <p className="text-xs text-neutral-400 leading-relaxed">{level.criteria}</p>
                  </div>

                  {/* Perks */}
                  <div className="flex-1 space-y-2.5">
                    {level.perks.map((perk, j) => (
                      <div key={j} className="flex items-start gap-2.5">
                        <Check className={`flex-shrink-0 mt-0.5 ${level.color.check}`} size={13} />
                        <span className={`text-sm leading-snug ${level.color.perkText}`}>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInBlock>
            ))}
          </div>

          {/* 1M views note */}
          <FadeInBlock delay={0.4}>
            <div className="mt-10 p-5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-empire/10 border border-empire/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-1">Le seuil de 1M de vues — atteignable en 21 jours.</p>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Ça paraît ambitieux. Mais avec les formats courts sur Instagram, TikTok et YouTube, 1M de vues sur le mois, c'est l'objectif que la plupart de nos clients atteignent dès le premier mois. Tu auras exactement les mêmes techniques.
                </p>
              </div>
            </div>
          </FadeInBlock>

        </div>
      </div>
    </section>
  )
}
