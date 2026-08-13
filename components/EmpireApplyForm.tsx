'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { getEmpParam } from '@/hooks/useCalLink'
import { useLanguage } from '@/contexts/LanguageContext'

const HOURS = [
  { value: 'moins-1h', fr: 'Moins d\'1 h', en: 'Less than 1h' },
  { value: '1-2h', fr: '1 à 2 h', en: '1–2h' },
  { value: '2-5h', fr: '2 à 5 h', en: '2–5h' },
  { value: '5h+', fr: 'Plus de 5 h', en: 'More than 5h' },
]

const SKILL = [
  { value: 'oui', fr: 'Oui, je suis à l\'aise', en: 'Yes, I\'m comfortable' },
  { value: 'un-peu', fr: 'Un peu, j\'ai besoin d\'aide', en: 'A bit - I need help' },
  { value: 'non', fr: 'Non, je pars de zéro', en: 'No, I\'m starting from zero' },
]

const PUBLISHING = [
  { value: 'oui-regulier', fr: 'Oui, régulièrement', en: 'Yes, regularly' },
  { value: 'parfois', fr: 'Parfois', en: 'Sometimes' },
  { value: 'non', fr: 'Pas encore', en: 'Not yet' },
]

const COUNTRIES = [
  { code: '+33', flag: '🇫🇷' },
  { code: '+32', flag: '🇧🇪' },
  { code: '+41', flag: '🇨🇭' },
  { code: '+1', flag: '🇺🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+212', flag: '🇲🇦' },
]

type StepId = 'email' | 'hours' | 'skill' | 'publishing' | 'contact'

const STEP_ORDER: StepId[] = ['email', 'hours', 'skill', 'publishing', 'contact']

export default function EmpireApplyForm() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState<StepId>('email')
  const [hoursPerWeek, setHoursPerWeek] = useState('')
  const [contentSkill, setContentSkill] = useState('')
  const [alreadyPublishing, setAlreadyPublishing] = useState('')
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+33')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fromUrl = searchParams.get('email')
    if (fromUrl) {
      setEmail(fromUrl)
      setStep('hours')
    }
  }, [searchParams])

  const progressSteps = email && step !== 'email' ? STEP_ORDER.filter((s) => s !== 'email') : STEP_ORDER
  const progressIndex = Math.max(0, progressSteps.indexOf(step))

  function pick(setter: (v: string) => void, value: string, next: StepId) {
    setter(value)
    setTimeout(() => setStep(next), 180)
  }

  async function submitContact(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!firstName.trim() || !email.trim() || !phone.trim()) {
      setError(fr ? 'Remplis tous les champs.' : 'Fill in all fields.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/empire-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          phone: `${countryCode}${phone.trim()}`,
          hoursPerWeek,
          contentSkill,
          alreadyPublishing,
          emp: getEmpParam(),
        }),
      })
      if (!res.ok) throw new Error('fail')
      router.push('/thank-you?from=waitlist')
    } catch {
      setError(fr ? 'Une erreur est survenue. Réessaie.' : 'Something went wrong. Try again.')
      setLoading(false)
    }
  }

  function ChoiceList({
    options,
    value,
    onPick,
  }: {
    options: { value: string; fr: string; en: string }[]
    value: string
    onPick: (v: string) => void
  }) {
    return (
      <div className="grid gap-2.5 w-full max-w-md mx-auto">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onPick(o.value)}
            className={`rounded-xl border px-4 py-4 text-left text-sm font-medium transition-all ${
              value === o.value
                ? 'border-empire bg-empire/15 text-white scale-[1.01]'
                : 'border-white/10 bg-white/[0.03] text-neutral-200 hover:border-empire/40'
            }`}
          >
            {fr ? o.fr : o.en}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Progress */}
      <div className="mb-8 flex items-center justify-center gap-1.5">
        {progressSteps.map((s, i) => (
          <span
            key={s}
            className={`h-1.5 rounded-full transition-all ${
              i < progressIndex ? 'w-5 bg-empire' : i === progressIndex ? 'w-8 bg-empire/70' : 'w-5 bg-white/15'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'email' && (
          <motion.form
            key="email"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            onSubmit={(e) => {
              e.preventDefault()
              if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
                setError(fr ? 'Entre un email valide.' : 'Enter a valid email.')
                return
              }
              setError('')
              setStep('hours')
            }}
            className="space-y-5 text-center"
          >
            <p className="text-sm font-semibold text-empire">
              {fr ? 'Complet pour l\'instant' : 'Full for now'}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {fr ? 'Demander un accès' : 'Request access'}
            </h2>
            <p className="text-sm text-neutral-400">
              {fr ? 'Complet pour l\'instant. Laisse ton email pour postuler.' : 'Full for now. Leave your email to apply.'}
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={fr ? 'ton@email.com' : 'you@email.com'}
              className="w-full max-w-md mx-auto block rounded-xl border border-white/15 bg-neutral-900 px-4 py-3.5 text-sm text-white outline-none focus:border-empire/50"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              className="w-full max-w-md mx-auto block rounded-xl bg-empire px-6 py-3.5 text-sm font-bold text-black hover:brightness-110"
            >
              {fr ? 'Continuer →' : 'Continue →'}
            </button>
          </motion.form>
        )}

        {step === 'hours' && (
          <motion.div
            key="hours"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="text-center"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              {fr ? 'Combien de temps par semaine pour le contenu ?' : 'How much time per week for content?'}
            </h2>
            <ChoiceList
              options={HOURS}
              value={hoursPerWeek}
              onPick={(v) => pick(setHoursPerWeek, v, 'skill')}
            />
          </motion.div>
        )}

        {step === 'skill' && (
          <motion.div
            key="skill"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="text-center"
          >
            <button type="button" onClick={() => setStep('hours')} className="mb-4 text-xs text-neutral-500 hover:text-white">
              ← {fr ? 'Retour' : 'Back'}
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              {fr ? 'Tu es à l\'aise pour créer du contenu ?' : 'Are you comfortable creating content?'}
            </h2>
            <ChoiceList
              options={SKILL}
              value={contentSkill}
              onPick={(v) => pick(setContentSkill, v, 'publishing')}
            />
          </motion.div>
        )}

        {step === 'publishing' && (
          <motion.div
            key="publishing"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="text-center"
          >
            <button type="button" onClick={() => setStep('skill')} className="mb-4 text-xs text-neutral-500 hover:text-white">
              ← {fr ? 'Retour' : 'Back'}
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              {fr ? 'Tu publies déjà sur les réseaux ?' : 'Do you already publish on social?'}
            </h2>
            <ChoiceList
              options={PUBLISHING}
              value={alreadyPublishing}
              onPick={(v) => pick(setAlreadyPublishing, v, 'contact')}
            />
          </motion.div>
        )}

        {step === 'contact' && (
          <motion.form
            key="contact"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            onSubmit={submitContact}
            className="mx-auto w-full max-w-md space-y-4 text-left"
          >
            <button type="button" onClick={() => setStep('publishing')} className="text-xs text-neutral-500 hover:text-white">
              ← {fr ? 'Retour' : 'Back'}
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-2">
              {fr ? 'Dernière étape' : 'Last step'}
            </h2>
            <p className="text-center text-sm text-neutral-400 mb-4">
              {fr ? 'On lit chaque candidature avant de répondre.' : 'We read every application before replying.'}
            </p>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-white">{fr ? 'Prénom' : 'First name'}</label>
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none focus:border-empire/50"
                placeholder={fr ? 'Ton prénom' : 'Your first name'}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-white">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none focus:border-empire/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-white">{fr ? 'Téléphone' : 'Phone'}</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="rounded-xl border border-white/10 bg-neutral-900 px-3 py-3 text-sm text-white outline-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ''))}
                  className="w-full min-w-0 rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none focus:border-empire/50"
                  placeholder={fr ? '6 12 34 56 78' : 'Phone number'}
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-empire px-6 py-3.5 text-sm font-bold text-black hover:brightness-110 disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
              {fr ? 'Envoyer ma candidature' : 'Submit my application'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

    </div>
  )
}
