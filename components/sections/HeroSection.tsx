'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { Meteors } from '@/components/magicui/meteors'
import { SocialIcons } from '@/components/ui/social-icons'
import WaitlistEmailCta from '@/components/WaitlistEmailCta'

// Même jeu de portraits que `/vsl` et `FormatsShowcaseSection` (public/creators).
const HERO_CREATORS = [
  { name: 'Alex Hormozi', img: '/creators/hormozi.jpg' },
  { name: 'Matt Gray', img: '/creators/gray.jpg' },
  { name: 'Ali Abdaal', img: '/creators/abdaal.webp' },
  { name: 'Justin Welsh', img: '/creators/welsh.webp' },
  { name: 'Dan Koe', img: '/creators/koe.webp' },
]

const RetroGrid = dynamic(() => import('@/components/magicui/retro-grid'), { ssr: false })
const VoiceToContentAnimation = dynamic(() => import('@/components/VoiceToContentAnimation'), { ssr: false })

export default function HeroSection() {
  const { t, lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const heroBadge = autopilot ? t.autopilot.hero.targetAudience : t.hero.targetAudience
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

          {/* Sans libellé, la pastille bordée resterait visible et vide. */}
          {heroBadge && (
            <motion.div
              initial={mounted ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4 flex justify-center"
            >
              <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold ${
                autopilot
                  ? 'border-autopilot/40 bg-autopilot/10 text-autopilot'
                  : 'border-empire/40 bg-empire/10 text-empire'
              }`}>
                {heroBadge}
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
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.15]"
              dangerouslySetInnerHTML={{ __html: heroTitle.replace(/<br\/>/g, '<br>') }}
            />
          </AnimatePresence>

          {!autopilot && t.hero.titleNote && (
            <motion.p
              initial={mounted ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-3 text-lg sm:text-xl md:text-2xl font-medium text-neutral-300 max-w-2xl mx-auto"
            >
              {t.hero.titleNote}
            </motion.p>
          )}

          {/* Platform logos strip - right under the title */}
          {!autopilot && (
            <motion.div
              initial={mounted ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mt-5 flex items-center justify-center gap-2"
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
              className="mt-5 text-[15px] sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed"
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
            <div className="w-full flex justify-center px-1">
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
                <WaitlistEmailCta />
              )}
            </div>
            {/* Preuve alignée sur la promesse : la promesse est « les formats
                qui marchent déjà », donc les visages des créateurs dont on
                réplique les formats, pas la pastille du fondateur - elle vit
                dans la section fondateur plus bas. Fichiers locaux, jamais de
                hotlink : un avatar cassé dans le hero est le pire endroit. */}
            <div className="-mt-3 flex justify-center">
              <div className="flex items-center gap-3 px-3 py-1.5 pl-1.5 rounded-full bg-white/5 border border-white/10">
                <div className="flex -space-x-2.5">
                  {HERO_CREATORS.map((c) => (
                    <img
                      key={c.name}
                      src={c.img}
                      alt={c.name}
                      title={c.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-black bg-neutral-800"
                      loading="eager"
                      width={32}
                      height={32}
                    />
                  ))}
                </div>
                <span className="text-xs text-neutral-300 text-left">
                  {lang === 'fr'
                    ? <>Les formats de Hormozi, Matt Gray, Ali Abdaal… <span className="text-neutral-500">adaptés à votre expertise</span></>
                    : <>The formats of Hormozi, Matt Gray, Ali Abdaal… <span className="text-neutral-500">adapted to your expertise</span></>}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Cascade strip + voice-to-content animation */}
          {!autopilot && (
            <motion.div
              initial={mounted ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 w-full max-w-4xl mx-auto"
            >
              <div className="mb-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 sm:text-xs">
                {(lang === 'fr'
                  ? ['1 idée', '1 contenu', '10+ contenus', 'Tous vos réseaux']
                  : ['1 idea', '1 piece', '10+ pieces', 'Every network']
                ).map((step, i, arr) => (
                  <span key={step} className="inline-flex items-center gap-2">
                    <span className={i === arr.length - 1 ? 'text-empire' : 'text-neutral-300'}>{step}</span>
                    {i < arr.length - 1 && <span className="text-neutral-600">→</span>}
                  </span>
                ))}
              </div>
              <VoiceToContentAnimation />
            </motion.div>
          )}

        </div>
        </div>
      </section>

    </>
  )
}
