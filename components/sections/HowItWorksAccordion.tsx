'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import NumberTicker from '@/components/magicui/number-ticker'
import { SocialIcons } from '@/components/ui/social-icons'
import { Mic, Brain, Wand2, Calendar, UserCheck, CheckCircle2, ArrowRight, Image } from 'lucide-react'
import { cn } from '@/lib/utils'

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

const contentTypes = [
  { icon: SocialIcons.linkedin, label: 'LinkedIn', count: 7, isSocialIcon: true },
  { icon: SocialIcons.newsletter, label: 'Newsletter', count: 7, isSocialIcon: true },
  { icon: SocialIcons.video, label: 'Reels/Shorts', count: 7, isSocialIcon: true },
  { icon: SocialIcons.instagram, label: 'IG Posts', count: 7, isSocialIcon: true },
  { icon: SocialIcons.twitter, label: 'Twitter', count: 7, isSocialIcon: true },
  { icon: SocialIcons.threads, label: 'Threads', count: 7, isSocialIcon: true },
  { icon: Image, label: 'Carousels', count: 2, isSocialIcon: false },
  { icon: SocialIcons.spotify, label: 'MP3 Podcast', count: 1, isSocialIcon: true },
]

export default function HowItWorksAccordion() {
  const { t } = useLanguage()
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  const steps = [
    {
      number: 1,
      title: t.howItWorks.step1.title,
      icon: Mic,
      summary: t.howItWorks.step1.summary,
      description: t.howItWorks.step1.description,
      badges: [
        { title: t.howItWorks.step1.badge1, sub: t.howItWorks.step1.badge1Sub },
        { title: t.howItWorks.step1.badge2, sub: t.howItWorks.step1.badge2Sub },
      ],
    },
    {
      number: 2,
      title: t.howItWorks.step2.title,
      icon: Wand2,
      summary: t.howItWorks.step2.summary,
      description: t.howItWorks.step2.description,
      hasHumanQA: true,
      contentTypes,
      humanQA: {
        title: t.howItWorks.step2.humanQA,
        sub: t.howItWorks.step2.humanQASub,
        rawAI: t.howItWorks.step2.rawAI,
        rawAIExample: t.howItWorks.step2.rawAIExample,
        humanPolish: t.howItWorks.step2.humanPolish,
        humanPolishExample: t.howItWorks.step2.humanPolishExample,
      },
    },
    {
      number: 3,
      title: t.howItWorks.step3.title,
      icon: Calendar,
      summary: t.howItWorks.step3.summary,
      description: t.howItWorks.step3.description,
      badges: [
        { title: t.howItWorks.step3.badge1, sub: t.howItWorks.step3.badge1Sub },
        { title: t.howItWorks.step3.badge2, sub: t.howItWorks.step3.badge2Sub },
        { title: t.howItWorks.step3.badge3, sub: t.howItWorks.step3.badge3Sub },
      ],
    },
  ]

  return (
    <section id="how-it-works" className="relative w-full py-20 md:py-32 overflow-hidden bg-[#0f0f0f]">
      <div className="container">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Title */}
          <FadeInBlock>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.howItWorks.title}</h2>
              <p className="text-xl text-neutral-300">
                {t.howItWorks.subtitle}
              </p>
            </div>
          </FadeInBlock>

          {/* Horizontal Steps */}
          <FadeInBlock delay={0.1}>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isHovered = hoveredStep === step.number

                return (
                  <motion.div
                    key={step.number}
                    onMouseEnter={() => setHoveredStep(step.number)}
                    onMouseLeave={() => setHoveredStep(null)}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {/* Connector Arrow (hidden on mobile, visible between steps) */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-12 -right-4 lg:-right-6 z-0">
                        <ArrowRight className="text-empire/30 w-8 h-8 lg:w-12 lg:h-12" />
                      </div>
                    )}

                    {/* Step Card */}
                    <div
                      className={cn(
                        'relative h-full rounded-2xl border transition-all overflow-hidden',
                        isHovered
                          ? 'bg-gradient-to-br from-white/10 to-white/[0.02] border-empire/50 shadow-[0_0_30px_rgba(218,252,104,0.1)]'
                          : 'bg-gradient-to-br from-white/5 to-transparent border-white/10 hover:border-white/20'
                      )}
                    >
                      {/* Header */}
                      <div className="p-6 lg:p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className={cn(
                              'flex items-center justify-center rounded-full transition-all',
                              isHovered
                                ? 'w-14 h-14 bg-empire/20 border-2 border-empire'
                                : 'w-12 h-12 bg-white/5 border border-white/10'
                            )}
                          >
                            <Icon className={isHovered ? 'text-empire' : 'text-neutral-400'} size={24} />
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'text-xs font-bold px-2 py-0.5 rounded-full',
                                isHovered ? 'bg-empire text-black' : 'bg-white/10 text-neutral-500'
                              )}
                            >
                              {t.howItWorks.stepLabel} {step.number}
                            </span>
                            {step.hasHumanQA && (
                              <span className="text-xs bg-empire/20 text-empire px-2 py-0.5 rounded-full font-semibold">
                                ⭐ Human QA
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-sm text-neutral-400 mb-4">{step.summary}</p>

                        {/* Description */}
                        <p className="text-sm text-neutral-300 mb-4 leading-relaxed">
                          {step.description}
                        </p>

                        {/* Badges */}
                        {step.badges && (
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {step.badges.map((badge, i) => (
                              <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <CheckCircle2 className="text-empire mb-2" size={16} />
                                <p className="text-xs font-semibold text-white">{badge.title}</p>
                                <p className="text-[10px] text-neutral-500">{badge.sub}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Step 2 - Content Types */}
                        {step.contentTypes && (
                          <div className="mb-4">
                            <p className="text-xs text-neutral-400 mb-3">{t.howItWorks.step2.perInterview}</p>
                            <div className="grid grid-cols-4 gap-2">
                              {step.contentTypes.slice(0, 8).map((type, i) => {
                                const IconComponent = type.icon
                                return (
                                  <div
                                    key={i}
                                    className="p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 text-center"
                                  >
                                    {type.isSocialIcon ? (
                                      <div className="flex justify-center mb-1 scale-75">
                                        <IconComponent />
                                      </div>
                                    ) : (
                                      <IconComponent className="text-empire mx-auto mb-1" size={16} />
                                    )}
                                    <p className="text-lg font-bold text-empire">
                                      <NumberTicker value={type.count} />
                                    </p>
                                    <p className="text-[9px] text-neutral-400">{type.label}</p>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Step 2 - Human QA */}
                        {step.humanQA && (
                          <div className="relative p-4 rounded-xl bg-gradient-to-br from-empire/10 to-transparent border border-empire/30">
                            <div className="flex items-center gap-2 mb-3">
                              <UserCheck className="text-empire" size={20} />
                              <div>
                                <h4 className="text-sm font-bold text-white">{step.humanQA.title}</h4>
                                <p className="text-[10px] text-empire">{step.humanQA.sub}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                                <p className="text-[10px] text-red-400 font-semibold mb-1">❌ {step.humanQA.rawAI}</p>
                                <p className="text-[10px] text-neutral-400 italic">
                                  {step.humanQA.rawAIExample}
                                </p>
                              </div>

                              <div className="relative p-2 rounded-lg bg-gradient-to-br from-empire/20 to-empire/5 border border-empire/50">
                                <p className="text-[10px] text-empire font-semibold mb-1">✓ {step.humanQA.humanPolish}</p>
                                <p className="text-[10px] text-white">
                                  {step.humanQA.humanPolishExample}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 3 - Badges */}
                        {step.number === 3 && step.badges && (
                          <div className="grid grid-cols-1 gap-2">
                            {step.badges.map((badge, i) => (
                              <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <CheckCircle2 className="text-empire mb-2" size={16} />
                                <p className="text-xs font-semibold text-white">{badge.title}</p>
                                <p className="text-[10px] text-neutral-500">{badge.sub}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </FadeInBlock>
        </div>
      </div>
    </section>
  )
}
