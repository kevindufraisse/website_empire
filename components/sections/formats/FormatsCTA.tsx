'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

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

export default function FormatsCTA() {
  const { t } = useLanguage()

  return (
    <section className="container section-spacing">
      <div className="max-w-4xl mx-auto">
        <FadeInBlock>
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              {t.formats?.cta?.title || 'Choose Your Format'}
              <br />
              <span className="text-empire">{t.formats?.cta?.titleHighlight || 'We Handle Everything Else'}</span>
            </h2>
            
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              {t.formats?.cta?.subtitle || 'No matter how you create, Empire transforms it into 30+ pieces of content per week.'}
            </p>

            <div className="flex items-center justify-center pt-4">
              <a
                href="/demo"
                className="px-8 py-4 bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)] text-center"
              >
                {t.finalCTA.watchDemo}
              </a>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

