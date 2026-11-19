'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { FORMULA_TERMS, FORMULA_RESULT } from './formulaTerms'

/**
 * La formule assemblée, en fin de parcours : chaque terme a été découvert
 * dans la section qui le démontre (pilule FormulaProgressPill), ici tout
 * se révèle en cascade et le tampon SECRET tombe.
 * Reduced motion : tout est révélé d'emblée.
 */
export default function FormulaSecretReveal() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const still = usePrefersReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const [count, setCount] = useState(0)

  // Révélation en cascade à l'entrée dans l'écran, une seule fois.
  useEffect(() => {
    if (still) { setCount(FORMULA_TERMS.length + 1); return }
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setCount(FORMULA_TERMS.length + 1); return }
    let timers: ReturnType<typeof setTimeout>[] = []
    const io = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return
      io.disconnect()
      for (let i = 1; i <= FORMULA_TERMS.length + 1; i++) {
        timers.push(setTimeout(() => setCount(i), 350 + i * 320))
      }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); timers.forEach(clearTimeout) }
  }, [still])

  const done = count > FORMULA_TERMS.length
  const label = (i: number) => (fr ? FORMULA_TERMS[i].fr : FORMULA_TERMS[i].en)

  const Term = ({ i }: { i: number }) => (
    <span
      className={[
        'rounded-md px-1 font-extrabold tracking-tight transition-all duration-700 ease-out',
        i < count ? 'text-white blur-0 opacity-100' : 'text-white blur-[9px] opacity-40 select-none',
      ].join(' ')}
    >
      {label(i)}
    </span>
  )
  const Op = ({ children }: { children: string }) => (
    <span className="px-1 text-[0.6em] font-medium text-neutral-500">{children}</span>
  )

  return (
    <section
      ref={ref}
      id="formula-reveal"
      data-formula-reveal
      aria-label={fr ? 'La formule' : 'The formula'}
      className="relative flex w-full flex-col items-center overflow-hidden bg-black px-4 py-20 sm:py-24"
    >
      {/* Halo discret, plus marqué une fois la formule révélée */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: done ? 1 : 0.35, background: 'radial-gradient(ellipse 65% 45% at 50% 52%, rgb(var(--empire-rgb) / 0.09), transparent)' }}
      />

      <p className="relative mb-7 flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-neutral-500">
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
            ? 'Tu viens de la voir en action, terme par terme. Il ne manque que ton message.'
            : 'You just saw it in action, term by term. Only your message is missing.'}
        </p>
      </div>
    </section>
  )
}
