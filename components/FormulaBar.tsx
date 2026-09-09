'use client'

/**
 * FormulaBar - la formule de la visibilité, en pilule « glass » fixée en bas
 * de la home, qui se défloute au fil du scroll.
 *
 *        Message × Format × Diffusion
 *        ────────────────────────────  = Visibilité   (→ Clients)
 *               Temps + Coût
 *
 * Chaque terme démarre flou (le format « flou → net » qu'on vend, appliqué à
 * la page elle-même) et devient net quand la section qui le démontre entre
 * dans le viewport : les ancres `formula-*` sont posées dans `app/page.tsx`,
 * dans l'ordre de la formule. Un terme révélé reste révélé - c'est une
 * découverte, pas un état. Arrivé au formulaire de candidature, la pilule
 * passe en vert et affiche la chute « → Clients ».
 *
 * La barre n'existe pas pendant le hero (rien à révéler) ni à partir de la
 * FAQ (la démonstration est finie, la place revient au formulaire et au
 * footer). En dessous de `lg`, elle se pose au-dessus de « Voir les stats »
 * et de la bulle WhatsApp, qui occupent déjà le bas de l'écran.
 */

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'

type TermId = 'message' | 'format' | 'diffusion' | 'cost' | 'visibility'

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
    hintFr: 'Tout le monde a quelque chose à dire. Vous aussi : une opinion, un constat, une actu.',
    hintEn: 'Everyone has something to say. You too: an opinion, an insight, a news item.',
  },
  {
    id: 'format',
    anchor: 'formula-format',
    fr: 'Format',
    en: 'Format',
    hintFr: '11 formats qui font des vues, prêts à filmer.',
    hintEn: '11 formats that get views, ready to shoot.',
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
    id: 'cost',
    anchor: 'formula-cost',
    fr: 'Temps + Coût',
    en: 'Time + Cost',
    hintFr: '20 minutes en marchant. Pas d\'agence à 15 K€.',
    hintEn: '20 minutes while walking. No €15K agency.',
  },
  {
    id: 'visibility',
    anchor: 'formula-visibility',
    fr: 'Visibilité',
    en: 'Visibility',
    hintFr: 'Trackée jusqu\'au client, format par format.',
    hintEn: 'Tracked down to the client, format by format.',
  },
]

const APPLY_ANCHOR = 'formula-apply'
const HINT_MS = 4200

export default function FormulaBar() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'

  const [visible, setVisible] = useState(false)
  const [revealed, setRevealed] = useState<Set<TermId>>(new Set())
  const [hint, setHint] = useState<TermId | null>(null)
  const [done, setDone] = useState(false)
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Visibilité de la barre : après le hero, avant la FAQ.
  // `html, body { height: 100%; overflow-x: hidden }` fait du <body> le
  // conteneur de scroll : `window.scrollY` reste à 0 et `scroll` ne remonte
  // pas jusqu'à `window`. On écoute donc en capture sur `document` et on
  // mesure les positions avec getBoundingClientRect, qui ne dépend pas du
  // conteneur.
  useEffect(() => {
    const main = document.querySelector('main')
    const onScroll = () => {
      const scrolled = main ? -main.getBoundingClientRect().top : 0
      // Deux ou trois coups de molette suffisent : la barre doit être là
      // pendant qu'on est encore dans le hero, pas une fois qu'on l'a quitté.
      const past = scrolled > Math.min(180, window.innerHeight * 0.2)
      const faq = document.getElementById('faq')
      const faqReached = faq ? faq.getBoundingClientRect().top < window.innerHeight * 0.6 : false
      setVisible(past && !faqReached)
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

  const TermChip = ({ id }: { id: TermId }) => {
    const t = term(id)
    const on = isOn(id)
    const hot = hint === id || (done && id === 'visibility')
    return (
      <button
        type="button"
        onClick={() => scrollToTerm(t)}
        aria-label={label(t)}
        className={[
          'rounded-md px-1 font-extrabold tracking-tight transition-all duration-700 ease-out select-none',
          on ? 'blur-0 opacity-100' : 'blur-[5px] opacity-40',
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

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          // En dessous de lg, le bas de l'écran est pris par « Voir les stats »
          // (gauche) et la bulle WhatsApp (droite) : la pilule se pose au-dessus.
          className="pointer-events-none fixed inset-x-3 bottom-[104px] z-50 flex justify-center lg:inset-x-0 lg:bottom-4"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="pointer-events-auto relative flex flex-col items-center">
            {/* Au-dessus de la pilule : la légende du terme qui vient de se
                révéler, sinon - tant que la formule est encore presque toute
                floue - l'invitation à scroller pour la découvrir. */}
            <AnimatePresence mode="wait">
              {hintTerm && !done ? (
                <motion.p
                  key={hintTerm.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.25 }}
                  className="mb-2 max-w-[min(92vw,420px)] rounded-xl border border-white/10 bg-black/60 px-3 py-1.5 text-center text-[11px] leading-snug text-neutral-200 shadow-lg backdrop-blur-xl sm:text-xs"
                >
                  <span className="font-bold text-empire">{label(hintTerm)}</span>
                  {' · '}
                  {fr ? hintTerm.hintFr : hintTerm.hintEn}
                </motion.p>
              ) : revealed.size < 2 && !done ? (
                <motion.p
                  key="intro"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.25 }}
                  className="mb-2 flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-1.5 text-center text-[11px] leading-snug text-neutral-200 shadow-lg backdrop-blur-xl sm:text-xs"
                >
                  <motion.span
                    aria-hidden
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-empire"
                  >
                    ↓
                  </motion.span>
                  {fr
                    ? 'Scrollez pour découvrir la formule d\'un personal brand qui rapporte'
                    : 'Scroll to uncover the formula of a personal brand that pays'}
                </motion.p>
              ) : null}
            </AnimatePresence>

            {/* Pilule glass */}
            <div
              className={[
                'relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-colors duration-700',
                'shadow-[0_16px_50px_-16px_rgba(0,0,0,0.9)]',
                done
                  ? 'border-empire/50 bg-empire/[0.10] shadow-[0_0_40px_-8px_rgb(var(--empire-rgb)_/_0.45)]'
                  : 'border-white/15 bg-white/[0.07]',
              ].join(' ')}
            >
              {/* Reflet haut, le détail qui fait « verre » */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0)_45%)]" />

              <div className="relative flex items-center gap-2.5 px-3.5 py-2 text-[11px] sm:gap-3.5 sm:px-5 sm:py-2.5 sm:text-sm">
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
                  <div className="whitespace-nowrap">
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

              {/* Progression de la découverte */}
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
                <motion.div
                  className="h-full bg-empire"
                  initial={false}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
