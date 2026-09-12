'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
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

export default function EmpireApplyForm() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [countryCode, setCountryCode] = useState('+33')
  const [phone, setPhone] = useState('')
  const [intent, setIntent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !intent) {
      setError(fr ? 'Remplissez tous les champs.' : 'Fill in all fields.')
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
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-md space-y-4"
      >
        <div className="text-center">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            {fr ? 'Parler à l’équipe' : 'Talk to the team'}
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            {fr
              ? 'Entrez vos coordonnées. On vous recontacte pour répondre à toutes vos questions et vous proposer l’offre la plus adaptée.'
              : 'Enter your details. We’ll contact you to answer your questions and recommend the best plan for you.'}
          </p>
        </div>

        <fieldset>
          <legend className="mb-2 block text-sm font-semibold text-white">
            {fr ? 'Quel est votre objectif principal ?' : 'What is your main goal?'}
          </legend>
          <div className="space-y-2">
            {[
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
            ].map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                  intent === option.value
                    ? 'border-empire bg-empire/10 text-white'
                    : 'border-white/15 bg-white/[0.05] text-neutral-300 hover:border-white/30'
                }`}
              >
                <input
                  required
                  type="radio"
                  name="intent"
                  value={option.value}
                  checked={intent === option.value}
                  onChange={(e) => setIntent(e.target.value)}
                  className="h-4 w-4 shrink-0 accent-empire"
                />
                <span>{fr ? option.fr : option.en}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-white">{fr ? 'Prénom' : 'First name'}</label>
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl border border-white/30 bg-white/[0.12] px-4 py-3 text-sm text-white placeholder:text-neutral-300 outline-none transition-colors focus:border-empire focus:ring-2 focus:ring-empire/30"
              placeholder={fr ? 'Prénom' : 'First name'}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-white">{fr ? 'Nom' : 'Last name'}</label>
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-xl border border-white/30 bg-white/[0.12] px-4 py-3 text-sm text-white placeholder:text-neutral-300 outline-none transition-colors focus:border-empire focus:ring-2 focus:ring-empire/30"
              placeholder={fr ? 'Nom' : 'Last name'}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-white">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/30 bg-white/[0.12] px-4 py-3 text-sm text-white placeholder:text-neutral-300 outline-none transition-colors focus:border-empire focus:ring-2 focus:ring-empire/30"
            placeholder={fr ? 'votre@email.com' : 'you@email.com'}
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
          {fr ? 'Être recontacté' : 'Contact me'}
        </button>
        <p className="text-center text-[12px] text-neutral-500">
          {fr
            ? 'Échange personnalisé · appel uniquement si vous le souhaitez'
            : 'Personal conversation · call only if you want one'}
        </p>
      </motion.form>
    </div>
  )
}
