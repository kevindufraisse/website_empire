'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, Crown } from 'lucide-react'
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

const standardFeatures = [
  'Bootcamp Head of Viralité',
  '21 vidéos pré-enregistrées',
  '21 exercices quotidiens',
  '6 lives experts',
  '2 Q&A en direct avec Kevin & Marc',
  'Groupe privé',
  'Replays à vie',
  'Éligible au réseau Empire',
]

const vipFeatures = [
  'Tout le pack standard',
  'Accompagnement personnalisé',
  'Priorité sur les missions Empire',
  'Suivi direct avec l'équipe',
  'Accès réseau clients 12 mois',
  'Affiliation + coaching inclus',
]

export default function AcademyPricingSection() {
  return (
    <section id="academy-pricing" className="relative w-full py-20 md:py-28 bg-gradient-to-b from-[#0f0f0f] to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(218,252,104,0.06),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          <FadeInBlock>
            <div className="text-center mb-16">
              <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">L'offre</p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Choisis ton <span className="text-empire">accès.</span>
              </h2>
            </div>
          </FadeInBlock>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Standard */}
            <FadeInBlock delay={0.1}>
              <div className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/15 hover:border-empire/30 transition-all flex flex-col">
                <div className="mb-6">
                  <p className="text-neutral-400 text-sm mb-1">Standard</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-black text-white">500€</span>
                    <span className="text-neutral-400">une fois</span>
                  </div>
                </div>

                <div className="flex-1 space-y-3 mb-8">
                  {standardFeatures.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="text-empire flex-shrink-0" size={16} />
                      <span className="text-neutral-300 text-sm">{f}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://www.join.empire-internet.com/bootcamp-standard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-6 py-4 rounded-xl bg-white/10 text-white font-bold hover:bg-empire hover:text-black transition-all"
                >
                  Je rejoins le bootcamp
                </a>
              </div>
            </FadeInBlock>

            {/* VIP */}
            <FadeInBlock delay={0.2}>
              <div className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-empire/20 to-empire/5 border border-empire shadow-[0_0_40px_rgba(218,252,104,0.2)] flex flex-col overflow-hidden">
                <BorderBeam size={300} duration={10} delay={0} />

                {/* Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-empire text-black text-xs font-black rounded-full whitespace-nowrap flex items-center gap-1.5">
                  <Crown size={12} />
                  VIP · Accompagnement renforcé
                </div>

                <div className="mb-6 mt-2">
                  <p className="text-neutral-400 text-sm mb-1">Bootcamp + Accès VIP 1 an</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-black text-empire">1 000€</span>
                    <span className="text-neutral-400">total</span>
                  </div>
                </div>

                <div className="flex-1 space-y-3 mb-8">
                  {vipFeatures.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="text-empire flex-shrink-0" size={16} />
                      <span className="text-white text-sm font-medium">{f}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://www.join.empire-internet.com/bootcamp-vip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-6 py-4 rounded-xl bg-empire text-black font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)]"
                >
                  Je prends l'accès VIP →
                </a>
              </div>
            </FadeInBlock>
          </div>
        </div>
      </div>
    </section>
  )
}
