'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, forwardRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { AnimatedBeam } from '@/components/magicui/animated-beam'
import { SparklesText } from '@/components/magicui/sparkles-text'
import { LinkedInPost, InstagramReel, InstagramCarousel, YouTubeShort, TwitterThread } from '@/components/ui/post-preview'
import Marquee from '@/components/magicui/marquee'
import { FileText, Bell, Mic as MicIcon, Calendar, Linkedin, Mail, Video, Instagram, Image, Mic } from 'lucide-react'
import { SocialIcons } from '@/components/ui/social-icons'
import { cn } from '@/lib/utils'

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'z-10 flex items-center justify-center rounded-full border-2 border-empire bg-gradient-to-br from-empire/20 to-empire/5 p-3 backdrop-blur-sm',
        className
      )}
    >
      {children}
    </div>
  )
})
Circle.displayName = 'Circle'

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

const getTransformations = (t: any) => [
  {
    title: t.featureDetails.previews.linkedinPost,
    icon: SocialIcons.linkedin,
    description: t.featureDetails.previews.linkedinPostDesc,
  },
  {
    title: t.featureDetails.previews.newsletter,
    icon: SocialIcons.newsletter,
    description: t.featureDetails.previews.newsletterDesc,
  },
  {
    title: t.featureDetails.previews.instagramReel,
    icon: SocialIcons.instagram,
    description: t.featureDetails.previews.instagramReelDesc,
    isReel: true,
  },
  {
    title: t.featureDetails.previews.youtubeShort,
    icon: SocialIcons.youtube,
    description: t.featureDetails.previews.youtubeShortDesc,
  },
  {
    title: t.featureDetails.previews.twitterThread,
    icon: SocialIcons.twitter,
    description: t.featureDetails.previews.twitterThreadDesc,
  },
  {
    title: t.featureDetails.previews.threadsPost,
    icon: SocialIcons.threads,
    description: t.featureDetails.previews.threadsPostDesc,
  },
  {
    title: t.featureDetails.previews.instagramCarousel,
    icon: SocialIcons.instagram,
    description: t.featureDetails.previews.instagramCarouselDesc,
    isCarousel: true,
  },
  {
    title: t.featureDetails.previews.linkedinCarousel,
    icon: SocialIcons.linkedin,
    description: t.featureDetails.previews.linkedinCarouselDesc,
  },
  {
    title: t.featureDetails.previews.mp3Podcast,
    icon: SocialIcons.spotify,
    description: t.featureDetails.previews.mp3PodcastDesc,
  },
]

export default function FeatureDetailsSection() {
  const { t } = useLanguage()
  const transformations = getTransformations(t)
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
    <section id="voice-transformation" className="relative w-full py-20 md:py-32 bg-black">
      <div className="container">
        <div className="max-w-6xl mx-auto relative z-10">
        {/* Title */}
        <FadeInBlock>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: t.featureDetails.title }} />
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              {t.featureDetails.subtitle}
            </p>
          </div>
        </FadeInBlock>

        {/* Animated Beam Diagram + Previews */}
        <FadeInBlock delay={0.1}>
          <div className="mb-16 grid grid-cols-1 lg:grid-cols-[600px,1fr] gap-8 items-center">
            {/* Beam Diagram */}
            <div
              className="relative flex h-[400px] md:h-[500px] w-full items-center justify-center overflow-visible p-4 md:p-10"
              ref={containerRef as any}
            >
              <div className="flex size-full flex-row items-center justify-between gap-10 relative z-10">
                <div className="relative flex items-center justify-center">
                  <Circle ref={div1Ref as any} className="size-16">
                    <Mic className="text-empire" size={24} />
                  </Circle>
                  <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-neutral-400 text-center whitespace-nowrap">
                    {t.featureDetails.you15min}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <Circle ref={div7Ref as any} className="size-20">
                    <SparklesText className="text-sm font-bold text-empire whitespace-nowrap" sparklesCount={5}>
                      Empire
                    </SparklesText>
                  </Circle>
                </div>
                <div className="flex flex-col items-center justify-center gap-3">
                  <Circle ref={div2Ref as any}>
                    <SocialIcons.linkedin />
                  </Circle>
                  <Circle ref={div3Ref as any}>
                    <SocialIcons.youtube />
                  </Circle>
                  <Circle ref={div4Ref as any}>
                    <SocialIcons.instagram />
                  </Circle>
                  <Circle ref={div5Ref as any}>
                    <SocialIcons.newsletter />
                  </Circle>
                  <Circle ref={div6Ref as any}>
                    <SocialIcons.twitter />
                  </Circle>
                  <Circle ref={div8Ref as any}>
                    <SocialIcons.threads />
                  </Circle>
                </div>
              </div>

              <AnimatedBeam containerRef={containerRef as any} fromRef={div1Ref as any} toRef={div7Ref as any} duration={3} />
              <AnimatedBeam containerRef={containerRef as any} fromRef={div7Ref as any} toRef={div2Ref as any} duration={3} />
              <AnimatedBeam containerRef={containerRef as any} fromRef={div7Ref as any} toRef={div3Ref as any} duration={3} />
              <AnimatedBeam containerRef={containerRef as any} fromRef={div7Ref as any} toRef={div4Ref as any} duration={3} />
              <AnimatedBeam containerRef={containerRef as any} fromRef={div7Ref as any} toRef={div5Ref as any} duration={3} />
              <AnimatedBeam containerRef={containerRef as any} fromRef={div7Ref as any} toRef={div6Ref as any} duration={3} />
              <AnimatedBeam containerRef={containerRef as any} fromRef={div7Ref as any} toRef={div8Ref as any} duration={3} />
            </div>

            {/* Scrolling Post Previews - Hidden on mobile */}
            <div className="hidden md:flex h-[400px] md:h-[500px] flex-col justify-center gap-4 overflow-hidden">
              <div className="[mask-image:linear-gradient(to_right,transparent_0%,#000_5%,#000_95%,transparent_100%)]">
                <Marquee pauseOnHover className="[--duration:25s]">
                  <div className="flex gap-4">
                    <div className="blur-[0.8px] hover:blur-none transition-all duration-300 scale-90">
                      <LinkedInPost />
                    </div>
                    <div className="blur-[0.8px] hover:blur-none transition-all duration-300 scale-90">
                      <TwitterThread />
                    </div>
                  </div>
                </Marquee>
              </div>
              
              <div className="[mask-image:linear-gradient(to_right,transparent_0%,#000_5%,#000_95%,transparent_100%)]">
                <Marquee reverse pauseOnHover className="[--duration:20s]">
                  <div className="flex gap-4">
                    <div className="blur-[0.8px] hover:blur-none transition-all duration-300 scale-90">
                      <InstagramReel />
                    </div>
                    <div className="blur-[0.8px] hover:blur-none transition-all duration-300 scale-90">
                      <InstagramCarousel />
                    </div>
                    <div className="blur-[0.8px] hover:blur-none transition-all duration-300 scale-90">
                      <YouTubeShort />
                    </div>
                  </div>
                </Marquee>
              </div>
            </div>
          </div>
        </FadeInBlock>

        {/* Transformation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transformations.map((item, i) => {
            const IconComponent = item.icon
            return (
              <FadeInBlock key={i} delay={0.1 + i * 0.05}>
                <div className="group p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all hover:scale-105">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="scale-90">
                      <IconComponent />
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">{item.description}</p>
                </div>
              </FadeInBlock>
            )
          })}
        </div>
      </div>
      </div>
    </section>
  )
}

