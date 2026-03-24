'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check } from 'lucide-react'
import BorderBeam from '@/components/magicui/border-beam'
import { AvatarCircles } from '@/components/magicui/avatar-circles'

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
  'Bootcamp Head of Virality — 21 jours',
  '21 vidéos pré-enregistrées',
  '21 exercices quotidiens',
  '3 lives avec Marc',
  '3 lives avec Kevin',
  '1 Q&A en direct avec Kevin & Marc',
  'Groupe privé',
  'Replays à vie',
  'Éligible au réseau Empire',
]

export default function AcademyPricingSection() {
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
                <p className="text-neutral-400 text-sm mb-1">Accès unique · Offre de lancement</p>
                <p className="text-white font-bold text-lg">Bootcamp Head of Viralité — 21 jours</p>
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
                href="https://www.join.empire-internet.com/academy"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-6 py-4 rounded-xl bg-empire text-black font-bold text-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)]"
              >
                Passer le test d'éligibilité →
              </a>

              <div className="flex flex-col items-center gap-2 mt-5">
                <div className="flex items-center gap-3">
                  <AvatarCircles avatarUrls={avatars} numPeople={31} className="[&_img]:h-8 [&_img]:w-8 [&_div]:h-8 [&_div]:w-8 [&_div]:text-[10px] -space-x-3" />
                  <p className="text-xs text-neutral-400">déjà inscrits</p>
                </div>
                <p className="text-xs text-neutral-600">Places limitées · Bootcamp de lancement</p>
              </div>
            </div>
          </FadeInBlock>
        </div>
      </div>
    </section>
  )
}
