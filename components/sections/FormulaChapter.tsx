'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { FORMULA_TERMS, FORMULA_RESULT } from './formulaTerms'

/**
 * Le chapitre de la formule : UN seul moment cinéma, juste après le hero.
 * ~3 écrans de scroll, un terme géant à la fois avec sa ligne de preuve,
 * la formule qui s'assemble en bas au fil des beats, le tampon SECRET qui
 * tombe à la fin sur « = Confiance + Ventes + Recommandation ».
 * Reduced motion : la formule assemblée et le résultat, sans course.
 */
const PROOFS = [
  {
    fr: 'Ton avis, tes idées, ta voix. La seule chose qu’on ne peut pas faire à ta place.',
    en: 'Your take, your ideas, your voice. The one thing we can’t do for you.',
  },
  {
    fr: 'Une vidéo vue un million de fois a un format, pas de la chance.',
    en: 'A video seen a million times has a format, not luck.',
  },
  {
    fr: 'Publié chaque jour sur 7 réseaux, chaque post avec son lien tracké.',
    en: 'Published every day on 7 networks, every post with its tracked link.',
  },
  {
    fr: '1 h par semaine de ton côté. L’équipe fait le reste.',
    en: '1 hour a week on your side. The team does the rest.',
  },
  {
    fr: 'Le prix d’un abonnement, pas d’une équipe entière.',
    en: 'The price of a subscription, not a whole team.',
  },
]

export default function FormulaChapter() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const still = usePrefersReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [beat, setBeat] = useState(0)
  // 7 beats : l'énigme, les 5 termes, la formule au complet.
  useMotionValueEvent(scrollYProgress, 'change', v => setBeat(Math.min(6, Math.floor(v * 7))))

  const label = (i: number) => (fr ? FORMULA_TERMS[i].fr : FORMULA_TERMS[i].en)
  const done = still || beat >= 6
  const revealedCount = still ? 5 : Math.max(0, Math.min(5, beat))

  // La formule assemblée (petite pendant les beats, grande au final).
  const Assembled = ({ big }: { big: boolean }) => (
    <div
      className={
        big
          ? 'relative flex flex-col items-center leading-none text-2xl min-[420px]:text-3xl sm:text-5xl md:text-6xl'
          : 'relative flex items-center leading-none text-sm sm:text-base'
      }
    >
      {big ? (
        <>
          <div className="flex items-center whitespace-nowrap">
            <Term i={0} big /><Op big>×</Op><Term i={1} big /><Op big>×</Op><Term i={2} big />
          </div>
          <div className="my-3 h-px w-full bg-white/25 sm:my-4" />
          <div className="flex items-center whitespace-nowrap">
            <Term i={3} big /><Op big>+</Op><Term i={4} big />
          </div>
        </>
      ) : (
        <div className="flex items-center whitespace-nowrap">
          {FORMULA_TERMS.map((t, i) => (
            <span key={t.key} className="flex items-center">
              {i > 0 && <Op>{i === 3 ? '/' : i === 4 ? '+' : '×'}</Op>}
              <Term i={i} />
            </span>
          ))}
        </div>
      )}
    </div>
  )
  const Term = ({ i, big }: { i: number; big?: boolean }) => (
    <span
      className={[
        'rounded-md font-extrabold tracking-tight transition-all duration-700 ease-out',
        big ? 'px-1' : 'px-0.5',
        i < revealedCount ? 'text-white blur-0 opacity-100' : `text-white select-none ${big ? 'blur-[9px]' : 'blur-[4px]'} opacity-40`,
      ].join(' ')}
    >
      {label(i)}
    </span>
  )
  const Op = ({ children, big }: { children: string; big?: boolean }) => (
    <span className={`font-medium text-neutral-500 ${big ? 'px-1 text-[0.6em]' : 'px-0.5 text-[0.7em]'}`}>{children}</span>
  )

  const Result = () => (
    <div className={'flex flex-col items-center text-center transition-all duration-700 ' + (done ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0')}>
      <p className="text-xl font-extrabold tracking-tight text-white sm:text-3xl">
        = <span className="text-empire">{fr ? FORMULA_RESULT.fr : FORMULA_RESULT.en}</span>
      </p>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
        {fr ? 'Il ne manque que ton message. La suite de la page te montre tout.' : 'Only your message is missing. The rest of the page shows you everything.'}
      </p>
    </div>
  )

  return (
    <section
      ref={ref}
      id="formula-chapter"
      data-formula-reveal
      aria-label={fr ? 'La formule' : 'The formula'}
      className="relative w-full bg-black"
      style={still ? undefined : { height: '340svh' }}
    >
      <div className={(still ? 'relative ' : 'sticky top-0 ') + 'flex h-svh min-h-[560px] w-full flex-col items-center justify-center overflow-hidden px-4'}>
        {/* Halo discret, plus marqué une fois la formule révélée */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: done ? 1 : 0.35, background: 'radial-gradient(ellipse 65% 45% at 50% 52%, rgb(var(--empire-rgb) / 0.09), transparent)' }}
        />

        <p className="relative mb-8 flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-neutral-500">
          <span className="h-1.5 w-1.5 rounded-full bg-empire" aria-hidden />
          {fr ? 'La formule' : 'The formula'}
        </p>

        {still ? (
          /* Reduced motion : tout, d'un bloc. */
          <div className="relative flex flex-col items-center gap-7">
            <div className="relative rounded-3xl border border-white/15 bg-black/85 px-6 py-6 sm:px-12 sm:py-9">
              <Assembled big />
            </div>
            <Result />
          </div>
        ) : (
          <>
            {/* La scène : un beat à la fois */}
            <div className="relative flex min-h-[16rem] w-full max-w-3xl flex-1 max-h-[26rem] flex-col items-center justify-center text-center">
              <AnimatePresence mode="wait">
                {beat === 0 && (
                  <motion.div key="intro" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
                    <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                      {fr ? 'Il existe une formule.' : 'There is a formula.'}
                    </h2>
                    <p className="mt-4 text-base text-neutral-400 sm:text-lg">
                      {fr ? 'Cinq termes. Un par un.' : 'Five terms. One at a time.'}
                    </p>
                  </motion.div>
                )}
                {beat >= 1 && beat <= 5 && (
                  <motion.div key={'t' + beat} initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }} transition={{ duration: 0.45, ease: 'easeOut' }}>
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-empire">{beat} / 5</p>
                    <h2 className="mt-3 text-5xl font-extrabold tracking-tight text-white sm:text-8xl">{label(beat - 1)}</h2>
                    <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-neutral-300 sm:text-lg">
                      {fr ? PROOFS[beat - 1].fr : PROOFS[beat - 1].en}
                    </p>
                  </motion.div>
                )}
                {beat >= 6 && (
                  <motion.div key="final" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="flex flex-col items-center gap-7">
                    <div className="relative rounded-3xl border border-white/15 bg-black/85 px-6 py-6 shadow-[0_30px_90px_-24px_rgba(0,0,0,0.95)] sm:px-12 sm:py-9">
                      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0)_45%)]" />
                      <Assembled big />
                    </div>
                    <Result />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* La formule qui s'assemble en bas, tamponnée SECRET tant qu'elle n'est pas complète */}
            <div className={'relative mb-2 transition-all duration-500 ' + (beat >= 6 ? 'pointer-events-none translate-y-3 opacity-0' : 'translate-y-0 opacity-100')}>
              <div className="relative rounded-full border border-white/12 bg-black/80 px-5 py-2.5">
                <Assembled big={false} />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-3 right-0 -rotate-[10deg] select-none rounded-[3px] border-2 border-red-500 px-1.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-red-500 sm:-right-4"
                >
                  Secret
                </span>
              </div>
            </div>
            {/* Indice de scroll */}
            <div className={'relative flex flex-col items-center gap-1 pb-2 text-[11px] font-semibold text-neutral-400 transition-opacity duration-500 ' + (beat >= 6 ? 'opacity-0' : 'opacity-100')} aria-hidden>
              <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} className="text-empire">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
              </motion.span>
              {fr ? 'Scrolle' : 'Scroll'}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
