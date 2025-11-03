'use client'
import { motion } from 'framer-motion'
import { Mic } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function VoiceAnimation() {
  const { t } = useLanguage()
  // Generate random bar heights for voice effect
  const bars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    delay: i * 0.1,
  }))

  return (
    <div className="flex items-center justify-center h-full w-full p-8">
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Microphone Icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-empire/30 to-empire/10 border-2 border-empire flex items-center justify-center"
        >
          <Mic className="text-empire" size={28} />
        </motion.div>

        {/* Voice Waveform */}
        <div className="flex items-center justify-center gap-1 w-full max-w-xs h-24">
          {bars.map((bar) => (
            <motion.div
              key={bar.id}
              className="w-1 bg-gradient-to-t from-empire/80 to-empire/40 rounded-full"
              animate={{
                height: ['20%', '100%', '40%', '80%', '30%', '20%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: bar.delay,
              }}
            />
          ))}
        </div>

        {/* Pulsing Text */}
        <motion.p
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-xs text-empire font-semibold tracking-wider"
        >
          {t.bentoGrid.recording}
        </motion.p>

        {/* Circular Sound Waves */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 border-empire/20"
              initial={{ width: '40px', height: '40px', opacity: 0.8 }}
              animate={{
                width: ['40px', '120px', '160px'],
                height: ['40px', '120px', '160px'],
                opacity: [0.8, 0.4, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeOut',
                delay: i * 1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

