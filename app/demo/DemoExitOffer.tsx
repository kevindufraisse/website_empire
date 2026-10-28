'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { Mail, Play, X } from 'lucide-react'
import { trackAmplitude } from '@/lib/amplitude'
import { storeVideoEmail } from '@/components/VideoEmailGate'

const SHOWN_KEY = 'empire_demo_exit_offer_v1'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Avant de quitter /demo : on propose d'envoyer la méthode Empire (la VSL)
// par email (tag « vsl-video », séquence existante). Une fois par session. Ordinateur : la souris sort par le haut.
// Téléphone : le bouton retour (une entrée d'historique posée à l'arrivée).
export default function DemoExitOffer({ email: knownEmail, fr }: { email: string; fr: boolean }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const openRef = useRef(false)

  useEffect(() => {
    let already = false
    try { already = sessionStorage.getItem(SHOWN_KEY) === '1' } catch { /* navigation privée */ }
    if (already) return

    const show = (trigger: 'mouse' | 'back') => {
      if (openRef.current) return
      openRef.current = true
      try { sessionStorage.setItem(SHOWN_KEY, '1') } catch { /* rien */ }
      setOpen(true)
      trackAmplitude('empire_demo_exit_offer_shown', { trigger })
      cleanup()
    }
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) show('mouse')
    }
    const onPopState = () => show('back')

    const touch = window.matchMedia('(pointer: coarse)').matches
    if (touch) window.history.pushState({ demoExitOffer: true }, '')
    document.addEventListener('mouseout', onMouseOut)
    if (touch) window.addEventListener('popstate', onPopState)

    function cleanup() {
      document.removeEventListener('mouseout', onMouseOut)
      window.removeEventListener('popstate', onPopState)
    }
    return cleanup
  }, [])

  if (!open) return null

  const target = knownEmail || email.trim().toLowerCase()

  function send(event?: FormEvent) {
    event?.preventDefault()
    if (!EMAIL_RE.test(target)) {
      setError(fr ? 'Vérifie ton email.' : 'Check your email.')
      return
    }
    // Même chemin que l'email de /vsl : tag « vsl-video » et sa séquence Systeme.io.
    fetch('/api/vsl-email', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: target, funnel: 'empire' }),
      keepalive: true,
    }).catch(() => {})
    storeVideoEmail(target)
    setSent(true)
    trackAmplitude('empire_demo_exit_offer_sent', { had_email: Boolean(knownEmail) })
  }

  function watchNow() {
    trackAmplitude('empire_demo_exit_offer_watch')
    window.location.href = '/vsl'
  }

  const close = () => setOpen(false)

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-offer-title"
        className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#0d0d0d] p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={close} aria-label={fr ? 'Fermer' : 'Close'} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 hover:bg-white/10 hover:text-white">
          <X size={20} />
        </button>

        {sent ? (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white"><Mail size={22} aria-hidden /></div>
            <h3 id="exit-offer-title" className="mb-2 text-xl font-bold text-white">{fr ? 'C’est envoyé' : 'On its way'}</h3>
            <p className="mb-5 text-sm text-neutral-300">{fr ? `La méthode Empire arrive à ${target} dans quelques minutes.` : `The Empire method is on its way to ${target}.`}</p>
            <button type="button" onClick={close} className="min-h-11 w-full rounded-xl border border-white/20 px-5 font-semibold text-white hover:bg-white/[0.06]">{fr ? 'Fermer' : 'Close'}</button>
          </>
        ) : (
          <>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-400">{fr ? 'Avant de partir' : 'Before you go'}</p>
            <h3 id="exit-offer-title" className="mb-2 text-xl font-bold leading-tight text-white sm:text-2xl">
              {fr ? 'On t’envoie la méthode Empire par email ?' : 'Want the Empire method by email?'}
            </h3>
            <p className="mb-5 text-sm leading-relaxed text-neutral-300">
              {fr ? 'La vidéo de Kevin : le système des entrepreneurs à 7 chiffres pour que tout leur marché les connaisse. Tu la regardes quand tu veux.' : 'Kevin’s video: the system 7-figure founders use so their whole market knows them. Watch it whenever you like.'}
            </p>
            <form onSubmit={send} className="flex flex-col gap-2">
              {!knownEmail && (
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={fr ? 'Ton email' : 'Your email'}
                  autoComplete="email"
                  aria-label={fr ? 'Ton email' : 'Your email'}
                  className="min-h-11 rounded-xl bg-white px-4 text-base text-black outline-none focus:ring-2 focus:ring-white/40"
                />
              )}
              <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 font-bold text-black hover:brightness-95">
                <Mail size={18} aria-hidden />
                {knownEmail ? (fr ? `Envoyer à ${knownEmail}` : `Send to ${knownEmail}`) : (fr ? 'Envoie-la moi' : 'Send it to me')}
              </button>
              {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
            </form>
            <button type="button" onClick={watchNow} className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-neutral-300 underline underline-offset-4 hover:text-white">
              <Play size={15} aria-hidden />
              {fr ? 'Ou la regarder maintenant' : 'Or watch it now'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
