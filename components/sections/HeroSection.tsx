'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import RetroGrid from '@/components/magicui/retro-grid'
import { Meteors } from '@/components/magicui/meteors'
import { StarRating } from '@/components/ui/star-rating'
import MediaCredibilityStrip from '@/components/MediaCredibilityStrip'
import Marquee from '@/components/magicui/marquee'
import { SocialIcons } from '@/components/ui/social-icons'
import OnboardingLink from '@/components/OnboardingLink'
import VoiceToContentAnimation from '@/components/VoiceToContentAnimation'
import { Play, X } from 'lucide-react'

const DEMO_URL =
  'https://www.loom.com/embed/9751f76501dc436f8728f46736d7aea8?hideEmbedTopBar=true&hide_owner=true&hide_share=true&hide_speed=true&hide_title=true&t=0'

function DemoModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-950"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
        >
          <X size={18} />
        </button>
        <div className="relative" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={DEMO_URL}
            frameBorder="0"
            allowFullScreen
            allow="autoplay"
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </div>
  )
}

export default function HeroSection() {
  const { t, lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const [showDemo, setShowDemo] = useState(false)

  const heroTitle = autopilot ? t.autopilot.hero.title : t.hero.title
  const heroSubtitle = autopilot ? t.autopilot.hero.subtitle : t.hero.subtitle
  const heroCta = autopilot ? t.autopilot.hero.cta1 : t.hero.cta1

  return (
    <>
      <section className="relative w-full pt-20 md:pt-24 pb-20 md:pb-28 overflow-hidden bg-gradient-to-b from-black via-transparent to-[#0f0f0f]">
        <div className="container">
        <RetroGrid />
        <Meteors number={15} />
        <div className={`absolute inset-0 transition-opacity duration-500 ${autopilot ? 'opacity-0' : 'opacity-100'} bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.15),transparent)]`} />
        <div className={`absolute inset-0 transition-opacity duration-500 ${autopilot ? 'opacity-100' : 'opacity-0'} bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(212,165,116,0.18),transparent)]`} />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">

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
              <div className="flex items-center gap-3 text-neutral-400 [&_path]:fill-current [&_circle]:fill-current">
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

          {/* CTA centered + Vu sur below */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 flex flex-col items-center gap-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              <OnboardingLink
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
                <span className="text-[11px] font-semibold opacity-70">{lang === 'fr' ? 'Sans engagement · Annulez en 1 clic' : 'No commitment · Cancel in 1 click'}</span>
              </OnboardingLink>
              {lang === 'fr' && !autopilot && (
                <button
                  onClick={() => setShowDemo(true)}
                  className="group w-full sm:w-auto px-8 py-4 font-bold rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:scale-105 transition-all flex items-center justify-center gap-2 self-stretch"
                >
                  <Play size={16} className="text-empire" />
                  {t.hero.cta2}
                </button>
              )}
            </div>
            {/* Creator badge */}
            <div className="-mt-3 flex justify-center">
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
            </div>
          </motion.div>

          {/* Voice-to-content animation in place of the video */}
          {!autopilot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 w-full max-w-4xl mx-auto"
            >
              <VoiceToContentAnimation />
            </motion.div>
          )}

          {/* Vu sur — media credibility below the animation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-10 flex justify-center"
          >
            <MediaCredibilityStrip />
          </motion.div>
        </div>
        </div>
      </section>

      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
    </>
  )
}
