'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import BorderBeam from '@/components/magicui/border-beam'
import { Lightbulb, MessageSquare, Sparkles } from 'lucide-react'

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function BreakthroughSection() {
  return (
    <section className="container py-20 md:py-32">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* The Turning Point */}
        <FadeInBlock>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            Then one day, something unexpected happened.
          </h2>
        </FadeInBlock>

        <FadeInBlock delay={0.1}>
          <div className="text-lg md:text-xl text-neutral-300 space-y-4">
            <p>I was on a call with a client.</p>
            <p>Not a content genius.</p>
            <p>Not super charismatic.</p>
            <p>Just a regular guy who struggled to publish anything.</p>
          </div>
        </FadeInBlock>

        {/* The Call */}
        <FadeInBlock delay={0.2}>
          <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
            <MessageSquare className="text-empire mb-4" size={32} />
            <div className="text-lg md:text-xl text-neutral-300 space-y-4">
              <p>We talked for an hour.</p>
              <p>No script.</p>
              <p>No agenda.</p>
              <p>Just me asking questions, pulling insights, listening.</p>
            </div>
          </div>
        </FadeInBlock>

        {/* The Realization */}
        <FadeInBlock delay={0.3}>
          <div className="text-lg md:text-xl text-neutral-300 space-y-4">
            <p className="text-2xl md:text-3xl font-semibold text-white">
              And when I played it back… it hit me.
            </p>
            <p className="pt-4">The guy had gold.</p>
            <p>Raw stories.</p>
            <p>Clear convictions.</p>
            <p>A real voice.</p>
            <p className="pt-4">
              Stuff that would crush on LinkedIn, in a newsletter, in a video.
            </p>
          </div>
        </FadeInBlock>

        {/* The Key Insight - with Border Beam */}
        <FadeInBlock delay={0.4}>
          <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-empire/10 to-transparent overflow-hidden">
            <BorderBeam size={300} duration={12} delay={0} />
            <Lightbulb className="text-empire mb-6" size={40} />
            <p className="text-2xl md:text-4xl font-bold text-white leading-tight mb-6">
              The problem isn't what people know.
            </p>
            <p className="text-xl md:text-2xl text-empire font-semibold">
              It's how they extract it.
            </p>
          </div>
        </FadeInBlock>

        {/* The Truth */}
        <FadeInBlock delay={0.5}>
          <div className="text-center text-lg md:text-xl text-neutral-300 space-y-4 py-8">
            <p className="text-2xl md:text-3xl font-semibold text-white">
              Everyone has something to say
            </p>
            <p>— they just need the right system to capture it.</p>
          </div>
        </FadeInBlock>

        {/* The New Approach */}
        <FadeInBlock delay={0.6}>
          <div className="text-lg md:text-xl text-neutral-300 space-y-4">
            <p className="text-2xl font-semibold text-white mb-4">So I stopped writing from scratch.</p>
            <p>I built a process.</p>
          </div>
        </FadeInBlock>

        {/* The Process */}
        <FadeInBlock delay={0.7}>
          <div className="relative p-8 md:p-10 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-empire/20 border border-empire flex items-center justify-center text-empire font-bold">
                  1
                </div>
                <span className="text-lg font-semibold">One interview</span>
              </div>
              
              <span className="text-neutral-500 hidden md:block">→</span>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-empire/20 border border-empire flex items-center justify-center text-empire font-bold">
                  2
                </div>
                <span className="text-lg font-semibold">AI writes</span>
              </div>
              
              <span className="text-neutral-500 hidden md:block">→</span>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-empire/20 border border-empire flex items-center justify-center text-empire font-bold">
                  3
                </div>
                <span className="text-lg font-semibold">Humans polish</span>
              </div>
              
              <span className="text-neutral-500 hidden md:block">→</span>
              
              <div className="flex items-center gap-3">
                <Sparkles className="text-empire" size={24} />
                <span className="text-lg font-semibold text-empire">Content explodes</span>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">Simple. Scalable. Finally sustainable.</p>
            </div>
          </div>
        </FadeInBlock>

        {/* The Journey */}
        <FadeInBlock delay={0.8}>
          <div className="text-lg md:text-xl text-neutral-300 space-y-4">
            <p className="text-xl font-semibold text-white">At first, it sucked.</p>
            <p>I was feeding prompts into ChatGPT, and getting back garbage.</p>
            <p>Nothing sounded like me.</p>
            <p>The tone was off.</p>
            <p>The content was useless.</p>
            <p className="pt-4 text-white font-semibold">But I didn't stop.</p>
          </div>
        </FadeInBlock>

        {/* The Refinement */}
        <FadeInBlock delay={0.9}>
          <div className="text-lg md:text-xl text-neutral-300 space-y-4">
            <p>I spent months refining every word, every structure, every transition.</p>
            <p>Tweaking verbs.</p>
            <p>Rewriting intros.</p>
            <p>Rebuilding from scratch.</p>
            <p className="pt-6 text-2xl md:text-3xl font-bold text-empire">
              Until it finally clicked.
            </p>
          </div>
        </FadeInBlock>

        {/* The Results */}
        <FadeInBlock delay={1.0}>
          <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-empire/10 to-transparent border border-empire/30">
            <div className="text-lg md:text-xl text-neutral-300 space-y-4">
              <p>The content was sharp.</p>
              <p>Sounded like me — on my best day.</p>
              <p className="pt-4 text-white font-semibold">And it worked.</p>
              <p className="text-3xl md:text-4xl font-bold text-empire mt-6">
                1 million views per month.
              </p>
              <p className="text-2xl text-white">Effortless.</p>
            </div>
          </div>
        </FadeInBlock>

        {/* The Transition */}
        <FadeInBlock delay={1.1}>
          <div className="text-center py-8">
            <p className="text-xl md:text-2xl font-semibold text-white mb-4">
              Now, that same system powers Empire.
            </p>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

