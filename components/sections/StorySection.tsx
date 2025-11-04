'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import NumberTicker from '@/components/magicui/number-ticker'
import { TrendingUp, Users, Calendar } from 'lucide-react'

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

export default function StorySection() {
  return (
    <section className="container py-20 md:py-32">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Story Title */}
        <FadeInBlock>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            I made{' '}
            <span className="text-empire">
              <NumberTicker value={700} />K
            </span>{' '}
            writing one post a day on LinkedIn.
          </h2>
        </FadeInBlock>

        {/* Stats Cards */}
        <FadeInBlock delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-12">
            <div className="relative p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-empire" size={24} />
                <span className="text-sm text-neutral-400">Revenue</span>
              </div>
              <div className="text-3xl font-bold">
                €<NumberTicker value={700} />K
              </div>
            </div>

            <div className="relative p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <Users className="text-empire" size={24} />
                <span className="text-sm text-neutral-400">Monthly Views</span>
              </div>
              <div className="text-3xl font-bold">
                <NumberTicker value={1} />M+
              </div>
            </div>

            <div className="relative p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-empire" size={24} />
                <span className="text-sm text-neutral-400">Ranking</span>
              </div>
              <div className="text-3xl font-bold">
                Top <NumberTicker value={50} />
              </div>
              <p className="text-xs text-neutral-400 mt-1">Creators in France</p>
            </div>
          </div>
        </FadeInBlock>

        {/* Story Content */}
        <FadeInBlock delay={0.2}>
          <div className="text-lg md:text-xl text-neutral-300 space-y-4">
            <p>Every morning — without fail — I wrote.</p>
            <p>Even on holidays.</p>
            <p>Even when I was sick.</p>
            <p>One idea, one post, one more shot to stay visible.</p>
            <p className="pt-4">And it worked.</p>
            <p className="font-semibold text-white">Top 50 creators in France.</p>
            <p>Leads, clients, sales.</p>
            <p className="pt-4">
              From the outside, it looked like I'd cracked the code.
            </p>
          </div>
        </FadeInBlock>

        {/* LinkedIn Ranking Image Placeholder */}
        <FadeInBlock delay={0.3}>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
            <div className="aspect-video flex items-center justify-center text-neutral-500">
              <div className="text-center">
                <Calendar className="mx-auto mb-4 text-empire" size={48} />
                <p className="text-sm">LinkedIn Top 50 Ranking Screenshot</p>
                <p className="text-xs text-neutral-600 mt-2">(Image placeholder)</p>
              </div>
            </div>
          </div>
        </FadeInBlock>

        {/* The Dark Side */}
        <FadeInBlock delay={0.4}>
          <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/20">
            <p className="text-xl md:text-2xl font-semibold text-white mb-6">
              But behind the scenes… I was breaking.
            </p>
            <div className="text-lg text-neutral-300 space-y-4">
              <p>Because LinkedIn isn't long-term.</p>
              <p>A post lives for 24 hours.</p>
              <p>Then it disappears.</p>
              <p className="pt-4">
                So every day, I had to show up again — and again — just to survive.
              </p>
              <p>
                To stay in the game, I had to chase the next "great idea." Something smart,
                something deep, something that would get likes.
              </p>
              <p className="pt-4 font-semibold text-white">It wasn't marketing anymore.</p>
              <p className="text-xl text-red-400">It was survival.</p>
            </div>
          </div>
        </FadeInBlock>

        {/* The Hiring Struggle */}
        <FadeInBlock delay={0.5}>
          <div className="text-lg md:text-xl text-neutral-300 space-y-4">
            <p>Meanwhile, I was still running my business.</p>
            <p>Serving clients.</p>
            <p>Solving problems.</p>
            <p>Trying to scale.</p>
            <p className="pt-6 text-2xl font-semibold text-white">So I hired people to help.</p>
          </div>
        </FadeInBlock>

        {/* Stripe Payments Placeholder */}
        <FadeInBlock delay={0.6}>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
            <div className="aspect-[2/1] flex items-center justify-center text-neutral-500">
              <div className="text-center">
                <TrendingUp className="mx-auto mb-4 text-empire" size={48} />
                <p className="text-sm">Stripe Payments Dashboard</p>
                <p className="text-xs text-neutral-600 mt-2">(Image placeholder)</p>
              </div>
            </div>
          </div>
        </FadeInBlock>

        {/* The Disappointment */}
        <FadeInBlock delay={0.7}>
          <div className="text-lg md:text-xl text-neutral-300 space-y-4">
            <p>Writers.</p>
            <p>Editors.</p>
            <p>Freelancers.</p>
            <p className="pt-4 text-red-400">Most of them disappeared.</p>
            <p>Missed deadlines.</p>
            <p>Gave me mediocre work.</p>
            <p className="pt-4">
              I was spending thousands to get stressed — and re-do everything myself.
            </p>
            <p className="pt-6 font-semibold text-white">So I kept doing it alone.</p>
            <p>More posts.</p>
            <p>More pressure.</p>
          </div>
        </FadeInBlock>

        {/* The Breaking Point */}
        <FadeInBlock delay={0.8}>
          <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-empire/10 to-transparent border border-empire/30">
            <p className="text-xl md:text-2xl text-white mb-4">Until one day, I realized…</p>
            <p className="text-2xl md:text-3xl font-bold text-empire leading-tight">
              I wasn't running a business.
            </p>
            <p className="text-xl md:text-2xl text-neutral-300 mt-4">
              I was trapped inside a machine — one I built myself.
            </p>
            <p className="text-lg text-neutral-400 mt-6">And the machine? It never stopped.</p>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

