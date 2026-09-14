'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { X, ArrowRight, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'
import posthog from 'posthog-js'

const SESSION_KEY = 'community-popup-exit'
const FALLBACK_INVITE =
  'https://join.slack.com/t/empire-community/shared_invite/zt-48r5is0lz-MiYTUfVBYgNymUbb56h_6g'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Step = 'email' | 'access'

function SlackLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 122.8 122.8" className={className} aria-hidden="true">
      <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#E01E5A" />
      <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36C5F0" />
      <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2EB67D" />
      <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ECB22E" />
    </svg>
  )
}

/** Pages où afficher la popup serait redondant ou intrusif. */
const EXCLUDED_PREFIXES = ['/quiz', '/candidature', '/postuler', '/thank-you', '/academy', '/academy/merci', '/webinar/merci', '/verify', '/communaute', '/community']

export default function CreatorQuizExitIntent() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [inviteUrl, setInviteUrl] = useState(FALLBACK_INVITE)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const pathname = usePathname()
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const close = useCallback(() => setOpen(false), [])

  const capture = useCallback((event: string, props?: Record<string, unknown>) => {
    trackAmplitude(event, props)
    if (posthog.__loaded) posthog.capture(event, props)
  }, [])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (EXCLUDED_PREFIXES.some(p => pathname?.startsWith(p))) return

    let timer: ReturnType<typeof setTimeout>
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 0) return
      if (sessionStorage.getItem(SESSION_KEY)) return
      timer = setTimeout(() => {
        sessionStorage.setItem(SESSION_KEY, '1')
        setOpen(true)
        capture('community_popup_opened', { source: 'exit_intent' })
      }, 100)
    }

    document.addEventListener('mouseleave', onMouseLeave)
    return () => {
      document.removeEventListener('mouseleave', onMouseLeave)
      clearTimeout(timer)
    }
  }, [capture, pathname])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const crisp = (window as unknown as { $crisp?: { push: (cmd: unknown[]) => void } }).$crisp
    crisp?.push(['do', 'chat:hide'])
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      crisp?.push(['do', 'chat:show'])
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  useEffect(() => {
    if (!open) {
      setStep('email')
      setEmail('')
      setError('')
      setSubmitting(false)
      setInviteUrl(FALLBACK_INVITE)
    }
  }, [open])

  async function submitEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const company = String(new FormData(e.currentTarget).get('company') || '')
    const trimmed = email.trim().toLowerCase()
    if (!EMAIL_RE.test(trimmed)) {
      setError(fr ? 'Email invalide.' : 'Invalid email.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/community-join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, lang, company }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string; inviteUrl?: string }
      if (!res.ok) {
        setError(data.error || (fr ? 'Impossible d’enregistrer ton email. Réessaie.' : 'Could not save your email. Try again.'))
        return
      }
      if (data.inviteUrl) setInviteUrl(data.inviteUrl)
      setStep('access')
      capture('community_popup_joined', { source: 'exit_intent' })
    } catch {
      setError(fr ? 'Connexion impossible. Réessaie.' : 'Connection failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function openInvite() {
    capture('community_popup_open_slack', { source: 'exit_intent' })
    window.open(inviteUrl, '_blank', 'noopener,noreferrer')
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={fr ? 'Avant de partir' : 'Before you go'}
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative w-full max-w-md rounded-2xl border-2 border-empire bg-[#0c0c0c] p-6 shadow-[0_0_80px_rgb(var(--empire-rgb)_/_0.45),0_0_0_1px_rgb(var(--empire-rgb)_/_0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute -inset-px rounded-2xl bg-[radial-gradient(ellipse_at_top,rgb(var(--empire-rgb)_/_0.18),transparent_55%)]" />

            <button
              type="button"
              onClick={close}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition"
              aria-label={fr ? 'Fermer' : 'Close'}
            >
              <X size={16} />
            </button>

            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-empire/40 bg-empire/15 px-2.5 py-1">
                <SlackLogo className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-empire">
                  {fr ? 'Accès gratuit' : 'Free access'}
                </span>
              </div>

              {step === 'email' ? (
                <>
                  <div className="rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                        <SlackLogo className="h-6 w-6" />
                      </span>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-empire">
                          {fr ? 'Communauté privée Slack' : 'Private Slack community'}
                        </p>
                        <h2 className="mt-0.5 text-lg font-extrabold leading-snug text-white pr-6">
                          {fr
                            ? 'Rejoins les entrepreneurs les plus visibles.'
                            : 'Join the most visible entrepreneurs.'}
                        </h2>
                        <p className="mt-1 text-sm leading-relaxed text-neutral-300">
                          {fr
                            ? 'Entre ton email et reçois ton accès immédiat.'
                            : 'Enter your email and get instant access.'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-neutral-200">
                        {fr ? 'Lives hebdo' : 'Weekly lives'}
                      </span>
                      <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-neutral-200">
                        {fr ? 'Masterclasses' : 'Masterclasses'}
                      </span>
                      <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-neutral-200">
                        {fr ? 'Feedback posts' : 'Post feedback'}
                      </span>
                      <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-neutral-200">
                        {fr ? 'Réseau qualifié' : 'Qualified network'}
                      </span>
                    </div>
                  </div>

                  <form className="mt-4 space-y-3" onSubmit={submitEmail} method="post" action="/api/community-join">
                    <label htmlFor="community-popup-email" className="sr-only">
                      Email
                    </label>
                    <input
                      id="community-popup-email"
                      name="email"
                      required
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={fr ? 'ton email' : 'your email'}
                      className="min-h-12 w-full rounded-xl border border-white/20 bg-[#111]/90 px-4 text-sm text-white placeholder:text-neutral-500 focus:border-empire focus:outline-none focus:ring-2 focus:ring-empire/40"
                    />
                    <input type="text" name="company" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group relative flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-empire px-5 text-sm font-bold text-black shadow-[0_0_36px_rgb(var(--empire-rgb)_/_0.4)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
                    >
                      <span className="absolute inset-y-0 left-0 w-12 bg-white/20 blur-xl transition group-hover:w-20" />
                      <SlackLogo className="relative h-4 w-4 shrink-0" />
                      {submitting
                        ? (fr ? 'Enregistrement…' : 'Saving…')
                        : (fr ? 'Recevoir le lien Slack' : 'Get Slack link')}
                      <ArrowRight className="relative" size={16} />
                    </button>
                  </form>

                  {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}

                  <p className="mt-2 text-center text-[11px] text-neutral-500">
                    {fr
                      ? 'Accès immédiat · aucun spam'
                      : 'Instant access · no spam'}
                  </p>

                  <button
                    type="button"
                    onClick={close}
                    className="mt-3 w-full text-center text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    {fr ? 'Non merci' : 'No thanks'}
                  </button>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                        <SlackLogo className="h-6 w-6" />
                      </span>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-empire">Slack access</p>
                        <h2 className="text-lg font-bold text-white leading-snug">
                          {fr ? 'Ton accès est prêt.' : 'Your access is ready.'}
                        </h2>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-300 leading-relaxed">
                      {fr
                        ? 'Entre dans le Slack Empire en un clic. Le lien s’ouvre dans une nouvelle fenêtre.'
                        : 'Join Empire Slack in one click. The link opens in a new window.'}
                    </p>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    <button
                      type="button"
                      onClick={openInvite}
                      className="group relative flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-empire px-5 text-sm font-bold text-black shadow-[0_0_36px_rgb(var(--empire-rgb)_/_0.4)] transition hover:brightness-110"
                    >
                      <span className="absolute inset-y-0 left-0 w-12 bg-white/20 blur-xl transition group-hover:w-20" />
                      <SlackLogo className="relative h-4 w-4 shrink-0" />
                      {fr ? 'Ouvrir Slack (nouvelle fenêtre)' : 'Open Slack (new window)'}
                      <ExternalLink className="relative" size={16} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={close}
                    className="mt-3 w-full text-center text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    {fr ? 'Fermer' : 'Close'}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
