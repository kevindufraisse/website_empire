'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

type Props = {
  className?: string
  /** Compact = tighter for secondary sections */
  compact?: boolean
}

export default function WaitlistEmailCta({ className = '', compact = false }: Props) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const value = email.trim()
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError(fr ? 'Entre un email valide.' : 'Enter a valid email.')
      return
    }
    setError('')
    router.push(`/postuler?email=${encodeURIComponent(value)}`)
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <p className={`text-center font-semibold text-empire ${compact ? 'text-xs mb-2' : 'text-sm mb-3'}`}>
        {fr ? 'Complet pour l\'instant' : 'Full for now'}
      </p>
      <form onSubmit={submit} className="flex flex-col gap-2 w-full sm:flex-row sm:items-stretch">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={fr ? 'ton@email.com' : 'you@email.com'}
          className="w-full min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-empire/50"
        />
        <button
          type="submit"
          className="w-full sm:w-auto shrink-0 rounded-xl bg-empire px-5 py-3.5 text-sm font-bold text-black transition-all hover:brightness-110 whitespace-nowrap"
        >
          {fr ? 'Demander un accès' : 'Request access'}
        </button>
      </form>
      {error && <p className="mt-1.5 text-center text-xs text-red-400">{error}</p>}
    </div>
  )
}
