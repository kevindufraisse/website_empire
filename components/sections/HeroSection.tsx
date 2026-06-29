'use client'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import RetroGrid from '@/components/magicui/retro-grid'
import { Meteors } from '@/components/magicui/meteors'
import { StarRating } from '@/components/ui/star-rating'
import { getCalApi } from "@calcom/embed-react"
import { useCalLink } from '@/hooks/useCalLink'
import MediaCredibilityStrip from '@/components/MediaCredibilityStrip'
import Marquee from '@/components/magicui/marquee'
import { SocialIcons } from '@/components/ui/social-icons'

function LazyLoom() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '200px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="mt-8 w-full max-w-4xl mx-auto"
    >
      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900/50 backdrop-blur-sm" style={{ paddingBottom: '56.25%' }}>
        {isInView ? (
          <iframe
            src="https://www.loom.com/embed/9751f76501dc436f8728f46736d7aea8?hideEmbedTopBar=true&hide_owner=true&hide_share=true&hide_speed=true&hide_title=true&t=0"
            frameBorder="0"
            allowFullScreen
            allow="autoplay"
            className="absolute inset-0 w-full h-full"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
        )}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-black to-transparent pointer-events-none" />
      </div>
    </motion.div>
  )
}

export default function HeroSection() {
  const { t, lang } = useLanguage()
  const { autopilot } = useAutopilot()
  
  const namespace = 'audit-empire'
  const calLink = useCalLink()

  const heroTitle = autopilot ? t.autopilot.hero.title : t.hero.title
  const heroSubtitle = autopilot ? t.autopilot.hero.subtitle : t.hero.subtitle
  const heroCta = autopilot ? t.autopilot.hero.cta1 : t.hero.cta1

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace })
      cal("ui", { 
        hideEventTypeDetails: false, 
        layout: "month_view",
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#dafc68" },
          dark: { "cal-brand": "#dafc68" }
        }
      })
    })()
  }, [namespace])
  return (
    <>
      <section className="relative w-full pt-20 md:pt-24 pb-20 md:pb-28 overflow-hidden bg-gradient-to-b from-black via-transparent to-[#0f0f0f]">
        <div className="container">
        <RetroGrid />
        <Meteors number={15} />
        <div className={`absolute inset-0 transition-opacity duration-500 ${autopilot ? 'opacity-0' : 'opacity-100'} bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.15),transparent)]`} />
        <div className={`absolute inset-0 transition-opacity duration-500 ${autopilot ? 'opacity-100' : 'opacity-0'} bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(212,165,116,0.18),transparent)]`} />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">

          {/* Creator badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mb-7 flex justify-center"
          >
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <img
                src="/founders/kevin.jpg"
                alt="Kevin Dufraisse"
                className="w-7 h-7 rounded-full object-cover"
                loading="lazy"
              />
              <span className="text-xs text-neutral-300">
                {lang === 'fr'
                  ? 'Créé par Kevin Dufraisse · Top 48 LinkedIn France'
                  : 'Built by Kevin Dufraisse · Top 48 LinkedIn France'}
              </span>
            </div>
          </motion.div>
          
          <AnimatePresence mode="wait">
            <motion.h1
              key={heroTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
              dangerouslySetInnerHTML={{ __html: heroTitle.replace(/<br\/>/g, '<br>') }}
            />
          </AnimatePresence>

          {/* Platform logos strip - right under the title */}
          {!autopilot && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mt-6 flex items-center justify-center gap-2"
            >
              <span className="text-[11px] text-neutral-500">{lang === 'fr' ? 'Publié sur' : 'Published on'}</span>
              <div className="flex items-center gap-3 opacity-60">
                <SocialIcons.linkedin />
                <SocialIcons.youtube />
                <SocialIcons.instagram />
                <SocialIcons.newsletter />
                <SocialIcons.twitter />
                <SocialIcons.threads />
                <SocialIcons.facebook />
              </div>
            </motion.div>
          )}

          {/* Subtitle */}
          {heroSubtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="mt-7 text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: heroSubtitle }}
            />
          )}

          {/* CTA + Vu sur side by side */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 flex flex-col md:flex-row items-center justify-center gap-5 md:gap-12"
          >
            <button
              data-cal-namespace={namespace}
              data-cal-link={calLink}
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className={`group w-full sm:w-auto px-8 py-4 font-bold rounded-xl hover:scale-105 transition-all text-center flex flex-col items-center gap-1 shrink-0 ${
                autopilot
                  ? 'bg-gradient-to-r from-autopilot to-autopilot text-black shadow-[0_0_30px_rgba(212,165,116,0.4)]'
                  : 'bg-empire text-black shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.3)]'
              }`}
            >
              <span className="flex items-center gap-2">
                {heroCta}
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
              <span className="text-[11px] font-semibold opacity-70">{lang === 'fr' ? 'Satisfait ou remboursé' : 'Satisfaction guaranteed'}</span>
            </button>
            <MediaCredibilityStrip />
          </motion.div>
            




          {/* Video Loom - FR only, hidden in Autopilot - lazy loaded */}
          {lang === 'fr' && !autopilot && <LazyLoom />}
        </div>
        </div>
      </section>
    </>
  )
}
