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

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 flex flex-col items-center justify-center gap-2"
          >
            <button
              data-cal-namespace={namespace}
              data-cal-link={calLink}
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className={`w-full sm:w-auto px-8 py-4 font-bold rounded-xl hover:scale-105 transition-all text-center ${
                autopilot
                  ? 'bg-gradient-to-r from-autopilot to-autopilot text-black shadow-[0_0_30px_rgba(212,165,116,0.4)]'
                  : 'bg-empire text-black shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.3)]'
              }`}
            >
              {heroCta}
            </button>
            <p className="text-[11px] text-neutral-400">
              {lang === 'fr' ? '300 000 vues garanties · 45 min' : '300K views guaranteed · 45 min'}
            </p>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-3xl mx-auto">
                {/* Grant Cardone */}
                <div className="flex flex-col items-center gap-2 px-3 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neutral-800 overflow-hidden">
                  <img 
                    src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4295dabe20aff6b9885_Cardone.webp"
                    alt="Grant Cardone"
                      className="w-full h-full object-cover"
                      loading="lazy"
                  />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] md:text-xs font-bold text-white group-hover:text-empire transition-colors">Grant Cardone</p>
                    <p className="text-[9px] md:text-[10px] text-neutral-400">~€100K/mo</p>
                  </div>
                </div>

                {/* Alex Hormozi */}
                <div className="flex flex-col items-center gap-2 px-3 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neutral-800 overflow-hidden">
                  <img 
                    src="https://yt3.googleusercontent.com/29XFUn3pc3cC81yUUCFiyCKKdgi856IGMJ4EZBnf53zTfrWWUGvmYnYGx86K08f4XR03UxpWyw=s900-c-k-c0x00ffffff-no-rj"
                    alt="Alex Hormozi"
                      className="w-full h-full object-cover"
                      loading="lazy"
                  />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] md:text-xs font-bold text-white group-hover:text-empire transition-colors">Alex Hormozi</p>
                    <p className="text-[9px] md:text-[10px] text-neutral-400">~€80K/mo</p>
                  </div>
                </div>

                {/* Ali Abdaal */}
                <div className="flex flex-col items-center gap-2 px-3 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neutral-800 overflow-hidden">
                  <img 
                    src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4d436f96370e8ccb7c4_Abdaal.webp"
                    alt="Ali Abdaal"
                      className="w-full h-full object-cover"
                      loading="lazy"
                  />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] md:text-xs font-bold text-white group-hover:text-empire transition-colors">Ali Abdaal</p>
                    <p className="text-[9px] md:text-[10px] text-neutral-400">~€75K/mo</p>
                  </div>
                </div>

                {/* Matt Gray */}
                <div className="flex flex-col items-center gap-2 px-3 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neutral-800 overflow-hidden">
                  <img 
                    src="https://yt3.googleusercontent.com/W_GKaSoEuny3REkdSVW-AD6wcB_z5Ltr3hY_Mos94yDKlFLupVnJ6Gf8w1YfjEGps2nr62fB=s160-c-k-c0x00ffffff-no-rj"
                    alt="Matt Gray"
                      className="w-full h-full object-cover"
                      loading="lazy"
                  />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] md:text-xs font-bold text-white group-hover:text-empire transition-colors">Matt Gray</p>
                    <p className="text-[9px] md:text-[10px] text-neutral-400">~€60K/mo</p>
                  </div>
                </div>

                {/* Chris Williamson - Hidden on smallest screens, visible from sm */}
                <div className="flex flex-col items-center gap-2 px-3 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group col-span-2 sm:col-span-1">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neutral-800 overflow-hidden">
                  <img 
                    src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4d4f950bcf495c7dfb2_Williamson.webp"
                    alt="Chris Williamson"
                      className="w-full h-full object-cover"
                      loading="lazy"
                  />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] md:text-xs font-bold text-white group-hover:text-empire transition-colors">Chris Williamson</p>
                    <p className="text-[9px] md:text-[10px] text-neutral-400">~€70K/mo</p>
                  </div>
                </div>
              </div>
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
        <div className="mt-12 md:mt-16">
          <MediaCredibilityStrip />
        </div>
        </div>
      </section>
    </>
  )
}
