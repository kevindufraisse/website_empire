'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Loader2, Sparkles, Check, X, Lock } from 'lucide-react'
import {
  ARCHETYPES,
  QUESTIONS,
  STEP_MESSAGES,
  TOTAL_QUESTIONS,
  iconAvatarUrl,
  type IconFigure,
} from '@/lib/quiz-data'
import { computeQuizResult } from '@/lib/quiz-scoring'
import QuizResult, { type QuizResultPayload } from './QuizResult'

const INTRO_ARCHETYPES = [
  {
    id: 'storyteller',
    icon: ARCHETYPES.storyteller.icons[0],
    label: 'Storyteller',
    stat: '4.2M abonnés',
    labelClass: 'text-cyan-300',
    ringClass: 'ring-cyan-400/50',
  },
  {
    id: 'builder',
    icon: ARCHETYPES.builder.icons[0],
    label: 'Builder',
    stat: '900k abonnés',
    labelClass: 'text-empire',
    ringClass: 'ring-empire/50',
  },
  {
    id: 'educator',
    icon: ARCHETYPES.educator.icons[0],
    label: 'Éducateur',
    stat: '4.1M abonnés',
    labelClass: 'text-amber-300',
    ringClass: 'ring-amber-400/50',
  },
  {
    id: 'provocateur',
    icon: ARCHETYPES.provocateur.icons[0],
    label: 'Provocateur',
    stat: '3.1M abonnés',
    labelClass: 'text-rose-300',
    ringClass: 'ring-rose-400/50',
  },
] as const

const INTRO_FEATURES = [
  { title: '10 sujets à poster cette semaine (Instagram, LinkedIn...)' },
  { title: 'Les raisons pour lesquelles vos posts ne convertissent pas' },
  { title: 'Votre plan d\'action de 30 jours à copier-coller' },
]

const INTRO_OUTCOMES = [
  'Vous savez quoi poster',
  'Vous produisez 3x plus vite',
  'Vous convertissez vos lecteurs',
]

const STORAGE_KEY = 'empire_quiz_v1'
const ANALYTICS_PREFIX = 'quiz'

type Stage = 'intro' | 'question' | 'computing' | 'email' | 'submitting' | 'result'

interface SavedState {
  answers: Record<string, string>
  email: string
  firstName: string
  cursor: number
  stage: Stage
  /** Local preview computed right after the last question (used to teaser the email gate). */
  preview?: QuizResultPayload
  result?: QuizResultPayload
}

const initial: SavedState = {
  answers: {},
  email: '',
  firstName: '',
  cursor: 0,
  stage: 'intro',
}

function track(event: string, payload?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const w = window as unknown as { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event: `${ANALYTICS_PREFIX}_${event}`, ...payload })
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

interface Props {
  /** Hook tagline shown on the intro screen. */
  hookOverride?: string
  /** Called when the user completes the quiz. */
  onCompleted?: (result: QuizResultPayload) => void
  /** Called when the user dismisses the quiz (close button). When provided, a close button is shown. */
  onDismiss?: () => void
}

export default function EmpireQuiz({ hookOverride, onCompleted, onDismiss }: Props) {
  const [state, setState] = useState<SavedState>(initial)
  const [submitting, setSubmitting] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [direction, setDirection] = useState<1 | -1>(1)
  const hydrated = useRef(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as SavedState
        if (parsed && typeof parsed === 'object') {
          // Recovery: if user closed mid-submission, fall back to email stage so they can retry.
          // This prevents being stuck on "loading" forever after a failed/interrupted submit.
          if (parsed.stage === 'submitting' && !parsed.result) {
            parsed.stage = 'email'
          }
          // If they closed during local computing, the useEffect below will re-run the compute.
          setState(parsed)
        }
      }
    } catch { /* ignore */ }
    hydrated.current = true
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch { /* ignore */ }
  }, [state])

  // ─── Actions ────────────────────────────────────────────────────────────────

  function start() {
    track('start')
    setDirection(1)
    setState(s => ({ ...s, stage: 'question', cursor: 0 }))
  }

  function answer(qid: string, optionId: string) {
    track('answer', { question: qid, option: optionId })
    setDirection(1)
    setState(s => {
      const nextAnswers = { ...s.answers, [qid]: optionId }
      const nextCursor = s.cursor + 1
      const isLast = nextCursor >= TOTAL_QUESTIONS
      // On the last answer: switch to "computing" stage. The result is computed
      // client-side during the loader so we can teaser the score on the email gate.
      return {
        ...s,
        answers: nextAnswers,
        cursor: isLast ? s.cursor : nextCursor,
        stage: isLast ? 'computing' : 'question',
      }
    })
  }

  // Compute preview locally after the last answer, then move to email gate.
  useEffect(() => {
    if (state.stage !== 'computing') return
    let cancelled = false
    const minWait = setTimeout(() => {
      if (cancelled) return
      try {
        const local = computeQuizResult(state.answers)
        const preview: QuizResultPayload = {
          archetype: local.archetype,
          score: local.score,
          scoreBand: local.scoreBand,
          recommendedOffer: local.recommendedOffer,
          secondaryOffer: local.secondaryOffer,
          archetypeRanking: local.archetypeRanking,
          premiumEligible: local.premiumEligible,
        }
        track('teaser_shown', { archetype: preview.archetype, score: preview.score })
        setState(s => ({ ...s, stage: 'email', preview }))
      } catch (err) {
        console.error('[quiz preview]', err)
        // Fallback: skip teaser, go straight to email gate.
        setState(s => ({ ...s, stage: 'email' }))
      }
    }, 2400)
    return () => {
      cancelled = true
      clearTimeout(minWait)
    }
  }, [state.stage, state.answers])

  function back() {
    setDirection(-1)
    setState(s => {
      if (s.stage === 'email') return { ...s, stage: 'question', cursor: TOTAL_QUESTIONS - 1 }
      if (s.stage === 'question' && s.cursor > 0) return { ...s, cursor: s.cursor - 1 }
      if (s.stage === 'question' && s.cursor === 0) return { ...s, stage: 'intro' }
      return s
    })
  }

  async function submitEmail() {
    setEmailError(null)
    if (!isValidEmail(state.email)) {
      setEmailError('Email invalide')
      return
    }
    track('email_submit')

    // Lead-only push as a safety net (mid-flow lead capture).
    fetch('/api/quiz/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: state.email, first_name: state.firstName }),
    }).catch(() => {})

    setSubmitting(true)
    setDirection(1)
    setState(s => ({ ...s, stage: 'submitting' }))

    let result: QuizResultPayload | null = null
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: state.email,
          first_name: state.firstName,
          answers: state.answers,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data?.result) throw new Error(data?.error || 'Erreur')
      result = data.result as QuizResultPayload
    } catch (err) {
      console.error('[quiz submit]', err)
      setSubmitting(false)
      // Fall back to the local preview if the server failed — the user still gets a result.
      if (state.preview) {
        result = state.preview
      } else {
        setState(s => ({ ...s, stage: 'email' }))
        setEmailError('Une erreur est survenue. Réessayez dans un instant.')
        return
      }
    }

    track('completed', { archetype: result!.archetype, score: result!.score })
    setSubmitting(false)
    setState(s => ({ ...s, stage: 'result', result: result! }))
    onCompleted?.(result!)
  }

  function restart() {
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
    hydrated.current = false
    setState(initial)
    setEmailError(null)
    setSubmitting(false)
    requestAnimationFrame(() => { hydrated.current = true })
  }

  // ─── Computed ───────────────────────────────────────────────────────────────

  const currentQuestion = QUESTIONS[state.cursor]
  const completedCount = Object.keys(state.answers).length
  const progressPct = (() => {
    if (state.stage === 'intro') return 0
    if (state.stage === 'question') return Math.round((completedCount / (TOTAL_QUESTIONS + 1)) * 100)
    if (state.stage === 'computing') return Math.round((TOTAL_QUESTIONS / (TOTAL_QUESTIONS + 1)) * 100)
    if (state.stage === 'email' || state.stage === 'submitting') return 96
    return 100
  })()

  // ─── Variants ───────────────────────────────────────────────────────────────

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  }

  // ─── Result ─────────────────────────────────────────────────────────────────

  if (state.stage === 'result' && state.result) {
    return (
      <Shell onDismiss={onDismiss} progressPct={100}>
        <div className="w-full max-w-3xl mx-auto py-6">
          <QuizResult
            result={state.result}
            email={state.email}
            firstName={state.firstName}
            answers={state.answers}
            onRestart={restart}
          />
        </div>
      </Shell>
    )
  }

  return (
    <Shell
      onDismiss={state.stage === 'intro' ? onDismiss : undefined}
      progressPct={progressPct}
      onBack={
        state.stage === 'question' || state.stage === 'email'
          ? back
          : undefined
      }
    >
      <AnimatePresence mode="wait" custom={direction}>
          {/* ── INTRO ── */}
          {state.stage === 'intro' && (
            <motion.div
              key="intro"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-3xl mx-auto"
            >
              {/* ── Top: Title + grid side by side on desktop ── */}
              <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 mb-4">
                {/* Title block */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-empire opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-empire" />
                    </span>
                    <span className="text-[11px] uppercase tracking-widest text-neutral-300 font-medium">
                      +700 entrepreneurs testés · 90 secondes
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-white leading-[1.1] mb-2.5">
                    Découvrez le type de créateur que vous êtes.
                  </h1>
                  <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
                    Et recevez un plan d&apos;action de 30 jours pour transformer vos lecteurs en clients payants.
                  </p>
                </div>

                {/* 4 archetype circles */}
                <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-sm lg:max-w-xs flex-shrink-0">
                  {INTRO_ARCHETYPES.map((a, i) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-[3px] ${a.ringClass} bg-neutral-800`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={iconAvatarUrl(a.icon)}
                          alt={a.icon.name}
                          className="w-full h-full object-cover"
                          loading="eager"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${a.labelClass}`}>
                        {a.label}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-neutral-500 font-medium -mt-0.5">
                        {a.stat}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ── Features cards ── */}
              <div className="mb-6 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
                  {INTRO_FEATURES.map((f, i) => (
                    <motion.div
                      key={f.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + i * 0.06 }}
                      className="flex items-center justify-center px-4 py-4 rounded-xl bg-white/[0.04] border border-white/10 text-center"
                    >
                      <span className="text-xs sm:text-sm font-semibold text-neutral-200 leading-snug">{f.title}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ── Outcomes ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-5 flex items-center justify-center gap-3 sm:gap-4 flex-wrap"
              >
                {INTRO_OUTCOMES.map((o) => (
                  <span key={o} className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
                    <span className="w-1 h-1 rounded-full bg-empire" />
                    {o}
                  </span>
                ))}
              </motion.div>

              {/* CTA */}
              <div className="text-center">
                  <button
                  onClick={start}
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-empire text-black font-bold text-lg hover:scale-[1.03] active:scale-100 transition-all shadow-[0_0_40px_rgb(var(--empire-rgb)_/_0.45)]"
                >
                  Découvrir mon archétype
                  <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <p className="text-xs text-neutral-500 mt-2">
                  10 questions · 90 secondes · Gratuit
                </p>
              </div>
            </motion.div>
          )}

        {/* ── QUESTION ── */}
        {state.stage === 'question' && currentQuestion && (
          <motion.div
            key={`q-${currentQuestion.id}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl mx-auto"
          >
            {/* Encouraging message (Timeleft-style) — appears before specific questions */}
            {STEP_MESSAGES[currentQuestion.step] && (
              <motion.div
                key={`msg-${currentQuestion.step}`}
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex justify-center mb-4"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-empire/15 border border-empire/30">
                  <span className="text-base">{STEP_MESSAGES[currentQuestion.step].emoji}</span>
                  <span className="text-xs sm:text-sm font-semibold text-empire">
                    {STEP_MESSAGES[currentQuestion.step].text}
                  </span>
                </div>
              </motion.div>
            )}

            <p className="text-[11px] uppercase tracking-[0.2em] text-empire font-bold mb-4 text-center">
              {currentQuestion.kicker}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-[2.6rem] font-black text-white leading-[1.15] mb-3 text-center">
              {currentQuestion.question}
            </h2>
            {currentQuestion.helper && (
              <p className="text-sm sm:text-base text-neutral-400 mb-8 text-center max-w-md mx-auto">
                {currentQuestion.helper}
              </p>
            )}

            <div className="flex flex-col gap-2.5 mt-8">
              {currentQuestion.options.map((opt, i) => {
                const isSelected = state.answers[currentQuestion.id] === opt.id
                return (
                  <motion.button
                    key={opt.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i, duration: 0.3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => answer(currentQuestion.id, opt.id)}
                    className={`group relative flex items-center gap-4 text-left px-5 py-4 sm:px-6 sm:py-5 rounded-2xl border-2 transition-colors ${
                      isSelected
                        ? 'bg-empire/15 border-empire text-white'
                        : 'bg-white/[0.03] border-white/10 text-neutral-200 hover:bg-white/[0.06] hover:border-white/30'
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-xl transition-all ${
                        isSelected
                          ? 'bg-empire text-black'
                          : 'bg-white/[0.06] border border-white/10 group-hover:bg-white/[0.12]'
                      }`}
                    >
                      {isSelected ? (
                        <Check size={18} strokeWidth={3} />
                      ) : opt.emoji ? (
                        <span aria-hidden>{opt.emoji}</span>
                      ) : (
                        <span className="text-sm font-bold text-neutral-300">
                          {String.fromCharCode(65 + i)}
                        </span>
                      )}
                    </span>
                    <span className="text-base sm:text-[17px] leading-snug font-medium">
                      {opt.label}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ── COMPUTING (loader BEFORE email gate) ── */}
        {state.stage === 'computing' && (
          <motion.div
            key="computing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md mx-auto py-10 text-center"
          >
            <Loader2 className="mx-auto text-empire animate-spin mb-6" size={36} />
            <p className="text-white font-bold text-xl mb-6">On analyse votre profil…</p>
            <div className="space-y-2.5 max-w-xs mx-auto text-left text-base text-neutral-400">
              <LoaderTick delay={0.1} text="Analyse de vos réponses" />
              <LoaderTick delay={0.8} text="Détection de votre archétype" />
              <LoaderTick delay={1.5} text="Calcul de votre score" />
            </div>
          </motion.div>
        )}

        {/* ── EMAIL GATE (with score teaser) ── */}
        {state.stage === 'email' && (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl mx-auto"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-empire font-bold mb-3 text-center">
              ✓ Analyse terminée
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-[1.1] mb-2 text-center">
              {state.firstName ? `${state.firstName}, votre ` : 'Votre '}
              <span className="text-empire">résultat est prêt.</span>
            </h2>
            <p className="text-base text-neutral-400 mb-6 text-center max-w-md mx-auto">
              On vous l&apos;envoie où ? Votre plan complet + votre archétype + votre tribu de
              Creators arrivent dans votre boîte.
            </p>

            {/* Teaser of the score, blurred to create curiosity */}
            {state.preview && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="relative mx-auto mb-6 max-w-sm rounded-2xl p-5 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 overflow-hidden"
              >
                {(() => {
                  const sharePct: Record<string, number> = { storyteller: 32, educator: 30, builder: 22, provocateur: 16 }
                  return (
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-left min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold mb-1">
                          Votre archétype
                        </p>
                        <p className="text-white font-black text-lg leading-tight truncate">
                          {ARCHETYPES[state.preview.archetype].emoji}{' '}
                          <span className="select-none">
                            {ARCHETYPES[state.preview.archetype].name}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-empire font-black text-2xl tabular-nums">
                          {sharePct[state.preview.archetype]}%
                        </p>
                        <p className="text-[10px] text-neutral-500 font-medium">
                          des créateurs Empire
                        </p>
                      </div>
                    </div>
                  )
                })()}

                {/* Locked plan preview */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                    <Lock size={12} />
                    <span>Verrouillé · Disponible après votre email</span>
                  </div>
                  <div className="space-y-1.5 select-none">
                    <div className="h-3 rounded bg-white/5 w-3/4" />
                    <div className="h-3 rounded bg-white/5 w-1/2" />
                    <div className="h-3 rounded bg-white/5 w-2/3" />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Votre prénom"
                value={state.firstName}
                onChange={e => setState(s => ({ ...s, firstName: e.target.value }))}
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border-2 border-white/10 text-white text-base placeholder-neutral-500 focus:outline-none focus:border-empire/60 focus:bg-white/[0.07] transition"
              />
              <input
                type="email"
                placeholder="votre@email.com"
                autoComplete="email"
                inputMode="email"
                value={state.email}
                onChange={e => {
                  setState(s => ({ ...s, email: e.target.value }))
                  if (emailError) setEmailError(null)
                }}
                onKeyDown={e => { if (e.key === 'Enter') submitEmail() }}
                className={`w-full px-5 py-4 rounded-2xl bg-white/5 border-2 text-white text-base placeholder-neutral-500 focus:outline-none focus:bg-white/[0.07] transition ${
                  emailError ? 'border-red-500/60' : 'border-white/10 focus:border-empire/60'
                }`}
              />
              {emailError && (
                <p className="text-sm text-red-400 -mt-1">{emailError}</p>
              )}
              <button
                onClick={submitEmail}
                disabled={submitting || !state.email}
                className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-empire text-black font-bold text-base hover:scale-[1.02] active:scale-100 transition-all shadow-[0_0_30px_rgb(var(--empire-rgb)_/_0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Débloquer mon résultat complet
                <ArrowRight size={18} />
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-neutral-500">
              🔒 Aucun spam, désabonnement en 1 clic
            </p>
          </motion.div>
        )}

        {/* ── SUBMITTING (mini-loader during API call) ── */}
        {state.stage === 'submitting' && (
          <motion.div
            key="submitting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md mx-auto py-10 text-center"
          >
            <Loader2 className="mx-auto text-empire animate-spin mb-4" size={32} />
            <p className="text-white font-semibold text-base">Préparation de votre résultat…</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  )
}

// ─── Shell (full-bleed surface, top bar with progress) ──────────────────────

function Shell({
  children,
  progressPct,
  onBack,
  onDismiss,
  hideTopBar,
}: {
  children: React.ReactNode
  progressPct: number
  onBack?: () => void
  onDismiss?: () => void
  hideTopBar?: boolean
}) {
  return (
    <div className="relative w-full min-h-[600px] flex flex-col">
      {!hideTopBar && (
        <div className="sticky top-0 z-10 px-4 sm:px-6 pt-4 pb-3 bg-gradient-to-b from-black via-black/95 to-black/0">
          <div className="flex items-center gap-3 mb-3">
            <button
              type="button"
              onClick={onBack}
              disabled={!onBack}
              className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/5 transition disabled:opacity-30 disabled:cursor-default"
              aria-label="Précédent"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full bg-empire rounded-full"
                initial={false}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            {onDismiss ? (
              <button
                type="button"
                onClick={onDismiss}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/20 transition"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            ) : (
              <div className="w-9 h-9" />
            )}
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center px-5 sm:px-6 py-4 sm:py-6">
        {children}
      </div>
    </div>
  )
}

function LoaderTick({ delay, text }: { delay: number; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3"
    >
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 0.4, type: 'spring', stiffness: 300 }}
        className="text-empire flex-shrink-0"
      >
        <Check size={18} strokeWidth={3} />
      </motion.span>
      <span>{text}</span>
    </motion.div>
  )
}
