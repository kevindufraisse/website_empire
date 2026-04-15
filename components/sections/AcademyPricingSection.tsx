'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, Users, ArrowRight } from 'lucide-react'
import BorderBeam from '@/components/magicui/border-beam'
import { useApplicationCount } from '@/hooks/useApplicationCount'

const MAX_SELECTED = 20

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

const included = [
  { item: '21 posts LinkedIn créés pour vous', highlight: true },
  { item: '21 Shorts vidéo montés pour vous', highlight: true },
  { item: '21 vidéos de formation à la viralité', highlight: false },
  { item: '6 lives experts + 2 Q&A en direct', highlight: false },
  { item: 'Groupe privé + feedbacks quotidiens', highlight: false },
  { item: 'Replays à vie', highlight: false },
  { item: 'Éligible au réseau Empire (clients fournis)', highlight: true },
]

export default function AcademyPricingSection() {
  const appCount = useApplicationCount()

  return (
    <section id="academy-pricing" className="relative w-full py-20 md:py-28 bg-gradient-to-b from-[#0f0f0f] to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(218,252,104,0.06),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-xl mx-auto">

          <FadeInBlock>
            <div className="relative p-8 md:p-10 rounded-2xl bg-gradient-to-br from-empire/20 to-empire/5 border border-empire shadow-[0_0_50px_rgba(218,252,104,0.15)] flex flex-col overflow-hidden">
              <BorderBeam size={350} duration={10} delay={0} />

              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                  <p className="text-sm text-neutral-400 mb-2 tracking-widest uppercase">Le bootcamp</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Head of Viralité — 21 jours</h2>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-empire/30">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-empire flex-shrink-0">
                      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="text-xs font-bold text-empire">25 avril → 17 mai 2026</span>
                  </div>
                </div>

                {/* What's included */}
                <div className="space-y-3 mb-8">
                  {included.map((row, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="text-empire flex-shrink-0" size={16} />
                      <span className={`text-sm ${row.highlight ? 'text-white font-semibold' : 'text-neutral-300'}`}>
                        {row.item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href="/candidature"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl bg-empire text-black font-bold text-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)]"
                >
                  Postuler — sur sélection <ArrowRight size={18} />
                </a>
                <p className="text-xs text-neutral-500 text-center mt-2">Formulaire de 2 min · Aucun engagement</p>

                {/* Candidatures counter */}
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
                </div>
              </div>
            </div>
          </FadeInBlock>
        </div>
      </div>
    </section>
  )
}
