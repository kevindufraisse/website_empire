'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'

export default function LegendProofSection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'

  if (!autopilot) return null

  return (
    <section className="relative w-full py-12 md:py-16 bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(212,165,116,0.05),transparent)]" />

      <div className="container relative z-10">
        {/* whileInView, not useInView: the section mounts after the toggle flips,
            so an observer created on first render would never attach. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-5xl md:text-7xl font-black text-autopilot leading-none">
            {fr ? '1 à 100M€' : '€1M to €100M'}
          </p>
          <p className="mt-5 text-lg md:text-xl text-white font-semibold">
            {fr
              ? 'de chiffre d\'affaires par an en moyenne chez nos clients.'
              : 'in annual revenue on average across our clients.'}
          </p>
          <p className="mt-3 text-sm text-neutral-500">
            {fr
              ? 'On ne travaille qu\'avec des marques qui ont déjà quelque chose à dire.'
              : 'We only work with brands that already have something to say.'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
