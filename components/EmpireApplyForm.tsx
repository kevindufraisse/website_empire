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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
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
            {fr ? 'Recevoir un accès' : 'Get access'}
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            {fr
              ? 'Testez gratuitement.'
              : 'Try it free.'}
          </p>
        </div>

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
          {fr ? 'Recevoir un accès' : 'Get access'}
        </button>
        <p className="text-center text-[12px] text-neutral-500">
          {fr
            ? 'Essai gratuit · sans engagement · on vous contacte sous 24h'
            : 'Free trial · no commitment · we contact you within 24h'}
        </p>
      </motion.form>
    </div>
  )
}
