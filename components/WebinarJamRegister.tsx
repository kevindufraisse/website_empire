'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import {
  WEBINARJAM_LIVE,
  WEBINARJAM_REGISTER_URL,
  webinarJamBarSrc,
  webinarJamEmbedSrc,
} from '@/lib/webinarjam'

/**
 * Inscription portes ouvertes via WebinarJam.
 * Si `WEBINARJAM_LIVE` est false : pas de widget (évite l’écran « expiré »),
 * CTAs vers #portes-ouvertes + formulaire email léger.
 */
export function WebinarJamBar({
  buttonText = "S'inscrire",
}: {
  buttonText?: string
}) {
  if (!WEBINARJAM_LIVE) return null
  return (
    <Script
      id="webinarjam-open-house-bar"
      src={webinarJamBarSrc({ buttonText })}
      strategy="lazyOnload"
    />
  )
}

export function WebinarJamButton({
  children,
  className = '',
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  if (!WEBINARJAM_LIVE) {
    return (
      <a
        href="#portes-ouvertes"
        onClick={onClick}
        className={className}
      >
        {children}
      </a>
    )
  }

  return (
    <a
      href={WEBINARJAM_REGISTER_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={className}
    >
      {children}
    </a>
  )
}

function OpenHouseInterestForm({ fr }: { fr: boolean }) {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !firstName.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/academy-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          lang: fr ? 'fr' : 'en',
          emp: 'open_house',
          partial: true,
        }),
      })
      if (!res.ok) throw new Error('fail')
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return (
      <div className="rounded-2xl border border-academy/30 bg-academy/10 px-5 py-8 text-center">
        <p className="text-[15px] font-bold text-white">
          {fr ? 'C’est noté.' : 'Got it.'}
        </p>
        <p className="mt-2 text-[13px] text-neutral-300">
          {fr
            ? 'On vous envoie le lien du prochain jeudi 11h (Paris).'
            : 'We’ll send you the link for the next Thursday 11am (Paris).'}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-6"
    >
      <p className="text-[13px] font-semibold text-white">
        {fr ? 'Recevoir le lien du prochain jeudi' : 'Get the next Thursday link'}
      </p>
      <p className="mt-1 text-[12px] text-neutral-400">
        {fr
          ? 'Chaque jeudi 11h (Paris) · 45 min · gratuit'
          : 'Every Thursday 11am (Paris) · 45 min · free'}
      </p>
      <div className="mt-4 space-y-3">
        <input
          type="text"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={fr ? 'Prénom' : 'First name'}
          className="w-full rounded-xl border border-white/20 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-academy/50 focus:outline-none"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-xl border border-white/20 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-academy/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex w-full items-center justify-center rounded-xl bg-academy px-4 py-3 text-sm font-bold text-black transition hover:brightness-110 disabled:opacity-60"
        >
          {status === 'loading'
            ? fr
              ? 'Envoi…'
              : 'Sending…'
            : fr
              ? 'Je veux le lien'
              : 'Send me the link'}
        </button>
        {status === 'error' && (
          <p className="text-center text-[12px] text-red-400">
            {fr ? 'Erreur - réessayez ou écrivez à kevin@empire-internet.com' : 'Error - try again or email kevin@empire-internet.com'}
          </p>
        )}
      </div>
    </form>
  )
}

export function WebinarJamEmbed({
  className = '',
  fr = true,
}: {
  className?: string
  fr?: boolean
}) {
  useEffect(() => {
    if (!WEBINARJAM_LIVE) return
    const id = 'webinarjam-open-house-embed'
    if (document.getElementById(id)) return
    const script = document.createElement('script')
    script.id = id
    script.src = webinarJamEmbedSrc()
    script.async = true
    const host = document.getElementById('webinarjam-embed-host')
    if (host) host.appendChild(script)
    return () => {
      document.getElementById(id)?.remove()
    }
  }, [])

  if (!WEBINARJAM_LIVE) {
    return (
      <div className={className}>
        <OpenHouseInterestForm fr={fr} />
      </div>
    )
  }

  return (
    <div
      id="webinarjam-embed-host"
      className={`min-h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] ${className}`}
    />
  )
}
