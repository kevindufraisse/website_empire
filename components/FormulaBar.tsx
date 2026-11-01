'use client'

/** La formule seule. Chaque terme se révèle au passage de sa section. */

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { trackAmplitude } from '@/lib/amplitude'
import { startFreeTrial } from '@/lib/startTrial'

type TermId = 'message' | 'format' | 'diffusion' | 'time' | 'cost'

type Term = {
  id: TermId
  anchor: string
  fr: string
  en: string
  hintFr: string
  hintEn: string
}

export const FORMULA_TERMS: Term[] = [
  {
    id: 'message',
    anchor: 'formula-message',
    fr: 'Message',
    en: 'Message',
    hintFr: 'Un lien Instagram, YouTube ou TikTok devient votre prochain sujet.',
    hintEn: 'An Instagram, YouTube or TikTok link becomes your next topic.',
  },
  {
    id: 'format',
    anchor: 'formula-format',
    fr: 'Format',
    en: 'Format',
    hintFr: 'Le sujet rentre dans un format qui se regarde, pour le bon réseau.',
    hintEn: 'The topic goes into a format people watch, for the right network.',
  },
  {
    id: 'diffusion',
    anchor: 'formula-diffusion',
    fr: 'Diffusion',
    en: 'Distribution',
    hintFr: '7 réseaux, republication automatique, multi-comptes par API.',
    hintEn: '7 networks, automatic republishing, multi-account via API.',
  },
  {
    id: 'time',
    anchor: 'formula-time',
    fr: 'Temps',
    en: 'Time',
    hintFr: '20 minutes à une heure par semaine. Une action en crée une autre.',
    hintEn: '20 minutes to an hour a week. One action triggers the next.',
  },
  {
    id: 'cost',
    anchor: 'formula-cost',
    fr: 'Coût',
    en: 'Cost',
    hintFr: 'Une chaîne de production, du sujet à la publication.',
    hintEn: 'A production workflow, from topic to publication.',
  },

]

const APPLY_ANCHOR = 'formula-apply'
const HERO_SLOT = 'formula-hero-slot'
const HINT_MS = 4200

type Mode = 'docked' | 'floating' | 'hidden'

export default function FormulaBar() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'

  const [mode, setMode] = useState<Mode>('hidden')
  const [slot, setSlot] = useState<HTMLElement | null>(null)
  const [revealed, setRevealed] = useState<Set<TermId>>(new Set())
  const [hint, setHint] = useState<TermId | null>(null)
  const [done, setDone] = useState(false)
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Où est la pilule : dans le hero, en bas de l'écran, ou nulle part.
  // `html, body { height: 100%; overflow-x: hidden }` fait du <body> le
  // conteneur de scroll : `window.scrollY` reste à 0 et `scroll` ne remonte
  // pas jusqu'à `window`. On écoute donc en capture sur `document` et on
  // mesure les positions avec getBoundingClientRect, qui ne dépend pas du
  // conteneur.
  useEffect(() => {
    const main = document.querySelector('main')
    const slotEl = document.getElementById(HERO_SLOT)
    setSlot(slotEl)

    // Un calcul par image au plus : l'événement scroll part bien plus souvent.
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        measure()
      })
    }
    const measure = () => {
      const faq = document.getElementById('faq')
      const faqReached = faq ? faq.getBoundingClientRect().top < window.innerHeight * 0.6 : false
      if (faqReached) {
        setMode('hidden')
        return
      }
      // La pilule quitte le hero quand son emplacement passe sous le header :
      // c'est le moment où elle disparaîtrait de toute façon.
      let leftHero: boolean
      if (slotEl) {
        leftHero = slotEl.getBoundingClientRect().top < 96
      } else {
        const scrolled = main ? -main.getBoundingClientRect().top : 0
        leftHero = scrolled > Math.min(180, window.innerHeight * 0.2)
      }
      setMode(leftHero ? 'floating' : slotEl ? 'docked' : 'hidden')
    }
    measure()
    document.addEventListener('scroll', onScroll, { passive: true, capture: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      document.removeEventListener('scroll', onScroll, { capture: true })
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // La copie statique du hero (`FormulaHeroStatic`, dans le HTML serveur)
  // s'efface une fois la pilule animée à l'écran, pas avant : sinon une image
  // sans formule entre les deux.
  useEffect(() => {
    if (slot && mode !== 'hidden') slot.setAttribute('data-live', 'true')
  }, [slot, mode])

  // Mesurer le seuil plutôt qu'observer un repère de 1 px : un grand coup
  // de molette ou une ancre peut sauter le repère entre deux images.
  useEffect(() => {
    const seen = new Set<TermId>()
    let frame = 0
    let completed = false
    const measure = () => {
      frame = 0
      for (const term of FORMULA_TERMS) {
        const el = document.getElementById(term.anchor)
        if (!el || seen.has(term.id) || el.getBoundingClientRect().top > window.innerHeight * 0.6) continue
        seen.add(term.id)
        setRevealed(new Set(seen))
        setHint(term.id)
        if (hintTimer.current) clearTimeout(hintTimer.current)
        hintTimer.current = setTimeout(() => setHint(null), HINT_MS)
      }
      const apply = document.getElementById(APPLY_ANCHOR)
      if (!completed && apply && apply.getBoundingClientRect().top < window.innerHeight * 0.7) {
        completed = true
        FORMULA_TERMS.forEach(term => seen.add(term.id))
        setRevealed(new Set(seen))
        setDone(true)
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure) }
    measure()
    document.addEventListener('scroll', schedule, { passive: true, capture: true })
    window.addEventListener('resize', schedule)
    // Les témoignages et composants chargés à la demande peuvent déplacer
    // les repères après le premier rendu.
    const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null
    const main = document.querySelector('main')
    if (main) resize?.observe(main)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      if (hintTimer.current) clearTimeout(hintTimer.current)
      document.removeEventListener('scroll', schedule, { capture: true })
      window.removeEventListener('resize', schedule)
      resize?.disconnect()
    }
  }, [])

  if (autopilot) return null

  const term = (id: TermId) => FORMULA_TERMS.find((t) => t.id === id)!
  const label = (t: Term) => (fr ? t.fr : t.en)
  const isOn = (id: TermId) => revealed.has(id)
  const progress = revealed.size / FORMULA_TERMS.length

  const scrollToTerm = (t: Term) => {
    document.getElementById(t.anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Les cinq termes du mécanisme sont floutés et se dévoilent un par un,
  // quand la section qui les démontre arrive à l'écran (format flou → net,
  // appliqué à la page). Plus flou dans le hero qu'en bas d'écran.
  const docked = mode === 'docked'

  const TermChip = ({ id }: { id: TermId }) => {
    const t = term(id)
    const on = isOn(id)
    const hot = hint === id
    return (
      <button
        type="button"
        onClick={() => scrollToTerm(t)}
        aria-label={label(t)}
        className={[
          // `min-h-0` : globals.css force 44px sur tout <button> en mobile,
          // ce qui ferait doubler la hauteur de la pilule.
          'min-h-0 rounded-md px-1 font-extrabold tracking-tight transition-all duration-700 ease-out select-none',
          on ? 'blur-0 opacity-100' : docked ? 'blur-[7px] opacity-40' : 'blur-[5px] opacity-50',
          hot ? 'text-empire' : 'text-white',
          on ? 'hover:bg-white/10' : 'pointer-events-none',
        ].join(' ')}
      >
        {label(t)}
      </button>
    )
  }

  const Op = ({ children }: { children: React.ReactNode }) => (
    <span className="px-0.5 font-medium text-neutral-400">{children}</span>
  )

  /* La pilule glass. Un seul `layoutId` pour les deux emplacements : quand
     elle passe du hero au bas de l'écran, Framer anime le déplacement au
     lieu de la faire réapparaître. */
  const pill = (
    <motion.div
      layoutId="formula-pill"
      transition={{ layout: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
      className={[
        'relative overflow-hidden rounded-2xl border transition-colors duration-700',
        'shadow-[0_16px_50px_-16px_rgba(0,0,0,0.9)]',
        // Pas de flou d'arrière-plan dans le hero : les réactions qui montent
        // derrière le forçaient à se recalculer à chaque image.
        docked ? 'bg-black/90' : 'backdrop-blur-xl',
        done
          ? 'border-empire/50 bg-black/80 shadow-[0_0_40px_-8px_rgb(var(--empire-rgb)_/_0.45)]'
          : docked ? 'border-white/15' : 'border-white/15 bg-black/75',
      ].join(' ')}
    >
      {/* Reflet haut, le détail qui fait « verre » */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0)_45%)]" />

      <div className="relative flex flex-col lg:flex-row lg:items-center">
        <div className={[
          'relative flex items-center gap-2.5 px-4 py-2.5 text-xs sm:gap-3.5 sm:px-6 sm:py-3 sm:text-base',
          // Dans le hero, la formule est la pièce centrale : plus grande sur grand écran.
          docked ? 'md:gap-5 md:px-9 md:py-5 md:text-2xl' : '',
        ].join(' ')}>
          {/* Fraction */}
          <div className="flex flex-col items-center leading-none">
            <div className="flex items-center whitespace-nowrap">
              <TermChip id="message" />
              <Op>×</Op>
              <TermChip id="format" />
              <Op>×</Op>
              <TermChip id="diffusion" />
            </div>
            <div className="my-1 h-px w-full bg-white/30" />
            <div className="flex items-center whitespace-nowrap">
              <TermChip id="time" />
              <Op>+</Op>
              <TermChip id="cost" />
            </div>
          </div>


        </div>
        {/* Le bouton d’essai reste accessible pendant la lecture : dessous sur mobile, à droite sur grand écran. */}
        {!docked && (
          <button
            type="button"
            data-cta="sticky-trial"
            onClick={() => {
              trackAmplitude('formula_bar_trial_clicked')
              startFreeTrial()
            }}
            className="mx-2 mb-2 flex min-h-0 items-center justify-center gap-1.5 rounded-xl bg-empire px-4 py-2 text-xs font-bold text-black transition hover:brightness-110 sm:text-sm lg:mx-0 lg:mb-0 lg:mr-2.5 lg:py-2.5"
          >
            {fr ? 'Tester 7 jours gratuitement' : 'Start my 7-day free trial'}
            <span aria-hidden>→</span>
          </button>
        )}
      </div>

      {/* Progression de la découverte */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
        <motion.div
          className="h-full bg-empire"
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )

  // Dans le hero : la pilule, lisible.
  if (mode === 'docked' && slot) {
    // Tampon « Secret » tant que des termes restent flous.
    const stillSecret = revealed.size < FORMULA_TERMS.length
    return createPortal(
      <div className="flex flex-col items-center">
        <div className="relative">
          {pill}
          {stillSecret && (
            // Le tampon est déjà dans le HTML serveur (`FormulaHeroStatic`) :
            // le rejouer ici le faisait tomber une deuxième fois.
            <span
              aria-hidden
              className="pointer-events-none absolute -right-3 -top-3 -rotate-[10deg] select-none rounded-[3px] border-[2.5px] border-red-500 px-1.5 py-0.5 font-mono text-[11px] font-black uppercase tracking-[0.22em] text-red-500 shadow-[0_0_18px_-4px_rgba(239,68,68,0.6)] sm:-right-4 sm:text-xs"
            >
              Secret
            </span>
          )}
        </div>
      </div>,
      slot,
    )
  }

  // En bas de l'écran : la pilule seule, bouton d’essai inclus.
  return (
    <AnimatePresence>
      {mode === 'floating' && (
        <motion.div
          key="floating"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="pointer-events-none fixed inset-x-3 bottom-3 z-50 flex justify-center lg:inset-x-0 lg:bottom-4"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="pointer-events-auto relative flex flex-col items-center">
            {pill}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * La pilule du hero, sans JavaScript : rendue dans le HTML serveur pour que la
 * formule s'affiche avec le titre. Avant, elle n'arrivait qu'à l'hydratation
 * de toute la page (portal de `FormulaBar`, monté en bas de `app/page.tsx`) :
 * la flèche « Grâce à cette formule » pointait un vide pendant le chargement.
 * Même dessin que l'état `docked` ; elle disparaît dès que le slot reçoit
 * `data-live` (voir l'effet de `FormulaBar`).
 */
export function FormulaHeroStatic({ fr }: { fr: boolean }) {
  const label = (id: TermId) => {
    const t = FORMULA_TERMS.find((x) => x.id === id)!
    return fr ? t.fr : t.en
  }
  const Blur = ({ id }: { id: TermId }) => (
    <span className="rounded-md px-1 font-extrabold tracking-tight text-white blur-[7px] opacity-40 select-none">{label(id)}</span>
  )
  const Op = ({ children }: { children: React.ReactNode }) => (
    <span className="px-0.5 font-medium text-neutral-400">{children}</span>
  )
  return (
    <div className="flex flex-col items-center group-data-[live=true]:hidden" aria-hidden>
      <div className="relative">
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/90 shadow-[0_16px_50px_-16px_rgba(0,0,0,0.9)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0)_45%)]" />
          <div className="relative flex items-center gap-2.5 px-4 py-2.5 text-xs sm:gap-3.5 sm:px-6 sm:py-3 sm:text-base md:gap-5 md:px-9 md:py-5 md:text-2xl">
            <div className="flex flex-col items-center leading-none">
              <div className="flex items-center whitespace-nowrap">
                <Blur id="message" /><Op>×</Op><Blur id="format" /><Op>×</Op><Blur id="diffusion" />
              </div>
              <div className="my-1 h-px w-full bg-white/30" />
              <div className="flex items-center whitespace-nowrap">
                <Blur id="time" /><Op>+</Op><Blur id="cost" />
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10" />
        </div>
        <span className="pointer-events-none absolute -right-3 -top-3 -rotate-[10deg] select-none rounded-[3px] border-[2.5px] border-red-500 px-1.5 py-0.5 font-mono text-[11px] font-black uppercase tracking-[0.22em] text-red-500 shadow-[0_0_18px_-4px_rgba(239,68,68,0.6)] sm:-right-4 sm:text-xs">
          Secret
        </span>
      </div>
    </div>
  )
}
