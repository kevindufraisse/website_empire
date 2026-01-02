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
    <section id="how-it-works" className="relative w-full py-20 md:py-32 overflow-hidden bg-[#0a0a0a]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(218,252,104,0.08),transparent)]" />
      
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <FadeInBlock>
            <div className="text-center mb-12 md:mb-20">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-empire/10 border border-empire/30">
                <Sparkles className="text-empire" size={16} />
                <span className="text-sm font-bold text-empire">
                  {lang === 'fr' ? 'SIMPLE COMME 1-2-3' : 'AS EASY AS 1-2-3'}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.howItWorks.title}</h2>
              <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto">
                {t.howItWorks.subtitle}
              </p>
            </div>
          </FadeInBlock>

          {/* Steps Container */}
          <div className="space-y-6 md:space-y-8">
            
            {/* STEP 1 */}
            <FadeInBlock delay={0.1}>
              <div className="relative p-6 md:p-10 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all">
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-empire to-empire/70 flex items-center justify-center shadow-[0_0_40px_rgba(218,252,104,0.3)]">
                      <span className="text-4xl md:text-6xl font-black text-black">1</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Mic className="text-empire" size={24} />
                      <h3 className="text-2xl md:text-3xl font-bold text-white">{t.howItWorks.step1.title}</h3>
                    </div>
                    <p className="text-neutral-400 mb-4">{t.howItWorks.step1.summary}</p>
                    
                    <div className="flex flex-wrap gap-3">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <Clock className="text-empire" size={16} />
                        <span className="text-sm text-white font-semibold">{t.howItWorks.step1.badge1}</span>
                      </div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <span className="text-sm text-white font-semibold">{t.howItWorks.step1.badge2}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Big Time */}
                  <div className="flex-shrink-0 text-center md:text-right">
                    <div className="inline-block p-4 md:p-6 rounded-2xl bg-empire/10 border border-empire/30">
                      <p className="text-4xl md:text-5xl font-black text-empire">
                        <NumberTicker value={15} />
                        <span className="text-2xl md:text-3xl"> min</span>
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">{lang === 'fr' ? 'c\'est tout' : 'that\'s it'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInBlock>

            {/* Arrow */}
            <div className="flex justify-center">
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="text-empire rotate-90 md:rotate-0" size={32} />
              </motion.div>
            </div>

            {/* STEP 2 */}
            <FadeInBlock delay={0.2}>
              <div className="relative p-6 md:p-10 rounded-3xl bg-gradient-to-br from-empire/10 to-purple-500/5 border border-empire/30">
                {/* Highlight Badge */}
                <div className="absolute -top-3 left-6 md:left-10 px-4 py-1 bg-empire text-black text-sm font-bold rounded-full">
                  ⭐ {lang === 'fr' ? 'LA MAGIE OPÈRE' : 'THE MAGIC HAPPENS'}
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 mt-2">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-empire to-empire/70 flex items-center justify-center shadow-[0_0_40px_rgba(218,252,104,0.3)]">
                      <span className="text-4xl md:text-6xl font-black text-black">2</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Wand2 className="text-empire" size={24} />
                      <h3 className="text-2xl md:text-3xl font-bold text-white">{t.howItWorks.step2.title}</h3>
                    </div>
                    <p className="text-neutral-400 mb-4">{t.howItWorks.step2.summary}</p>
                  </div>
                  
                  {/* Big Number */}
                  <div className="flex-shrink-0 text-center md:text-right">
                    <div className="inline-block p-4 md:p-6 rounded-2xl bg-empire/10 border border-empire/30">
                      <p className="text-4xl md:text-5xl font-black text-empire">
                        <NumberTicker value={30} />+
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">{lang === 'fr' ? 'contenus créés' : 'pieces created'}</p>
                    </div>
                  </div>
                </div>

                {/* The Machine */}
                <div className="mt-8 p-5 md:p-6 rounded-2xl bg-black/40 border border-white/10">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-empire/30 border border-empire/50 flex items-center justify-center">
                        <span className="text-xl">🧠</span>
                      </div>
                      <div>
                        <h4 className="text-base md:text-lg font-bold text-white">
                          {lang === 'fr' ? 'La Machine Empire' : 'The Empire Machine'}
                        </h4>
                        <p className="text-xs text-empire">
                          {lang === 'fr' ? 'Experts viraux clonés' : 'Viral experts cloned'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-wrap gap-2 md:gap-3 md:justify-end">
                      <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-lg font-black text-empire">50+</span>
                        <span className="text-xs text-neutral-400 ml-1">{lang === 'fr' ? 'experts' : 'experts'}</span>
                      </div>
                      <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-lg font-black text-empire">6</span>
                        <span className="text-xs text-neutral-400 ml-1">{lang === 'fr' ? 'mois R&D' : 'months R&D'}</span>
                      </div>
                      <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-lg font-black text-empire">∞</span>
                        <span className="text-xs text-neutral-400 ml-1">{lang === 'fr' ? 'posts analysés' : 'posts analyzed'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Types Grid */}
                <div className="mt-6 grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {contentTypes.map((type, i) => {
                    const IconComponent = type.icon
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        viewport={{ once: true }}
                        className="p-2 md:p-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all text-center"
                      >
                        {type.isSocialIcon ? (
                          <div className="flex justify-center mb-1 scale-75 md:scale-90">
                            <IconComponent />
                          </div>
                        ) : (
                          <IconComponent className="text-empire mx-auto mb-1" size={18} />
                        )}
                        <p className="text-lg font-bold text-empire">{type.count}</p>
                        <p className="text-[8px] md:text-[10px] text-neutral-500 leading-tight">{type.label}</p>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Human QA */}
                <div className="mt-6 p-5 md:p-6 rounded-2xl bg-gradient-to-r from-empire/5 to-transparent border border-empire/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-empire/20 border border-empire flex items-center justify-center">
                      <UserCheck className="text-empire" size={20} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">{t.howItWorks.step2.humanQA}</h4>
                      <p className="text-xs text-empire">{t.howItWorks.step2.humanQASub}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                      <p className="text-xs text-red-400 font-semibold mb-1">❌ {t.howItWorks.step2.rawAI}</p>
                      <p className="text-xs text-neutral-500 italic line-clamp-2">{t.howItWorks.step2.rawAIExample}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-empire/10 border border-empire/30">
                      <p className="text-xs text-empire font-semibold mb-1">✓ {t.howItWorks.step2.humanPolish}</p>
                      <p className="text-xs text-white line-clamp-2">{t.howItWorks.step2.humanPolishExample}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInBlock>

            {/* Arrow */}
            <div className="flex justify-center">
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              >
                <ArrowRight className="text-empire rotate-90 md:rotate-0" size={32} />
              </motion.div>
            </div>

            {/* STEP 3 */}
            <FadeInBlock delay={0.3}>
              <div className="relative p-6 md:p-10 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all">
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-empire to-empire/70 flex items-center justify-center shadow-[0_0_40px_rgba(218,252,104,0.3)]">
                      <span className="text-4xl md:text-6xl font-black text-black">3</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="text-empire" size={24} />
                      <h3 className="text-2xl md:text-3xl font-bold text-white">{t.howItWorks.step3.title}</h3>
                    </div>
                    <p className="text-neutral-400 mb-4">{t.howItWorks.step3.summary}</p>
                    
                    <div className="flex flex-wrap gap-3">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <span className="text-sm text-white font-semibold">{t.howItWorks.step3.badge1}</span>
                      </div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <span className="text-sm text-white font-semibold">{t.howItWorks.step3.badge2}</span>
                      </div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <span className="text-sm text-white font-semibold">{t.howItWorks.step3.badge3}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Big Number */}
                  <div className="flex-shrink-0 text-center md:text-right">
                    <div className="inline-block p-4 md:p-6 rounded-2xl bg-empire/10 border border-empire/30">
                      <p className="text-4xl md:text-5xl font-black text-empire">1</p>
                      <p className="text-xs text-neutral-400 mt-1">{lang === 'fr' ? 'clic pour publier' : 'click to publish'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInBlock>
          </div>

          {/* Bottom Summary */}
          <FadeInBlock delay={0.4}>
            <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20">
                <Clock className="text-red-400" size={24} />
                <div>
                  <p className="text-xs text-neutral-500">{lang === 'fr' ? 'Méthode traditionnelle' : 'Traditional method'}</p>
                  <p className="text-xl font-bold text-red-400 line-through">40h / {lang === 'fr' ? 'semaine' : 'week'}</p>
                </div>
              </div>
              
              <ArrowRight className="text-empire hidden md:block" size={24} />
              
              <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-empire/10 border border-green-500/30">
                <Zap className="text-green-400" size={24} />
                <div>
                  <p className="text-xs text-neutral-500">{lang === 'fr' ? 'Avec Empire' : 'With Empire'}</p>
                  <p className="text-xl font-bold text-green-400">15 min / {lang === 'fr' ? 'semaine' : 'week'}</p>
                </div>
              </div>
              
              <div className="px-6 py-4 rounded-2xl bg-empire/10 border border-empire/30">
                <p className="text-xs text-neutral-500">{lang === 'fr' ? 'Vous économisez' : 'You save'}</p>
                <p className="text-xl font-bold text-empire">39h 45min</p>
              </div>
            </div>
          </FadeInBlock>
        </div>
      </div>
    </section>
  )
}
