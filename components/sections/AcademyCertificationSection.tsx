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
      check: 'text-neutral-400',
      perkText: 'text-neutral-400',
    },
    title: 'Certifié Empire',
    subtitle: 'Programme complété',
    criteria: 'Vous avez suivi le bootcamp et relevé les défis quotidiens.',
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
    subtitle: 'Résultats prouvés',
    criteria: 'Vous avez généré des vues significatives sur le mois écoulé et démontré une maîtrise des formats viraux.',
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
      border: 'border-academy/50',
      bg: 'from-academy/15 to-academy/[0.03]',
      badge: 'bg-academy/20 text-academy border-academy/40',
      glow: 'shadow-[0_0_50px_rgba(252, 165, 165,0.18)]',
      label: 'text-academy',
      check: 'text-academy',
      perkText: 'text-white font-medium',
    },
    title: 'Certifié Elite',
    subtitle: 'Résultats clients prouvés',
    criteria: 'Vous avez démontré des résultats viraux reproductibles et prouvé votre valeur sur des missions clients réelles.',
    perks: [
      'Certification Elite officielle',
      'Badge LinkedIn "Certifié Elite Empire"',
      'Travailler avec vos propres clients',
      'Recevoir des clients Empire Internet',
      'Premier client garanti après le bootcamp',
    ],
    highlight: true,
  },
]

export default function AcademyCertificationSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-gradient-to-b from-[#0f0f0f] to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(252, 165, 165,0.04),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <FadeInBlock>
            <div className="text-center mb-6">
              <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">Certification</p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                Prouvez vos résultats.{' '}
                <span className="text-academy">Obtenez votre certification.</span>
              </h2>
              <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto">
                À la fin du bootcamp, vous pouvez passer les certifications Empire Internet - ajoutables sur votre profil LinkedIn. Les niveaux sont basés sur vos vrais résultats.
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
                      <span className="text-[10px] font-bold text-academy bg-academy/10 border border-academy/30 px-2 py-0.5 rounded-full">
                        MEILLEUR NIVEAU
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl font-black mb-1 ${level.color.label}`}>{level.title}</h3>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-4">{level.subtitle}</p>

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


        </div>
      </div>
    </section>
  )
}
