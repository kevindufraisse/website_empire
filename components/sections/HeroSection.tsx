'use client'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import RetroGrid from '@/components/magicui/retro-grid'
import { Meteors } from '@/components/magicui/meteors'
import { StarRating } from '@/components/ui/star-rating'
import { getCalApi } from "@calcom/embed-react"
import CallbackButton from '@/components/CallbackButton'
import { CtaReassurance } from '@/components/ui/cta-reassurance'
import { useCalLink } from '@/hooks/useCalLink'

export default function HeroSection() {
  const { t, lang } = useLanguage()
  
  const namespace = 'audit-empire'
  const calLink = useCalLink()

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
      <section className="relative w-full pt-20 md:pt-28 pb-28 md:pb-40 overflow-hidden bg-gradient-to-b from-black via-transparent to-[#0f0f0f]">
        <div className="container">
        <RetroGrid />
        <Meteors number={15} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(218,252,104,0.15),transparent)]" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Creator badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mb-8 flex flex-col items-center gap-3"
          >
            <p className="text-xs text-neutral-400 tracking-widest uppercase">
              {t.hero.targetAudience}
            </p>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <img
                src="/founders/kevin.png"
                alt="Kevin Dufraisse"
                className="w-7 h-7 rounded-full object-cover object-top"
              />
              <span className="text-xs text-neutral-300">
                {lang === 'fr'
                  ? 'Créé par Kevin Dufraisse · Top 48 LinkedIn France'
                  : 'Built by Kevin Dufraisse · Top 48 LinkedIn France'}
              </span>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
            dangerouslySetInnerHTML={{ __html: t.hero.title.replace(/<br\/>/g, '<br>') }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mt-8"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 flex flex-col items-center justify-center gap-4"
          >
            <div className="flex flex-col items-center justify-center w-full px-4 sm:px-0 gap-3">
              <button
                data-cal-namespace={namespace}
                data-cal-link={calLink}
                data-cal-config='{"layout":"month_view","theme":"dark"}'
                className="w-full sm:w-auto px-8 py-4 bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)] text-center flex flex-col items-center gap-0.5"
              >
                <span>{t.hero.cta1}</span>
                <span className="text-[10px] font-medium text-black/50">
                  {lang === 'fr' ? 'Vérifier votre éligibilité' : 'Check your eligibility'}
                </span>
              </button>
              <CallbackButton variant="subtle" />
            </div>
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

          {t.hero.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mt-2 text-xs md:text-sm text-neutral-400 max-w-md mx-auto"
            >
              {t.hero.description}
            </motion.p>
          )}

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
              <p className="text-xs text-red-400 font-semibold mb-4">
                {t.hero?.creatorsCost || 'They pay €50-100K/month for their content systems'}
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
                    <p className="text-[9px] md:text-[10px] text-neutral-500">~€100K/mo</p>
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
                    <p className="text-[9px] md:text-[10px] text-neutral-500">~€80K/mo</p>
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
                    <p className="text-[9px] md:text-[10px] text-neutral-500">~€75K/mo</p>
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
                    <p className="text-[9px] md:text-[10px] text-neutral-500">~€60K/mo</p>
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
                    <p className="text-[9px] md:text-[10px] text-neutral-500">~€70K/mo</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Video Loom - FR only */}
          {lang === 'fr' && (
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
