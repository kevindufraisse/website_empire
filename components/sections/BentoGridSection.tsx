'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, forwardRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import AnimatedList, { AnimatedListItem } from '@/components/magicui/animated-list'
import { AnimatedBeam } from '@/components/magicui/animated-beam'
import CalendarGrid from '@/components/magicui/calendar-grid'
import Marquee from '@/components/magicui/marquee'
import { SparklesText } from '@/components/magicui/sparkles-text'
import { VoiceAnimation } from '@/components/magicui/voice-animation'
import { SocialIcons } from '@/components/ui/social-icons'
import { BentoCard, BentoGrid } from '@/components/magicui/bento-grid'
import { Wand2, Bell, Mic, CalendarIcon, FileText, Video } from 'lucide-react'
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

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'z-10 flex size-12 items-center justify-center rounded-full border-2 border-empire bg-gradient-to-br from-empire/20 to-empire/5 p-3 backdrop-blur-sm',
        className
      )}
    >
      {children}
    </div>
  )
})
Circle.displayName = 'Circle'

// Notification items for animated list - will be converted to function
const getNotifications = (t: any): AnimatedListItem[] => [
  {
    id: 1,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20">
        <div className="flex-shrink-0"><SocialIcons.linkedin /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">30 LinkedIn posts</p>
          <p className="text-xs text-neutral-500">{t.bentoGrid.writtenScheduled} · {t.bentoGrid.justNow}</p>
        </div>
        <div className="text-xs text-empire font-bold">✓</div>
      </div>
    ),
  },
  {
    id: 2,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20">
        <div className="flex-shrink-0"><SocialIcons.newsletter /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">30 newsletters</p>
          <p className="text-xs text-neutral-500">{t.bentoGrid.dailyContent} · 2{t.bentoGrid.minsAgo2}</p>
        </div>
        <div className="text-xs text-empire font-bold">✓</div>
      </div>
    ),
  },
  {
    id: 3,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20">
        <div className="flex-shrink-0"><SocialIcons.video /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">30 reels/shorts</p>
          <p className="text-xs text-neutral-500">{t.bentoGrid.editedOptimized} · 5{t.bentoGrid.minsAgo2}</p>
        </div>
        <div className="text-xs text-empire font-bold">✓</div>
      </div>
    ),
  },
  {
    id: 4,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20">
        <div className="flex-shrink-0"><SocialIcons.instagram /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">30 Instagram posts</p>
          <p className="text-xs text-neutral-500">{t.bentoGrid.designedCaptioned} · 8{t.bentoGrid.minsAgo2}</p>
        </div>
        <div className="text-xs text-empire font-bold">✓</div>
      </div>
    ),
  },
  {
    id: 5,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20">
        <div className="flex-shrink-0"><SocialIcons.instagram /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">4 carousels</p>
          <p className="text-xs text-neutral-500">{t.bentoGrid.highConverting} · 12{t.bentoGrid.minsAgo2}</p>
        </div>
        <div className="text-xs text-empire font-bold">✓</div>
      </div>
    ),
  },
  {
    id: 6,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20">
        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center"><Mic className="text-empire" size={16} /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">4 MP3 podcasts</p>
          <p className="text-xs text-neutral-500">{t.bentoGrid.audioExtracted} · 15{t.bentoGrid.minsAgo2}</p>
        </div>
        <div className="text-xs text-empire font-bold">✓</div>
      </div>
    ),
  },
  {
    id: 7,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20">
        <div className="flex-shrink-0"><SocialIcons.youtube /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">4 long-form MP4 videos</p>
          <p className="text-xs text-neutral-500">{t.bentoGrid.editedWithBroll} · 18{t.bentoGrid.minsAgo2}</p>
        </div>
        <div className="text-xs text-empire font-bold">✓</div>
      </div>
    ),
  },
  {
    id: 8,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20">
        <div className="flex-shrink-0"><SocialIcons.twitter /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">10 Twitter threads</p>
          <p className="text-xs text-neutral-500">{t.bentoGrid.ideasBrokenDown} · 20{t.bentoGrid.minsAgo2}</p>
        </div>
        <div className="text-xs text-empire font-bold">✓</div>
      </div>
    ),
  },
  {
    id: 9,
    content: (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-empire/20">
        <div className="flex-shrink-0"><SocialIcons.threads /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">10 Threads posts</p>
          <p className="text-xs text-neutral-500">{t.bentoGrid.engagingContent} · 22{t.bentoGrid.minsAgo2}</p>
        </div>
        <div className="text-xs text-empire font-bold">✓</div>
      </div>
    ),
  },
]

function AnimatedBeamMultiple() {
  const containerRef = useRef<HTMLElement>(null)
  const div1Ref = useRef<HTMLElement>(null)
  const div2Ref = useRef<HTMLElement>(null)
  const div3Ref = useRef<HTMLElement>(null)
  const div4Ref = useRef<HTMLElement>(null)
  const div5Ref = useRef<HTMLElement>(null)
  const div6Ref = useRef<HTMLElement>(null)
  const div7Ref = useRef<HTMLElement>(null)
  const div8Ref = useRef<HTMLElement>(null)

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden p-10"
      ref={containerRef as any}
    >
      <div className="flex size-full max-w-2xl flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center">
          <Circle ref={div1Ref as any}>
            <Mic className="text-empire" size={18} />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref as any} className="size-16">
            <SparklesText className="text-xs font-bold text-empire whitespace-nowrap" sparklesCount={4}>
              Empire
            </SparklesText>
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div2Ref as any} className="size-10">
            <SocialIcons.linkedin />
          </Circle>
          <Circle ref={div3Ref as any} className="size-10">
            <SocialIcons.youtube />
          </Circle>
          <Circle ref={div4Ref as any} className="size-10">
            <SocialIcons.instagram />
          </Circle>
          <Circle ref={div5Ref as any} className="size-10">
            <SocialIcons.newsletter />
          </Circle>
          <Circle ref={div7Ref as any} className="size-10">
            <SocialIcons.twitter />
          </Circle>
          <Circle ref={div8Ref as any} className="size-10">
            <SocialIcons.threads />
          </Circle>
        </div>
      </div>

      <AnimatedBeam containerRef={containerRef as any} fromRef={div1Ref as any} toRef={div6Ref as any} duration={3} />
      <AnimatedBeam containerRef={containerRef as any} fromRef={div6Ref as any} toRef={div2Ref as any} duration={3} />
      <AnimatedBeam containerRef={containerRef as any} fromRef={div6Ref as any} toRef={div3Ref as any} duration={3} />
      <AnimatedBeam containerRef={containerRef as any} fromRef={div6Ref as any} toRef={div4Ref as any} duration={3} />
      <AnimatedBeam containerRef={containerRef as any} fromRef={div6Ref as any} toRef={div5Ref as any} duration={3} />
      <AnimatedBeam containerRef={containerRef as any} fromRef={div6Ref as any} toRef={div7Ref as any} duration={3} />
      <AnimatedBeam containerRef={containerRef as any} fromRef={div6Ref as any} toRef={div8Ref as any} duration={3} />
    </div>
  )
}

// Transformation examples for Marquee - will use translations
const getTransformations = (t: any) => t.features.items || []

// Note: Ces features utilisent useLanguage dans le component parent
const getFeaturesConfig = (t: any) => [
  {
    Icon: Mic,
    name: t.bentoGrid.voiceContent,
    description: t.bentoGrid.voiceContentDesc,
    href: '#voice-transformation',
    cta: t.common.learnMore,
    className: 'col-span-3 lg:col-span-1',
    background: (
      <div className="absolute inset-0">
        <VoiceAnimation />
      </div>
    ),
  },
  {
    Icon: Bell,
    name: t.bentoGrid.contentReady,
    description: t.bentoGrid.contentReadyDesc,
    href: '#content-ready',
    cta: t.common.learnMore,
    className: 'col-span-3 lg:col-span-2',
    background: (
      <div className="absolute inset-0 pt-10 px-4 [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)]">
        <AnimatedList
          items={getNotifications(t)}
          delay={1500}
          className="w-full"
        />
      </div>
    ),
  },
  {
    Icon: Wand2,
    name: t.bentoGrid.multiPlatform,
    description: t.bentoGrid.multiPlatformDesc,
    href: '#multi-platform',
    cta: t.common.learnMore,
    className: 'col-span-3 lg:col-span-2',
    background: (
      <div className="h-full w-full opacity-60">
        <AnimatedBeamMultiple />
      </div>
    ),
  },
  {
    Icon: CalendarIcon,
    name: t.bentoGrid.calendar,
    description: t.bentoGrid.calendarDesc,
    className: 'col-span-3 lg:col-span-1',
    href: '#calendar',
    cta: t.common.learnMore,
    background: (
      <div className="flex items-start justify-center pt-16 px-4 h-full">
        <div className="scale-90">
          <CalendarGrid label={t.bentoGrid.contentScheduled} />
        </div>
      </div>
    ),
  },
]

export default function BentoGridSection() {
  const { t } = useLanguage()
  const features = getFeaturesConfig(t)
  
  return (
    <section id="features" className="relative w-full section-spacing bg-gradient-to-b from-[#0f0f0f] via-black to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(218,252,104,0.1),transparent)]" />
      <div className="container">
        <div className="max-w-6xl mx-auto relative z-10">
        {/* Title */}
        <FadeInBlock>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">{t.features.title}</h2>
            <p className="text-xl text-neutral-300">
              {t.features.subtitle}
            </p>
          </div>
        </FadeInBlock>

        {/* Bento Grid */}
        <FadeInBlock delay={0.1}>
          <BentoGrid>
            {features.map((feature, idx) => (
              <BentoCard key={idx} {...feature} />
            ))}
          </BentoGrid>
        </FadeInBlock>
      </div>
      </div>
    </section>
  )
}
