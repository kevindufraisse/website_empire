'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { FORMULA_TERMS, FORMULA_RESULT } from './formulaTerms'

/**
 * Le moment secret, piloté au scroll (course sticky de ~4 écrans) :
 * « Règle n°1 : on ne parle pas d'Empire Internet. » → « Règle n°2 : … » →
 * « Aujourd'hui, on fait une exception. » → la formule à l'écran, un terme
 * se défloute à chaque cran de scroll → tout est révélé, le tampon SECRET
 * tombe et le résultat s'affiche. La pilule FormulaProgressPill s'efface
 * dès que cette section entre à l'écran (#formula-reveal).
 * Reduced motion : tout est révélé d'emblée, sans course de scroll.
 */
export default function FormulaSecretReveal() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const still = usePrefersReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [beat, setBeat] = useState(0)
  // 9 beats : règle 1, règle 2, l'exception, les 5 termes, tout révélé.
  useMotionValueEvent(scrollYProgress, 'change', v => setBeat(Math.min(8, Math.floor(v * 9))))

  const label = (i: number) => (fr ? FORMULA_TERMS[i].fr : FORMULA_TERMS[i].en)
  const done = still || beat >= 8
  const revealedCount = still ? FORMULA_TERMS.length : Math.max(0, Math.min(FORMULA_TERMS.length, beat - 2))

  const Term = ({ i }: { i: number }) => (
    <span
      className={[
        'rounded-md px-1 font-extrabold tracking-tight transition-all duration-700 ease-out',
        i < revealedCount ? 'text-white blur-0 opacity-100' : 'text-white blur-[9px] opacity-40 select-none',
      ].join(' ')}
    >
      {label(i)}
    </span>
  )
  const Op = ({ children }: { children: string }) => (
    <span className="px-1 text-[0.6em] font-medium text-neutral-500">{children}</span>
  )

  const formula = (
    <div className="relative flex flex-col items-center">
      <p className="mb-7 flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-neutral-500">
        <span className="h-1.5 w-1.5 rounded-full bg-empire" aria-hidden />
        {fr ? 'La formule, au complet' : 'The formula, in full'}
      </p>
      <div className="relative">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-black/85 px-6 py-6 shadow-[0_30px_90px_-24px_rgba(0,0,0,0.95)] sm:px-12 sm:py-9">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0)_45%)]" />
          <div className="relative flex flex-col items-center leading-none text-xl min-[420px]:text-2xl sm:text-4xl md:text-5xl">
            <div className="flex items-center whitespace-nowrap">
              <Term i={0} /><Op>×</Op><Term i={1} /><Op>×</Op><Term i={2} />
            </div>
            <div className="my-3 h-px w-full bg-white/25 sm:my-4" />
            <div className="flex items-center whitespace-nowrap">
              <Term i={3} /><Op>+</Op><Term i={4} />
            </div>
          </div>
        </div>

        {/* Tampon SECRET, qui tombe une fois tout révélé */}
        <span
          aria-hidden
          className={[
            'pointer-events-none absolute -right-3 -top-4 -rotate-[10deg] select-none rounded-[3px] border-[2.5px] border-red-500 px-2 py-0.5 font-mono text-[11px] font-black uppercase tracking-[0.22em] text-red-500 shadow-[0_0_18px_-4px_rgba(239,68,68,0.55)] transition-all duration-700 sm:-right-5 sm:text-sm',
            done ? 'opacity-0 blur-[3px]' : 'opacity-100',
          ].join(' ')}
        >
          Secret
        </span>
      </div>

      {/* Le résultat, une fois la formule entière à l'écran */}
      <div className={'relative mt-7 flex flex-col items-center text-center transition-all duration-700 ' + (done ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0')}>
        <p className="text-xl font-extrabold tracking-tight text-white sm:text-3xl">
          = <span className="text-empire">{fr ? FORMULA_RESULT.fr : FORMULA_RESULT.en}</span>
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
          {fr
            ? 'La suite de la page te la montre en action, terme par terme. Il ne manque que ton message.'
            : 'The rest of the page shows it in action, term by term. Only your message is missing.'}
        </p>
      </div>
    </div>
  )

  const Rule = ({ n }: { n: 1 | 2 }) => (
    <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
      {fr ? (
        <>
          <span className="text-empire">Règle n°{n}&nbsp;:</span>
          <br />
          on ne parle pas d’Empire&nbsp;Internet.
        </>
      ) : (
        <>
          <span className="text-empire">Rule #{n}:</span>
          <br />
          you do not talk about Empire&nbsp;Internet.
        </>
      )}
    </h2>
  )

  return (
    <section
      ref={ref}
      id="formula-reveal"
      data-formula-reveal
      aria-label={fr ? 'La formule' : 'The formula'}
      className="relative w-full bg-black"
      style={still ? undefined : { height: '420svh' }}
    >
      <div className={(still ? 'relative ' : 'sticky top-0 ') + 'flex h-svh min-h-[560px] w-full flex-col items-center justify-center overflow-hidden px-4'}>
        {/* Halo discret, plus marqué une fois la formule révélée */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: done ? 1 : 0.35, background: 'radial-gradient(ellipse 65% 45% at 50% 52%, rgb(var(--empire-rgb) / 0.09), transparent)' }}
        />

        {still ? (
          <div className="relative">{formula}</div>
        ) : (
          <AnimatePresence mode="wait">
            {beat <= 1 && (
              <motion.div
                key={'rule' + Math.min(1, beat)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative max-w-3xl text-center"
              >
                <Rule n={beat === 0 ? 1 : 2} />
              </motion.div>
            )}
            {beat === 2 && (
              <motion.div
                key="exception"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative max-w-2xl text-center"
              >
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                  {fr ? 'Aujourd’hui, on fait une exception.' : 'Today, we make an exception.'}
                </h2>
                <p className="mt-4 text-base text-neutral-400 sm:text-lg">
                  {fr ? 'Continue de scroller.' : 'Keep scrolling.'}
                </p>
              </motion.div>
            )}
            {beat >= 3 && (
              <motion.div
                key="formula"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative"
              >
                {formula}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Indice de scroll tant que tout n'est pas révélé */}
        {!still && (
          <div className={'absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-[11px] font-semibold text-neutral-400 transition-opacity duration-500 ' + (done ? 'opacity-0' : 'opacity-100')} aria-hidden>
            <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} className="text-empire">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            </motion.span>
            {fr ? 'Scrolle' : 'Scroll'}
          </div>
        )}
      </div>
    </section>
  )
}
