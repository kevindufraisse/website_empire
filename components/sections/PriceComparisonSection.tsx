'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import BorderBeam from '@/components/magicui/border-beam'
import NumberTicker from '@/components/magicui/number-ticker'
import { X, CheckCircle2, Shield, Zap } from 'lucide-react'
import { PRICING } from '@/lib/pricing-config'

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

export default function PriceComparisonSection() {
  const { t } = useLanguage()
  
  return (
    <section id="pricing" className="relative w-full py-20 md:py-32 pb-4 md:pb-8 bg-gradient-to-b from-black via-[#0f0f0f] to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(218,252,104,0.08),transparent)]" />
      <div className="container">
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Title */}
          <FadeInBlock>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold mb-4">
                {t.pricing.title}
              </h2>
              <p className="text-xl text-neutral-300">
                {t.pricing.subtitle}
              </p>
            </div>
          </FadeInBlock>


          {/* Comparison Table - Simplified */}
          <div className="mb-12 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-neutral-500 font-normal text-sm">{t.pricing.tableOption}</th>
                  <th className="text-center p-4 text-neutral-500 font-normal text-sm">{t.pricing.tablePrice}</th>
                  <th className="text-center p-4 text-neutral-500 font-normal text-sm">{t.pricing.tableTimeline}</th>
                  <th className="text-center p-4 text-neutral-500 font-normal text-sm">{t.pricing.tableQuality}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10 opacity-60">
                  <td className="p-4 text-white font-semibold">{t.pricing.agency}</td>
                  <td className="p-4 text-center text-red-400 font-bold">{t.pricing.agencyPrice}</td>
                  <td className="p-4 text-center text-neutral-400">{t.pricing.agencyTimeline}</td>
                  <td className="p-4 text-center text-neutral-400">{t.pricing.agencyQuality}</td>
                </tr>
                <tr className="border-b border-white/10 opacity-60">
                  <td className="p-4 text-white font-semibold">{t.pricing.inHouse}</td>
                  <td className="p-4 text-center text-red-400 font-bold">{t.pricing.inHousePrice}</td>
                  <td className="p-4 text-center text-neutral-400">{t.pricing.inHouseTimeline}</td>
                  <td className="p-4 text-center text-neutral-400">{t.pricing.inHouseQuality}</td>
                </tr>
                <tr className="bg-empire/5 border-2 border-empire">
                  <td className="p-4 text-empire font-bold">{t.pricing.empire}</td>
                  <td className="p-4 text-center text-empire font-bold text-xl">€{PRICING.monthly}/mo</td>
                  <td className="p-4 text-center text-white font-semibold">{t.pricing.empireTimeline}</td>
                  <td className="p-4 text-center text-white font-semibold">{t.pricing.empireQuality}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Savings stat - integrated */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <p className="text-sm text-neutral-400 mb-2">{t.pricing.saved}</p>
              <p className="text-5xl md:text-6xl font-bold text-empire mb-2">
                €<NumberTicker value={265} /><span>K</span>
              </p>
              <p className="text-neutral-300">{t.pricing.lastMonth}</p>
            </div>
          </motion.div>

          {/* Original Comparison Grid - Removed */}
          <div className="hidden grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {/* Option 1 - Agency */}
            <FadeInBlock delay={0.2}>
              <div className="relative p-6 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 opacity-60">
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <X className="text-red-400" size={16} />
                  </div>
                </div>
                <p className="text-lg font-bold text-neutral-400 line-through mb-2">Hire Agency</p>
                <p className="text-4xl font-bold text-red-400 mb-3">€5K-15K</p>
                <p className="text-sm text-neutral-500 mb-4">/month</p>
                <div className="space-y-2 text-sm text-neutral-600">
                  <p>• 4-6 weeks wait time</p>
                  <p>• Generic content</p>
                  <p>• No control</p>
                  <p>• Long contracts</p>
                </div>
              </div>
            </FadeInBlock>

            {/* Option 2 - In-House */}
            <FadeInBlock delay={0.3}>
              <div className="relative p-6 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 opacity-60">
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <X className="text-red-400" size={16} />
                  </div>
                </div>
                <p className="text-lg font-bold text-neutral-400 line-through mb-2">Build In-House</p>
                <p className="text-4xl font-bold text-red-400 mb-3">€12K+</p>
                <p className="text-sm text-neutral-500 mb-4">/month</p>
                <div className="space-y-2 text-sm text-neutral-600">
                  <p>• Hire 5+ people</p>
                  <p>• Manage team</p>
                  <p>• Turnover issues</p>
                  <p>• Massive overhead</p>
                </div>
              </div>
            </FadeInBlock>

            {/* Option 3 - EMPIRE */}
            <FadeInBlock delay={0.4}>
              <div className="relative p-6 rounded-xl bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire overflow-hidden">
                <BorderBeam size={300} duration={12} />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-empire text-black text-xs font-bold rounded-full">
                  BEST VALUE
                </div>
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 rounded-full bg-empire/30 flex items-center justify-center">
                    <CheckCircle2 className="text-empire" size={16} />
                  </div>
                </div>
                <p className="text-lg font-bold text-white mb-2">Empire Internet</p>
                <p className="text-5xl font-bold text-empire mb-1">€1,000</p>
                <p className="text-sm text-neutral-300 mb-4">/month</p>
                <div className="space-y-2 text-sm text-white mb-4">
                  <p>✓ Content in 24-48h</p>
                  <p>✓ Sounds like you</p>
                  <p>✓ 30+ pieces/month</p>
                  <p>✓ Cancel anytime</p>
                </div>
                <div className="pt-4 border-t border-empire/30">
                  <p className="text-xs text-empire font-semibold">
                    + €3,800 in bonuses included
                  </p>
                </div>
              </div>
            </FadeInBlock>
          </div>
        </div>
      </div>
    </section>
  )
}

