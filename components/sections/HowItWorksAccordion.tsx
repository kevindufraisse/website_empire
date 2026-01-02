'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import NumberTicker from '@/components/magicui/number-ticker'
import { SocialIcons } from '@/components/ui/social-icons'
import { Mic, Wand2, Calendar, UserCheck, CheckCircle2, Clock, Zap, Image, ArrowDown } from 'lucide-react'

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
  { icon: SocialIcons.video, label: 'Reels/Shorts', count: 7, isSocialIcon: true },
  { icon: SocialIcons.instagram, label: 'IG Posts', count: 7, isSocialIcon: true },
  { icon: SocialIcons.twitter, label: 'Twitter', count: 7, isSocialIcon: true },
  { icon: SocialIcons.threads, label: 'Threads', count: 7, isSocialIcon: true },
  { icon: Image, label: 'Carousels', count: 2, isSocialIcon: false },
  { icon: SocialIcons.spotify, label: 'MP3 Podcast', count: 1, isSocialIcon: true },
]

export default function HowItWorksAccordion() {
  const { t, lang } = useLanguage()

  return (
    <section id="how-it-works" className="relative w-full py-20 md:py-32 overflow-hidden bg-[#0f0f0f]">
      <div className="container">
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Title */}
          <FadeInBlock>
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.howItWorks.title}</h2>
              <p className="text-lg md:text-xl text-neutral-300 mb-6">
                {t.howItWorks.subtitle}
              </p>
              {/* Time Savings Highlight */}
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-empire/20 to-green-500/20 border border-empire/30">
                <Clock className="text-empire" size={20} />
                <span className="text-sm md:text-base text-white">
                  {lang === 'fr' ? 'Traditionnellement' : 'Traditional way'}: <span className="text-red-400 line-through">40h/semaine</span>
                </span>
                <ArrowDown className="text-empire rotate-[-90deg]" size={16} />
                <span className="text-sm md:text-base font-bold text-empire">
                  Empire: 15 min
                </span>
              </div>
            </div>
          </FadeInBlock>

          {/* Timeline Steps */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-empire/50 via-empire to-empire/50 transform -translate-x-1/2" />

            {/* Step 1 */}
            <FadeInBlock delay={0.1}>
              <div className="relative mb-8 md:mb-0">
                <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                  {/* Left - Content */}
                  <div className="md:text-right md:pr-12">
                    <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-empire/10 border border-empire/30">
                      <span className="text-xs font-bold text-empire">{t.howItWorks.stepLabel} 1</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.howItWorks.step1.title}</h3>
                    <p className="text-neutral-400 mb-4">{t.howItWorks.step1.summary}</p>
                    
                    <div className="flex flex-wrap gap-3 md:justify-end">
                      <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-xs text-neutral-500">{t.howItWorks.step1.badge1Sub}</p>
                        <p className="text-sm font-semibold text-white">{t.howItWorks.step1.badge1}</p>
                      </div>
                      <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-xs text-neutral-500">{t.howItWorks.step1.badge2Sub}</p>
                        <p className="text-sm font-semibold text-white">{t.howItWorks.step1.badge2}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right - Big Number */}
                  <div className="mt-6 md:mt-0 md:pl-12">
                    <div className="relative p-8 rounded-2xl bg-gradient-to-br from-empire/20 to-transparent border border-empire/30">
                      {/* Timeline Node */}
                      <div className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-empire border-4 border-[#0f0f0f]">
                        <Mic className="text-black" size={20} />
                      </div>
                      <div className="text-center">
                        <div className="text-6xl md:text-7xl font-black text-empire mb-2">
                          <NumberTicker value={15} />
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-white">{lang === 'fr' ? 'minutes' : 'minutes'}</p>
                        <p className="text-sm text-neutral-400 mt-2">{lang === 'fr' ? 'C\'est tout ce qu\'on vous demande' : 'That\'s all we ask from you'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInBlock>

            {/* Arrow Down Mobile */}
            <div className="flex justify-center my-4 md:hidden">
              <ArrowDown className="text-empire animate-bounce" size={24} />
            </div>

            {/* Step 2 */}
            <FadeInBlock delay={0.2}>
              <div className="relative my-8 md:my-16">
                <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                  {/* Left - Big Number */}
                  <div className="order-2 md:order-1 mt-6 md:mt-0 md:pr-12">
                    <div className="relative p-8 rounded-2xl bg-gradient-to-br from-empire/20 to-transparent border border-empire/30">
                      {/* Timeline Node */}
                      <div className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-empire border-4 border-[#0f0f0f]">
                        <Wand2 className="text-black" size={20} />
                      </div>
                      <div className="text-center">
                        <div className="text-6xl md:text-7xl font-black text-empire mb-2">
                          <NumberTicker value={30} />+
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-white">{lang === 'fr' ? 'contenus créés' : 'pieces created'}</p>
                        <p className="text-sm text-neutral-400 mt-2">{lang === 'fr' ? 'par interview de 15 min' : 'per 15-min interview'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right - Content */}
                  <div className="order-1 md:order-2 md:pl-12">
                    <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-empire/10 border border-empire/30">
                      <span className="text-xs font-bold text-empire">{t.howItWorks.stepLabel} 2</span>
                      <span className="text-xs bg-empire text-black px-2 py-0.5 rounded-full font-bold">⭐ Human QA</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.howItWorks.step2.title}</h3>
                    <p className="text-neutral-400 mb-4">{t.howItWorks.step2.summary}</p>
                  </div>
                </div>

                {/* The Machine - Expert Cloning Highlight */}
                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 via-empire/10 to-blue-500/10 border border-purple-500/30 relative overflow-hidden">
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(218,252,104,0.05),transparent)]" />
                  
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-empire/30 to-purple-500/30 border border-empire/50 flex items-center justify-center">
                          <span className="text-2xl">🧠</span>
                        </div>
                        <div>
                          <h4 className="text-lg md:text-xl font-bold text-white">
                            {lang === 'fr' ? 'La Machine Empire' : 'The Empire Machine'}
                          </h4>
                          <p className="text-sm text-empire font-semibold">
                            {lang === 'fr' ? 'Des mois de R&D condensés' : 'Months of R&D condensed'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
                          <p className="text-2xl font-black text-empire">50+</p>
                          <p className="text-xs text-neutral-400">
                            {lang === 'fr' ? 'Experts clonés' : 'Experts cloned'}
                          </p>
                        </div>
                        <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
                          <p className="text-2xl font-black text-empire">6</p>
                          <p className="text-xs text-neutral-400">
                            {lang === 'fr' ? 'Mois de développement' : 'Months of development'}
                          </p>
                        </div>
                        <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
                          <p className="text-2xl font-black text-empire">∞</p>
                          <p className="text-xs text-neutral-400">
                            {lang === 'fr' ? 'Posts analysés' : 'Posts analyzed'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="mt-4 text-sm text-neutral-300">
                      {lang === 'fr' 
                        ? 'Nous avons étudié et cloné les stratégies des meilleurs créateurs de contenu viral. Leur expertise est maintenant intégrée dans notre IA pour maximiser la performance de chaque post.'
                        : 'We studied and cloned the strategies of the best viral content creators. Their expertise is now embedded in our AI to maximize the performance of every post.'}
                    </p>
                  </div>
                </div>

                {/* Content Types Grid */}
                <div className="mt-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-sm text-neutral-400 mb-4 text-center">{t.howItWorks.step2.perInterview}</p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {contentTypes.map((type, i) => {
                      const IconComponent = type.icon
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          viewport={{ once: true }}
                          className="p-2 md:p-3 rounded-lg bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all text-center"
                        >
                          {type.isSocialIcon ? (
                            <div className="flex justify-center mb-1 scale-75 md:scale-90">
                              <IconComponent />
                            </div>
                          ) : (
                            <IconComponent className="text-empire mx-auto mb-1" size={18} />
                          )}
                          <p className="text-lg md:text-xl font-bold text-empire">{type.count}</p>
                          <p className="text-[8px] md:text-[10px] text-neutral-400 leading-tight">{type.label}</p>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Human QA Highlight */}
                <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-empire/10 to-transparent border border-empire/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-empire/20 border-2 border-empire flex items-center justify-center">
                      <UserCheck className="text-empire" size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{t.howItWorks.step2.humanQA}</h4>
                      <p className="text-sm text-empire">{t.howItWorks.step2.humanQASub}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                      <p className="text-sm text-red-400 font-semibold mb-2">❌ {t.howItWorks.step2.rawAI}</p>
                      <p className="text-sm text-neutral-400 italic">
                        {t.howItWorks.step2.rawAIExample}
                      </p>
                    </div>

                    <div className="relative p-4 rounded-xl bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire/50">
                      <div className="absolute -top-3 left-4 px-2 py-0.5 bg-empire text-black text-xs font-bold rounded">
                        {lang === 'fr' ? 'APRÈS POLISH HUMAIN' : 'AFTER HUMAN POLISH'}
                      </div>
                      <p className="text-sm text-empire font-semibold mb-2 mt-1">✓ {t.howItWorks.step2.humanPolish}</p>
                      <p className="text-sm text-white">
                        {t.howItWorks.step2.humanPolishExample}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInBlock>

            {/* Arrow Down Mobile */}
            <div className="flex justify-center my-4 md:hidden">
              <ArrowDown className="text-empire animate-bounce" size={24} />
            </div>

            {/* Step 3 */}
            <FadeInBlock delay={0.3}>
              <div className="relative mt-8 md:mt-0">
                <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                  {/* Left - Content */}
                  <div className="md:text-right md:pr-12">
                    <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-empire/10 border border-empire/30">
                      <span className="text-xs font-bold text-empire">{t.howItWorks.stepLabel} 3</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.howItWorks.step3.title}</h3>
                    <p className="text-neutral-400 mb-4">{t.howItWorks.step3.summary}</p>
                    
                    <div className="flex flex-wrap gap-3 md:justify-end">
                      <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                        <CheckCircle2 className="text-empire mb-1" size={16} />
                        <p className="text-sm font-semibold text-white">{t.howItWorks.step3.badge1}</p>
                      </div>
                      <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                        <CheckCircle2 className="text-empire mb-1" size={16} />
                        <p className="text-sm font-semibold text-white">{t.howItWorks.step3.badge2}</p>
                      </div>
                      <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                        <CheckCircle2 className="text-empire mb-1" size={16} />
                        <p className="text-sm font-semibold text-white">{t.howItWorks.step3.badge3}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right - Big Number */}
                  <div className="mt-6 md:mt-0 md:pl-12">
                    <div className="relative p-8 rounded-2xl bg-gradient-to-br from-empire/20 to-transparent border border-empire/30">
                      {/* Timeline Node */}
                      <div className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-empire border-4 border-[#0f0f0f]">
                        <Calendar className="text-black" size={20} />
                      </div>
                      <div className="text-center">
                        <div className="text-6xl md:text-7xl font-black text-empire mb-2">
                          1
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-white">{lang === 'fr' ? 'clic pour publier' : 'click to publish'}</p>
                        <p className="text-sm text-neutral-400 mt-2">{lang === 'fr' ? 'Tout est déjà programmé' : 'Everything is pre-scheduled'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInBlock>
          </div>

          {/* Bottom CTA - Time Saved Summary */}
          <FadeInBlock delay={0.4}>
            <div className="mt-12 md:mt-16 text-center">
              <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-empire/20 border border-green-500/30">
                <Zap className="text-empire" size={28} />
                <div className="text-left">
                  <p className="text-sm text-neutral-400">{lang === 'fr' ? 'Temps économisé chaque semaine' : 'Time saved every week'}</p>
                  <p className="text-2xl md:text-3xl font-black text-white">
                    <span className="text-green-400">39h 45min</span>
                  </p>
                </div>
              </div>
            </div>
          </FadeInBlock>
        </div>
      </div>
    </section>
  )
}
