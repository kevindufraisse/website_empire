'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApplicationCount } from '@/hooks/useApplicationCount'

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
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-empire/20 bg-black/95 backdrop-blur-md"
        >
          <div className="container">
            <div className="flex items-center justify-between gap-3 py-2.5 md:py-3">

              {/* Left — statut + candidatures live */}
              <div className="flex items-center gap-3 min-w-0">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-empire opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-empire" />
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 min-w-0">
                  <p className="text-sm text-neutral-300 whitespace-nowrap">
                    Bootcamp <span className="text-white font-semibold">Head of Viralité</span>
                    <span className="hidden md:inline text-neutral-500"> · </span>
                    <span className="hidden md:inline text-empire font-semibold">25 avr → 17 mai</span>
                  </p>
                  {appCount !== null && (
                    <span className="text-[11px] text-empire font-semibold whitespace-nowrap">
                      {appCount} candidatures · {MAX_SELECTED} admis
                    </span>
                  )}
                </div>
              </div>

              {/* Right — CTA */}
              <a
                href="/candidature"
                className="flex-shrink-0 px-5 py-2.5 bg-empire text-black font-bold text-sm rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)] whitespace-nowrap"
              >
                Passer le test d'éligibilité →
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
