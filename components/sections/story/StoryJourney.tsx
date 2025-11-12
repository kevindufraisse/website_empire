'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Frown, AlertCircle, Lightbulb, Rocket } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

function TimelineBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function StoryJourney() {
  const { t } = useLanguage()

  const timeline = [
    {
      icon: Frown,
      color: 'from-red-600 via-red-500 to-orange-500',
      glowColor: 'rgba(239,68,68,0.3)',
      title: t.story.journey.problem.title,
      year: t.story.journey.problem.year,
      story: t.story.journey.problem.lines,
    },
    {
      icon: AlertCircle,
      color: 'from-orange-500 via-amber-500 to-yellow-500',
      glowColor: 'rgba(251,146,60,0.3)',
      title: t.story.journey.awareness.title,
      year: t.story.journey.awareness.year,
      story: t.story.journey.awareness.lines,
    },
    {
      icon: Lightbulb,
      color: 'from-blue-400 via-cyan-400 to-teal-400',
      glowColor: 'rgba(56,189,248,0.3)',
      title: t.story.journey.breakthrough.title,
      year: t.story.journey.breakthrough.year,
      story: t.story.journey.breakthrough.lines,
    },
    {
      icon: Rocket,
      color: 'from-green-400 via-emerald-400 to-empire',
      glowColor: 'rgba(218,252,104,0.3)',
      title: t.story.journey.system.title,
      year: t.story.journey.system.year,
      story: t.story.journey.system.lines,
    },
  ]

  return (
    <section className="container py-20 md:py-32 bg-gradient-to-b from-black via-[#0a0a0a] to-black">
      <div className="max-w-4xl mx-auto">
        {/* Timeline */}
        <div className="relative">
          {/* Vertical line - gradient rainbow */}
          <div className="absolute left-0 md:left-12 top-0 bottom-0 w-[2px] bg-gradient-to-b from-red-500 via-blue-400 to-empire opacity-50" />

          <div className="space-y-16 md:space-y-24">
            {timeline.map((item, i) => (
              <TimelineBlock key={i} delay={i * 0.2}>
                <div className="relative pl-12 md:pl-32">
                  {/* Icon with glow */}
                  <div className={`absolute left-0 md:left-8 w-8 h-8 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center border-4 border-black shadow-[0_0_30px_${item.glowColor}]`}>
                    <item.icon className="text-black" size={20} />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-empire font-semibold mb-1">{item.year}</p>
                      <h3 className="text-3xl md:text-4xl font-bold">{item.title}</h3>
                    </div>

                    <div className="space-y-3 text-lg md:text-xl text-neutral-300">
                      {item.story.map((line, j) => (
                        <p key={j} className={j === item.story.length - 1 ? 'text-white font-semibold' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </TimelineBlock>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

