'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { SocialIcons } from '@/components/ui/social-icons'
import { Calendar, X, CheckCircle2 } from 'lucide-react'
import { InlineCTA } from '@/components/ui/inline-cta'

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

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Calendrier AVANT - Quelques posts éparpillés
const beforeCalendar = [
  { day: 3, platforms: ['linkedin'] },
  { day: 7, platforms: ['linkedin'] },
  { day: 12, platforms: [] },
  { day: 15, platforms: ['instagram'] },
  { day: 18, platforms: [] },
  { day: 22, platforms: ['linkedin'] },
  { day: 26, platforms: [] },
  { day: 29, platforms: ['instagram'] },
]

// Calendrier APRÈS - Tous les jours, toutes les plateformes
const afterCalendar = [
  { day: 1, platforms: ['linkedin', 'newsletter', 'youtube'] },
  { day: 2, platforms: ['instagram', 'twitter', 'threads'] },
  { day: 3, platforms: ['linkedin', 'newsletter', 'youtube', 'instagram'] },
  { day: 4, platforms: ['twitter', 'threads', 'instagram'] },
  { day: 5, platforms: ['linkedin', 'twitter', 'instagram'] },
  { day: 6, platforms: ['youtube', 'newsletter', 'threads'] },
  { day: 7, platforms: ['linkedin', 'instagram', 'twitter'] },
  { day: 8, platforms: ['newsletter', 'youtube', 'threads'] },
  { day: 9, platforms: ['linkedin', 'instagram', 'twitter'] },
  { day: 10, platforms: ['youtube', 'newsletter', 'instagram'] },
  { day: 11, platforms: ['linkedin', 'twitter', 'threads', 'instagram'] },
  { day: 12, platforms: ['linkedin', 'twitter', 'threads'] },
  { day: 13, platforms: ['instagram', 'youtube', 'newsletter'] },
  { day: 14, platforms: ['linkedin', 'twitter', 'instagram'] },
  { day: 15, platforms: ['youtube', 'newsletter', 'threads'] },
  { day: 16, platforms: ['linkedin', 'instagram', 'twitter'] },
  { day: 17, platforms: ['youtube', 'newsletter', 'instagram'] },
  { day: 18, platforms: ['linkedin', 'threads', 'twitter'] },
  { day: 19, platforms: ['linkedin', 'twitter', 'threads'] },
  { day: 20, platforms: ['instagram', 'youtube', 'newsletter'] },
  { day: 21, platforms: ['linkedin', 'twitter', 'instagram'] },
  { day: 22, platforms: ['youtube', 'newsletter', 'threads'] },
  { day: 23, platforms: ['linkedin', 'instagram', 'twitter'] },
  { day: 24, platforms: ['youtube', 'newsletter', 'instagram'] },
  { day: 25, platforms: ['linkedin', 'twitter', 'threads', 'youtube'] },
  { day: 26, platforms: ['linkedin', 'twitter', 'threads'] },
  { day: 27, platforms: ['instagram', 'youtube', 'newsletter'] },
  { day: 28, platforms: ['linkedin', 'twitter', 'instagram'] },
  { day: 29, platforms: ['youtube', 'newsletter', 'threads'] },
  { day: 30, platforms: ['linkedin', 'instagram', 'twitter'] },
]

const platformColors: Record<string, string> = {
  linkedin: 'bg-blue-500/80',
  newsletter: 'bg-empire/80',
  youtube: 'bg-red-500/80',
  instagram: 'bg-pink-500/80',
  twitter: 'bg-blue-400/80',
  threads: 'bg-neutral-400/80',
}

export default function MultiPlatformSection() {
  const { t } = useLanguage()
  
  return (
    <section id="multi-platform" className="relative w-full py-20 md:py-32 bg-black">
      <div className="container">
        <div className="max-w-6xl mx-auto relative z-10">
        {/* Title */}
        <FadeInBlock>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              {t.multiPlatform.title}
            </h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              {t.multiPlatform.subtitle}
            </p>
          </div>
        </FadeInBlock>

        {/* Before/After Calendars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* BEFORE Calendar */}
          <FadeInBlock delay={0.1}>
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/20">
              {/* Stats badges around */}
              <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 backdrop-blur-sm">
                <p className="text-xs text-red-400 font-semibold">~2K views/mo</p>
              </div>
              <div className="absolute -bottom-3 -left-3 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 backdrop-blur-sm">
                <p className="text-xs text-red-400 font-semibold">~5 leads/mo</p>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X className="text-red-400" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{t.multiPlatform.without}</h3>
                  <p className="text-sm text-neutral-400">{t.multiPlatform.doingYourself}</p>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-2">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {days.map((day, i) => (
                    <div key={i} className="text-center text-xs text-neutral-500 font-medium py-1">
                      {day.slice(0, 1)}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, i) => {
                    const day = i + 1
                    const dayData = beforeCalendar.find(d => d.day === day)
                    const hasPlatforms = dayData && dayData.platforms.length > 0

                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-md flex flex-col items-center justify-center text-xs transition-all ${
                          day > 30
                            ? 'opacity-20'
                            : hasPlatforms
                            ? 'bg-white/10 border border-white/20'
                            : 'bg-red-500/5 border border-red-500/10'
                        }`}
                      >
                        {day <= 30 && (
                          <>
                            <span className="text-neutral-400 text-[10px] mb-0.5">{day}</span>
                            {hasPlatforms && dayData.platforms.length > 0 && (
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                            )}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 pt-4 border-t border-red-500/20 text-center">
                <p className="text-sm text-neutral-500">
                  <span className="text-red-400 font-bold">4 posts</span> / month · 1-2 platforms
                </p>
              </div>
            </div>
          </FadeInBlock>

          {/* AFTER Calendar */}
          <FadeInBlock delay={0.2}>
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-empire/10 to-transparent border border-empire/30">
              {/* Stats badges around */}
              <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-lg bg-empire/20 border border-empire/50 backdrop-blur-sm shadow-[0_0_20px_rgba(218,252,104,0.2)]">
                <p className="text-xs text-empire font-bold">1M+ views/mo</p>
              </div>
              <div className="absolute -bottom-3 -left-3 px-3 py-1.5 rounded-lg bg-empire/20 border border-empire/50 backdrop-blur-sm shadow-[0_0_20px_rgba(218,252,104,0.2)]">
                <p className="text-xs text-empire font-bold">100+ leads/mo</p>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-empire/20 flex items-center justify-center">
                  <CheckCircle2 className="text-empire" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{t.multiPlatform.withEmpire}</h3>
                  <p className="text-sm text-neutral-400">{t.multiPlatform.justMinWeek}</p>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-2">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {days.map((day, i) => (
                    <div key={i} className="text-center text-xs text-neutral-500 font-medium py-1">
                      {day.slice(0, 1)}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, i) => {
                    const day = i + 1
                    const dayData = afterCalendar.find(d => d.day === day)
                    const hasPlatforms = dayData && dayData.platforms.length > 0

                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-md flex flex-col items-center justify-center p-0.5 transition-all ${
                          day > 30
                            ? 'opacity-20'
                            : hasPlatforms
                            ? 'bg-white/5 border border-empire/30 hover:border-empire/50'
                            : 'bg-white/5 border border-white/10'
                        }`}
                      >
                        {day <= 30 && (
                          <>
                            <span className="text-neutral-400 text-[9px] mb-0.5">{day}</span>
                            {hasPlatforms && (
                              <div className="flex flex-wrap gap-[1px] justify-center">
                                {dayData.platforms.slice(0, 3).map((platform, idx) => (
                                  <div
                                    key={idx}
                                    className={`w-1 h-1 rounded-full ${platformColors[platform]}`}
                                  />
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 pt-4 border-t border-empire/30 text-center">
                <p className="text-sm text-neutral-300">
                  <span className="text-empire font-bold">30+ posts</span> / month · 6+ platforms
                </p>
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center text-[10px]">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-neutral-500">LinkedIn</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-empire" />
                  <span className="text-neutral-500">Newsletter</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-neutral-500">YouTube</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-pink-500" />
                  <span className="text-neutral-500">Instagram</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-neutral-500">Twitter</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-neutral-400" />
                  <span className="text-neutral-500">Threads</span>
                </div>
              </div>
            </div>
          </FadeInBlock>
        </div>

        {/* Platform Icons */}
        <FadeInBlock delay={0.3}>
          <div className="mt-12 text-center">
            <p className="text-sm text-neutral-500 mb-4">{t.multiPlatform.publishTo}</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <div className="scale-90"><SocialIcons.linkedin /></div>
                <span>LinkedIn</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <div className="scale-90"><SocialIcons.youtube /></div>
                <span>YouTube</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <div className="scale-90"><SocialIcons.instagram /></div>
                <span>Instagram</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <div className="scale-90"><SocialIcons.newsletter /></div>
                <span>Newsletter</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <div className="scale-90"><SocialIcons.twitter /></div>
                <span>Twitter</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <div className="scale-90"><SocialIcons.threads /></div>
                <span>Threads</span>
              </div>
            </div>
          </div>
        </FadeInBlock>

          {/* CTA */}
          <FadeInBlock delay={0.4}>
            <div className="mt-12">
              <InlineCTA
                title={t.multiPlatform.cta}
                description={`83 ${t.multiPlatform.spotsLeftOf100}`}
                primaryText={t.common.startNow}
                secondaryText={t.common.watchDemo}
                urgencyLabel={t.multiPlatform.limitedSpots}
                variant="urgency"
              />
            </div>
          </FadeInBlock>
        </div>
      </div>
      </section>
    )
  }

