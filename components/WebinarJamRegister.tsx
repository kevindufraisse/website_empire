'use client'

import { marketingAllowed } from '@/lib/marketingConsent'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { trackAmplitude } from '@/lib/amplitude'
import { trackMeta } from '@/lib/meta'
import { storedVideoEmail } from '@/components/VideoEmailGate'
import {
  WEBINARJAM_ID,
  WEBINARJAM_LIVE,
  webinarJamBarSrc,
  webinarJamEmbedSrc,
} from '@/lib/webinarjam'

type Fbq = (...args: unknown[]) => void

/**
 * Inscription réussie = l'iframe WebinarJam poste `{ func: 'redirect', url }`
 * au parent, et le script de la barre change de page aussitôt. On écoute en
 * capture (avant le script de la barre), on envoie Lead et CompleteRegistration
 * (pixel chargé par GTM + Conversions API), puis on fait nous-mêmes la même
 * redirection un peu plus tard : sans ce délai la navigation coupe l'envoi.
 */
function useWebinarJamConversion(source: string, hash: string) {
  useEffect(() => {
    if (!WEBINARJAM_LIVE) return
    let redirecting = false
    const onMessage = (event: MessageEvent) => {
      if (!/(^|\.)webinarjam\.com$/.test(new URL(event.origin || 'null', 'https://x').hostname)) return
      const data = event.data as { func?: string; url?: string; hash?: string } | null
      if (!data || data.func !== 'redirect' || !data.url || data.hash !== hash) return
      event.stopImmediatePropagation()
      if (redirecting) return
      redirecting = true
      const fbq = (window as unknown as { fbq?: Fbq }).fbq
      const params = { content_name: 'portes_ouvertes', content_category: 'academy_partner', source }
      if (typeof fbq === 'function') fbq('track', 'Lead', params)
      trackMeta('CompleteRegistration', params, { email: storedVideoEmail() })
      ;(window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({
        event: 'open_house_registered',
        open_house_source: source,
      })
      trackAmplitude('open_house_registered', { source })
      const url = data.url
      window.setTimeout(() => window.location.assign(url), 600)
    }
    window.addEventListener('message', onMessage, true)
    return () => window.removeEventListener('message', onMessage, true)
  }, [source, hash])
}

/**
 * Inscription portes ouvertes via WebinarJam.
 * Barre + embed différés (idle / viewport) pour ne pas bloquer le first paint.
 * Si `WEBINARJAM_LIVE` est false : CTAs vers #portes-ouvertes + form email.
 */
export function WebinarJamBar({
  buttonText = "S'inscrire",
  source = 'site',
  hash = WEBINARJAM_ID,
}: {
  buttonText?: string
  /** Page d'origine, envoyée avec la conversion (pixel, GTM, Amplitude). */
  source?: string
  /** Webinar à ouvrir : la présentation enregistrée par défaut, `OPEN_HOUSE_REPLAY_ID` pour le replay. */
  hash?: string
}) {
  useWebinarJamConversion(source, hash)
  if (!WEBINARJAM_LIVE) return null
  return (
    <Script
      id="webinarjam-open-house-bar"
      src={webinarJamBarSrc({ buttonText, id: hash })}
      strategy="afterInteractive"
    />
  )
}

export function WebinarJamButton({
  children,
  className = '',
  onClick,
  hash = WEBINARJAM_ID,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hash?: string
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
    <button
      type="button"
      data-webinarhash={hash}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
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
            ? 'Votre demande est enregistrée. Pour une question, écrivez à kevin@empire-internet.com.'
            : 'Your request has been recorded. For questions, email kevin@empire-internet.com.'}
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
        {fr ? 'Être informé de l’accès aux portes ouvertes' : 'Get updates on open-house access'}
      </p>
      <p className="mt-1 text-[12px] text-neutral-400">
        {fr
          ? 'Présentation enregistrée gratuite · Accès selon les disponibilités'
          : 'Free recorded presentation · Access subject to availability'}
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
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!WEBINARJAM_LIVE) return
    const host = hostRef.current
    if (!host) return

    let script: HTMLScriptElement | null = null
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || script) return
        const id = 'webinarjam-open-house-embed'
        if (document.getElementById(id)) {
          observer.disconnect()
          return
        }
        script = document.createElement('script')
        script.id = id
        script.src = webinarJamEmbedSrc()
        script.async = true
        host.appendChild(script)
        observer.disconnect()
      },
      { rootMargin: '280px 0px' },
    )
    observer.observe(host)

    return () => {
      observer.disconnect()
      document.getElementById('webinarjam-open-house-embed')?.remove()
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
      ref={hostRef}
      id="webinarjam-embed-host"
      className={`min-h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] ${className}`}
    />
  )
}

