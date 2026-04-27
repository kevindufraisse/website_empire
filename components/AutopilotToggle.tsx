'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Plane } from 'lucide-react'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AutopilotToggle() {
  const { autopilot, toggle } = useAutopilot()
  const { lang } = useLanguage()

  const fr = lang === 'fr'
  const label = autopilot
    ? fr ? 'Mode Autopilot' : 'Autopilot Mode'
    : fr ? 'Pas 15 min ?' : 'No 15 min?'
  const sublabel = autopilot
    ? fr ? 'On fait tout pour vous' : 'We do it all for you'
    : fr ? 'Activez Autopilot' : 'Activate Autopilot'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={autopilot}
      aria-label={label}
      className={`group relative flex items-center gap-2 px-2.5 py-1.5 rounded-full border transition-all shrink-0 ${
        autopilot
          ? 'bg-gradient-to-r from-autopilot/20 to-autopilot/10 border-autopilot/50 shadow-[0_0_20px_rgba(212,165,116,0.25)]'
          : 'bg-white/5 border-white/15 hover:border-empire/40'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <motion.div
          animate={{
            rotate: autopilot ? [0, -8, 8, 0] : 0,
            scale: autopilot ? 1.05 : 1,
          }}
          transition={{ duration: 0.4 }}
          className={`flex items-center justify-center w-5 h-5 ${
            autopilot ? 'text-autopilot' : 'text-neutral-400 group-hover:text-empire'
          }`}
        >
          <Plane size={14} strokeWidth={2.4} className={autopilot ? 'rotate-[-15deg]' : ''} />
        </motion.div>

        <div className="hidden md:flex flex-col items-start leading-none">
          <AnimatePresence mode="wait">
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className={`text-[11px] font-bold whitespace-nowrap ${
                autopilot ? 'text-autopilot' : 'text-white'
              }`}
            >
              {label}
            </motion.span>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.span
              key={sublabel}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, delay: 0.05 }}
              className={`text-[9px] font-medium whitespace-nowrap ${
                autopilot ? 'text-autopilot/80' : 'text-neutral-400'
              }`}
            >
              {sublabel}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div
        className={`relative w-8 h-4 rounded-full transition-colors ${
          autopilot ? 'bg-autopilot' : 'bg-neutral-700'
        }`}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute top-0.5 w-3 h-3 rounded-full shadow-md ${
            autopilot ? 'left-[18px] bg-white' : 'left-0.5 bg-neutral-300'
          }`}
        />
      </div>

      {autopilot && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -inset-px rounded-full pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(212,165,116,0.25), transparent)',
            maskImage: 'linear-gradient(black, black)',
          }}
        />
      )}
    </button>
  )
}
