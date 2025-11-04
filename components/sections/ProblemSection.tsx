'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

function ProblemBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className="max-w-3xl mx-auto"
    >
      {children}
    </motion.div>
  )
}

export default function ProblemSection() {
  return (
    <section className="container py-20 md:py-32">
      <div className="space-y-16 md:space-y-24">
        {/* Problem 1 */}
        <ProblemBlock>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            You know content could change the game for you.
          </h2>
          <div className="text-lg md:text-xl text-neutral-300 space-y-4">
            <p>But it never sticks.</p>
            <p>You tell yourself you'll start next week.</p>
            <p>Then a client project lands.</p>
            <p>Or you get stuck on what to say.</p>
            <p>So you push it back.</p>
            <p>Again.</p>
            <p>And again.</p>
          </div>
        </ProblemBlock>

        {/* Problem 2 */}
        <ProblemBlock delay={0.1}>
          <div className="text-lg md:text-xl text-neutral-300 space-y-4">
            <p>You're not lazy.</p>
            <p>You're not lost.</p>
            <p className="text-2xl md:text-3xl font-semibold text-white mt-8">
              You're just tired of trying to build a machine… with zero parts.
            </p>
          </div>
        </ProblemBlock>

        {/* Problem 3 */}
        <ProblemBlock delay={0.2}>
          <div className="text-lg md:text-xl text-neutral-300 space-y-4">
            <p>
              Every time you try to publish consistently, it eats your time, your energy, your
              brain.
            </p>
            <p>Ideas dry up.</p>
            <p>Doubt creeps in.</p>
            <p>The calendar stays empty.</p>
            <p className="pt-4">
              Meanwhile, you see others posting daily — and you wonder what the hell they know that
              you don't.
            </p>
          </div>
        </ProblemBlock>

        {/* The System is the Problem */}
        <ProblemBlock delay={0.3}>
          <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
              You're not the problem.
            </h2>
            <p className="text-2xl md:text-3xl font-semibold text-empire">The system is.</p>
          </div>
        </ProblemBlock>

        {/* The Struggle */}
        <ProblemBlock delay={0.4}>
          <div className="text-lg md:text-xl text-neutral-300 space-y-4">
            <p>You open a doc.</p>
            <p>Stare at the blinking cursor.</p>
            <p>Scroll LinkedIn for "inspiration."</p>
            <p>Then close the tab.</p>
            <p>Again.</p>
            <p className="pt-4">It's not that you're not capable.</p>
            <p>You're just tired.</p>
            <p>Of forcing it.</p>
            <p>Of trying to be consistent when your calendar's a warzone.</p>
            <p>Of watching others post daily while you ghost your own brand.</p>
          </div>
        </ProblemBlock>

        {/* Final Realization */}
        <ProblemBlock delay={0.5}>
          <div className="text-center">
            <p className="text-lg md:text-xl text-neutral-400 mb-4">
              And yeah… maybe you've even started to wonder:
            </p>
            <p className="text-2xl md:text-4xl font-bold mb-6">"Is something wrong with me?"</p>
            <p className="text-xl md:text-2xl text-empire font-semibold">Spoiler: no.</p>
            <p className="text-lg md:text-xl text-neutral-300 mt-6">
              The problem isn't you. It's the system you're trying to follow.
            </p>
          </div>
        </ProblemBlock>
      </div>
    </section>
  )
}

