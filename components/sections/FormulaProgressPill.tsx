'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { FORMULA_TERMS, type FormulaTermKey } from './formulaTerms'

/**
 * Le rappel de la formule pendant la descente : une pilule fixée en bas
 * de l'écran où chaque terme se défloute quand on passe la section qui le
 * démontre ([data-formula-term]). Un terme découvert le reste.
 * Elle n'apparaît qu'après le hero et s'efface à la révélation finale
 * (#formula-reveal). Décorative : cachée en reduced motion et aux lecteurs
 * d'écran.
 */
export default function FormulaProgressPill() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const still = usePrefersReducedMotion()
  const [revealed, setRevealed] = useState<Set<FormulaTermKey>>(new Set())
  const [flash, setFlash] = useState<FormulaTermKey | null>(null)
  const [pastHero, setPastHero] = useState(false)
  const [atFinale, setAtFinale] = useState(false)

  useEffect(() => {
    if (still || typeof IntersectionObserver === 'undefined') return

    // Un terme se découvre quand sa section traverse le milieu de l'écran.
    const termIo = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const key = (e.target as HTMLElement).dataset.formulaTerm as FormulaTermKey | undefined
        if (!key) continue
        termIo.unobserve(e.target)
        setRevealed(prev => {
          if (prev.has(key)) return prev
          const next = new Set(prev)
          next.add(key)
          return next
        })
        setFlash(key)
      }
    }, { rootMargin: '-35% 0px -45% 0px' })
    // Certaines sections (le parcours des formats) se montent après coup :
    // on attache aussi ce qui apparaît plus tard.
    const seen = new WeakSet<Element>()
    const attach = () => document.querySelectorAll<HTMLElement>('[data-formula-term]').forEach(el => {
      if (seen.has(el)) return
      seen.add(el)
      termIo.observe(el)
    })
    attach()
    const mo = new MutationObserver(attach)
    mo.observe(document.body, { childList: true, subtree: true })

    // Visible après le hero, effacée sur la révélation finale.
    const hero = document.querySelector('main > section')
    const heroIo = hero
      ? new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { threshold: 0.05 })
      : null
    if (hero && heroIo) heroIo.observe(hero)
    const finale = document.getElementById('formula-reveal')
    const finaleIo = finale
      ? new IntersectionObserver(([e]) => { if (e.isIntersecting) setAtFinale(true) }, { threshold: 0.1 })
      : null
    if (finale && finaleIo) finaleIo.observe(finale)

    return () => { termIo.disconnect(); mo.disconnect(); heroIo?.disconnect(); finaleIo?.disconnect() }
  }, [still])

  useEffect(() => {
    if (!flash) return
    const t = setTimeout(() => setFlash(null), 1600)
    return () => clearTimeout(t)
  }, [flash])

  if (still) return null
  const show = pastHero && !atFinale
  const flashTerm = flash ? FORMULA_TERMS.find(t => t.key === flash) : null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="pointer-events-none fixed bottom-4 left-1/2 z-40 -translate-x-1/2"
        >
          <div className="relative flex items-center gap-1 whitespace-nowrap rounded-full border border-white/12 bg-black/80 px-4 py-2 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.9)] backdrop-blur-md">
            <span className="mr-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-empire" />
            {FORMULA_TERMS.map((t, i) => (
              <span key={t.key} className="flex items-center">
                {i > 0 && (
                  <span className="px-0.5 text-[9px] text-neutral-600">{i === 3 ? '/' : i === 4 ? '+' : '×'}</span>
                )}
                <motion.span
                  animate={flash === t.key ? { scale: [1.3, 1] } : {}}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={[
                    'text-[11px] font-bold tracking-tight transition-all duration-700',
                    revealed.has(t.key)
                      ? flash === t.key ? 'text-empire' : 'text-white'
                      : 'text-white blur-[4px] opacity-35 select-none',
                  ].join(' ')}
                >
                  {fr ? t.fr : t.en}
                </motion.span>
              </span>
            ))}

            {/* Le petit mot qui confirme ce qu'on vient de voir */}
            <AnimatePresence>
              {flashTerm && (
                <motion.span
                  key={flashTerm.key}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/85 px-2.5 py-0.5 text-[10px] font-bold text-empire"
                >
                  {(fr ? flashTerm.fr : flashTerm.en) + (fr ? ' ✓ — tu viens de le voir' : ' ✓ — you just saw it')}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
