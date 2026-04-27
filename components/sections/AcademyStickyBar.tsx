'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApplicationCount } from '@/hooks/useApplicationCount'
import { COHORT_RANGE_SHORT } from '@/lib/cohort-config'

const MAX_SELECTED = 20

export default function AcademyStickyBar() {
  const [visible, setVisible] = useState(false)
  const appCount = useApplicationCount()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-academy/20 bg-black/95 backdrop-blur-md"
        >
          <div className="container px-3">
            <div className="flex items-center justify-between gap-2 py-1.5 md:py-2">

              {/* Left - statut + candidatures live */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-academy opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-academy" />
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
                  <p className="text-xs text-neutral-300 whitespace-nowrap">
                    Bootcamp <span className="text-white font-semibold">Head of Viralité</span>
                    <span className="hidden md:inline text-neutral-400"> · </span>
                    <span className="hidden md:inline text-academy font-semibold">{COHORT_RANGE_SHORT}</span>
                  </p>
                  {appCount !== null && (
                    <span className="text-[10px] text-academy font-semibold whitespace-nowrap">
                      {appCount} candidatures · {MAX_SELECTED} admis
                    </span>
                  )}
                </div>
              </div>

              {/* Right - CTA */}
              <a
                href="/candidature"
                className="flex-shrink-0 px-3.5 py-1.5 bg-academy text-black font-bold text-xs rounded-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(252,165,165,0.3)] whitespace-nowrap"
              >
                Postuler →
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
