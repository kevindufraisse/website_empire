'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Frown, AlertCircle, Lightbulb, Rocket } from 'lucide-react'

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

const timeline = [
  {
    icon: Frown,
    color: 'from-red-500 to-orange-500',
    title: 'The Problem',
    year: '2020-2022',
    story: [
      'You know content could change the game for you.',
      'But it never sticks.',
      'You tell yourself you\'ll start next week.',
      'Then a client project lands.',
      'Or you get stuck on what to say.',
      'So you push it back. Again. And again.',
    ],
  },
  {
    icon: AlertCircle,
    color: 'from-orange-500 to-yellow-500',
    title: 'The Realization',
    year: '2022',
    story: [
      'You\'re not lazy. You\'re not lost.',
      'You\'re just tired of trying to build a machine… with zero parts.',
      'Every time you try to publish consistently, it eats your time, your energy, your brain.',
      'The calendar stays empty.',
    ],
  },
  {
    icon: Lightbulb,
    color: 'from-empire to-green-400',
    title: 'The Breakthrough',
    year: 'Mid 2022',
    story: [
      'I was on a call with a client. Not a content genius. Just a regular guy who struggled to publish anything.',
      'We talked for an hour. No script. No agenda.',
      'And when I played it back… it hit me.',
      'The guy had gold. Raw stories. Clear convictions. A real voice.',
      'The problem isn\'t what people know. It\'s how they extract it.',
    ],
  },
  {
    icon: Rocket,
    color: 'from-green-400 to-empire',
    title: 'The System',
    year: 'Late 2022 - 2024',
    story: [
      'I stopped writing from scratch. I built a process.',
      'One interview → AI writes → Humans polish → Content explodes.',
      'At first, it sucked. I was feeding prompts into ChatGPT, and getting back garbage.',
      'But I didn\'t stop.',
      'I spent months refining every word, every structure, every transition.',
      'Until it finally clicked. The content was sharp. Sounded like me — on my best day.',
      '1 million views per month. Effortless.',
    ],
  },
]

export default function StoryJourney() {
  return (
    <section className="container py-20 md:py-32">
      <div className="max-w-4xl mx-auto">
        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-empire to-transparent" />

          <div className="space-y-16 md:space-y-24">
            {timeline.map((item, i) => (
              <TimelineBlock key={i} delay={i * 0.2}>
                <div className="relative pl-12 md:pl-32">
                  {/* Icon */}
                  <div className={`absolute left-0 md:left-8 w-8 h-8 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center border-4 border-black`}>
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

