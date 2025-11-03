'use client'
import { motion } from 'framer-motion'

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function CalendarGrid({ className, label = 'Content scheduled' }: { className?: string; label?: string }) {
  // Generate random content days
  const contentDays = [3, 5, 7, 10, 12, 14, 17, 19, 21, 24, 26, 28]

  return (
    <div className={`w-full ${className || ''}`}>
      {/* Days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day, i) => (
          <div key={i} className="text-center text-xs text-neutral-500 font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => {
          const day = i + 1
          const hasContent = contentDays.includes(day)
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02, duration: 0.3 }}
              className={`aspect-square rounded-md flex items-center justify-center text-xs transition-all ${
                hasContent
                  ? 'bg-empire/20 border border-empire/50 text-empire font-semibold hover:bg-empire/30'
                  : 'bg-white/5 border border-white/10 text-neutral-500 hover:bg-white/10'
              }`}
            >
              {day <= 30 ? day : ''}
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-empire/20 border border-empire/50" />
          <span>{label}</span>
        </div>
      </div>
    </div>
  )
}
