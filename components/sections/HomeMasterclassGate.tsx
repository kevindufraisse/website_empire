'use client'
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ArrowDown, ArrowRight, Check, Mail } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { storeVideoEmail } from '@/components/VideoEmailGate'
import { trackAmplitude } from '@/lib/amplitude'
import s from './HomeMasterclassGate.module.css'
import stable from '../StableHomeJourney.module.css'

const DONE = 'empire-masterclass-requested-v16'
const PREVIEW = process.env.NEXT_PUBLIC_SITE_PREVIEW === '1'
function remembered() {
  try { if (sessionStorage.getItem(DONE) === '1') return true } catch {}
  try { return localStorage.getItem(DONE) === '1' } catch { return false }
}
function remember() {
  try { sessionStorage.setItem(DONE, '1') } catch {}
  if (!PREVIEW) { try { localStorage.setItem(DONE, '1') } catch {} }
}

// A completion flag, not an email draft. No new personal data is stored.
export function useMasterclassRequested() {
  const [requested, setRequested] = useState<boolean | null>(null)
  useEffect(() => {
    const sync = () => setRequested(remembered())
    sync()
    window.addEventListener('empire-masterclass-updated', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('empire-masterclass-updated', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return requested
}

export function MasterclassForm({ onReady, reminder = false, idPrefix }: {
  onReady?: () => void; reminder?: boolean; idPrefix?: string
}) {
  const { lang } = useLanguage(), fr = lang === 'fr'
  const requested = useMasterclassRequested()
  const [email, setEmail] = useState(''), [company, setCompany] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'preview' | 'error'>('idle')
  const [invalid, setInvalid] = useState(false), [reservedHeight, setReservedHeight] = useState(0)
  const frame = useRef<HTMLDivElement>(null), submitting = useRef(false)
  const suffix = idPrefix || (reminder ? 'reminder' : 'gate')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting.current) return
    setInvalid(false)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setInvalid(true); setStatus('error'); return
    }
    // Keep the page's geometry when the form becomes a persistent receipt.
    setReservedHeight(Math.max(200, frame.current?.offsetHeight || 0))
    submitting.current = true
    setStatus('loading')
    try {
      if (PREVIEW) {
        remember(); setStatus('preview')
        window.dispatchEvent(new Event('empire-masterclass-updated'))
        onReady?.(); return
      }
      const res = await fetch('/api/home-masterclass', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, locale: lang }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setInvalid(data.code === 'invalid_fields'); setStatus('error'); return
      }
      storeVideoEmail(email.trim().toLowerCase())
      remember(); setStatus('success')
      window.dispatchEvent(new Event('empire-masterclass-updated'))
      trackAmplitude('home_masterclass_requested', { source: suffix })
      onReady?.()
    } catch {
      setStatus('error')
    } finally {
      submitting.current = false
    }
  }

  const complete = status === 'success' || status === 'preview' || requested === true
  return <div ref={frame} className={stable.formFrame} data-masterclass-form={suffix} style={reservedHeight ? { minHeight: reservedHeight } : undefined}>
    {complete ? <div className={stable.receipt} role="status" aria-live="polite">
      <Check size={22}/><div>
        <b>{status === 'preview' ? 'Demande simulée dans cet aperçu.' : fr ? 'Votre demande de masterclass est enregistrée.' : 'Your masterclass request is recorded.'}</b>
        <p>{status === 'preview' ? 'Aucun email n’est envoyé depuis cet aperçu.' : fr ? 'Vous pouvez continuer à découvrir Empire à votre rythme.' : 'You can continue exploring Empire at your own pace.'}</p>
      </div>
    </div> : <form onSubmit={submit} className={s.form} aria-label={fr ? 'Recevoir la masterclass' : 'Get the masterclass'}>
      <label htmlFor={`masterclass-email-${suffix}`}>{fr ? 'Recevez la vidéo dans votre boîte mail' : 'Get the video in your inbox'}</label>
      <div className={s.field}><Mail size={18}/><input id={`masterclass-email-${suffix}`} type="email" autoComplete="email" inputMode="email" required maxLength={254} value={email} onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }} placeholder="vous@entreprise.com" aria-invalid={status === 'error' && invalid} aria-describedby={`masterclass-note-${suffix}`} disabled={status === 'loading'}/></div>
      <div className={s.honeypot} aria-hidden><label htmlFor={`masterclass-company-${suffix}`}>Company</label><input id={`masterclass-company-${suffix}`} name="company" value={company} onChange={e => setCompany(e.target.value)} tabIndex={-1} autoComplete="off"/></div>
      <button type="submit" disabled={status === 'loading'}>{status === 'loading' ? (fr ? 'Enregistrement…' : 'Registering…') : (fr ? 'Recevoir la masterclass gratuite' : 'Get the free masterclass')}<ArrowRight size={17}/></button>
      <small id={`masterclass-note-${suffix}`}>{PREVIEW ? 'Aperçu du formulaire · envoi d’email désactivé.' : fr ? '1 h 26 de vidéo. À regarder quand vous voulez.' : '1h26 of video. Watch whenever you like.'}</small>
      {status === 'error' && <p role="alert" className={s.error}>{invalid ? (fr ? 'Vérifiez votre adresse email.' : 'Check your email address.') : (fr ? 'L’envoi n’a pas abouti. Votre saisie est conservée : réessayez ou continuez la découverte.' : 'The request failed. Your entry is kept: retry or continue exploring.')}</p>}
    </form>}
  </div>
}

export function MasterclassThumbnail() {
  const [unavailable, setUnavailable] = useState(false)
  return <div className={s.thumbnail}>{unavailable ? <div className={s.thumbnailFallback}><img src="/founders/kevin.jpg" alt="Kevin Dufraisse"/><div><span>LA MASTERCLASS EMPIRE</span><b>La formule<br/>pour être vu.</b><small>Avec Kevin Dufraisse</small></div></div> : <img src="https://i.ytimg.com/vi/AKfoDblGUNs/maxresdefault.jpg" alt="La masterclass de Kevin Dufraisse : comprendre la formule Empire" width={1280} height={720} onError={() => setUnavailable(true)} ref={node => { if (node?.complete && !node.naturalWidth) setUnavailable(true) }} loading="lazy"/>}<span>MASTERCLASS · 1 H 26</span></div>
}

export function MasterclassReminder() {
  const requested = useMasterclassRequested()
  const [submittedHere, setSubmittedHere] = useState(false)
  // Do not remove the section while the person is reading its confirmation.
  if (requested !== false && !submittedHere) return null
  return <section className={s.reminder} aria-labelledby="masterclass-reminder-title"><div className={s.reminderVisual}><MasterclassThumbnail/></div><div className={s.reminderCopy}><small>MASTERCLASS GRATUITE</small><h2 id="masterclass-reminder-title">Comprendre la méthode,<br/>à votre rythme.</h2><p>La formule, expliquée par Kevin en 1 h 26.<br/>Recevez la vidéo et regardez-la quand vous voulez.</p><MasterclassForm reminder onReady={() => setSubmittedHere(true)}/></div></section>
}

export default function HomeMasterclassGate({ children }: { children: ReactNode }) {
  const { autopilot } = useAutopilot()
  if (autopilot) return <>{children}</>
  // No timed scroll, lock, blur, spring transition or disappearing overlay.
  // Only this explicit link navigates to the demo; ordinary scrolling always works.
  return <><section className={s.section} aria-labelledby="masterclass-title" id="home-masterclass"><div className={s.card}>
    <div className={s.visual}><MasterclassThumbnail/><p>Comprendre la formule.<br/><em>Savoir l’appliquer à votre activité.</em></p></div>
    <div className={s.copy}><small>MASTERCLASS GRATUITE · FACULTATIVE</small><h2 id="masterclass-title">Comprenez ce qui fait<br/>fonctionner vos contenus.</h2><p>Pourquoi certains contenus sont vus, et comment appliquer ces mécaniques à vos propres sujets. Kevin vous montre la méthode dans la masterclass.</p><MasterclassForm/><a href="#formula-message" className={s.skip} onClick={() => trackAmplitude('home_masterclass_continue_clicked')}>Continuer la découverte<ArrowDown size={16}/></a></div>
  </div></section><div className={s.discovery} data-discovery-unlocked="true">{children}</div></>
}
