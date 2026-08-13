'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { useReveal } from '@/hooks/useReveal'
import WhyEmpireCompact from '@/components/sections/WhyEmpireCompact'
import WaitlistEmailCta from '@/components/WaitlistEmailCta'

const INCLUDED_FR = [
  'Sujets trouvés pour vous (contenus viraux + tendances)',
  'Vous parlez 1 h - on crée vos contenus',
  'Publication sur 7 réseaux',
  'Équipe humaine qui rédige et monte',
  'Lives et communauté dès Intermédiaire',
]

const INCLUDED_EN = [
  'Topics found for you (viral posts + trends)',
  'You talk 1h - we create your content',
  'Publishing on 7 platforms',
  'Human team that writes and edits',
  'Lives and community from Intermediate',
]

export default function HomeApplySection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  const [ref, isInView] = useReveal('-100px')

  if (autopilot) return null

  const included = fr ? INCLUDED_FR : INCLUDED_EN

  return (
    <section ref={ref} id="rejoindre" className="relative w-full py-20 md:py-28 bg-[#0a0a0a]">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
            {fr ? 'Rejoindre Empire' : 'Join Empire'}
          </h2>
          <p className="mt-4 text-neutral-400">
            {fr
              ? 'Demande un accès - on lit chaque candidature.'
              : 'Request access - we read every application.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="mt-10 max-w-xl mx-auto rounded-2xl border border-empire/50 bg-white/[0.03] p-6 lg:p-8"
        >
          <h3 className="text-lg font-bold text-white mb-4">
            {fr ? 'Ce que vous obtenez' : 'What you get'}
          </h3>
          <ul className="space-y-2.5 mb-6">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-neutral-300">
                <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                {item}
              </li>
            ))}
          </ul>
          <WaitlistEmailCta compact />
        </motion.div>

        <div className="mt-10">
          <WhyEmpireCompact />
        </div>
      </div>
    </section>
  )
}
