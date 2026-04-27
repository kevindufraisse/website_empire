'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const applicants = [
  { name: 'Thomas', city: 'Paris', time: 'à l\'instant' },
  { name: 'Julie', city: 'Lyon', time: 'il y a 2 min' },
  { name: 'Maxime', city: 'Bordeaux', time: 'il y a 4 min' },
  { name: 'Sarah', city: 'Marseille', time: 'il y a 6 min' },
  { name: 'Antoine', city: 'Nantes', time: 'à l\'instant' },
  { name: 'Camille', city: 'Toulouse', time: 'il y a 3 min' },
  { name: 'Lucas', city: 'Lille', time: 'il y a 1 min' },
  { name: 'Emma', city: 'Strasbourg', time: 'il y a 5 min' },
  { name: 'Hugo', city: 'Rennes', time: 'à l\'instant' },
  { name: 'Léa', city: 'Nice', time: 'il y a 2 min' },
  { name: 'Nicolas', city: 'Montpellier', time: 'il y a 7 min' },
  { name: 'Chloé', city: 'Grenoble', time: 'il y a 3 min' },
]

const SHOW_DURATION = 5000
const INTERVAL = 28000
const INITIAL_DELAY = 8000

export default function AcademySocialProofToast() {
  const [current, setCurrent] = useState<typeof applicants[0] | null>(null)
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const show = (i: number) => {
      setCurrent(applicants[i % applicants.length])
      setTimeout(() => setCurrent(null), SHOW_DURATION)
    }

    const t0 = setTimeout(() => {
      show(0)
      const interval = setInterval(() => {
        setIdx(prev => {
          const next = (prev + 1) % applicants.length
          show(next)
          return next
        })
      }, INTERVAL)
      return () => clearInterval(interval)
    }, INITIAL_DELAY)

    return () => clearTimeout(t0)
  }, [])

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current.name + current.city}
          initial={{ opacity: 0, x: -20, y: 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-4 left-4 z-40 max-w-[240px]"
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            {/* Avatar initial */}
            <div className="w-8 h-8 rounded-full bg-academy/20 border border-academy/40 flex items-center justify-center flex-shrink-0">
              <span className="text-academy font-black text-xs">{current.name[0]}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold leading-tight truncate">
                {current.name} de {current.city}
              </p>
              <p className="text-neutral-400 text-[10px] leading-tight mt-0.5">
                vient de postuler · {current.time}
              </p>
            </div>
            {/* Pulse */}
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-academy opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-academy" />
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
