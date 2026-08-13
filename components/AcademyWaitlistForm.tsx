'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, ChevronLeft, Loader2 } from 'lucide-react'
import { getEmpParam } from '@/hooks/useCalLink'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'

export const ACADEMY_WAITLIST_DONE_KEY = 'academy_waitlist_done'

const DRAFT_KEY = 'academy_waitlist_draft'
const FLUSHED_KEY = 'academy_waitlist_flushed'
const COOKIE_NAME = 'academy_wl'
/** Flush whatever they typed if they stall / abandon. */
const FLUSH_MS = 3 * 60 * 1000

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const COUNTRIES = [
  { code: '+33', flag: '🇫🇷' },
  { code: '+32', flag: '🇧🇪' },
  { code: '+41', flag: '🇨🇭' },
  { code: '+1', flag: '🇺🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+212', flag: '🇲🇦' },
]

const SITUATIONS = [
  { value: 'salarie', fr: 'Salarié', en: 'Employed' },
  { value: 'indep', fr: 'Indépendant / freelance', en: 'Self-employed / freelance' },
  { value: 'etudiant', fr: 'Étudiant', en: 'Student' },
  { value: 'createur', fr: 'Créateur de contenu', en: 'Content creator' },
  { value: 'autre', fr: 'Autre', en: 'Other' },
] as const

const CONTENT_LEVELS = [
  { value: 'jamais', fr: 'Pas encore', en: 'Not yet' },
  { value: 'parfois', fr: 'De temps en temps', en: 'Sometimes' },
  { value: 'regulier', fr: 'Régulièrement', en: 'Regularly' },
] as const

type Draft = {
  firstName: string
  email: string
  phone: string
  countryCode: string
  linkedin: string
  situation: string
  contentLevel: string
  step: 1 | 2
  timerStartedAt?: number
}

const emptyDraft = (): Draft => ({
  firstName: '',
  email: '',
  phone: '',
  countryCode: '+33',
  linkedin: '',
  situation: '',
  contentLevel: '',
  step: 1,
})

const inputClass = (error: boolean) =>
  `w-full rounded-xl border bg-white/[0.06] px-4 py-3.5 text-sm text-white placeholder:text-neutral-400 transition-all focus:outline-none focus:ring-1 focus:ring-academy/40 ${
    error ? 'border-red-500' : 'border-white/25 focus:border-academy/60'
  }`

function readDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    return { ...emptyDraft(), ...JSON.parse(raw) } as Draft
  } catch {
    return null
  }
}

function writeDraft(draft: Draft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  } catch {
    /* ignore */
  }
  try {
    if (draft.email) {
      const maxAge = 60 * 60 * 24 * 30
      document.cookie = `${COOKIE_NAME}=1; Max-Age=${maxAge}; Path=/; SameSite=Lax`
    }
  } catch {
    /* ignore */
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {
    /* ignore */
  }
}

function alreadyFlushed(): boolean {
  try {
    return Boolean(sessionStorage.getItem(FLUSHED_KEY) || sessionStorage.getItem(ACADEMY_WAITLIST_DONE_KEY))
  } catch {
    return false
  }
}

function markFlushed() {
  try {
    sessionStorage.setItem(FLUSHED_KEY, '1')
  } catch {
    /* ignore */
  }
}

export default function AcademyWaitlistForm({
  className = '',
  onSuccess,
}: {
  className?: string
  onSuccess?: () => void
}) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState({
    firstName: '',
    email: '',
    phone: '',
    linkedin: '',
    situation: '',
    contentLevel: '',
  })
  const [countryCode, setCountryCode] = useState('+33')
  const [countryOpen, setCountryOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [position, setPosition] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const formRef = useRef(form)
  const countryRef = useRef(countryCode)
  const stepRef = useRef(step)
  const submittedRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const langRef = useRef(lang)

  formRef.current = form
  countryRef.current = countryCode
  stepRef.current = step
  submittedRef.current = submitted
  langRef.current = lang

  const buildPayload = (partial: boolean) => {
    const f = formRef.current
    const phone = f.phone.trim()
      ? `${countryRef.current}${f.phone.trim().replace(/\s/g, '')}`
      : undefined
    return {
      firstName: f.firstName.trim() || undefined,
      email: f.email.trim(),
      phone,
      linkedin: f.linkedin.trim() || undefined,
      situation: f.situation || undefined,
      contentLevel: f.contentLevel || undefined,
      lang: langRef.current,
      emp: getEmpParam() || undefined,
      partial,
    }
  }

  const persist = (nextStep?: 1 | 2, timerStartedAt?: number) => {
    const prev = readDraft()
    writeDraft({
      firstName: formRef.current.firstName,
      email: formRef.current.email,
      phone: formRef.current.phone,
      countryCode: countryRef.current,
      linkedin: formRef.current.linkedin,
      situation: formRef.current.situation,
      contentLevel: formRef.current.contentLevel,
      step: nextStep ?? stepRef.current,
      timerStartedAt: timerStartedAt ?? prev?.timerStartedAt,
    })
  }

  const flushLead = (partial: boolean, opts?: { beacon?: boolean }) => {
    const email = formRef.current.email.trim()
    if (!EMAIL_RE.test(email)) return
    if (submittedRef.current || alreadyFlushed()) return

    markFlushed()
    const payload = buildPayload(partial)
    const body = JSON.stringify(payload)

    if (opts?.beacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon('/api/academy-waitlist', blob)
      return
    }

    fetch('/api/academy-waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {})
  }

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const startFlushTimer = (fromTs?: number) => {
    clearTimer()
    if (submittedRef.current || alreadyFlushed()) return

    const started = fromTs || Date.now()
    persist(stepRef.current, started)
    const remaining = Math.max(0, FLUSH_MS - (Date.now() - started))

    timerRef.current = setTimeout(() => {
      flushLead(true)
    }, remaining)
  }

  // Restore draft + resume timer
  useEffect(() => {
    try {
      if (sessionStorage.getItem(ACADEMY_WAITLIST_DONE_KEY)) {
        setSubmitted(true)
        onSuccess?.()
        return
      }
    } catch {
      /* ignore */
    }

    const draft = readDraft()
    if (!draft?.email) return

    setForm({
      firstName: draft.firstName || '',
      email: draft.email || '',
      phone: draft.phone || '',
      linkedin: draft.linkedin || '',
      situation: draft.situation || '',
      contentLevel: draft.contentLevel || '',
    })
    setCountryCode(draft.countryCode || '+33')
    if (draft.step === 2) setStep(2)

    if (draft.timerStartedAt && !alreadyFlushed()) {
      const elapsed = Date.now() - draft.timerStartedAt
      if (elapsed >= FLUSH_MS) {
        // Fire after paint so refs have restored values
        setTimeout(() => flushLead(true), 0)
      } else {
        startFlushTimer(draft.timerStartedAt)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist on every change
  useEffect(() => {
    if (submitted) return
    if (!form.email && !form.firstName && !form.phone) return
    persist()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, countryCode, step, submitted])

  // Leave page OR close the modal before finishing → flush once.
  // Tab switches do NOT flush. Completing the form cancels this path.
  useEffect(() => {
    const onPageHide = () => flushLead(true, { beacon: true })
    window.addEventListener('pagehide', onPageHide)
    return () => {
      window.removeEventListener('pagehide', onPageHide)
      clearTimer()
      // Only after they started the flow (timer running / step 2), not on Strict Mode remounts.
      const draft = readDraft()
      if (draft?.timerStartedAt && EMAIL_RE.test(formRef.current.email.trim())) {
        flushLead(true, { beacon: true })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCountryOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: false }))
  }

  const goToStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = {
      firstName: !form.firstName.trim(),
      email: !EMAIL_RE.test(form.email.trim()),
      phone: !form.phone.trim() || form.phone.replace(/\D/g, '').length < 8,
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setErrorMessage(null)
    setStep(2)
    // Start 3 min countdown — if they stall / leave, we still get the lead once.
    startFlushTimer(Date.now())
  }

  const finish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    const nextErrors = {
      linkedin: !form.linkedin.trim(),
      situation: !form.situation,
      contentLevel: !form.contentLevel,
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    clearTimer()
    setLoading(true)
    setErrorMessage(null)
    try {
      // If timer already flushed, this silently enriches DB (no 2nd Slack).
      // If not, this is the only Slack/Folk ping — with full data.
      const res = await fetch('/api/academy-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(false)),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setErrorMessage(
          data?.error ||
            (fr
              ? 'Une erreur est survenue. Réessayez dans un instant.'
              : 'Something went wrong. Please try again.'),
        )
        return
      }
      markFlushed()
      setPosition(typeof data.position === 'number' ? data.position : null)
      setSubmitted(true)
      clearDraft()
      try {
        sessionStorage.setItem(ACADEMY_WAITLIST_DONE_KEY, '1')
      } catch {
        /* ignore */
      }
      onSuccess?.()
      trackAmplitude('academy_waitlist_signup', { position: data.position ?? null })
    } catch {
      setErrorMessage(
        fr
          ? 'Une erreur est survenue. Réessayez dans un instant.'
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border border-academy/30 bg-academy/[0.06] p-6 text-center ${className}`}
      >
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-academy/20">
          <Check size={20} className="text-academy" strokeWidth={3} />
        </div>
        <p className="text-lg font-bold text-white">
          {position !== null
            ? (fr ? `Vous êtes n°${position} dans la file.` : `You're #${position} in the queue.`)
            : (fr ? 'Vous êtes sur la liste.' : "You're on the list.")}
        </p>
        <p className="mt-2 text-sm text-neutral-400">
          {fr
            ? 'On lit chaque candidature. On vous écrit dès que les inscriptions de la prochaine promo ouvrent.'
            : "We read every application. We'll write you as soon as the next cohort opens."}
        </p>
      </motion.div>
    )
  }

  return (
    <div className={className}>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex flex-1 gap-1.5">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-academy' : 'bg-white/10'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-academy' : 'bg-white/10'}`} />
        </div>
        <span className="text-[11px] font-medium text-neutral-500">{step}/2</span>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form
            key="step-1"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18 }}
            onSubmit={goToStep2}
            className="space-y-3"
          >
            <p className="text-xs font-medium text-neutral-400">
              {fr ? 'Vos coordonnées' : 'Your details'}
            </p>

            <input
              type="text"
              placeholder={fr ? 'Votre prénom *' : 'Your first name *'}
              value={form.firstName}
              onChange={(e) => setField('firstName', e.target.value)}
              autoComplete="given-name"
              className={inputClass(!!errors.firstName)}
            />
            <input
              type="email"
              placeholder={fr ? 'Votre email *' : 'Your email *'}
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              autoComplete="email"
              inputMode="email"
              className={inputClass(!!errors.email)}
            />

            <div
              ref={dropdownRef}
              className={`flex overflow-hidden rounded-xl border bg-white/[0.06] focus-within:ring-1 focus-within:ring-academy/40 ${
                errors.phone ? 'border-red-500' : 'border-white/25 focus-within:border-academy/60'
              }`}
            >
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCountryOpen((o) => !o)}
                  className="flex h-full items-center gap-1 border-r border-white/15 px-3 text-sm text-white"
                >
                  <span>{COUNTRIES.find((c) => c.code === countryCode)?.flag}</span>
                  <span className="text-neutral-300">{countryCode}</span>
                  <ChevronDown size={14} className="text-neutral-500" />
                </button>
                {countryOpen && (
                  <div className="absolute left-0 top-full z-20 mt-1 max-h-48 w-36 overflow-y-auto rounded-xl border border-white/15 bg-[#141414] py-1 shadow-xl">
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setCountryCode(c.code)
                          setCountryOpen(false)
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-white/10 ${
                          c.code === countryCode ? 'text-academy' : 'text-white'
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="tel"
                placeholder={fr ? 'Téléphone *' : 'Phone *'}
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                autoComplete="tel-national"
                inputMode="tel"
                className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm text-white placeholder:text-neutral-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-academy px-4 py-4 text-base font-bold text-black transition-all hover:brightness-110"
            >
              {fr ? 'Continuer' : 'Continue'} →
            </button>

            <p className="text-center text-[11px] text-neutral-500">
              {fr
                ? '20 places · Sur sélection · Réponse après lecture'
                : '20 spots · By selection · Reply after review'}
            </p>
          </motion.form>
        ) : (
          <motion.form
            key="step-2"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.18 }}
            onSubmit={finish}
            className="space-y-3"
          >
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null)
                setStep(1)
              }}
              className="inline-flex items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-white"
            >
              <ChevronLeft size={14} />
              {fr ? 'Retour' : 'Back'}
            </button>

            <p className="text-xs font-medium text-neutral-400">
              {fr ? 'Quelques questions pour la sélection' : 'A few questions for selection'}
            </p>

            <input
              type="url"
              placeholder={fr ? 'Profil LinkedIn *' : 'LinkedIn profile *'}
              value={form.linkedin}
              onChange={(e) => setField('linkedin', e.target.value)}
              autoComplete="url"
              className={inputClass(!!errors.linkedin)}
            />

            <div>
              <p className="mb-1.5 text-xs font-medium text-neutral-400">
                {fr ? 'Votre situation *' : 'Your situation *'}
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {SITUATIONS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setField('situation', s.value)}
                    className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-all ${
                      form.situation === s.value
                        ? 'border-academy/60 bg-academy/10 text-white'
                        : errors.situation
                          ? 'border-red-500/60 text-neutral-300'
                          : 'border-white/15 text-neutral-300 hover:border-white/30'
                    }`}
                  >
                    {fr ? s.fr : s.en}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium text-neutral-400">
                {fr ? 'Vous créez déjà du contenu ? *' : 'Do you already create content? *'}
              </p>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
                {CONTENT_LEVELS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setField('contentLevel', c.value)}
                    className={`rounded-xl border px-3 py-2.5 text-center text-sm transition-all ${
                      form.contentLevel === c.value
                        ? 'border-academy/60 bg-academy/10 text-white'
                        : errors.contentLevel
                          ? 'border-red-500/60 text-neutral-300'
                          : 'border-white/15 text-neutral-300 hover:border-white/30'
                    }`}
                  >
                    {fr ? c.fr : c.en}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-academy px-4 py-4 text-base font-bold text-black transition-all hover:brightness-110 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {fr ? 'Envoi en cours...' : 'Sending...'}
                </>
              ) : (
                <>{fr ? 'Envoyer ma candidature' : 'Submit my application'} →</>
              )}
            </button>

            {errorMessage && (
              <p className="text-center text-xs text-red-400">{errorMessage}</p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
