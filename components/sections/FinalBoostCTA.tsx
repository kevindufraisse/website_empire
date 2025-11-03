'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { openVideoDialog } from '@/components/magicui/hero-video-dialog'
import { Zap, Calendar } from 'lucide-react'

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
  const { t } = useLanguage()
  
  return (
    <section className="relative w-full pb-20 md:pb-32 bg-gradient-to-b from-black to-[#0f0f0f]">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <FadeInBlock>
            <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-empire/10 to-transparent border border-empire/30 overflow-hidden text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(218,252,104,0.15),transparent)]" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-4">
                  <Zap className="text-red-400" size={16} />
                  <p className="text-sm font-bold text-red-400">{t.finalCTA.limited}</p>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  {t.finalCTA.title}
                </h2>
                <p className="text-lg text-neutral-300 mb-8">
                  {t.finalCTA.subtitle}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="https://www.join.empire-internet.com/bdc-empire"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)] text-center"
                  >
                    {t.finalCTA.startNow}
                  </a>
                  <button
                    onClick={() => openVideoDialog()}
                    className="px-8 py-4 border-2 border-empire/50 text-white font-semibold rounded-xl hover:border-empire hover:bg-empire/10 transition-all text-center"
                  >
                    {t.finalCTA.watchDemo}
                  </button>
                </div>

                <p className="text-sm text-neutral-400">
                  {t.finalCTA.details}
                </p>
              </div>
            </div>
          </FadeInBlock>
        </div>
      </div>
    </section>
  )
}

