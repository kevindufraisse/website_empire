'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Newspaper, ArrowRight, CheckCircle2 } from 'lucide-react'

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

const results = [
  '30+ LinkedIn posts, written & scheduled',
  'Daily newsletters that sound like you — but better',
  '30+ short-form videos for Reels, Shorts, TikTok',
  '30+ Instagram posts',
  '4+ high-converting carousels',
  'Custom prompts trained on your tone',
  '1 human assistant to QA everything',
]

export default function ResultsSection() {
  return (
    <section className="container py-20 md:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: Image */}
          <FadeInBlock>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-empire/5 to-transparent p-8">
              <div className="aspect-[4/3] flex items-center justify-center text-neutral-500">
                <div className="text-center">
                  <Newspaper className="mx-auto mb-4 text-empire" size={64} />
                  <p className="text-lg font-semibold">Kevin + Press Coverage</p>
                  <p className="text-sm text-neutral-600 mt-2">(Image placeholder)</p>
                  <p className="text-xs text-neutral-700 mt-4 max-w-xs mx-auto">
                    Add your press appearances, media features, or personal brand image here
                  </p>
                </div>
              </div>
            </div>
          </FadeInBlock>

          {/* Right: Content */}
          <div className="space-y-8">
            <FadeInBlock delay={0.1}>
              <div>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                  One interview a week{' '}
                  <ArrowRight className="inline text-empire" size={36} />{' '}
                  <span className="text-empire">30+ pieces of content</span>
                </h2>
                <p className="text-lg text-neutral-300">
                  Posted across LinkedIn, YouTube, Instagram, newsletters, shorts, reels…
                </p>
              </div>
            </FadeInBlock>

            <FadeInBlock delay={0.2}>
              <div className="space-y-3">
                {results.map((result, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <CheckCircle2 className="text-empire flex-shrink-0 mt-1" size={20} />
                    <span className="text-neutral-200">{result}</span>
                  </motion.div>
                ))}
              </div>
            </FadeInBlock>

            <FadeInBlock delay={0.4}>
              <div className="pt-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-empire/10 to-transparent border border-empire/30">
                  <p className="text-lg font-semibold text-white mb-2">
                    You stay focused on your business.
                  </p>
                  <p className="text-empire text-xl font-bold">We make sure the world sees you.</p>
                </div>
              </div>
            </FadeInBlock>
          </div>
        </div>
      </div>
    </section>
  )
}

