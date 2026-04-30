'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import RetroGrid from '@/components/magicui/retro-grid'
import { Meteors } from '@/components/magicui/meteors'
import { StarRating } from '@/components/ui/star-rating'
import { getCalApi } from "@calcom/embed-react"
import { useCalLink } from '@/hooks/useCalLink'
import MediaCredibilityStrip from '@/components/MediaCredibilityStrip'
import Marquee from '@/components/magicui/marquee'

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
            className="mb-5 flex justify-center"
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
          <AnimatePresence mode="wait">
            <motion.p
              key={heroSubtitle}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mt-5 mb-14"
              dangerouslySetInnerHTML={{ __html: heroSubtitle }}
            />
          </AnimatePresence>

          {/* CTA + Vu sur side by side */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 flex flex-col md:flex-row items-center justify-center gap-5 md:gap-8"
          >
            <button
              data-cal-namespace={namespace}
              data-cal-link={calLink}
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className={`w-full sm:w-auto px-8 py-4 font-bold rounded-xl hover:scale-105 transition-all text-center flex flex-col items-center gap-1 shrink-0 ${
                autopilot
                  ? 'bg-gradient-to-r from-autopilot to-autopilot text-black shadow-[0_0_30px_rgba(212,165,116,0.4)]'
                  : 'bg-empire text-black shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.3)]'
              }`}
            >
              <span>{heroCta}</span>
              <span className="text-[11px] font-semibold opacity-70">{lang === 'fr' ? '300 000 vues/mois garanties · 45 min' : '300,000 views/month guaranteed · 45 min'}</span>
            </button>
            <MediaCredibilityStrip />
          </motion.div>
            
            {/* Star Rating */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 flex justify-center"
          >
            <StarRating className="mt-2" />
          </motion.div>

          {/* Benefits stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-6"
          >
            <p className="text-[11px] text-neutral-500 text-center mb-2.5">
              {lang === 'fr' ? 'En moyenne en travaillant leur personal branding, nos créateurs remarquent :' : 'On average by working on their personal brand, our creators notice:'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {(lang === 'fr'
                ? [
                    { stat: '+100%', label: 'Closing' },
                    { stat: '+400%', label: 'Leads' },
                    { stat: '+30%', label: 'Tarifs' },
                    { stat: '+110%', label: 'CA' },
                    { stat: '+200%', label: 'Recommandations' },
                  ]
                : [
                    { stat: '+100%', label: 'Closing' },
                    { stat: '+400%', label: 'Leads' },
                    { stat: '+30%', label: 'Pricing' },
                    { stat: '+110%', label: 'Revenue' },
                    { stat: '+200%', label: 'Referrals' },
                  ]
              ).map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
                  <span className="text-sm sm:text-base font-bold text-white">{item.stat}</span>
                  <span className="text-[11px] sm:text-xs text-neutral-500 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Creators Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12"
          >
            <div className="text-center mb-6">
              <p className="text-sm text-neutral-400 mb-2">
                {t.hero?.creatorsTitle || 'The systems used by the world\'s top creators'}
              </p>
              <p className="text-xs text-empire font-semibold mb-4">
                {t.hero?.creatorsCost || 'We automated them for you - request your custom quote'}
              </p>
              <Marquee className="max-w-4xl mx-auto" pauseOnHover>
                {(lang === 'fr'
                  ? [
                      { name: 'Yomi Denzel', revenue: '~€60K/mo', src: 'https://unavatar.io/x/YomiDenzel96' },
                      { name: 'Pauline Laigneau', revenue: '~€25K/mo', src: 'https://unavatar.io/x/plaigneau' },
                      { name: 'Stan Leloup', revenue: '~€30K/mo', src: 'https://unavatar.io/x/marketingstan' },
                      { name: 'Oussama Ammar', revenue: '~€35K/mo', src: 'https://unavatar.io/x/daedalium' },
                      { name: 'Antoine BM', revenue: '~€15K/mo', src: 'https://unavatar.io/x/antoinebm' },
                    ]
                  : [
                      { name: 'Grant Cardone', revenue: '~€100K/mo', src: '/creators/cardone.webp' },
                      { name: 'Alex Hormozi', revenue: '~€80K/mo', src: '/creators/hormozi.jpg' },
                      { name: 'Ali Abdaal', revenue: '~€75K/mo', src: '/creators/abdaal.webp' },
                      { name: 'Matt Gray', revenue: '~€60K/mo', src: '/creators/gray.jpg' },
                      { name: 'Chris Williamson', revenue: '~€70K/mo', src: '/creators/williamson.webp' },
                    ]
                ).map((creator) => (
                  <div
                    key={creator.name}
                    className="flex flex-col items-center gap-2 px-4 py-3 mx-2 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group shrink-0"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neutral-800 overflow-hidden">
                      <img
                        src={creator.src}
                        alt={creator.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] md:text-xs font-bold text-white group-hover:text-empire transition-colors whitespace-nowrap">{creator.name}</p>
                      <p className="text-[9px] md:text-[10px] text-neutral-400">{creator.revenue}</p>
                    </div>
                  </div>
                ))}
              </Marquee>
            </div>
          </motion.div>


          {/* Video Loom - FR only, hidden in Autopilot */}
          {lang === 'fr' && !autopilot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-8 w-full max-w-4xl mx-auto"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900/50 backdrop-blur-sm" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src="https://www.loom.com/embed/9751f76501dc436f8728f46736d7aea8?hideEmbedTopBar=true&hide_owner=true&hide_share=true&hide_speed=true&hide_title=true&t=0"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay"
                  className="absolute inset-0 w-full h-full"
                />
                {/* Overlay to hide bottom player controls */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                {/* Overlay to hide emoji reaction button (bottom-right) */}
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-black to-transparent pointer-events-none" />
              </div>
            </motion.div>
          )}
        </div>
        </div>
      </section>
    </>
  )
}
