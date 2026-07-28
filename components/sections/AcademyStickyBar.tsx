'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AcademyWaitlistCta from '@/components/AcademyWaitlistCta'
import { ACADEMY_ENTRY_PRICE } from '@/lib/cohort-config'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AcademyStickyBar() {
  const [visible, setVisible] = useState(false)
  const { lang } = useLanguage()
  const fr = lang === 'fr'

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

              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-academy opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-academy" />
                </span>
                <p className="text-xs text-neutral-300">
                  <span className="text-white font-semibold">
                    {fr ? 'Liste d\'attente ouverte' : 'Waitlist open'}
                  </span>
                  <span className="hidden md:inline text-neutral-400"> · </span>
                  <span className="hidden md:inline text-neutral-400 text-[10px]">
                    {fr ? `à partir de ${ACADEMY_ENTRY_PRICE}€` : `from €${ACADEMY_ENTRY_PRICE}`}
                  </span>
                </p>
              </div>

              <AcademyWaitlistCta
                source="sticky-bar"
                className="flex-shrink-0 px-3.5 py-1.5 bg-academy text-black font-bold text-xs rounded-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(252,165,165,0.3)] whitespace-nowrap"
              >
                {fr ? 'Rejoindre' : 'Join'}
              </AcademyWaitlistCta>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
