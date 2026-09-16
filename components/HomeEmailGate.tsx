'use client'

/**
 * Porte email de la home. Quand le visiteur a scrollé au-delà des logos
 * presse (sentinelle `#home-gate-trigger` posée dans `app/page.tsx`), le
 * scroll se bloque, le bas de l'écran se floute et une barre « glass » se pose
 * en bas : « Vos millions de vues sont à un scroll. Entrez votre email pour
 * découvrir la formule. » Pas de popup : le haut de page reste lisible, et la
 * popup communauté (exit intent) garde sa place. L'email est vérifié côté
 * serveur (`/api/home-gate` : syntaxe, jetable, faute de frappe, serveur mail)
 * avant de libérer le scroll. Une fois passé, on ne redemande plus (localStorage).
 */

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ArrowRight, Check, ChevronDown, Loader2, ShieldCheck } from 'lucide-react'
import posthog from 'posthog-js'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'

/** Même id que la sentinelle dans `app/page.tsx` (pas importé : module client). */
const HOME_GATE_TRIGGER_ID = 'home-gate-trigger'
const STORAGE_KEY = 'home-gate-email'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Phase = 'idle' | 'checking' | 'verified'

function readUnlocked(): boolean {
  try {
    return !!localStorage.getItem(STORAGE_KEY)
  } catch {
    return false
  }
}

export default function HomeEmailGate() {
  const pathname = usePathname()
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState('')
  const [suggestion, setSuggestion] = useState('')
  /** Le serveur a vu une faute de frappe probable : proposer aussi « garder le mien ». */
  const [typoConfirm, setTypoConfirm] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const unlockedRef = useRef(false)

  const capture = useCallback((event: string, props?: Record<string, unknown>) => {
    trackAmplitude(event, props)
    if (posthog.__loaded) posthog.capture(event, props)
  }, [])

  useEffect(() => setMounted(true), [])

  // Déclencheur : la sentinelle sous les logos atteint la moitié haute de
  // l'écran = les logos sont passés. Une seule fois par visiteur.
  useEffect(() => {
    if (pathname !== '/') return
    if (readUnlocked()) {
      unlockedRef.current = true
      return
    }

    let observer: IntersectionObserver | null = null
    let raf = 0
    let tries = 0

    const arm = () => {
      const el = document.getElementById(HOME_GATE_TRIGGER_ID)
      if (!el) {
        // La page et ce wrapper montent séparément : on réessaie quelques frames.
        if (tries++ < 30) raf = requestAnimationFrame(arm)
        return
      }
      observer = new IntersectionObserver(
        (entries) => {
          if (unlockedRef.current) return
          const hit = entries.some((e) => e.isIntersecting || e.boundingClientRect.top < 0)
          if (!hit) return
          observer?.disconnect()
          setOpen(true)
          capture('home_gate_opened', { source: 'scroll_after_logos' })
        },
        { rootMargin: '0px 0px -50% 0px', threshold: 0 },
      )
      observer.observe(el)
    }
    arm()

    return () => {
      cancelAnimationFrame(raf)
      observer?.disconnect()
    }
  }, [pathname, capture])

  // Scroll bloqué là où le visiteur est arrivé. Pas via `body{overflow:hidden}` :
  // avec `html, body { overflow-x: hidden }` (globals.css) Chrome remet alors
  // la page à 0 et le visiteur perdait les logos qu'il venait de voir. On
  // intercepte molette, doigt et clavier, et on rétablit la position si un
  // scroll passe quand même (ascenseur). Chat masqué : il chevaucherait la
  // barre. Pas de focus automatique : sur mobile le clavier monterait
  // par-dessus la page qu'on veut justement laisser voir.
  useEffect(() => {
    if (!open) return
    const y = window.scrollY
    const isTyping = (t: EventTarget | null) => t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement
    const block = (e: Event) => { if (!isTyping(e.target)) e.preventDefault() }
    const SCROLL_KEYS = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '])
    const onKey = (e: KeyboardEvent) => { if (SCROLL_KEYS.has(e.key) && !isTyping(e.target)) e.preventDefault() }
    const onScroll = () => {
      if (Math.abs(window.scrollY - y) > 1) window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior })
    }
    window.addEventListener('wheel', block, { passive: false })
    window.addEventListener('touchmove', block, { passive: false })
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll)
    const crisp = (window as unknown as { $crisp?: { push: (cmd: unknown[]) => void } }).$crisp
    crisp?.push(['do', 'chat:hide'])
    return () => {
      window.removeEventListener('wheel', block)
      window.removeEventListener('touchmove', block)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
      crisp?.push(['do', 'chat:show'])
    }
  }, [open])

  const unlock = useCallback((value: string) => {
    unlockedRef.current = true
    try { localStorage.setItem(STORAGE_KEY, value) } catch { /* navigation privée */ }
    setPhase('verified')
    // Laisser lire « Email vérifié », puis libérer le scroll et pousser un peu
    // vers la suite : c'est la promesse (« à un scroll »).
    setTimeout(() => {
      setOpen(false)
      requestAnimationFrame(() => window.scrollBy({ top: Math.round(window.innerHeight * 0.35), behavior: 'smooth' }))
    }, 900)
  }, [])

  async function verify(value: string, company: string, force: boolean) {
    if (phase !== 'idle') return
    if (!EMAIL_RE.test(value)) {
      setError(fr ? 'Entrez un email valide.' : 'Enter a valid email.')
      return
    }
    setError('')
    setSuggestion('')
    setTypoConfirm(false)
    setPhase('checking')
    try {
      const res = await fetch('/api/home-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value, lang, company, force }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        error?: string
        reason?: string
        suggestion?: string
        success?: boolean
      }
      if (!res.ok) {
        setPhase('idle')
        setError(data.error || (fr ? 'Cet email ne semble pas valide.' : 'This email does not look valid.'))
        if (data.suggestion) setSuggestion(data.suggestion)
        setTypoConfirm(data.reason === 'typo')
        capture('home_gate_rejected', { reason: data.reason || 'unknown' })
        return
      }
      capture('home_gate_unlocked', { source: 'scroll_after_logos', forced: force })
      unlock(value)
    } catch {
      // Réseau coupé : on ne laisse pas un visiteur bloqué devant un mur à cause de nous.
      setPhase('idle')
      setError(fr ? 'Connexion impossible. Réessayez.' : 'Connection failed. Try again.')
    }
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const company = String(new FormData(e.currentTarget).get('company') || '')
    void verify(email.trim().toLowerCase(), company, false)
  }

  function useSuggestion() {
    const next = suggestion
    setEmail(next)
    setSuggestion('')
    setTypoConfirm(false)
    setError('')
    void verify(next, '', false)
  }

  function keepMine() {
    void verify(email.trim().toLowerCase(), '', true)
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Voile : le bas de l'écran (la suite de la page) se floute et
              s'assombrit progressivement ; le haut reste net. Le voile
              intercepte les clics pour que rien ne se déclenche sous le flou. */}
          <motion.div
            key="home-gate-veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 0.45 }}
            aria-hidden
            className="fixed inset-x-0 bottom-0 z-[9989] h-[62vh] backdrop-blur-xl bg-gradient-to-b from-black/0 via-black/60 to-black/90 [mask-image:linear-gradient(to_bottom,transparent,black_38%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_38%)]"
          />

          {/* Barre glass en bas */}
          <motion.div
            key="home-gate-bar"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40, transition: { duration: 0.35 } }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-gate-title"
            className="fixed inset-x-0 bottom-0 z-[9990] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-6"
          >
            <div className="mx-auto w-full max-w-2xl">
              <div className="mb-3 flex justify-center">
                <motion.span
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md"
                >
                  <ChevronDown size={13} className="text-empire" />
                  {fr ? 'Vos millions de vues sont à un scroll.' : 'Your millions of views are one scroll away.'}
                </motion.span>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.08] shadow-[0_-10px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(var(--empire-rgb)_/_0.18),transparent_55%)]" />
                <div className="relative p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-empire">
                        {fr ? 'Découvrir la formule' : 'Discover the formula'}
                      </p>
                      <h2 id="home-gate-title" className="mt-1 text-[17px] sm:text-xl font-extrabold leading-snug tracking-tight text-white">
                        {fr
                          ? 'Entrez votre email pour découvrir la formule.'
                          : 'Enter your email to discover the formula.'}
                      </h2>
                      <p className="mt-1 hidden text-[13px] text-neutral-300 sm:block">
                        {fr
                          ? 'Message × Format × Diffusion ÷ Temps + Coût = Visibilité - et la suite de la page se dévoile.'
                          : 'Message × Format × Distribution ÷ Time + Cost = Visibility - and the rest of the page opens up.'}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={submit} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch" method="post" action="/api/home-gate">
                    <label htmlFor="home-gate-email" className="sr-only">Email</label>
                    <div className="relative flex-1 min-w-0">
                      <input
                        ref={inputRef}
                        id="home-gate-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        value={email}
                        disabled={phase !== 'idle'}
                        onChange={(e) => { setEmail(e.target.value); if (error) setError(''); if (suggestion) setSuggestion(''); if (typoConfirm) setTypoConfirm(false) }}
                        placeholder={fr ? 'votre@email.com' : 'you@email.com'}
                        aria-invalid={!!error && !typoConfirm}
                        className={`min-h-[50px] w-full rounded-xl border bg-black/35 px-4 pr-11 text-[15px] text-white placeholder:text-neutral-400 outline-none transition focus:ring-2 focus:ring-empire/40 disabled:opacity-70 ${
                          error && !typoConfirm ? 'border-red-400/70 focus:border-red-300' : phase === 'verified' ? 'border-emerald-400/70' : 'border-white/20 focus:border-empire'
                        }`}
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center">
                        {phase === 'checking' && <Loader2 size={18} className="animate-spin text-empire" />}
                        {phase === 'verified' && <Check size={18} className="text-emerald-400" />}
                      </span>
                    </div>
                    <input type="text" name="company" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden />
                    <button
                      type="submit"
                      disabled={phase !== 'idle'}
                      className="group relative flex min-h-[50px] shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl bg-empire px-5 text-[15px] font-bold text-black shadow-[0_0_36px_rgb(var(--empire-rgb)_/_0.35)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-80"
                    >
                      <span className="absolute inset-y-0 left-0 w-10 bg-white/25 blur-xl transition group-hover:w-20" />
                      <span className="relative whitespace-nowrap">
                        {phase === 'checking'
                          ? (fr ? 'Vérification…' : 'Verifying…')
                          : phase === 'verified'
                            ? (fr ? 'Email vérifié' : 'Email verified')
                            : (fr ? 'Découvrir' : 'Discover')}
                      </span>
                      {phase === 'idle' && <ArrowRight size={17} className="relative transition group-hover:translate-x-0.5" />}
                      {phase === 'verified' && <Check size={17} className="relative" />}
                    </button>
                  </form>

                  <div className="mt-2 flex min-h-[16px] items-start justify-between gap-3" aria-live="polite">
                    {error ? (
                      <p className={`text-xs ${typoConfirm ? 'text-neutral-200' : 'text-red-300'}`}>
                        {error}
                        {suggestion && (
                          <>
                            {' '}
                            <button type="button" onClick={useSuggestion} className="font-semibold text-empire underline underline-offset-2">
                              {fr ? `Vouliez-vous dire ${suggestion} ?` : `Did you mean ${suggestion}?`}
                            </button>
                          </>
                        )}
                        {typoConfirm && (
                          <>
                            {' · '}
                            <button type="button" onClick={keepMine} className="text-neutral-300 underline underline-offset-2 hover:text-white">
                              {fr ? 'Non, garder le mien' : 'No, keep mine'}
                            </button>
                          </>
                        )}
                      </p>
                    ) : (
                      <p className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                        <ShieldCheck size={12} className="shrink-0" />
                        {fr ? 'Email vérifié à l’instant · aucun spam' : 'Verified instantly · no spam'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
