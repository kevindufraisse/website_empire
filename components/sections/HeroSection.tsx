'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { Meteors } from '@/components/magicui/meteors'
import { SocialIcons } from '@/components/ui/social-icons'
// Même jeu de portraits que `/vsl` et `FormatsShowcaseSection` (public/creators).
const HERO_CREATORS = [
  { name: 'Alex Hormozi', img: '/creators/hormozi.jpg' },
  { name: 'Matt Gray', img: '/creators/gray.jpg' },
  { name: 'Ali Abdaal', img: '/creators/abdaal.webp' },
  { name: 'Justin Welsh', img: '/creators/welsh.webp' },
  { name: 'Dan Koe', img: '/creators/koe.webp' },
]

const RetroGrid = dynamic(() => import('@/components/magicui/retro-grid'), { ssr: false })

export default function HeroSection() {
  const { t, lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const heroBadge = autopilot ? t.autopilot.hero.targetAudience : t.hero.targetAudience
  const heroTitle = autopilot ? t.autopilot.hero.title : t.hero.title
  // Hors autopilot, pas de paragraphe : la formule (floue) prend sa place et
  // invite à scroller. Voir `FormulaBar` et le slot `formula-hero-slot`.
  const heroSubtitle = autopilot ? t.autopilot.hero.subtitle : null
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
              className="mt-3 text-lg sm:text-xl md:text-2xl font-medium text-neutral-300 max-w-2xl mx-auto text-balance"
            >
              {t.hero.titleNote}
            </motion.p>
          )}

          {/* La formule, en mode secret : `FormulaBar` se rend ici (portal)
              tant qu'on est dans le hero, tout flou, puis file en bas de
              l'écran au scroll et se révèle section par section. La hauteur
              est réservée pour que le hero ne saute pas quand elle part. */}
          {/* Bénéfices en glass, discret */}
          {!autopilot && (
            <motion.div
              initial={mounted ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-5 flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-neutral-400 sm:text-xs"
            >
              {(lang === 'fr'
                ? ['1 an de R&D', '10 000+ posts testés', '1M de vues garanties']
                : ['1 year of R&D', '10,000+ posts tested', '1M views guaranteed']
              ).map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 backdrop-blur-sm">{item}</span>
              ))}
            </motion.div>
          )}

          {/* "Grâce à cette formule" avec flèche manuscrite courbée */}
          {!autopilot && (
            <motion.div
              initial={mounted ? { opacity: 0, y: 6 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 flex items-end justify-center gap-1.5"
            >
              <span className="text-sm italic text-neutral-400 sm:text-base">
                {lang === 'fr' ? 'Grâce à cette formule' : 'Thanks to this formula'}
              </span>
              <svg width="24" height="32" viewBox="0 0 24 32" fill="none" className="-mb-1 text-empire">
                <path d="M4 4 C6 12, 18 14, 14 22 C12 26, 12 28, 12 30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" strokeDasharray="2 3" />
                <path d="M8 27 L12 31 L15 26" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </motion.div>
          )}

          {!autopilot && (
            <div
              id="formula-hero-slot"
              className="mt-1 flex min-h-[80px] items-start justify-center sm:min-h-[76px]"
            />
          )}

          {!autopilot && (
            <motion.div
              initial={mounted ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-2 flex items-center justify-center gap-2"
            >
              <span className="text-[11px] text-neutral-500">{lang === 'fr' ? 'Adapté pour' : 'Adapted for'}</span>
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
                /* Un seul bouton, pas d'input : le hero démontre, l'email se
                   saisit sur la page de candidature. */
                <a
                  href="/postuler"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-empire px-8 py-4 text-base font-bold text-black shadow-[0_0_30px_rgb(var(--empire-rgb)_/_0.35)] transition-all hover:brightness-110 sm:w-auto"
                >
                  {lang === 'fr' ? 'Recevoir un accès' : 'Get access'}
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </a>
              )}
            </div>
            {/* Preuve alignée sur la promesse : la promesse est « les formats
                qui marchent déjà », donc les visages des créateurs dont on
                réplique les formats, pas la pastille du fondateur - elle vit
                dans la section fondateur plus bas. Fichiers locaux, jamais de
                hotlink : un avatar cassé dans le hero est le pire endroit. */}
            <div className="mt-1 flex justify-center">
              <div className="flex max-w-full items-center gap-3 sm:gap-4 px-3.5 py-2 pl-2 rounded-full bg-white/5 border border-white/10">
                <div className="flex shrink-0 -space-x-2">
                  {HERO_CREATORS.map((c) => (
                    <img
                      key={c.name}
                      src={c.img}
                      alt={c.name}
                      title={c.name}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-black bg-neutral-800"
                      loading="eager"
                      width={40}
                      height={40}
                    />
                  ))}
                </div>
                <span className="text-[11px] sm:text-xs text-neutral-300 text-left leading-snug">
                  {lang === 'fr'
                    ? <>Ils utilisent cette formule. <span className="text-neutral-500">Prête à utiliser pour vous.</span></>
                    : <>They use this formula. <span className="text-neutral-500">Ready for you.</span></>}
                </span>
              </div>
            </div>
          </motion.div>

          {/* L'animation voix → contenus vit désormais dans la section
              « Message » (HomeDemoSection), à la place de la vidéo. */}
        </div>
        </div>

      </section>

      {/* Flèche flottante en bas de l'écran — disparaît au scroll */}
      {!autopilot && <ScrollDownArrow lang={lang} />}
    </>
  )
}

function ScrollDownArrow({ lang }: { lang: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const slot = document.getElementById('formula-hero-slot')
    const onScroll = () => {
      if (slot) {
        setVisible(slot.getBoundingClientRect().top > 96)
      } else {
        const main = document.querySelector('main')
        const scrolled = main ? -main.getBoundingClientRect().top : 0
        setVisible(scrolled < 80)
      }
    }
    const t = setTimeout(onScroll, 600)
    document.addEventListener('scroll', onScroll, { passive: true, capture: true })
    return () => {
      clearTimeout(t)
      document.removeEventListener('scroll', onScroll, { capture: true })
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-arrow"
          type="button"
          onClick={() => document.getElementById('formula-message')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-x-0 bottom-20 z-[60] mx-auto flex w-fit flex-col items-center gap-0.5 sm:bottom-8"
        >
          <motion.span
            aria-hidden
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center text-empire drop-shadow-[0_0_12px_rgb(var(--empire-rgb)_/_0.7)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="-mt-2.5 opacity-50"><path d="M6 9l6 6 6-6" /></svg>
          </motion.span>
          <span className="mt-1 text-[10px] font-medium tracking-wide text-neutral-500">
            {lang === 'fr' ? 'Scrollez pour découvrir la formule' : 'Scroll to discover the formula'}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
