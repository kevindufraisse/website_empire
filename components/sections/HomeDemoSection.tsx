'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import LoomEmbed, { DEMO_1MIN_LOOM_ID } from '@/components/LoomEmbed'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'

export default function HomeDemoSection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  if (autopilot) return null

  return (
    <section className="relative w-full bg-[#0c0c0c] py-10 md:py-16">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto w-full max-w-3xl"
        >
          <p className="mb-5 text-center text-lg font-semibold text-white md:text-xl">
            {lang === 'fr' ? '2 minutes pour voir le système en action.' : '2 minutes to see the system in action.'}
          </p>
          <LoomEmbed
            id={DEMO_1MIN_LOOM_ID}
            title={lang === 'fr' ? 'Démo Empire (1 min)' : 'Empire demo (1 min)'}
          />
        </motion.div>
      </div>
    </section>
  )
}
