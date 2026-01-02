'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import NumberTicker from '@/components/magicui/number-ticker'
import { SocialIcons } from '@/components/ui/social-icons'
import { Mic, Wand2, Calendar, UserCheck, Clock, Zap, Image, ArrowRight, Sparkles } from 'lucide-react'

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

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
  { icon: SocialIcons.video, label: 'Shorts', count: 7, isSocialIcon: true },
  { icon: SocialIcons.instagram, label: 'IG', count: 7, isSocialIcon: true },
  { icon: SocialIcons.twitter, label: 'X', count: 7, isSocialIcon: true },
  { icon: SocialIcons.threads, label: 'Threads', count: 7, isSocialIcon: true },
  { icon: Image, label: 'Carousel', count: 2, isSocialIcon: false },
  { icon: SocialIcons.spotify, label: 'Podcast', count: 1, isSocialIcon: true },
]

export default function HowItWorksAccordion() {
  const { t, lang } = useLanguage()

  return (
    <section id="how-it-works" className="relative w-full py-16 md:py-28 overflow-hidden bg-[#0a0a0a]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(218,252,104,0.08),transparent)]" />
      
      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <FadeInBlock>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-3">{t.howItWorks.title}</h2>
              <p className="text-base md:text-xl text-neutral-400">
                {t.howItWorks.subtitle}
              </p>
            </div>
          </FadeInBlock>

          {/* 3 Steps in a Row */}
          <FadeInBlock delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
              
              {/* STEP 1 */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all flex flex-col">
                {/* Number Badge */}
                <div className="absolute -top-4 left-6 w-8 h-8 rounded-lg bg-empire flex items-center justify-center shadow-lg">
                  <span className="text-lg font-black text-black">1</span>
                </div>
                
                <div className="mt-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Mic className="text-empire" size={20} />
                    <h3 className="text-lg md:text-xl font-bold text-white">{t.howItWorks.step1.title}</h3>
                  </div>
                  
                  <p className="text-sm text-neutral-400 mb-4 flex-1">{t.howItWorks.step1.summary}</p>
                  
                  {/* Big Number */}
                  <div className="text-center p-4 rounded-xl bg-empire/10 border border-empire/20">
                    <p className="text-4xl md:text-5xl font-black text-empire">
                      <NumberTicker value={15} />
                    </p>
                    <p className="text-sm text-neutral-400">{lang === 'fr' ? 'minutes' : 'minutes'}</p>
                  </div>
                </div>
                
                {/* Arrow - Desktop only */}
                <div className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center">
                  <ArrowRight className="text-empire" size={24} />
                </div>
              </div>

              {/* STEP 2 */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-b from-empire/15 to-empire/5 border-2 border-empire/40 flex flex-col">
                {/* Number Badge */}
                <div className="absolute -top-4 left-6 w-8 h-8 rounded-lg bg-empire flex items-center justify-center shadow-lg">
                  <span className="text-lg font-black text-black">2</span>
                </div>
                
                {/* Star Badge */}
                <div className="absolute -top-4 right-6 px-3 py-1 rounded-full bg-empire text-black text-xs font-bold">
                  ⭐ {lang === 'fr' ? 'LA MAGIE' : 'THE MAGIC'}
                </div>
                
                <div className="mt-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Wand2 className="text-empire" size={20} />
                    <h3 className="text-lg md:text-xl font-bold text-white">{t.howItWorks.step2.title}</h3>
                  </div>
                  
                  <p className="text-sm text-neutral-400 mb-3">{t.howItWorks.step2.summary}</p>
                  
                  {/* Machine Stats */}
                  <div className="flex gap-2 mb-4 text-center">
                    <div className="flex-1 px-2 py-2 rounded-lg bg-black/30 border border-white/10">
                      <p className="text-lg font-black text-empire">50+</p>
                      <p className="text-[10px] text-neutral-500">{lang === 'fr' ? 'experts clonés' : 'experts cloned'}</p>
                    </div>
                    <div className="flex-1 px-2 py-2 rounded-lg bg-black/30 border border-white/10">
                      <p className="text-lg font-black text-empire">6</p>
                      <p className="text-[10px] text-neutral-500">{lang === 'fr' ? 'mois R&D' : 'months R&D'}</p>
                    </div>
                  </div>
                  
                  {/* Big Number */}
                  <div className="text-center p-4 rounded-xl bg-black/30 border border-empire/30">
                    <p className="text-4xl md:text-5xl font-black text-empire">
                      <NumberTicker value={30} />+
                    </p>
                    <p className="text-sm text-neutral-400">{lang === 'fr' ? 'contenus créés' : 'pieces created'}</p>
                  </div>
                  
                  {/* Human QA */}
                  <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-black/20 border border-white/10">
                    <UserCheck className="text-empire flex-shrink-0" size={18} />
                    <p className="text-xs text-neutral-300">
                      <span className="text-empire font-semibold">Human QA</span> · {lang === 'fr' ? 'Chaque post vérifié' : 'Every post verified'}
                    </p>
                  </div>
                </div>
                
                {/* Arrow - Desktop only */}
                <div className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center">
                  <ArrowRight className="text-empire" size={24} />
                </div>
              </div>

              {/* STEP 3 */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all flex flex-col">
                {/* Number Badge */}
                <div className="absolute -top-4 left-6 w-8 h-8 rounded-lg bg-empire flex items-center justify-center shadow-lg">
                  <span className="text-lg font-black text-black">3</span>
                </div>
                
                <div className="mt-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="text-empire" size={20} />
                    <h3 className="text-lg md:text-xl font-bold text-white">{t.howItWorks.step3.title}</h3>
                  </div>
                  
                  <p className="text-sm text-neutral-400 mb-4 flex-1">{t.howItWorks.step3.summary}</p>
                  
                  {/* Big Number */}
                  <div className="text-center p-4 rounded-xl bg-empire/10 border border-empire/20">
                    <p className="text-4xl md:text-5xl font-black text-empire">1</p>
                    <p className="text-sm text-neutral-400">{lang === 'fr' ? 'clic pour publier' : 'click to publish'}</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInBlock>

          {/* Content Types - Horizontal scroll on mobile */}
          <FadeInBlock delay={0.2}>
            <div className="mt-10 md:mt-12">
              <p className="text-center text-sm text-neutral-500 mb-4">{t.howItWorks.step2.perInterview}</p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {contentTypes.map((type, i) => {
                  const IconComponent = type.icon
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:border-empire/30 transition-all"
                    >
                      {type.isSocialIcon ? (
                        <div className="scale-75">
                          <IconComponent />
                        </div>
                      ) : (
                        <IconComponent className="text-empire" size={16} />
                      )}
                      <span className="text-lg font-bold text-empire">{type.count}</span>
                      <span className="text-xs text-neutral-400">{type.label}</span>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </FadeInBlock>

          {/* Time Comparison */}
          <FadeInBlock delay={0.3}>
            <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6">
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <Clock className="text-red-400" size={20} />
                <span className="text-red-400 line-through font-semibold">40h/{lang === 'fr' ? 'sem' : 'week'}</span>
              </div>
              
              <ArrowRight className="text-empire rotate-90 sm:rotate-0" size={20} />
              
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500/10 border border-green-500/30">
                <Zap className="text-green-400" size={20} />
                <span className="text-green-400 font-bold">15 min/{lang === 'fr' ? 'sem' : 'week'}</span>
              </div>
              
              <div className="px-5 py-3 rounded-xl bg-empire/10 border border-empire/30">
                <span className="text-empire font-bold">= 39h 45min {lang === 'fr' ? 'économisées' : 'saved'}</span>
              </div>
            </div>
          </FadeInBlock>
        </div>
      </div>
    </section>
  )
}
