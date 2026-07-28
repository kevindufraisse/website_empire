'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { Meteors } from '@/components/magicui/meteors'
import { SocialIcons } from '@/components/ui/social-icons'
import OnboardingLink from '@/components/OnboardingLink'

const RetroGrid = dynamic(() => import('@/components/magicui/retro-grid'), { ssr: false })
const VoiceToContentAnimation = dynamic(() => import('@/components/VoiceToContentAnimation'), { ssr: false })

export default function HeroSection() {
  const { t, lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const heroTitle = autopilot ? t.autopilot.hero.title : t.hero.title
  const heroSubtitle = autopilot ? t.autopilot.hero.subtitle : t.hero.subtitle
  const heroCta = autopilot ? t.autopilot.hero.cta1 : t.hero.cta1

  return (
    <>
      <section className="relative w-full pt-20 md:pt-24 pb-20 md:pb-28 overflow-hidden bg-gradient-to-b from-black via-transparent to-[#0f0f0f]">
        <div className="container">
        <RetroGrid />
        <Meteors number={8} />
        <div className={`absolute inset-0 transition-opacity duration-500 ${autopilot ? 'opacity-0' : 'opacity-100'} bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.15),transparent)]`} />
        <div className={`absolute inset-0 transition-opacity duration-500 ${autopilot ? 'opacity-100' : 'opacity-0'} bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(212,165,116,0.18),transparent)]`} />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">

          {autopilot && (
            <motion.div
              initial={mounted ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-5 flex justify-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-autopilot/40 bg-autopilot/10 px-4 py-1.5 text-xs font-bold text-autopilot">
                {t.autopilot.hero.targetAudience}
              </span>
            </motion.div>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.h1
              key={heroTitle}
              initial={mounted ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
              dangerouslySetInnerHTML={{ __html: heroTitle.replace(/<br\/>/g, '<br>') }}
            />
          </AnimatePresence>

          {/* Platform logos strip - right under the title */}
          {!autopilot && (
            <motion.div
              initial={mounted ? { opacity: 0, y: 10 } : false}
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
              initial={mounted ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="mt-7 text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: heroSubtitle }}
            />
          )}

          {/* CTA centered + Vu sur below */}
          <motion.div
            initial={mounted ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 flex flex-col items-center gap-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              {autopilot ? (
                <a
                  href="/join-us"
                  className="group w-full sm:w-auto px-8 py-4 font-bold rounded-xl hover:scale-105 transition-all text-center flex flex-col items-center gap-1 shrink-0 bg-autopilot text-black shadow-[0_0_30px_rgba(212,165,116,0.4)]"
                >
                  <span className="flex items-center gap-2">
                    {heroCta}
                    <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                  <span className="text-[11px] font-semibold opacity-70">{t.autopilot.hero.ctaReassurance}</span>
                </a>
              ) : (
                <OnboardingLink className="group w-full sm:w-auto px-8 py-4 font-bold rounded-xl hover:scale-105 transition-all text-center flex flex-col items-center gap-1 shrink-0 bg-empire text-black shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.3)]">
                  <span className="flex items-center gap-2">
                    {heroCta}
                    <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                  <span className="text-[11px] font-semibold opacity-70">{lang === 'fr' ? 'Sans engagement · Annulez en 1 clic' : 'No commitment · Cancel in 1 click'}</span>
                </OnboardingLink>
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
                    ? 'Créé par Kevin Dufraisse · Top 55 LinkedIn France'
                    : 'Built by Kevin Dufraisse · Top 55 LinkedIn France'}
                </span>
              </div>
            </div>
            {autopilot && (
              <div className="flex items-center justify-center gap-6">
                {[
                  { name: 'Ippon Technologies', src: '/logos/ippon.png' },
                  { name: 'Socratiz', src: '/logos/presse-agence.png' },
                  { name: 'The Sanctuary Group', src: '/logos/sanctuary.png' },
                ].map((l) => (
                  <img
                    key={l.name}
                    src={l.src}
                    alt={l.name}
                    className="h-5 w-auto object-contain brightness-0 invert opacity-40"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Voice-to-content animation in place of the video */}
          {!autopilot && (
            <motion.div
              initial={mounted ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 w-full max-w-4xl mx-auto"
            >
              <VoiceToContentAnimation />
            </motion.div>
          )}

        </div>
        </div>
      </section>

    </>
  )
}
