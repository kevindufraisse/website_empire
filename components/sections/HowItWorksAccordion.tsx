'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import NumberTicker from '@/components/magicui/number-ticker'
import { SocialIcons } from '@/components/ui/social-icons'
import { Mic, Brain, Wand2, Calendar, UserCheck, CheckCircle2, ChevronDown, Image } from 'lucide-react'
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
  const [openStep, setOpenStep] = useState<number | null>(2)

  const steps = [
    {
      number: 1,
      title: t.howItWorks.step1.title,
      icon: Mic,
      summary: t.howItWorks.step1.summary,
      details: (
        <div className="space-y-4">
          <p className="text-neutral-300">
            {t.howItWorks.step1.description}
          </p>
            <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-empire/10 to-transparent border border-empire/30 hover:border-empire/50 transition-all group">
              <div className="w-10 h-10 rounded-full bg-empire/20 border border-empire/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="text-empire" size={20} />
              </div>
              <p className="text-sm font-bold text-white mb-1">{t.howItWorks.step1.badge1}</p>
              <p className="text-xs text-neutral-400">{t.howItWorks.step1.badge1Sub}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-empire/10 to-transparent border border-empire/30 hover:border-empire/50 transition-all group">
              <div className="w-10 h-10 rounded-full bg-empire/20 border border-empire/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="text-empire" size={20} />
              </div>
              <p className="text-sm font-bold text-white mb-1">{t.howItWorks.step1.badge2}</p>
              <p className="text-xs text-neutral-400">{t.howItWorks.step1.badge2Sub}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 2,
      title: t.howItWorks.step2.title,
      icon: Wand2,
      summary: t.howItWorks.step2.summary,
      details: (
        <div className="space-y-6">
          {/* Content breakdown */}
          <div>
            <p className="text-sm text-neutral-400 mb-4">{t.howItWorks.step2.perInterview}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {contentTypes.map((type, i) => {
                const IconComponent = type.icon
                return (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all text-center"
                  >
                    {type.isSocialIcon ? (
                      <div className="flex justify-center mb-2 scale-90">
                        <IconComponent />
                      </div>
                    ) : (
                      <IconComponent className="text-empire mx-auto mb-2" size={20} />
                    )}
                    <p className="text-xl font-bold text-empire">
                      <NumberTicker value={type.count} />
                    </p>
                    <p className="text-[10px] text-neutral-400">{type.label}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Human QA Highlight */}
          <div className="relative p-6 rounded-xl bg-gradient-to-br from-empire/10 to-transparent border border-empire/30">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="text-empire" size={28} />
              <div>
                <h4 className="text-lg font-bold text-white">{t.howItWorks.step2.humanQA}</h4>
                <p className="text-xs text-empire">{t.howItWorks.step2.humanQASub}</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-xs text-red-400 font-semibold mb-2">❌ {t.howItWorks.step2.rawAI}</p>
                <p className="text-xs text-neutral-400 italic">
                  {t.howItWorks.step2.rawAIExample}
                </p>
              </div>

              <div className="relative p-4 rounded-lg bg-gradient-to-br from-empire/20 to-empire/5 border border-empire/50">
                <p className="text-xs text-empire font-semibold mb-2">✓ {t.howItWorks.step2.humanPolish}</p>
                <p className="text-xs text-white">
                  {t.howItWorks.step2.humanPolishExample}
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 3,
      title: t.howItWorks.step3.title,
      icon: Calendar,
      summary: t.howItWorks.step3.summary,
      details: (
        <div className="space-y-4">
          <p className="text-neutral-300">
            {t.howItWorks.step3.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-empire/10 to-transparent border border-empire/30 hover:border-empire/50 transition-all group">
              <div className="w-10 h-10 rounded-full bg-empire/20 border border-empire/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="text-empire" size={20} />
              </div>
              <p className="text-sm font-bold text-white mb-1">{t.howItWorks.step3.badge1}</p>
              <p className="text-xs text-neutral-400">{t.howItWorks.step3.badge1Sub}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-empire/10 to-transparent border border-empire/30 hover:border-empire/50 transition-all group">
              <div className="w-10 h-10 rounded-full bg-empire/20 border border-empire/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="text-empire" size={20} />
              </div>
              <p className="text-sm font-bold text-white mb-1">{t.howItWorks.step3.badge2}</p>
              <p className="text-xs text-neutral-400">{t.howItWorks.step3.badge2Sub}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-empire/10 to-transparent border border-empire/30 hover:border-empire/50 transition-all group">
              <div className="w-10 h-10 rounded-full bg-empire/20 border border-empire/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="text-empire" size={20} />
              </div>
              <p className="text-sm font-bold text-white mb-1">{t.howItWorks.step3.badge3}</p>
              <p className="text-xs text-neutral-400">{t.howItWorks.step3.badge3Sub}</p>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <section id="how-it-works" className="relative w-full py-20 md:py-32 overflow-hidden bg-[#0f0f0f]">
      <div className="container">
        <div className="max-w-4xl mx-auto relative z-10">
        {/* Title */}
        <FadeInBlock>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.howItWorks.title}</h2>
            <p className="text-xl text-neutral-300">
              {t.howItWorks.subtitle}
            </p>
          </div>
        </FadeInBlock>

        {/* Accordion */}
        <FadeInBlock delay={0.1}>
          <div className="space-y-4">
            {steps.map((step) => {
              const Icon = step.icon
              const isOpen = openStep === step.number

              return (
                <div
                  key={step.number}
                  className={cn(
                    'rounded-2xl border transition-all overflow-hidden',
                    isOpen
                      ? 'bg-gradient-to-br from-white/10 to-white/[0.02] border-empire/30'
                      : 'bg-gradient-to-br from-white/5 to-transparent border-white/10 hover:border-white/20'
                  )}
                >
                  {/* Header */}
                  <button
                    onClick={() => setOpenStep(isOpen ? null : step.number)}
                    className="w-full p-6 md:p-8 flex items-center justify-between text-left group hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-start gap-5 md:gap-6 flex-1">
                      {/* Large Icon Circle */}
                      <div
                        className={cn(
                          'flex items-center justify-center rounded-2xl transition-all shrink-0',
                          isOpen
                            ? 'w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-empire/30 to-empire/10 border-2 border-empire shadow-[0_0_20px_rgba(218,252,104,0.3)]'
                            : 'w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 group-hover:border-empire/50 group-hover:bg-empire/10'
                        )}
                      >
                        <Icon className={cn(
                          'transition-colors',
                          isOpen ? 'text-empire' : 'text-neutral-400 group-hover:text-empire/70'
                        )} size={isOpen ? 32 : 28} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span
                            className={cn(
                              'text-xs font-bold px-3 py-1 rounded-full transition-all',
                              isOpen 
                                ? 'bg-empire text-black shadow-[0_0_10px_rgba(218,252,104,0.5)]' 
                                : 'bg-white/10 text-neutral-400 group-hover:bg-white/20'
                            )}
                          >
                            {t.howItWorks.stepLabel} {step.number}
                          </span>
                          {step.number === 2 && (
                            <span className={cn(
                              'text-xs px-3 py-1 rounded-full font-semibold transition-all',
                              isOpen
                                ? 'bg-gradient-to-r from-empire/30 to-empire/10 text-empire border border-empire/50'
                                : 'bg-empire/10 text-empire/70 border border-empire/20'
                            )}>
                              ⭐ Human QA
                            </span>
                          )}
                        </div>
                        <h3 className={cn(
                          'font-bold transition-colors mb-2',
                          isOpen 
                            ? 'text-2xl md:text-3xl text-white' 
                            : 'text-xl md:text-2xl text-white group-hover:text-empire'
                        )}>
                          {step.title}
                        </h3>
                        <p className={cn(
                          'transition-colors',
                          isOpen ? 'text-base text-neutral-300' : 'text-sm text-neutral-400 group-hover:text-neutral-300'
                        )}>
                          {step.summary}
                        </p>
                      </div>
                    </div>
                    
                    {/* Chevron */}
                    <ChevronDown
                      className={cn(
                        'text-neutral-400 transition-all duration-300 shrink-0 ml-4',
                        isOpen ? 'rotate-180 text-empire scale-110' : 'group-hover:text-empire/70'
                      )}
                      size={28}
                    />
                  </button>

                  {/* Content */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? 'auto' : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-white/10">
                      <motion.div 
                        initial={false}
                        animate={{
                          y: isOpen ? 0 : -10,
                        }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="pt-6"
                      >
                        {step.details}
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </FadeInBlock>
      </div>
      </div>
    </section>
  )
}

