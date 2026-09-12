'use client'

import { Heart, MessageCircle, ThumbsUp } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

const REACTIONS = [
  { left: '5%', delay: 0, duration: 9, drift: 34, kind: 'heart' },
  { left: '14%', delay: 4.5, duration: 11, drift: -26, kind: 'like' },
  { left: '25%', delay: 2.2, duration: 10, drift: 42, kind: 'comment' },
  { left: '38%', delay: 7.2, duration: 12, drift: -32, kind: 'heart' },
  { left: '55%', delay: 1.2, duration: 11, drift: 28, kind: 'like' },
  { left: '67%', delay: 5.8, duration: 9.5, drift: -38, kind: 'heart' },
  { left: '79%', delay: 3.2, duration: 12, drift: 36, kind: 'comment' },
  { left: '92%', delay: 8, duration: 10, drift: -30, kind: 'heart' },
] as const

export default function FloatingSocialReactions() {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {REACTIONS.map((reaction, index) => (
        <motion.span
          key={`${reaction.left}-${reaction.kind}`}
          className={`absolute bottom-[-48px] flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/45 shadow-lg backdrop-blur-sm ${
            index > 4 ? 'hidden sm:flex' : ''
          }`}
          style={{ left: reaction.left }}
          initial={{ y: 0, x: 0, opacity: 0, scale: 0.7 }}
          animate={{
            y: [0, -180, -430, -720],
            x: [0, reaction.drift, -reaction.drift / 2, reaction.drift / 3],
            opacity: [0, 0.52, 0.34, 0],
            scale: [0.7, 1, 0.92, 0.75],
            rotate: [0, 8, -7, 4],
          }}
          transition={{
            duration: reaction.duration,
            delay: reaction.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {reaction.kind === 'heart' ? (
            <Heart className="h-5 w-5 fill-[#ff375f] text-[#ff375f]" />
          ) : reaction.kind === 'like' ? (
            <ThumbsUp className="h-5 w-5 fill-[#3897f0] text-[#3897f0]" />
          ) : (
            <MessageCircle className="h-5 w-5 fill-[#a855f7] text-[#a855f7]" />
          )}
        </motion.span>
      ))}
    </div>
  )
}
