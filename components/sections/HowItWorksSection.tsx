'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { AnimatedBeam } from '@/components/magicui/animated-beam'
import Marquee from '@/components/magicui/marquee'
import { Mic, Brain, Wand2, Rocket, Linkedin, Youtube, Instagram, Mail, Video } from 'lucide-react'

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

const platforms = [
  { icon: Linkedin, name: 'LinkedIn', color: '#0A66C2' },
  { icon: Youtube, name: 'YouTube', color: '#FF0000' },
  { icon: Instagram, name: 'Instagram', color: '#E4405F' },
  { icon: Mail, name: 'Newsletter', color: '#DAFC68' },
  { icon: Video, name: 'TikTok', color: '#000000' },
  { icon: Video, name: 'Reels', color: '#E4405F' },
]

export default function HowItWorksSection() {
  const { t } = useLanguage()
  
  return (
    <section className="container py-20 md:py-32">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Title */}
        <FadeInBlock>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t.howItWorksPage?.title || 'How Empire Works'}
            </h2>
            <p className="text-xl text-neutral-300">
              {t.howItWorksPage?.subtitle || 'One interview a week → 30+ pieces of content → posted everywhere'}
            </p>
          </div>
        </FadeInBlock>

        {/* Flow Diagram */}
        <FadeInBlock delay={0.1}>
          <div className="relative">
            {/* Desktop Flow */}
            <div className="hidden md:grid grid-cols-4 gap-8 relative py-12">
              {/* SVG for beams - positioned absolutely */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                {/* Beam 1 to 2 */}
                <motion.path
                  d="M 240 60 L 400 60"
                  stroke="url(#gradient-beam)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                />
                {/* Beam 2 to 3 */}
                <motion.path
                  d="M 560 60 L 720 60"
                  stroke="url(#gradient-beam)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.3, repeat: Infinity, repeatDelay: 1 }}
                />
                {/* Beam 3 to 4 */}
                <motion.path
                  d="M 880 60 L 1040 60"
                  stroke="url(#gradient-beam)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.6, repeat: Infinity, repeatDelay: 1 }}
                />
                
                <defs>
                  <linearGradient id="gradient-beam" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="50%" stopColor="#DAFC68" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Step 1 */}
              <div className="relative z-10 text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire flex items-center justify-center mb-4">
                  <Mic className="text-empire" size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">{t.howItWorksPage?.step1Title || 'Interview'}</h3>
                <p className="text-sm text-neutral-400">{t.howItWorksPage?.step1Desc || '30 min call, just talking'}</p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire flex items-center justify-center mb-4">
                  <Brain className="text-empire" size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">{t.howItWorksPage?.step2Title || 'AI Processing'}</h3>
                <p className="text-sm text-neutral-400">{t.howItWorksPage?.step2Desc || 'Extract insights & ideas'}</p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire flex items-center justify-center mb-4">
                  <Wand2 className="text-empire" size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">{t.howItWorksPage?.step3Title || 'Content Creation'}</h3>
                <p className="text-sm text-neutral-400">{t.howItWorksPage?.step3Desc || 'Posts, videos, newsletters'}</p>
              </div>

              {/* Step 4 */}
              <div className="relative z-10 text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire flex items-center justify-center mb-4">
                  <Rocket className="text-empire" size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">{t.howItWorksPage?.step4Title || 'Distribution'}</h3>
                <p className="text-sm text-neutral-400">{t.howItWorksPage?.step4Desc || 'Posted everywhere'}</p>
              </div>
            </div>

            {/* Mobile Flow */}
            <div className="md:hidden space-y-6">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire flex items-center justify-center mb-4">
                  <Mic className="text-empire" size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">{t.howItWorksPage?.step1Title || 'Interview'}</h3>
                <p className="text-sm text-neutral-400">{t.howItWorksPage?.step1Desc || '30 min call, just talking'}</p>
              </div>
              
              <div className="text-center text-empire text-2xl">↓</div>
              
              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire flex items-center justify-center mb-4">
                  <Brain className="text-empire" size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">AI Processing</h3>
                <p className="text-sm text-neutral-400">Extract insights & ideas</p>
              </div>
              
              <div className="text-center text-empire text-2xl">↓</div>
              
              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire flex items-center justify-center mb-4">
                  <Wand2 className="text-empire" size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">Content Creation</h3>
                <p className="text-sm text-neutral-400">Posts, videos, newsletters</p>
              </div>
              
              <div className="text-center text-empire text-2xl">↓</div>
              
              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire flex items-center justify-center mb-4">
                  <Rocket className="text-empire" size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">Distribution</h3>
                <p className="text-sm text-neutral-400">Posted everywhere</p>
              </div>
            </div>
          </div>
        </FadeInBlock>

        {/* Platforms Marquee */}
        <FadeInBlock delay={0.2}>
          <div className="py-12">
            <h3 className="text-center text-xl font-semibold mb-8 text-neutral-400">
              {t.howItWorksPage?.platformsTitle || 'We post to all your platforms'}
            </h3>
            <Marquee className="py-4" pauseOnHover>
              {platforms.map((platform, i) => {
                const Icon = platform.icon
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all min-w-[180px]"
                  >
                    <Icon className="text-empire" size={24} />
                    <span className="font-semibold">{platform.name}</span>
                  </div>
                )
              })}
            </Marquee>
          </div>
        </FadeInBlock>

        {/* Key Benefits */}
        <FadeInBlock delay={0.3}>
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10">
              <div className="text-3xl font-bold text-empire mb-2">15 min</div>
              <p className="text-neutral-300">{t.howItWorksPage?.stat1 || 'Your time investment per week'}</p>
            </div>
            
            <div className="p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10">
              <div className="text-3xl font-bold text-empire mb-2">30+</div>
              <p className="text-neutral-300">{t.howItWorksPage?.stat2 || 'Pieces of content created'}</p>
            </div>
            
            <div className="p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10">
              <div className="text-3xl font-bold text-empire mb-2">6+</div>
              <p className="text-neutral-300">{t.howItWorksPage?.stat3 || 'Platforms covered'}</p>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

