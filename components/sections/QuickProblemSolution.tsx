'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ArrowRight } from 'lucide-react'

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

export default function QuickProblemSolution() {
  const { t } = useLanguage()

  return (
    <section className="container py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <FadeInBlock>
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              {t.quickProblem?.title || 'Creating content shouldn\'t feel like a second job.'}
            </h2>
            
            <div className="space-y-4 text-lg md:text-xl text-neutral-300">
              <p>
                {t.quickProblem?.line1 || 'But between client work, your business, and life... the calendar stays empty.'}
              </p>
              <p className="text-2xl md:text-3xl font-semibold text-white">
                {t.quickProblem?.line2 || 'You\'re not lazy. The system is broken.'}
              </p>
            </div>

            <div className="pt-6">
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-empire/10 to-transparent border border-empire/30">
                <p className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {t.quickProblem?.solution || 'Empire fixes that.'}
                </p>
                <p className="text-xl text-empire font-semibold mb-4">
                  {t.quickProblem?.hook || '15 minutes of talking = 30+ posts across all platforms.'}
                </p>
                <p className="text-base text-neutral-400">
                  {t.quickProblem?.subtext || 'No writing. No editing. No scheduling. Just results.'}
                </p>
              </div>
            </div>

            {/* Subtle link to full story */}
            <div className="pt-4">
              <a 
                href="/story" 
                className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-empire transition-colors group"
              >
                <span>{t.quickProblem?.readStory || 'Read the full story'}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

