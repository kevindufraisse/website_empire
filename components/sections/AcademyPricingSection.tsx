'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, Users } from 'lucide-react'
import BorderBeam from '@/components/magicui/border-beam'
import { AvatarCircles } from '@/components/magicui/avatar-circles'
import { useApplicationCount } from '@/hooks/useApplicationCount'

const MAX_SELECTED = 20

const avatars = [
  { imageUrl: 'https://i.pravatar.cc/48?img=11', profileUrl: '' },
  { imageUrl: 'https://i.pravatar.cc/48?img=22', profileUrl: '' },
  { imageUrl: 'https://i.pravatar.cc/48?img=33', profileUrl: '' },
  { imageUrl: 'https://i.pravatar.cc/48?img=44', profileUrl: '' },
  { imageUrl: 'https://i.pravatar.cc/48?img=55', profileUrl: '' },
]

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

const features = [
  '21 vidéos pré-enregistrées',
  '21 défis quotidiens',
  '3 lives avec Marc',
  '3 lives avec Kevin',
  '1 Q&A en direct avec Kevin & Marc',
  'Groupe privé',
  'Replays à vie',
  'Éligible au réseau Empire',
]

export default function AcademyPricingSection() {
  const appCount = useApplicationCount()

  return (
    <section id="academy-pricing" className="relative w-full py-20 md:py-28 bg-gradient-to-b from-[#0f0f0f] to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(218,252,104,0.06),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-xl mx-auto">
          <FadeInBlock>
            <div className="text-center mb-16">
              <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">L'offre</p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Rejoins le <span className="text-empire">bootcamp 21 jours.</span>
              </h2>
            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.1}>
            <div className="relative p-8 md:p-10 rounded-2xl bg-gradient-to-br from-empire/20 to-empire/5 border border-empire shadow-[0_0_50px_rgba(218,252,104,0.15)] flex flex-col overflow-hidden">
              <BorderBeam size={350} duration={10} delay={0} />

              <div className="mb-8 text-center">
                <p className="text-white font-bold text-lg mb-3">Bootcamp Head of Viralité - 21 jours</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-empire/30">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-empire flex-shrink-0">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span className="text-xs text-neutral-300">Prochaine promotion :</span>
                  <span className="text-xs font-bold text-empire">25 avril → 17 mai 2026</span>
                </div>
              </div>

              <div className="space-y-3 mb-10">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="text-empire flex-shrink-0" size={16} />
                    <span className="text-white text-sm font-medium">{f}</span>
                  </div>
                ))}
              </div>

              <a
                href="/candidature"
                className="block text-center px-6 py-4 rounded-xl bg-empire text-black font-bold text-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)]"
              >
                Postuler - sur sélection →
              </a>
              <p className="text-xs text-neutral-600 text-center mt-2">Formulaire de 2 min · Réponse le 2 avril · Aucun engagement</p>

              {/* Live candidatures counter */}
              <div className="mt-5 p-4 rounded-xl bg-black/30 border border-empire/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-empire" />
                    <span className="text-xs text-neutral-400">Candidatures reçues</span>
                  </div>
                  <span className="text-sm font-black text-empire">
                    {appCount !== null ? appCount : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Admis dans la promotion</span>
                  <span className="text-sm font-black text-white">{MAX_SELECTED} max</span>
                </div>
                {appCount !== null && (
                  <div className="w-full h-1.5 rounded-full bg-white/8 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-empire rounded-full transition-all"
                      style={{ width: `${Math.min(100, (appCount / (appCount + MAX_SELECTED)) * 100)}%` }}
                    />
                  </div>
                )}
                <p className="text-[11px] text-neutral-500 text-center leading-snug">
                  Plus tu candidates tôt, plus tu as de chances d'être sélectionné.
                </p>
              </div>
            </div>
          </FadeInBlock>
        </div>
      </div>
    </section>
  )
}
