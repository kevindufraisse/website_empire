'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import EmpireSalesCta from '@/components/EmpireSalesCta'

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function FinalBoostCTA() {
  const { t, lang } = useLanguage()
  const { autopilot } = useAutopilot()

  if (autopilot) return null

  return (
    <section className="relative w-full pb-20 md:pb-32 bg-gradient-to-b from-black to-[#0f0f0f]">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <FadeInBlock>
            <div className="relative p-8 md:p-12 rounded-2xl border overflow-hidden text-center bg-gradient-to-br from-empire/10 to-transparent border-empire/30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(var(--empire-rgb)_/_0.15),transparent)]" />

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  {t.finalCTA.title}
                </h2>
                <p className="text-lg text-neutral-300 mb-6">
                  {lang === 'fr' ? 'Tes idées, tes contenus, ton calendrier : prends Empire en main dès aujourd’hui.' : 'Your ideas, your content, your calendar: get started with Empire today.'}
                </p>

                <EmpireSalesCta source="final" />

              </div>
            </div>
          </FadeInBlock>
        </div>
      </div>
    </section>
  )
}
