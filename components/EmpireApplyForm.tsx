'use client'

import { useState } from 'react'
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
  { value: 'un-peu', fr: 'Un peu, j\'ai besoin d\'aide', en: 'A bit — I need help' },
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

export default function EmpireApplyForm() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [step, setStep] = useState<1 | 2>(1)
  const [hoursPerWeek, setHoursPerWeek] = useState('')
  const [contentSkill, setContentSkill] = useState('')
  const [alreadyPublishing, setAlreadyPublishing] = useState('')
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+33')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!firstName.trim() || !email.trim() || !phone.trim()) {
      setError(fr ? 'Remplissez tous les champs.' : 'Fill in all fields.')
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
      setDone(true)
    } catch {
      setError(fr ? 'Une erreur est survenue. Réessayez.' : 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-empire/30 bg-empire/10 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-empire text-black">
          <Check size={22} />
        </div>
        <h3 className="text-xl font-bold text-white">
          {fr ? 'Vous êtes sur la liste d\'attente' : 'You\'re on the waitlist'}
        </h3>
        <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
          {fr
            ? 'On lit chaque candidature. On sélectionne les profils les plus motivés — on vous répond si vous êtes pris.'
            : 'We read every application. We select the most motivated profiles — we\'ll reply if you\'re in.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={step === 2 ? submit : (e) => { e.preventDefault(); if (hoursPerWeek && contentSkill && alreadyPublishing) setStep(2) }} className="space-y-5">
      {step === 1 && (
        <>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-white">
              {fr ? 'Combien de temps voulez-vous consacrer au contenu par semaine ?' : 'How much time do you want to spend on content per week?'}
            </legend>
            <div className="grid gap-2">
              {HOURS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setHoursPerWeek(o.value)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    hoursPerWeek === o.value
                      ? 'border-empire bg-empire/15 text-white'
                      : 'border-white/10 bg-white/[0.02] text-neutral-300 hover:border-white/20'
                  }`}
                >
                  {fr ? o.fr : o.en}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-white">
              {fr ? 'Êtes-vous à l\'aise pour créer du contenu ?' : 'Are you comfortable creating content?'}
            </legend>
            <div className="grid gap-2">
              {SKILL.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setContentSkill(o.value)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    contentSkill === o.value
                      ? 'border-empire bg-empire/15 text-white'
                      : 'border-white/10 bg-white/[0.02] text-neutral-300 hover:border-white/20'
                  }`}
                >
                  {fr ? o.fr : o.en}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-white">
              {fr ? 'Vous publiez déjà sur les réseaux ?' : 'Do you already publish on social media?'}
            </legend>
            <div className="grid gap-2">
              {PUBLISHING.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setAlreadyPublishing(o.value)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    alreadyPublishing === o.value
                      ? 'border-empire bg-empire/15 text-white'
                      : 'border-white/10 bg-white/[0.02] text-neutral-300 hover:border-white/20'
                  }`}
                >
                  {fr ? o.fr : o.en}
                </button>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={!hoursPerWeek || !contentSkill || !alreadyPublishing}
            className="w-full rounded-xl bg-empire px-6 py-3.5 text-sm font-bold text-black transition-all hover:brightness-110 disabled:opacity-40"
          >
            {fr ? 'Continuer →' : 'Continue →'}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-xs font-semibold text-neutral-500 hover:text-white"
          >
            ← {fr ? 'Retour' : 'Back'}
          </button>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-white">{fr ? 'Prénom' : 'First name'}</label>
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none focus:border-empire/50"
              placeholder={fr ? 'Votre prénom' : 'Your first name'}
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
              placeholder="vous@email.com"
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
                className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none focus:border-empire/50"
                placeholder={fr ? '6 12 34 56 78' : 'Phone number'}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-empire px-6 py-3.5 text-sm font-bold text-black transition-all hover:brightness-110 disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
            {fr ? 'Rejoindre la liste d\'attente' : 'Join the waitlist'}
          </button>
        </>
      )}
    </form>
  )
}
