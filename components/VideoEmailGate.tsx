'use client'

import { useState } from 'react'
import { trackAmplitude } from '@/lib/amplitude'

export type VideoFunnel = 'empire' | 'academy'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const EMAIL_KEY = 'empire_vsl_email_v1'

/** Email déjà donné sur ce navigateur (n'importe quelle vidéo du site). */
export function storedVideoEmail(): string | null {
  try {
    return window.localStorage.getItem(EMAIL_KEY)
  } catch {
    return null
  }
}

export function storeVideoEmail(email: string) {
  try {
    window.localStorage.setItem(EMAIL_KEY, email)
  } catch {
    // navigation privée : la vidéo s'ouvre quand même cette fois-ci
  }
}

/**
 * `?email=` (lien d'un email ou d'un autre formulaire du site) : enregistré
 * une fois, la vidéo ne le redemande pas. Rend true si un email est connu.
 */
export function adoptEmailFromUrl(funnel: VideoFunnel): boolean {
  const fromUrl = (new URLSearchParams(window.location.search).get('email') || '').trim().toLowerCase()
  if (!storedVideoEmail() && EMAIL_RE.test(fromUrl)) {
    storeVideoEmail(fromUrl)
    fetch('/api/vsl-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: fromUrl, funnel }),
    }).catch(() => {})
    trackAmplitude('vsl_email_submitted', { source: 'url', funnel })
  }
  return Boolean(storedVideoEmail())
}

/** Formulaire posé sur la vignette : l'email part dans Systeme.io avant la lecture. */
export default function VideoEmailGate({
  funnel,
  title,
  subtitle,
  cta = 'Regarder la vidéo',
  accent = 'empire',
  onUnlocked,
}: {
  funnel: VideoFunnel
  title: string
  subtitle?: string
  cta?: string
  accent?: 'empire' | 'academy'
  onUnlocked: () => void
}) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const accentBg = accent === 'academy' ? 'bg-academy' : 'bg-empire'
  const accentRing = accent === 'academy' ? 'focus:ring-academy' : 'focus:ring-empire'

  // La vidéo s'ouvre au clic, sans attendre le serveur : lancer la lecture
  // dans le geste du clic garde l'autoplay sur mobile.
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (sending) return
    const clean = email.trim().toLowerCase()
    if (!EMAIL_RE.test(clean)) {
      setError('Vérifie ton email.')
      return
    }
    setError('')
    setSending(true)
    fetch('/api/vsl-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: clean, company, funnel }),
      keepalive: true,
    }).catch(() => {})
    storeVideoEmail(clean)
    trackAmplitude('vsl_email_submitted', { funnel })
    onUnlocked()
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <form onSubmit={submit} className="w-full max-w-sm text-center">
        <h3 className="mb-1 text-base font-bold text-white sm:text-xl">{title}</h3>
        {subtitle && <p className="mb-4 hidden text-sm text-neutral-300 sm:block">{subtitle}</p>}
        <input
          type="text"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ton email"
            autoComplete="email"
            aria-label="Ton email"
            className={`min-w-0 flex-1 rounded-lg bg-white px-4 py-2.5 text-base text-black outline-none focus:ring-2 sm:py-3 ${accentRing}`}
          />
          <button
            type="submit"
            disabled={sending}
            className={`rounded-lg px-5 py-2.5 font-bold text-black transition hover:brightness-110 disabled:opacity-60 sm:py-3 ${accentBg}`}
          >
            {sending ? '…' : cta}
          </button>
        </div>
        <p className="mt-2 text-[11px] text-neutral-400">Pas de spam. Tu te désinscris en un clic.</p>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </form>
    </div>
  )
}
