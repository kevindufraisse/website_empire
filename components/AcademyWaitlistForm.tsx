'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { getEmpParam } from '@/hooks/useCalLink'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AcademyWaitlistForm({ className = '' }: { className?: string }) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const [form, setForm] = useState({ firstName: '', email: '' })
  const [errors, setErrors] = useState({ firstName: false, email: false })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [position, setPosition] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    const nextErrors = {
      firstName: !form.firstName.trim(),
      email: !EMAIL_RE.test(form.email.trim()),
    }
    setErrors(nextErrors)
    if (nextErrors.firstName || nextErrors.email) return

    setLoading(true)
    setErrorMessage(null)
    try {
      const res = await fetch('/api/academy-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          email: form.email.trim(),
          lang,
          emp: getEmpParam() || undefined,
        }),
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
      setPosition(typeof data.position === 'number' ? data.position : null)
      setSubmitted(true)
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
            : (fr ? 'Vous êtes sur la liste.' : 'You\'re on the list.')}
        </p>
        <p className="mt-2 text-sm text-neutral-400">
          {fr
            ? 'On vous écrit dès que les inscriptions de la prochaine promo ouvrent.'
            : 'We\'ll email you as soon as the next cohort opens.'}
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      <input
        type="text"
        placeholder={fr ? 'Votre prénom *' : 'Your first name *'}
        value={form.firstName}
        onChange={(e) => { setForm({ ...form, firstName: e.target.value }); setErrors({ ...errors, firstName: false }) }}
        autoComplete="given-name"
        className={`w-full rounded-xl border bg-white/[0.06] px-4 py-3.5 text-sm text-white placeholder:text-neutral-400 transition-all focus:outline-none focus:ring-1 focus:ring-academy/40 ${
          errors.firstName ? 'border-red-500' : 'border-white/25 focus:border-academy/60'
        }`}
      />
      <input
        type="email"
        placeholder={fr ? 'Votre email *' : 'Your email *'}
        value={form.email}
        onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: false }) }}
        autoComplete="email"
        inputMode="email"
        className={`w-full rounded-xl border bg-white/[0.06] px-4 py-3.5 text-sm text-white placeholder:text-neutral-400 transition-all focus:outline-none focus:ring-1 focus:ring-academy/40 ${
          errors.email ? 'border-red-500' : 'border-white/25 focus:border-academy/60'
        }`}
      />

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

      <p className="text-center text-[11px] text-neutral-500">
        {fr
          ? '20 places · Sur sélection · Réponse après lecture'
          : '20 spots · By selection · Reply after review'}
      </p>
    </form>
  )
}
