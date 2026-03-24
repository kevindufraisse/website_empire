'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PRICE_DEADLINE = new Date('2026-04-10T23:59:59')
const NEXT_PRICE = 597

type TimeLeft = { d: number; h: number; m: number; s: number } | null

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(null)
  useEffect(() => {
    const calc = () => {
      const diff = PRICE_DEADLINE.getTime() - Date.now()
      if (diff <= 0) { setTimeLeft(null); return }
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [])
  return timeLeft
}

export default function AcademyStickyBar() {
  const [visible, setVisible] = useState(false)
  const timeLeft = useCountdown()

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

              {/* Left — prix + countdown */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-empire opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-empire" />
                  </span>
                  <p className="text-sm font-semibold text-white whitespace-nowrap">
                    <span className="text-empire">497€</span>{' '}
                    <span className="text-neutral-500 line-through text-xs">897€</span>
                  </p>
                </div>

                {/* Countdown */}
                {timeLeft && (
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs text-neutral-500 hidden md:block whitespace-nowrap">
                      Prix → {NEXT_PRICE}€ dans
                    </p>
                    <div className="flex items-center gap-1">
                      {[
                        { val: timeLeft.d, unit: 'j' },
                        { val: timeLeft.h, unit: 'h' },
                        { val: timeLeft.m, unit: 'm' },
                        { val: timeLeft.s, unit: 's' },
                      ].map(({ val, unit }) => (
                        <div key={unit} className="flex items-baseline gap-0.5">
                          <span className="w-7 h-7 rounded-md bg-empire/10 border border-empire/25 flex items-center justify-center text-empire font-black text-xs tabular-nums">
                            {String(val).padStart(2, '0')}
                          </span>
                          <span className="text-[9px] text-neutral-600">{unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right — CTA */}
              <a
                href="https://www.join.empire-internet.com/academy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-5 py-2.5 bg-empire text-black font-bold text-sm rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)] whitespace-nowrap"
              >
                Rejoindre à 497€ →
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
