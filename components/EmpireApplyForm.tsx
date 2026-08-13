'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { getEmpParam } from '@/hooks/useCalLink'
import { useLanguage } from '@/contexts/LanguageContext'

const FREQUENCY = [
  { value: '3-plus-semaine', fr: '3 fois ou plus / semaine', en: '3+ times / week' },
  { value: '1-2-semaine', fr: '1 à 2 fois / semaine', en: '1–2 times / week' },
  { value: '1-3-mois', fr: '1 à 3 fois / mois', en: '1–3 times / month' },
  { value: 'rarement', fr: 'Moins d\'1 fois / mois', en: 'Less than once a month' },
  { value: 'jamais', fr: 'Pas encore', en: 'Not yet' },
]

const STATS = [
  { value: 'moins-1k', fr: 'Moins de 1 000 vues / mois', en: 'Under 1,000 views / month' },
  { value: '1k-10k', fr: '1 000 à 10 000 vues / mois', en: '1,000–10,000 views / month' },
  { value: '10k-50k', fr: '10 000 à 50 000 vues / mois', en: '10,000–50,000 views / month' },
  { value: '50k-plus', fr: 'Plus de 50 000 vues / mois', en: '50,000+ views / month' },
  { value: 'pas-de-stats', fr: 'Je n\'ai pas encore de stats', en: 'I don\'t have stats yet' },
]

const SKILL = [
  { value: 'oui', fr: 'Oui, je suis à l\'aise', en: 'Yes, I\'m comfortable' },
  { value: 'un-peu', fr: 'Un peu, j\'ai besoin d\'aide', en: 'A bit - I need help' },
  { value: 'non', fr: 'Non, je pars de zéro', en: 'No, I\'m starting from zero' },
]

const NETWORKS = [
  { value: 'linkedin', fr: 'LinkedIn', en: 'LinkedIn' },
  { value: 'instagram', fr: 'Instagram', en: 'Instagram' },
  { value: 'youtube', fr: 'YouTube', en: 'YouTube' },
  { value: 'tiktok', fr: 'TikTok', en: 'TikTok' },
  { value: 'x', fr: 'X / Twitter', en: 'X / Twitter' },
  { value: 'autres', fr: 'Autres', en: 'Other' },
  { value: 'aucun', fr: 'Aucun pour l\'instant', en: 'None yet' },
]

const COUNTRIES = [
  { code: '+33', flag: '🇫🇷' },
  { code: '+32', flag: '🇧🇪' },
  { code: '+41', flag: '🇨🇭' },
  { code: '+1', flag: '🇺🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+212', flag: '🇲🇦' },
]

type StepId = 'email' | 'frequency' | 'stats' | 'skill' | 'networks' | 'profiles' | 'contact'

const STEP_ORDER: StepId[] = ['email', 'frequency', 'stats', 'skill', 'networks', 'profiles', 'contact']

export default function EmpireApplyForm() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState<StepId>('email')
  const [frequency, setFrequency] = useState('')
  const [contentStats, setContentStats] = useState('')
  const [contentSkill, setContentSkill] = useState('')
  const [networks, setNetworks] = useState<string[]>([])
  const [linkedin, setLinkedin] = useState('')
  const [instagram, setInstagram] = useState('')
  const [youtube, setYoutube] = useState('')
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
      setStep('frequency')
    }
  }, [searchParams])

  const progressSteps = email && step !== 'email' ? STEP_ORDER.filter((s) => s !== 'email') : STEP_ORDER
  const progressIndex = Math.max(0, progressSteps.indexOf(step))

  function pick(setter: (v: string) => void, value: string, next: StepId) {
    setter(value)
    setTimeout(() => setStep(next), 180)
  }

  function toggleNetwork(value: string) {
    if (value === 'aucun') {
      setNetworks(['aucun'])
      return
    }
    setNetworks((prev) => {
      const withoutNone = prev.filter((n) => n !== 'aucun')
      return withoutNone.includes(value)
        ? withoutNone.filter((n) => n !== value)
        : [...withoutNone, value]
    })
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
          frequency,
          contentStats,
          contentSkill,
          networks,
          linkedin: linkedin.trim(),
          instagram: instagram.trim(),
          youtube: youtube.trim(),
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

  function Back({ to }: { to: StepId }) {
    return (
      <button type="button" onClick={() => setStep(to)} className="mb-4 text-xs text-neutral-500 hover:text-white">
        ← {fr ? 'Retour' : 'Back'}
      </button>
    )
  }

  return (
    <div className="w-full">
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
              setStep('frequency')
            }}
            className="space-y-5 text-center"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {fr ? 'Demander un accès' : 'Request access'}
            </h2>
            <p className="text-sm text-empire font-semibold">
              {fr ? '+ 15 min d\'audit offert si tu es sélectionné' : '+ 15 min free audit if you\'re selected'}
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

        {step === 'frequency' && (
          <motion.div
            key="frequency"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="text-center"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {fr ? 'Tu publies déjà sur les réseaux ?' : 'Do you already publish on social?'}
            </h2>
            <p className="text-sm text-neutral-400 mb-6">
              {fr ? 'Combien de fois environ ?' : 'About how often?'}
            </p>
            <ChoiceList
              options={FREQUENCY}
              value={frequency}
              onPick={(v) => {
                setFrequency(v)
                if (v === 'jamais') {
                  setContentStats('pas-de-stats')
                  setTimeout(() => setStep('skill'), 180)
                } else {
                  setTimeout(() => setStep('stats'), 180)
                }
              }}
            />
          </motion.div>
        )}

        {step === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="text-center"
          >
            <Back to="frequency" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {fr ? 'Tes stats actuelles ?' : 'Your current stats?'}
            </h2>
            <p className="text-sm text-neutral-400 mb-6">
              {fr ? 'Vues totales approx. sur tous tes contenus / mois' : 'Approx. total views across your content / month'}
            </p>
            <ChoiceList
              options={STATS}
              value={contentStats}
              onPick={(v) => pick(setContentStats, v, 'skill')}
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
            <Back to={frequency === 'jamais' ? 'frequency' : 'stats'} />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              {fr ? 'Tu es à l\'aise pour créer du contenu ?' : 'Are you comfortable creating content?'}
            </h2>
            <ChoiceList
              options={SKILL}
              value={contentSkill}
              onPick={(v) => pick(setContentSkill, v, 'networks')}
            />
          </motion.div>
        )}

        {step === 'networks' && (
          <motion.div
            key="networks"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="text-center"
          >
            <Back to="skill" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {fr ? 'Sur quels réseaux tu publies ?' : 'Which networks do you publish on?'}
            </h2>
            <p className="text-sm text-neutral-400 mb-6">
              {fr ? 'Tu peux en choisir plusieurs' : 'You can pick several'}
            </p>
            <div className="grid gap-2.5 w-full max-w-md mx-auto">
              {NETWORKS.map((o) => {
                const active = networks.includes(o.value)
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => toggleNetwork(o.value)}
                    className={`rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all ${
                      active
                        ? 'border-empire bg-empire/15 text-white'
                        : 'border-white/10 bg-white/[0.03] text-neutral-200 hover:border-empire/40'
                    }`}
                  >
                    {fr ? o.fr : o.en}
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              disabled={networks.length === 0}
              onClick={() => setStep('profiles')}
              className="mt-6 w-full max-w-md mx-auto block rounded-xl bg-empire px-6 py-3.5 text-sm font-bold text-black hover:brightness-110 disabled:opacity-40"
            >
              {fr ? 'Continuer →' : 'Continue →'}
            </button>
          </motion.div>
        )}

        {step === 'profiles' && (
          <motion.form
            key="profiles"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            onSubmit={(e) => {
              e.preventDefault()
              setStep('contact')
            }}
            className="mx-auto w-full max-w-md space-y-4 text-left"
          >
            <Back to="networks" />
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-2">
              {fr ? 'Tes comptes (optionnel)' : 'Your accounts (optional)'}
            </h2>
            <p className="text-center text-sm text-empire font-semibold mb-4">
              {fr
                ? 'Si tu es sélectionné : 15 min d\'audit offert en plus de l\'offre'
                : 'If selected: 15 min free audit on top of the offer'}
            </p>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-white">LinkedIn</label>
              <input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none focus:border-empire/50"
                placeholder="linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-white">Instagram</label>
              <input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none focus:border-empire/50"
                placeholder="@compte"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-white">YouTube</label>
              <input
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none focus:border-empire/50"
                placeholder="youtube.com/@..."
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-empire px-6 py-3.5 text-sm font-bold text-black hover:brightness-110"
            >
              {fr ? 'Continuer →' : 'Continue →'}
            </button>
            <button
              type="button"
              onClick={() => setStep('contact')}
              className="w-full text-center text-xs text-neutral-500 hover:text-white"
            >
              {fr ? 'Passer cette étape' : 'Skip this step'}
            </button>
          </motion.form>
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
            <Back to="profiles" />
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-2">
              {fr ? 'Dernière étape' : 'Last step'}
            </h2>
            <p className="text-center text-sm text-neutral-400 mb-4">
              {fr
                ? 'On lit chaque candidature. 15 min d\'audit offert si tu es pris.'
                : 'We read every application. 15 min free audit if you\'re in.'}
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
              className="flex w-full flex-col items-center justify-center gap-0.5 rounded-xl bg-empire px-6 py-3.5 text-sm font-bold text-black hover:brightness-110 disabled:opacity-60"
            >
              <span className="inline-flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                {fr ? 'Envoyer ma candidature' : 'Submit my application'}
              </span>
              <span className="text-[11px] font-semibold opacity-70">
                {fr ? '+ 15 min d\'audit offert si sélectionné' : '+ 15 min free audit if selected'}
              </span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
