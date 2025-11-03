'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { SocialIcons } from '@/components/ui/social-icons'
import { Calendar, UserCheck, CheckCircle2, Clock, Eye, DollarSign, X as CloseIcon } from 'lucide-react'
import { InlineCTA } from '@/components/ui/inline-cta'
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

interface ContentItem {
  id: number
  platform: string
  type: string
  title: string
  scheduledDate: string
  scheduledTime: string
  verified: boolean
  published: boolean
  savingsAmount: number
}

const platformSavings: Record<string, number> = {
  linkedin: 100,
  newsletter: 150,
  youtube: 100,
  instagram: 100,
  twitter: 50,
  threads: 50,
}

// Content items will use translations
const getContentItems = (t: any): ContentItem[] => [
  {
    id: 1,
    platform: 'newsletter',
    type: 'Email',
    title: t.calendar.exampleTitles.newsletter,
    scheduledDate: 'Monday',
    scheduledTime: '6:00 AM',
    verified: true,
    published: false,
    savingsAmount: 150,
  },
  {
    id: 2,
    platform: 'linkedin',
    type: 'Post',
    title: t.calendar.exampleTitles.linkedin,
    scheduledDate: 'Monday',
    scheduledTime: '9:00 AM',
    verified: true,
    published: false,
    savingsAmount: 100,
  },
  {
    id: 3,
    platform: 'youtube',
    type: 'Short',
    title: t.calendar.exampleTitles.youtube,
    scheduledDate: 'Monday',
    scheduledTime: '3:00 PM',
    verified: true,
    published: false,
    savingsAmount: 100,
  },
  {
    id: 4,
    platform: 'instagram',
    type: 'Reel',
    title: t.calendar.exampleTitles.instagram,
    scheduledDate: 'Monday',
    scheduledTime: '5:00 PM',
    verified: true,
    published: false,
    savingsAmount: 100,
  },
  {
    id: 5,
    platform: 'twitter',
    type: 'Thread',
    title: t.calendar.exampleTitles.twitter,
    scheduledDate: 'Monday',
    scheduledTime: '7:00 PM',
    verified: true,
    published: false,
    savingsAmount: 50,
  },
]

const platformIcons: Record<string, any> = {
  linkedin: SocialIcons.linkedin,
  newsletter: SocialIcons.newsletter,
  youtube: SocialIcons.youtube,
  instagram: SocialIcons.instagram,
  twitter: SocialIcons.twitter,
  threads: SocialIcons.threads,
}

export default function CalendarSection() {
  const { t } = useLanguage()
  const [items, setItems] = useState(getContentItems(t))
  const [showSavings, setShowSavings] = useState<{ show: boolean; amount: number; platform: string } | null>(null)

  // Update items when language changes
  useEffect(() => {
    setItems(getContentItems(t))
  }, [t])

  const togglePublish = (id: number) => {
    const item = items.find(i => i.id === id)
    if (item && !item.published) {
      // Show savings popup
      setShowSavings({
        show: true,
        amount: item.savingsAmount,
        platform: item.platform,
      })
      // Auto hide after 3 seconds
      setTimeout(() => setShowSavings(null), 3000)
    }
    
    setItems(items.map(item => 
      item.id === id ? { ...item, published: !item.published } : item
    ))
  }

  return (
    <section id="calendar" className="relative w-full py-20 md:py-32 bg-gradient-to-b from-black via-[#0f0f0f] to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(218,252,104,0.08),transparent)]" />
      <div className="container">
        <div className="max-w-5xl mx-auto relative z-10">
        {/* Savings Popup */}
        <AnimatePresence>
          {showSavings && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-24 right-8 z-50 p-6 rounded-2xl bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire backdrop-blur-md shadow-[0_0_50px_rgba(218,252,104,0.3)]"
            >
              <button
                onClick={() => setShowSavings(null)}
                className="absolute top-2 right-2 text-neutral-400 hover:text-white transition-colors"
              >
                <CloseIcon size={16} />
              </button>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-empire/30 flex items-center justify-center">
                  <DollarSign className="text-empire" size={24} />
                </div>
                <div>
                  <p className="text-sm text-neutral-400">{t.calendar.youJustSaved}</p>
                  <p className="text-3xl font-bold text-empire">€{showSavings.amount}</p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-empire/30">
                <p className="text-xs text-neutral-400 mb-1">{t.calendar.costIfInHouse}</p>
                <p className="text-sm text-neutral-300">
                  {t.calendar.inHouseCosts[showSavings.platform as keyof typeof t.calendar.inHouseCosts] || ''}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Title */}
        <FadeInBlock>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              {t.calendar.title}
            </h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              {t.calendar.subtitle}
            </p>
          </div>
        </FadeInBlock>

        {/* Process Flow */}
        <FadeInBlock delay={0.1}>
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <UserCheck className="text-empire" size={20} />
              <span className="text-sm font-semibold text-white">{t.calendar.humanVerified}</span>
            </div>
            <div className="text-empire text-2xl">→</div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-empire/10 border border-empire/30">
              <Calendar className="text-empire" size={20} />
              <span className="text-sm font-semibold text-white">{t.calendar.scheduled}</span>
            </div>
            <div className="text-empire text-2xl">→</div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <CheckCircle2 className="text-empire" size={20} />
              <span className="text-sm font-semibold text-white">{t.calendar.youPublish}</span>
            </div>
          </div>
        </FadeInBlock>

        {/* Content List with Toggles */}
        <FadeInBlock delay={0.2}>
          <div className="space-y-3">
            {items.map((item, i) => {
              const Icon = platformIcons[item.platform]
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                  className={cn(
                    'p-3 rounded-xl border transition-all',
                    item.published
                      ? 'bg-gradient-to-br from-empire/10 to-transparent border-empire/30'
                      : 'bg-gradient-to-br from-white/5 to-transparent border-white/10 hover:border-white/20'
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Platform Icon */}
                    <div className="flex-shrink-0 scale-90">
                      <Icon />
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-neutral-400 uppercase">
                          {item.platform}
                        </span>
                        <span className="text-xs text-neutral-600">•</span>
                        <span className="text-xs text-neutral-500">{item.type}</span>
                        {item.verified && (
                          <>
                            <span className="text-xs text-neutral-600">•</span>
                            <div className="flex items-center gap-1">
                              <UserCheck className="text-empire" size={12} />
                              <span className="text-xs text-empire font-semibold">{t.common.verified}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-white font-medium mb-2 truncate">{item.title}</p>
                      <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{item.scheduledDate === 'Monday' ? t.calendar.monday : item.scheduledDate}</span>
                      </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{item.scheduledTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Toggle Switch - Review → Publish */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <span className={cn(
                        'text-xs font-semibold transition-colors',
                        !item.published ? 'text-neutral-300' : 'text-neutral-600'
                      )}>
                        {t.calendar.review}
                      </span>
                      <button
                        onClick={() => togglePublish(item.id)}
                        className={cn(
                          'relative w-14 h-7 rounded-full transition-all duration-300 ease-in-out',
                          item.published
                            ? 'bg-empire shadow-[0_0_15px_rgba(218,252,104,0.3)]'
                            : 'bg-white/10'
                        )}
                      >
                        <div
                          className={cn(
                            'absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out flex items-center justify-center',
                            item.published ? 'translate-x-7' : 'translate-x-0'
                          )}
                        >
                          {item.published ? (
                            <CheckCircle2 className="text-empire" size={14} />
                          ) : (
                            <Eye className="text-neutral-400" size={14} />
                          )}
                        </div>
                      </button>
                      <span className={cn(
                        'text-xs font-semibold transition-colors',
                        item.published ? 'text-empire' : 'text-neutral-600'
                      )}>
                        {t.calendar.publish}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </FadeInBlock>

          {/* CTA */}
          <FadeInBlock delay={0.4}>
            <div className="mt-12">
              <InlineCTA
                title={t.calendar.cta}
                description={t.calendar.ctaDesc}
                primaryText={t.common.startNow}
                secondaryText={t.common.watchDemo}
              />
            </div>
          </FadeInBlock>
        </div>
      </div>
      </section>
    )
  }

