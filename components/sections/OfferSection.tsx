'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Calendar,
  FileText,
  Mail,
  Video,
  Image as ImageIcon,
  Bot,
  UserCheck,
  Users,
  Zap,
  CheckCircle2,
} from 'lucide-react'
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

const features = [
  {
    icon: Calendar,
    title: '4 interviews',
    description: '30 min each — you just show up',
    highlight: false,
  },
  {
    icon: FileText,
    title: '30+ LinkedIn posts',
    description: 'Written & scheduled',
    highlight: false,
  },
  {
    icon: Mail,
    title: 'Daily newsletters',
    description: 'That sound like you — but better',
    highlight: true,
  },
  {
    icon: Video,
    title: '30+ short videos',
    description: 'Reels, Shorts, TikTok',
    highlight: false,
  },
  {
    icon: ImageIcon,
    title: '30+ Instagram posts',
    description: 'Engaging visual content',
    highlight: false,
  },
  {
    icon: ImageIcon,
    title: '4+ carousels',
    description: 'High-converting format',
    highlight: false,
  },
  {
    icon: Bot,
    title: '1 AI LinkedIn setter',
    description: 'Automated outreach',
    highlight: true,
  },
  {
    icon: Zap,
    title: 'Unlimited scripted Reels',
    description: 'Edited & ready to post',
    highlight: false,
  },
  {
    icon: CheckCircle2,
    title: 'Everything scheduled',
    description: 'Ready to go live',
    highlight: false,
  },
  {
    icon: Bot,
    title: 'Custom prompts',
    description: 'Trained on your unique tone',
    highlight: true,
  },
  {
    icon: UserCheck,
    title: '1 human assistant',
    description: 'QA everything before posting',
    highlight: false,
  },
  {
    icon: Users,
    title: 'Private community',
    description: 'Founder/creator network',
    highlight: false,
  },
]

export default function OfferSection() {
  return (
    <section id="offer" className="container py-20 md:py-32">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <FadeInBlock>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">What You Get</h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              Everything you need to become omnipresent across all platforms — without lifting a
              finger.
            </p>
          </div>
        </FadeInBlock>

        {/* Features Grid */}
        <FadeInBlock delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                  className={`group relative p-6 rounded-xl border transition-all hover:scale-[1.02] ${
                    feature.highlight
                      ? 'bg-gradient-to-br from-empire/10 to-transparent border-empire/30 hover:border-empire/50'
                      : 'bg-gradient-to-br from-white/5 to-transparent border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]" />
                  
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                        feature.highlight
                          ? 'bg-empire/20 border border-empire/30'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      <Icon
                        className={feature.highlight ? 'text-empire' : 'text-neutral-300'}
                        size={24}
                      />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-neutral-400">{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </FadeInBlock>

        {/* Bottom CTA */}
        <FadeInBlock delay={0.5}>
          <div className="mt-16 text-center">
            <div className="inline-block p-8 md:p-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10">
              <p className="text-lg text-neutral-300 mb-4">
                Real value if you built this in-house:
              </p>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">€{PRICING.inHouse}/month</p>
              <p className="text-sm text-neutral-500">
                Hiring writers, editors, video editors, schedulers…
              </p>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

