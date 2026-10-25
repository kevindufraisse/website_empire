"use client"
import { useEffect, useState } from 'react'
import { Consent, readConsent, saveConsent, clearOptionalStorage, CONSENT_EVENT } from '../lib/marketingConsent'
export default function CookiePreferences({ onChange }: { onChange?: (consent: Consent | null) => void }) {
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)
  const [details, setDetails] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  useEffect(() => {
    const sync = () => { const c = readConsent(); setMarketing(c?.marketing === true); setAnalytics(c?.analytics === true); onChange?.(c) }
    const c = readConsent(); setOpen(!c); setReady(true); sync()
    if (!c) clearOptionalStorage()
    window.addEventListener(CONSENT_EVENT, sync)
    return () => window.removeEventListener(CONSENT_EVENT, sync)
  }, [onChange])
  function choose(m: boolean, a: boolean) {
    const previous = readConsent()
    saveConsent(m, a); setOpen(false)
    if (!m || !a) clearOptionalStorage(!m, !a)
    if ((previous?.marketing && !m) || (previous?.analytics && !a)) location.reload()
  }
  if (!ready) return null
  const button = { border: '1px solid #777', borderRadius: 8, padding: '10px 14px', background: '#fff', color: '#111', cursor: 'pointer', fontSize: 14, fontWeight: 600 } as const
  return <>
    <button type="button" onClick={() => { setOpen(true); setDetails(false) }} style={{ ...button, position: 'fixed', bottom: 8, left: 8, zIndex: 9998, fontSize: 12, padding: '5px 9px' }}>Cookies</button>
    {open && <section role="dialog" aria-label="Vos choix de cookies" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, background: '#171717', color: '#fff', padding: 20, boxShadow: '0 -2px 20px #0006', fontSize: 14, lineHeight: 1.5 }}>
      <div style={{ maxWidth: 1000, margin: 'auto' }}>
        <p style={{ fontWeight: 700, marginBottom: 8 }}>Tu gardes le choix.</p>
        <p>Empire utilise, avec ton accord, Meta et Google pour mesurer les campagnes et personnaliser la publicité, ainsi qu’Amplitude et PostHog pour comprendre la navigation et améliorer le site. Refuser ne bloque ni l’inscription ni l’achat. Tu peux revenir sur ton choix avec le bouton Cookies. <a href="https://www.empire-internet.com/privacy" style={{ textDecoration: 'underline' }}>En savoir plus</a></p>
        {details && <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          <label><input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} /> Publicité et mesure des campagnes (Meta, Google)</label>
          <label><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} /> Statistiques et amélioration (Amplitude, PostHog)</label>
          <p>Les cookies nécessaires au fonctionnement et à la mémorisation de ton choix restent actifs. Choix conservé 6 mois sur le site et l’application Empire.</p>
        </div>}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
          <button type="button" style={button} onClick={() => choose(false, false)}>Tout refuser</button>
          <button type="button" style={button} onClick={() => choose(true, true)}>Tout accepter</button>
          <button type="button" style={button} onClick={() => details ? choose(marketing, analytics) : setDetails(true)}>{details ? 'Enregistrer mes choix' : 'Personnaliser'}</button>
        </div>
      </div>
    </section>}
  </>
}
