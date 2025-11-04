'use client'
import { motion } from 'framer-motion'
import RetroGrid from '@/components/magicui/retro-grid'
import { Meteors } from '@/components/magicui/meteors'
import NumberTicker from '@/components/magicui/number-ticker'

export default function StoryHero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-[#0f0f0f] to-black">
      <RetroGrid />
      <Meteors number={20} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(218,252,104,0.15),transparent)]" />
      
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-2 rounded-full bg-empire/10 border border-empire/30 text-empire text-sm font-semibold mb-8">
              The Origin Story
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] mb-8"
          >
            From{' '}
            <span className="block mt-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent">
              Burnout
            </span>
            <span className="block mt-2">to</span>
            <span className="block mt-2 text-empire">
              <NumberTicker value={1} />M+ Views
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-neutral-300 max-w-3xl mx-auto mb-12"
          >
            Why I built Empire to help creators escape the content treadmill
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
          >
            <div>
              <p className="text-4xl md:text-5xl font-bold text-empire mb-2">
                <NumberTicker value={700} />K+
              </p>
              <p className="text-sm text-neutral-400">Revenue generated</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <p className="text-4xl md:text-5xl font-bold text-empire mb-2">
                <NumberTicker value={1} />M+
              </p>
              <p className="text-sm text-neutral-400">Monthly views</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <p className="text-4xl md:text-5xl font-bold text-empire mb-2">
                Top <NumberTicker value={50} />
              </p>
              <p className="text-sm text-neutral-400">LinkedIn France</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-16"
          >
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-empire/50 to-empire/10">
              <div className="px-6 py-3 rounded-full bg-black">
                <p className="text-sm text-neutral-400">
                  Scroll to read the journey ↓
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

