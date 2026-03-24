'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AcademyStickyBar() {
  const [visible, setVisible] = useState(false)

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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3 md:py-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="flex -space-x-1.5 flex-shrink-0">
                  {/* Animated pulse dot */}
                  <span className="relative flex h-2.5 w-2.5 mt-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-empire opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-empire" />
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white hidden sm:block">
                    Bootcamp Head of Viralité · <span className="text-empire">497€</span>{' '}
                    <span className="text-neutral-500 line-through text-xs ml-1">897€</span>
                  </p>
                  <p className="text-xs text-neutral-500 hidden sm:block">21 jours · 6 lives · Accès à vie · Places limitées</p>
                  <p className="text-sm font-semibold text-white sm:hidden">
                    Bootcamp · <span className="text-empire">497€</span>{' '}
                    <span className="text-neutral-500 line-through text-xs">897€</span>
                  </p>
                </div>
              </div>
              <a
                href="#academy-pricing"
                className="flex-shrink-0 px-6 py-2.5 bg-empire text-black font-bold text-sm rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)] whitespace-nowrap"
              >
                Rejoindre le bootcamp →
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
