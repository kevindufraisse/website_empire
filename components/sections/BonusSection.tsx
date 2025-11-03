'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Globe } from '@/components/magicui/globe'
import { DotPattern } from '@/components/magicui/dot-pattern'
import { AvatarCircles } from '@/components/magicui/avatar-circles'
import { SocialIcons } from '@/components/ui/social-icons'
import { Zap, Bot, MessageSquare, Sparkles, ArrowRight } from 'lucide-react'

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

// Fake avatars for LinkedIn conversations
const linkedinProspects = [
  { imageUrl: 'https://i.pravatar.cc/150?img=1', profileUrl: '#' },
  { imageUrl: 'https://i.pravatar.cc/150?img=2', profileUrl: '#' },
  { imageUrl: 'https://i.pravatar.cc/150?img=3', profileUrl: '#' },
  { imageUrl: 'https://i.pravatar.cc/150?img=4', profileUrl: '#' },
  { imageUrl: 'https://i.pravatar.cc/150?img=5', profileUrl: '#' },
]


export default function BonusSection() {
  const { t } = useLanguage()
  
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-black">
      <DotPattern className="opacity-50" width={20} height={20} cr={1.5} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(218,252,104,0.1),transparent)]" />
      <div className="container">
        <div className="max-w-6xl mx-auto relative z-10">
        {/* Title */}
        <FadeInBlock>
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 rounded-full bg-empire/20 border border-empire/30 mb-4">
              <p className="text-sm font-bold text-empire">{t.bonus.badge}</p>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t.bonus.title}
            </h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              {t.bonus.subtitle}
            </p>
          </div>
        </FadeInBlock>

        {/* Bonus Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Bonus 1 - API Multi-diffusion */}
          <FadeInBlock delay={0.1}>
            <div className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all overflow-hidden group flex flex-col">
              {/* Bonus Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-empire/20 border border-empire/30">
                <p className="text-xs font-bold text-empire">BONUS #1</p>
              </div>

              <div className="mb-6 flex-shrink-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire flex items-center justify-center">
                    <Zap className="text-empire" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{t.bonus.bonus1Title}</h3>
                    <p className="text-sm text-empire font-semibold">{t.bonus.bonus1Sub}</p>
                  </div>
                </div>

                <p className="text-neutral-300 mb-6 leading-relaxed">
                  {t.bonus.bonus1Description}
                </p>

                <div className="space-y-3 mb-6">
                  {t.bonus.bonus1Bullets.map((bullet: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <ArrowRight className="text-empire flex-shrink-0" size={16} />
                      <span className="text-neutral-300">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Globe + Icons */}
              <div className="flex-1 flex flex-col items-center justify-center mb-6">
                {/* Globe */}
                <div className="relative w-full max-w-md h-64 mb-6 mx-auto">
                  <Globe className="absolute inset-0" />
                </div>
                
                {/* Platform Icons below globe */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                  <div className="scale-75 opacity-80 hover:opacity-100 transition-opacity"><SocialIcons.linkedin /></div>
                  <div className="scale-75 opacity-80 hover:opacity-100 transition-opacity"><SocialIcons.youtube /></div>
                  <div className="scale-75 opacity-80 hover:opacity-100 transition-opacity"><SocialIcons.instagram /></div>
                  <div className="scale-75 opacity-80 hover:opacity-100 transition-opacity"><SocialIcons.twitter /></div>
                  <div className="scale-75 opacity-80 hover:opacity-100 transition-opacity"><SocialIcons.threads /></div>
                  <div className="scale-75 opacity-80 hover:opacity-100 transition-opacity"><SocialIcons.newsletter /></div>
                </div>
                
                {/* Automation tools */}
                <div className="flex items-center gap-2">
                  <div className="text-xs text-empire font-bold px-2 py-1 rounded bg-empire/10 border border-empire/30">
                    N8N
                  </div>
                  <div className="text-xs text-purple-400 font-bold px-2 py-1 rounded bg-purple-500/10 border border-purple-500/30">
                    Make
                  </div>
                  <div className="text-xs text-orange-400 font-bold px-2 py-1 rounded bg-orange-500/10 border border-orange-500/30">
                    Zapier
                  </div>
                </div>
              </div>

              {/* Value at bottom */}
              <div className="mt-auto">

                <div className="text-center">
                  <p className="text-xs text-neutral-500">
                    {t.bonus.value} <span className="text-empire font-bold text-base">€3,000{t.common.perMonth}</span>
                  </p>
                </div>
              </div>
            </div>
          </FadeInBlock>

          {/* Bonus 2 - AI Setter LinkedIn */}
          <FadeInBlock delay={0.2}>
            <div className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all overflow-hidden group flex flex-col">
              {/* Bonus Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-empire/20 border border-empire/30">
                <p className="text-xs font-bold text-empire">BONUS #2</p>
              </div>

              <div className="mb-6 flex-shrink-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire flex items-center justify-center">
                    <Bot className="text-empire" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{t.bonus.bonus2Title}</h3>
                    <p className="text-sm text-empire font-semibold">{t.bonus.bonus2Sub}</p>
                  </div>
                </div>

                <p className="text-neutral-300 mb-6 leading-relaxed">
                  {t.bonus.bonus2Description}
                </p>

                <div className="space-y-3 mb-6">
                  {t.bonus.bonus2Bullets.map((bullet: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <ArrowRight className="text-empire flex-shrink-0" size={16} />
                      <span className="text-neutral-300">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversation Preview */}
              <div className="space-y-2 mb-6 max-h-80 overflow-y-auto pr-2">
                {/* Message 1 - AI opens */}
                {/* Conversation stays in English as it's just an example */}
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="text-blue-400" size={14} />
                    <span className="text-[10px] font-semibold text-white">{t.bonus.aiSetterLabel}</span>
                    <span className="text-[10px] text-neutral-600">2h ago</span>
                  </div>
                  <p className="text-xs text-neutral-300">
                    Hey Sarah, saw your recent post about scaling content. Are you handling 
                    everything in-house or working with an agency?
                  </p>
                </div>

                {/* Message 2 - Prospect responds */}
                <div className="p-3 rounded-lg bg-empire/5 border border-empire/20 ml-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full bg-empire/30" />
                    <span className="text-[10px] font-semibold text-white">Sarah M.</span>
                    <span className="text-[10px] text-neutral-600">1h ago</span>
                  </div>
                  <p className="text-xs text-neutral-300">
                    Right now I'm doing it myself but it's killing me tbh. Takes so much time 
                    and I'm not even consistent
                  </p>
                </div>

                {/* Message 3 - AI qualifies */}
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="text-blue-400" size={14} />
                    <span className="text-[10px] font-semibold text-white">{t.bonus.aiSetterLabel}</span>
                    <span className="text-[10px] text-neutral-600">45m ago</span>
                  </div>
                  <p className="text-xs text-neutral-300">
                    I hear you. How much time are you spending on content per week right now?
                  </p>
                </div>

                {/* Message 4 - Prospect answers */}
                <div className="p-3 rounded-lg bg-empire/5 border border-empire/20 ml-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full bg-empire/30" />
                    <span className="text-[10px] font-semibold text-white">Sarah M.</span>
                    <span className="text-[10px] text-neutral-600">30m ago</span>
                  </div>
                  <p className="text-xs text-neutral-300">
                    Probably 8-10 hours. Writing, editing, scheduling... it never ends
                  </p>
                </div>

                {/* Message 5 - AI books call */}
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="text-blue-400" size={14} />
                    <span className="text-[10px] font-semibold text-white">{t.bonus.aiSetterLabel}</span>
                    <span className="text-[10px] text-neutral-600">Just now</span>
                  </div>
                  <p className="text-xs text-neutral-300">
                    What if you could get that down to 15 minutes/week? I can show you how. 
                    Free to chat Tuesday at 2pm?
                  </p>
                </div>

                {/* Qualified badge */}
                <div className="flex justify-center pt-2">
                  <div className="px-3 py-1 rounded-full bg-empire/20 border border-empire/30">
                    <p className="text-xs text-empire font-bold">{t.bonus.qualifiedLead}</p>
                  </div>
                </div>
              </div>

              {/* Avatar Circles */}
              <div className="flex-1 flex flex-col items-center justify-center gap-4 mb-6">
                <AvatarCircles numPeople={127} avatarUrls={linkedinProspects} />
                <p className="text-xs text-neutral-400 text-center">
                  {t.bonus.activeConversations}
                </p>
              </div>

              <div className="mt-auto text-center">
                <p className="text-xs text-neutral-500">
                  {t.bonus.value} <span className="text-empire font-bold text-base">€800{t.common.perMonth}</span>
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

