'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import BorderBeam from '@/components/magicui/border-beam'
import { MessageSquare, Sparkles, TrendingUp } from 'lucide-react'

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

export default function StoryBreakthrough() {
  return (
    <section className="container py-20 md:py-32 bg-gradient-to-b from-black to-[#0f0f0f]">
      <div className="max-w-6xl mx-auto">
        <FadeInBlock>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              Now, that same system powers{' '}
              <span className="text-empire">Empire</span>
            </h2>
          </div>
        </FadeInBlock>

        {/* The Process - Visual */}
        <FadeInBlock delay={0.2}>
          <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 overflow-hidden">
            <BorderBeam size={300} duration={12} delay={0} />
            
            <div className="relative z-10">
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire flex items-center justify-center">
                    <MessageSquare className="text-empire" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">1. You Talk</h3>
                  <p className="text-neutral-400">15 minutes. No script. Just your expertise.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire flex items-center justify-center">
                    <Sparkles className="text-empire" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">2. AI + Human</h3>
                  <p className="text-neutral-400">AI generates. Humans polish. Perfect blend.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire flex items-center justify-center">
                    <TrendingUp className="text-empire" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">3. You Grow</h3>
                  <p className="text-neutral-400">30+ pieces published. Everywhere.</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Simple. Scalable. Finally sustainable.
                </p>
                <p className="text-lg text-neutral-300 mb-8">
                  The same system that got me to 1M+ views/month
                </p>
                <a
                  href="/pricing"
                  className="inline-block px-8 py-4 bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)]"
                >
                  This is how I built Empire. Want to use it?
                </a>
              </div>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

