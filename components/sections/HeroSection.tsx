'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { SocialIcons } from '@/components/ui/social-icons'
import FloatingSocialReactions from '@/components/FloatingSocialReactions'
import { trackAmplitude } from '@/lib/amplitude'
import { startFreeTrial, TRIAL_URL } from '@/lib/startTrial'
import { CTA_PRIMARY, CTA_SECONDARY, CtaPair } from '@/components/ui/cta'
import { FORMULA_TERMS } from './formulaTerms'
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
  const heroTitle = autopilot ? t.autopilot.hero.title : (lang === 'fr' ? 'L’avantage injuste pour développer ta marque personnelle.' : 'The unfair advantage for growing your personal brand.')
  const heroTitleH2 = autopilot ? null : (lang === 'fr' ? 'Sois vu, acheté et recommandé grâce à ton contenu en 1 h par semaine.' : 'Get seen, chosen and recommended through your content in one hour a week.')
  const heroTitleNote = null

  const heroSubtitle = autopilot ? t.autopilot.hero.subtitle : null
  const heroCta = autopilot ? t.autopilot.hero.cta1 : t.hero.cta1
  // Trafic chaud (setter WhatsApp, lien parrainage, email) : le visiteur arrive
  // déjà convaincu, on lui propose l'essai directement au lieu du workshop.
  const [warm, setWarm] = useState(false)
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search)
      setWarm(Boolean(p.get('ref') || p.get('wa_ref')))
    } catch {
      setWarm(false)
    }
  }, [])
  const onTrial = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    trackAmplitude('home_hero_trial_clicked')
    await startFreeTrial()
  }

  return (
    <section className="relative flex w-full flex-col overflow-hidden border-b border-white/10 bg-gradient-to-b from-black via-transparent to-[#0f0f0f] pb-6 pt-16 md:pb-8 md:pt-20 lg:min-h-[calc(100svh-170px)] lg:pb-6">
      <div className="container flex flex-1 flex-col">
        <RetroGrid />
        <div className={`absolute inset-0 transition-opacity duration-500 ${autopilot ? 'opacity-0' : 'opacity-100'} bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.15),transparent)]`} />
        <div className={`absolute inset-0 transition-opacity duration-500 ${autopilot ? 'opacity-100' : 'opacity-0'} bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(212,165,116,0.18),transparent)]`} />
        {!autopilot && <FloatingSocialReactions />}

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-8 lg:flex-row lg:gap-12">
          <div className="flex w-full max-w-3xl flex-col items-center text-center">

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
                className="text-[26px] min-[380px]:text-[28px] sm:text-4xl lg:text-[2.6rem] font-extrabold leading-[1.15]"
                dangerouslySetInnerHTML={{ __html: heroTitle.replace(/<br\/>/g, '<br>') }}
              />
            </AnimatePresence>

            {!autopilot && heroTitleH2 && (
              <motion.h2
                initial={mounted ? { opacity: 0, y: 8 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-4 text-lg sm:text-xl md:text-2xl font-semibold leading-snug text-neutral-300 max-w-3xl mx-auto text-balance"
                dangerouslySetInnerHTML={{ __html: heroTitleH2.replace(/<br\/>/g, '<br>') }}
              />
            )}

            {!autopilot && heroTitleNote && (
              <motion.p
                initial={mounted ? { opacity: 0, y: 8 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-3 text-lg sm:text-xl md:text-2xl font-medium text-neutral-300 max-w-2xl mx-auto text-balance"
              >
                {heroTitleNote}
              </motion.p>
            )}

            {/* Logos réseaux, juste sous le titre */}
            {!autopilot && (
              <motion.div
                initial={mounted ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 flex items-center justify-center gap-2"
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

            {/* La formule, floutée et tamponnée SECRET : le teaser du moment
                « Règle n°1 » qui suit les logos presse. Un tap y descend. */}
            {!autopilot && (
              <div className="relative mx-auto mt-14 w-fit max-w-full sm:mt-12">
                <motion.div
                  initial={mounted ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="pointer-events-none absolute -top-12 left-0 z-10 flex items-start gap-1 sm:-left-24 sm:-top-6"
                >
                  <span className="max-w-[230px] text-[11px] italic leading-snug text-neutral-300 sm:max-w-[260px] sm:text-xs">
                    {lang === 'fr'
                      ? 'Dans 30 jours, tout ton marché t’aura vu, grâce à cette formule'
                      : 'In 30 days, your whole market will have seen you, thanks to this formula'}
                  </span>
                  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" className="mt-1.5 text-empire" aria-hidden>
                    <path d="M4 4 C14 6, 24 12, 27 26" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" strokeDasharray="3 3" />
                    <path d="M21.5 23 L27.5 27.5 L30 21" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </motion.div>

                <motion.button
                  type="button"
                  initial={mounted ? { opacity: 0, y: 10 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  onClick={() => document.getElementById('formula-reveal')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  aria-label={lang === 'fr' ? 'Découvrir la formule' : 'Reveal the formula'}
                  className="group relative block rounded-2xl border border-white/12 bg-black/80 px-6 py-4 transition-colors hover:border-white/25 sm:px-9 sm:py-5"
                >
                  <span className="relative flex flex-col items-center leading-none text-lg font-extrabold sm:text-2xl">
                    <span className="flex items-center whitespace-nowrap">
                      <HeroBlurTerm i={0} /><HeroOp>×</HeroOp><HeroBlurTerm i={1} /><HeroOp>×</HeroOp><HeroBlurTerm i={2} />
                    </span>
                    <span className="my-2 block h-px w-full bg-white/20 sm:my-2.5" />
                    <span className="flex items-center whitespace-nowrap">
                      <HeroBlurTerm i={3} /><HeroOp>+</HeroOp><HeroBlurTerm i={4} />
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-3 -top-3 -rotate-[10deg] select-none rounded-[3px] border-2 border-red-500 px-1.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-red-500 shadow-[0_0_14px_-4px_rgba(239,68,68,0.55)] sm:text-[11px]"
                  >
                    Secret
                  </span>
                </motion.button>
              </div>
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
              id="hero-cta-block"
              initial={mounted ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-7 flex flex-col items-center gap-5 lg:mt-6"
            >
              <div className="w-full flex justify-center px-1">
                {autopilot ? (
                  <a
                    href="/join-us"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full sm:w-auto px-8 py-4 font-bold rounded-xl hover:scale-105 transition-all text-center flex flex-col items-center gap-1 shrink-0 bg-autopilot text-black shadow-[0_0_30px_rgba(212,165,116,0.4)]"
                  >
                    <span className="flex items-center gap-2">
                      {heroCta}
                      <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </span>
                    <span className="text-[11px] font-semibold opacity-70">{t.autopilot.hero.ctaReassurance}</span>
                  </a>
                ) : (
                  /* L’essai est l’action principale, la démo le second choix :
                     même hauteur, même largeur, contour blanc bien visible. Le
                     trafic chaud (lien setter, parrainage) n'a que l'essai. */
                  <CtaPair
                    fr={lang === 'fr'}
                    reassuranceClassName="mx-auto w-fit rounded-lg bg-[#0a0a0a] px-3 py-0.5"
                    primary={
                      <a href={TRIAL_URL} onClick={onTrial} className={CTA_PRIMARY}>
                        {lang === 'fr' ? 'Essai gratuit 7 jours' : '7-day free trial'}
                        <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                      </a>
                    }
                    secondary={!warm && (
                      <a
                        href="/join-us"
                        onClick={() => trackAmplitude('empire_call_clicked', { source: 'home-hero' })}
                        className={CTA_SECONDARY}
                      >
                        {lang === 'fr' ? 'Demander une démo' : 'Request a demo'}
                      </a>
                    )}
                  />
                )}
              </div>
              {/* Preuve alignée sur la promesse : la promesse est « les formats
                  qui marchent déjà », donc les visages des créateurs dont on
                  réplique les formats, pas la pastille du fondateur - elle vit
                  dans la section fondateur plus bas. Fichiers locaux, jamais de
                  hotlink : un avatar cassé dans le hero est le pire endroit. */}
              <div className="mt-1 flex flex-col items-center gap-3">
                <div className="flex max-w-full items-center gap-3 sm:gap-4 px-3.5 py-2 pl-2 rounded-full bg-[#0d0d0d] border border-white/10">
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
                      ? <>Ils utilisent déjà le système Empire. <span className="text-neutral-500">Prêt à l’emploi pour toi.</span></>
                      : <>They already use the Empire system. <span className="text-neutral-500">Ready for you.</span></>}
                  </span>
                </div>
                {!autopilot && (
                  <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-neutral-400 sm:gap-2.5 sm:text-xs">
                    {(lang === 'fr'
                      ? ['1 an de R&D', '10 000+ posts testés', '10M de vues par mois']
                      : ['1 year of R&D', '10,000+ posts tested', '10M views a month']
                    ).map((item) => (
                      <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Indice de scroll juste sous la preuve : au-dessus du pli sur
                téléphone comme sur ordinateur, et il ne recouvre ni les boutons
                ni la bande de presse. */}
            {!autopilot && <ScrollCue lang={lang} />}

            {/* L'animation voix → contenus vit désormais dans la section
                « Message » (HomeDemoSection), à la place de la vidéo. */}
          </div>
        </div>

      </div>
    </section>
  )
}

function ScrollCue({ lang }: { lang: string }) {
  return (
    <button
      type="button"
      onClick={() => (document.getElementById('formula-reveal') ?? document.getElementById('home-creators'))?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      className="relative z-10 mx-auto mt-4 flex flex-col items-center gap-1 text-xs font-semibold text-neutral-300 transition-colors hover:text-white"
    >
      <motion.span
        aria-hidden
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center text-empire drop-shadow-[0_0_10px_rgb(var(--empire-rgb)_/_0.8)]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="-mt-2 opacity-50"><path d="M6 9l6 6 6-6" /></svg>
      </motion.span>
      <span>{lang === 'fr' ? 'Il existe une formule. Scrolle pour la révéler.' : 'There is a formula. Scroll to reveal it.'}</span>
    </button>
  )
}

function HeroBlurTerm({ i }: { i: number }) {
  // Le libellé reste français dans le teaser : il est flouté, illisible exprès.
  return (
    <span className="select-none px-1 text-white opacity-45 blur-[5px]" aria-hidden>
      {FORMULA_TERMS[i].fr}
    </span>
  )
}

function HeroOp({ children }: { children: string }) {
  return <span className="px-0.5 text-[0.6em] font-medium text-neutral-500">{children}</span>
}
