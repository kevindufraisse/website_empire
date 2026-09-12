'use client'

import { useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { getEmpParam } from '@/hooks/useCalLink'
import { useLanguage } from '@/contexts/LanguageContext'

const COUNTRIES = [
  { code: '+33', flag: '🇫🇷' },
  { code: '+32', flag: '🇧🇪' },
  { code: '+41', flag: '🇨🇭' },
  { code: '+1', flag: '🇺🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+212', flag: '🇲🇦' },
]

const INTENTS = [
  {
    value: 'delegate',
    fr: 'Je souhaite déléguer ma marque personnelle à un expert',
    en: 'I want an expert to manage my personal brand',
  },
  {
    value: 'career',
    fr: 'Je souhaite me reconvertir en expert en viralité',
    en: 'I want to become a virality expert',
  },
  {
    value: 'grow',
    fr: 'Je souhaite utiliser le système pour développer ma marque personnelle',
    en: 'I want to use the system to grow my personal brand',
  },
  {
    value: 'unsure',
    fr: 'Je ne sais pas encore',
    en: 'I’m not sure yet',
  },
] as const

const TEAM_SIZES = [
  { value: 'solo', fr: 'Moi uniquement', en: 'Just me' },
  { value: '2-5', fr: '2 à 5 personnes', en: '2–5 people' },
  { value: '6-10', fr: '6 à 10 personnes', en: '6–10 people' },
  { value: '11-19', fr: '11 à 19 personnes', en: '11–19 people' },
  { value: '20-30', fr: '20 à 30 personnes', en: '20–30 people' },
  { value: '30-plus', fr: 'Plus de 30 personnes', en: 'More than 30 people' },
] as const

const inputClass =
  'w-full rounded-xl border border-white/30 bg-white/[0.12] px-4 py-3 text-sm text-white placeholder:text-neutral-300 outline-none transition-colors focus:border-empire focus:ring-2 focus:ring-empire/30'

const slide = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

type Step = 'intent' | 'qualify' | 'contact'

function ChoiceButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[48px] w-full cursor-pointer items-center rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all ${
        selected
          ? 'border-empire bg-empire/15 text-white'
          : 'border-white/15 bg-white/[0.05] text-neutral-200 hover:border-empire/40'
      }`}
    >
      {children}
    </button>
  )
}

export default function EmpireApplyForm() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const router = useRouter()

  const [step, setStep] = useState<Step>('intent')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [countryCode, setCountryCode] = useState('+33')
  const [phone, setPhone] = useState('')
  const [intent, setIntent] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const unsure = intent === 'unsure'
  const progress: Step[] = unsure ? ['intent', 'qualify', 'contact'] : ['intent', 'contact']
  const progressIndex = Math.max(0, progress.indexOf(step))

  function pickIntent(nextIntent: string) {
    setIntent(nextIntent)
    setError('')
    if (nextIntent === 'unsure') {
      setTimeout(() => setStep('qualify'), 160)
      return
    }
    setTeamSize('')
    setTimeout(() => setStep('contact'), 160)
  }

  function pickTeamSize(nextSize: string) {
    setTeamSize(nextSize)
    setError('')
    setTimeout(() => setStep('contact'), 160)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !intent) {
      setError(fr ? 'Remplissez tous les champs.' : 'Fill in all fields.')
      return
    }
    if (intent === 'unsure' && !teamSize) {
      setError(fr ? 'Indiquez la taille de votre équipe.' : 'Tell us your team size.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(fr ? 'Entrez un email valide.' : 'Enter a valid email.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/empire-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: `${countryCode}${phone.trim()}`,
          intent,
          teamSize: intent === 'unsure' ? teamSize : '',
          emp: getEmpParam(),
          lang,
        }),
      })
      if (!res.ok) throw new Error('fail')
      router.push('/thank-you?from=waitlist')
    } catch {
      setError(fr ? 'Une erreur est survenue. Réessayez.' : 'Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-7 flex items-center justify-center gap-1.5" aria-hidden>
        {[...progress, 'thanks'].map((id, n) => (
          <span
            key={id}
            className={`h-1.5 rounded-full transition-all ${
              n < progressIndex ? 'w-6 bg-empire' : n === progressIndex ? 'w-8 bg-empire' : 'w-5 bg-white/15'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'intent' ? (
          <motion.div
            key="intent"
            {...slide}
            transition={{ duration: 0.25 }}
            className="mx-auto w-full max-w-md space-y-6"
          >
            <div className="text-center">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                {fr ? 'Merci pour votre intérêt pour Empire.' : 'Thanks for your interest in Empire.'}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                {fr
                  ? 'On accueille personnellement nos futurs partenaires, pour qu’ils aient toutes les réponses à leurs questions avant de souscrire. Un membre de l’équipe vous contacte dans les prochaines 15 minutes. (On pourra aussi organiser un appel si vous le souhaitez.)'
                  : 'We personally welcome our future partners, so they have every answer before they subscribe. A team member will contact you in the next 15 minutes. (We can also set up a call if you’d like.)'}
              </p>
            </div>

            <fieldset>
              <legend className="mb-3 block text-center text-sm font-semibold text-white">
                {fr ? 'Qu’est-ce que vous voulez faire ?' : 'What do you want to do?'}
              </legend>
              <div className="space-y-2.5">
                {INTENTS.map((option) => (
                  <ChoiceButton
                    key={option.value}
                    selected={intent === option.value}
                    onClick={() => pickIntent(option.value)}
                  >
                    {fr ? option.fr : option.en}
                  </ChoiceButton>
                ))}
              </div>
            </fieldset>
          </motion.div>
        ) : step === 'qualify' ? (
          <motion.div
            key="qualify"
            {...slide}
            transition={{ duration: 0.25 }}
            className="mx-auto w-full max-w-md space-y-6"
          >
            <button
              type="button"
              onClick={() => {
                setError('')
                setStep('intent')
              }}
              className="text-xs text-neutral-500 hover:text-white"
            >
              ← {fr ? 'Retour' : 'Back'}
            </button>

            <div className="text-center">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                {fr ? 'Pour vous orienter' : 'To point you the right way'}
              </h2>
              <p className="mt-2 text-sm text-neutral-400">
                {fr
                  ? 'Pour estimer ce qui vous correspond.'
                  : 'So we can estimate the right fit.'}
              </p>
            </div>

            <fieldset>
              <legend className="mb-2.5 block text-sm font-semibold text-white">
                {fr ? 'Combien de personnes dans votre équipe ?' : 'How many people are on your team?'}
              </legend>
              <div className="space-y-2">
                {TEAM_SIZES.map((option) => (
                  <ChoiceButton
                    key={option.value}
                    selected={teamSize === option.value}
                    onClick={() => pickTeamSize(option.value)}
                  >
                    {fr ? option.fr : option.en}
                  </ChoiceButton>
                ))}
              </div>
            </fieldset>
          </motion.div>
        ) : (
          <motion.form
            key="contact"
            {...slide}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className="mx-auto w-full max-w-md space-y-4"
          >
            <button
              type="button"
              onClick={() => {
                setError('')
                setStep(unsure ? 'qualify' : 'intent')
              }}
              className="text-xs text-neutral-500 hover:text-white"
            >
              ← {fr ? 'Retour' : 'Back'}
            </button>

            <div className="text-center">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                {fr ? 'On vous recontacte' : 'We’ll get back to you'}
              </h2>
              <p className="mt-2 text-sm text-neutral-400">
                {fr
                  ? 'Prénom, nom, email et téléphone. Un membre vous contacte dans les prochaines 15 minutes.'
                  : 'First name, last name, email and phone. Someone will contact you in the next 15 minutes.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="apply-first-name" className="mb-1.5 block text-sm font-semibold text-white">
                  {fr ? 'Prénom' : 'First name'}
                </label>
                <input
                  id="apply-first-name"
                  required
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                  placeholder={fr ? 'Prénom' : 'First name'}
                />
              </div>
              <div>
                <label htmlFor="apply-last-name" className="mb-1.5 block text-sm font-semibold text-white">
                  {fr ? 'Nom' : 'Last name'}
                </label>
                <input
                  id="apply-last-name"
                  required
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                  placeholder={fr ? 'Nom' : 'Last name'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="apply-email" className="mb-1.5 block text-sm font-semibold text-white">
                Email
              </label>
              <input
                id="apply-email"
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder={fr ? 'votre@email.com' : 'you@email.com'}
              />
            </div>

            <div>
              <label htmlFor="apply-phone" className="mb-1.5 block text-sm font-semibold text-white">
                {fr ? 'Téléphone' : 'Phone'}
              </label>
              <div className="flex gap-2">
                <select
                  aria-label={fr ? 'Indicatif pays' : 'Country code'}
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="rounded-xl border border-white/10 bg-neutral-900 px-3 py-3 text-sm text-white outline-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  id="apply-phone"
                  required
                  type="tel"
                  autoComplete="tel"
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
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-empire px-6 py-3.5 text-sm font-bold text-black hover:brightness-110 disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
              {fr ? 'Être recontacté' : 'Contact me'}
            </button>
            <p className="text-center text-[12px] text-neutral-500">
              {fr
                ? 'Échange personnalisé · appel uniquement si vous le souhaitez'
                : 'Personal conversation · call only if you want one'}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
