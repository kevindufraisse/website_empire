'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { openVideoDialog } from '@/components/magicui/hero-video-dialog'
import { Zap, Shield, Clock } from 'lucide-react'

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

export default function PricingSection() {
  const { t } = useLanguage()
  
  return (
    <section id="pricing" className="container py-20 md:py-32">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <FadeInBlock>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to become <span className="text-empire">omnipresent</span>?
            </h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              Join the creators who are building their empire — without the burnout.
            </p>
          </div>
        </FadeInBlock>

        {/* Pricing Card */}
        <FadeInBlock delay={0.1}>
          <div className="relative">
            {/* Main pricing box */}
            <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 overflow-hidden">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-empire/5 via-transparent to-blue-500/5 pointer-events-none" />
              
              <div className="relative z-10">
                {/* Comparison */}
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  {/* Real Value */}
                  <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-neutral-400 mb-2">Real Value (In-house team)</p>
                    <p className="text-4xl md:text-5xl font-bold text-neutral-500 line-through mb-2">
                      €12,000
                    </p>
                    <p className="text-sm text-neutral-500">/month</p>
                  </div>

                  {/* Your Price */}
                  <div className="relative text-center p-6 rounded-xl bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire">
                    {/* Savings badge */}
                    <div className="absolute -top-3 -right-3 bg-empire text-black text-xs font-bold px-3 py-1 rounded-full">
                      92% OFF
                    </div>
                    <p className="text-sm text-empire mb-2">Your Investment</p>
                    <p className="text-5xl md:text-6xl font-bold text-white mb-2">€1,000</p>
                    <p className="text-sm text-neutral-300">/month</p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="grid md:grid-cols-3 gap-4 mb-10">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5">
                    <Zap className="text-empire flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-sm">Quick Start</p>
                      <p className="text-xs text-neutral-400">First content in 24-48h</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5">
                    <Clock className="text-empire flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-sm">15 min/week</p>
                      <p className="text-xs text-neutral-400">Your time commitment</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5">
                    <Shield className="text-empire flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-sm">Cancel Anytime</p>
                      <p className="text-xs text-neutral-400">No long-term contract</p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col items-center gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <a
                      href="/pricing"
                      className="px-8 py-4 bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)] text-center"
                    >
                      {t.finalCTA.startNow}
                    </a>
                    <button
                      onClick={() => openVideoDialog()}
                      className="px-8 py-4 border-2 border-empire/50 text-white font-semibold rounded-xl hover:border-empire hover:bg-empire/10 transition-all text-center"
                    >
                      {t.finalCTA.watchDemo}
                    </button>
                  </div>

                  <p className="text-sm text-neutral-400">
                    {t.finalCTA.details}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeInBlock>

        {/* Social Proof / Trust Signals */}
        <FadeInBlock delay={0.3}>
          <div className="mt-16 grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-empire mb-2">700K+</p>
              <p className="text-sm text-neutral-400">Revenue generated from content</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-empire mb-2">1M+</p>
              <p className="text-sm text-neutral-400">Monthly views achieved</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-empire mb-2">Top 50</p>
              <p className="text-sm text-neutral-400">Creators in France ranking</p>
            </div>
          </div>
        </FadeInBlock>

        {/* Final Message */}
        <FadeInBlock delay={0.4}>
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-neutral-300 leading-relaxed">
              Stop trying to build the machine alone.
              <br />
              <span className="text-white font-semibold">Let Empire do it for you.</span>
            </p>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

