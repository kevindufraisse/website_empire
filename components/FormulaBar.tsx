'use client'

/**
 * FormulaBar - la formule de la visibilité, en pilule « glass » fixée en bas
 * de la home. Elle est lisible dès le hero ; au fil du scroll, le terme de la
 * section qu'on lit s'allume.
 *
 *        Message × Format × Diffusion
 *        ────────────────────────────  = Visibilité   (→ Clients)
 *               Temps + Coût
 *
 * Temps et Coût sont deux termes distincts : le temps se révèle à l'app
 * (une heure par mois), le coût au comparatif Seul / Freelances / Empire.
 *
 * Chaque terme est lisible mais atténué, et passe en plein quand la section
 * qui le démontre entre dans le viewport (ancres `formula-*` dans
 * `app/page.tsx`, dans l'ordre de la formule). Il n'y a plus de flou : la
 * porte email qui « dévoilait » la formule a été retirée, la cacher n'avait
 * plus rien à débloquer. Arrivé au bas de la démonstration, la pilule passe
 * en vert et affiche la chute « → Clients ».
 *
 * Trois états, dans l'ordre du scroll :
 * - `docked` : dans le hero, sous l'accroche, rendue par portal dans le slot
 *   `formula-hero-slot`, entièrement lisible.
 * - `floating` : dès que le slot passe sous le header, la pilule file en bas
 *   de l'écran (même `layoutId`, Framer anime le déplacement) et allume le
 *   terme de chaque section.
 * - `hidden` : à partir de la FAQ, la démonstration est finie, la place
 *   revient au formulaire et au footer.
 */

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { trackAmplitude } from '@/lib/amplitude'

type TermId = 'message' | 'format' | 'diffusion' | 'time' | 'cost' | 'visibility'

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
    hintFr: 'Telegram, veille concurrents, sujets viraux. Vous cliquez.',
    hintEn: 'Telegram, competitor watch, viral topics. You click.',
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
    hintFr: 'Le prix d\'une équipe, divisé par 100. Vous pouvez payer à l\'usage.',
    hintEn: 'The price of a team, divided by 100. You can pay for what you use.',
  },
  {
    id: 'visibility',
    anchor: 'formula-visibility',
    fr: '100 M de vues',
    en: '100M views',
    hintFr: 'Trackée jusqu\'au client, format par format.',
    hintEn: 'Tracked down to the client, format by format.',
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

    const onScroll = () => {
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
    onScroll()
    document.addEventListener('scroll', onScroll, { passive: true, capture: true })
    window.addEventListener('resize', onScroll)
    return () => {
      document.removeEventListener('scroll', onScroll, { capture: true })
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Révélation des termes : un observer par ancre, déclenché quand le haut
  // de la section passe les 60 % du viewport. Une fois net, on n'y revient pas.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(new Set(FORMULA_TERMS.map((t) => t.id)))
      return
    }
    const observers: IntersectionObserver[] = []

    const reveal = (id: TermId) => {
      setRevealed((prev) => {
        if (prev.has(id)) return prev
        const next = new Set(prev)
        next.add(id)
        return next
      })
      setHint(id)
      if (hintTimer.current) clearTimeout(hintTimer.current)
      hintTimer.current = setTimeout(() => setHint(null), HINT_MS)
    }

    FORMULA_TERMS.forEach((term) => {
      const el = document.getElementById(term.anchor)
      if (!el) return
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            reveal(term.id)
            io.disconnect()
          }
        },
        { rootMargin: '0px 0px -40% 0px' },
      )
      io.observe(el)
      observers.push(io)
    })

    const applyEl = document.getElementById(APPLY_ANCHOR)
    if (applyEl) {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            // Tout devient net, même si l'utilisateur a sauté des sections.
            setRevealed(new Set(FORMULA_TERMS.map((t) => t.id)))
            setDone(true)
            io.disconnect()
          }
        },
        { rootMargin: '0px 0px -30% 0px' },
      )
      io.observe(applyEl)
      observers.push(io)
    }

    return () => {
      observers.forEach((o) => o.disconnect())
      if (hintTimer.current) clearTimeout(hintTimer.current)
    }
  }, [])

  if (autopilot) return null

  const term = (id: TermId) => FORMULA_TERMS.find((t) => t.id === id)!
  const label = (t: Term) => (fr ? t.fr : t.en)
  const isOn = (id: TermId) => revealed.has(id)
  const progress = revealed.size / FORMULA_TERMS.length
  const hintTerm = hint ? term(hint) : null

  const scrollToTerm = (t: Term) => {
    document.getElementById(t.anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Dans le hero, toute la formule est en plein : c'est la promesse.
  const docked = mode === 'docked'

  const TermChip = ({ id }: { id: TermId }) => {
    const t = term(id)
    const on = docked || isOn(id)
    const hot = hint === id || (done && id === 'visibility')
    return (
      <button
        type="button"
        onClick={() => scrollToTerm(t)}
        aria-label={label(t)}
        className={[
          // `min-h-0` : globals.css force 44px sur tout <button> en mobile,
          // ce qui ferait doubler la hauteur de la pilule.
          'min-h-0 rounded-md px-1 font-extrabold tracking-tight transition-all duration-700 ease-out select-none',
          on ? 'opacity-100' : 'opacity-50',
          hot ? 'text-empire' : 'text-white',
          'hover:bg-white/10',
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
        'relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-colors duration-700',
        'shadow-[0_16px_50px_-16px_rgba(0,0,0,0.9)]',
        done
          ? 'border-empire/50 bg-black/80 shadow-[0_0_40px_-8px_rgb(var(--empire-rgb)_/_0.45)]'
          : 'border-white/15 bg-black/75',
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

          <Op>=</Op>
          <div className="whitespace-nowrap">
            <TermChip id="visibility" />
          </div>

          {/* La chute : visible quand toute la formule est nette */}
          <AnimatePresence>
            {done && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="ml-0.5 whitespace-nowrap rounded-lg bg-empire px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-black sm:text-[11px]"
              >
                → {fr ? 'Clients' : 'Clients'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {/* Le bouton workshop vit dans la pilule (pas dans le hero, qui a
            le sien) : dessous sur mobile, à droite sur grand écran. */}
        {!docked && (
          <a
            href="/vsl"
            onClick={() => trackAmplitude('formula_bar_workshop_clicked')}
            className="mx-2 mb-2 flex min-h-0 items-center justify-center gap-1.5 rounded-xl bg-empire px-4 py-2 text-xs font-bold text-black transition hover:brightness-110 sm:text-sm lg:mx-0 lg:mb-0 lg:mr-2.5 lg:py-2.5"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M7 4.5v15l13-7.5z" /></svg>
            {fr ? 'Voir le workshop gratuit' : 'Watch the free workshop'}
            <span className="font-semibold opacity-70">· 1 h 26</span>
          </a>
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
    return createPortal(<div className="flex flex-col items-center">{pill}</div>, slot)
  }

  // En bas de l'écran : la pilule seule, bouton workshop inclus.
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
