"use client"
import { useEffect, useState, type CSSProperties } from 'react'
import { Consent, readConsent, saveConsent, clearOptionalStorage, CONSENT_EVENT } from '../lib/marketingConsent'

/**
 * Bandeau de consentement : une carte compacte en bas de l'écran, jamais un
 * mur. Sur un iPhone la version précédente prenait 340 px (40 % de l'écran)
 * sous une page dont le bouton principal est en bas. Meta, Google, Amplitude
 * et PostHog ne se chargent qu'après un « oui » (voir `MarketingConsent`),
 * donc le bandeau reste nécessaire : il doit juste rester petit.
 */
export default function CookiePreferences({ onChange }: { onChange?: (consent: Consent | null) => void }) {
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)
  const [details, setDetails] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  // Dès qu'un choix est enregistré, on masque le bouton flottant « Cookies » :
  // la barre ne doit plus rien afficher une fois qu'on a répondu.
  const [hasConsent, setHasConsent] = useState(false)
  useEffect(() => {
    const sync = () => { const c = readConsent(); setMarketing(c?.marketing === true); setAnalytics(c?.analytics === true); setHasConsent(Boolean(c)); onChange?.(c) }
    const c = readConsent(); setOpen(!c); setReady(true); sync()
    if (!c) clearOptionalStorage()
    window.addEventListener(CONSENT_EVENT, sync)
    return () => window.removeEventListener(CONSENT_EVENT, sync)
  }, [onChange])
  function choose(m: boolean, a: boolean) {
    const previous = readConsent()
    saveConsent(m, a); setOpen(false); setHasConsent(true)
    if (!m || !a) clearOptionalStorage(!m, !a)
    if ((previous?.marketing && !m) || (previous?.analytics && !a)) location.reload()
  }
  if (!ready) return null

  const base: CSSProperties = { borderRadius: 10, padding: '8px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 600, lineHeight: 1.2, flex: '1 1 0' }
  const primary: CSSProperties = { ...base, border: '1px solid #fff', background: '#fff', color: '#111' }
  const secondary: CSSProperties = { ...base, border: '1px solid #444', background: 'transparent', color: '#fff' }
  const link: CSSProperties = { background: 'none', border: 0, padding: 0, color: 'inherit', textDecoration: 'underline', cursor: 'pointer', font: 'inherit', lineHeight: 'inherit', display: 'inline', verticalAlign: 'baseline', minHeight: 0 }

  return <>
    {!hasConsent && !open && (
      <button
        type="button"
        onClick={() => { setOpen(true); setDetails(false) }}
        style={{ position: 'fixed', bottom: 'calc(8px + env(safe-area-inset-bottom, 0px))', left: 8, zIndex: 9998, border: '1px solid #444', borderRadius: 999, padding: '5px 10px', background: '#171717', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
      >
        Cookies
      </button>
    )}
    {open && (
      <section
        role="dialog"
        aria-label="Vos choix de cookies"
        style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 9999, padding: '0 10px calc(10px + env(safe-area-inset-bottom, 0px))', pointerEvents: 'none' }}
      >
        <div style={{ pointerEvents: 'auto', maxWidth: 520, margin: '0 auto', background: '#171717', color: '#fff', border: '1px solid #2e2e2e', borderRadius: 14, padding: '10px 12px', boxShadow: '0 8px 30px #0008', fontSize: 12.5, lineHeight: 1.4 }}>
          <p style={{ margin: 0, color: '#c4c4c4' }}>
            <strong style={{ color: '#fff' }}>Cookies ?</strong> Mesure d’audience, pour améliorer ton expérience. Refuser ne bloque rien.{' '}
            <a href="https://www.empire-internet.com/privacy" style={{ color: '#c4c4c4', textDecoration: 'underline' }}>En savoir plus</a>
            {!details && <>{' · '}<button type="button" style={link} onClick={() => setDetails(true)}>Personnaliser</button></>}
          </p>
          {details && (
            <div style={{ display: 'grid', gap: 8, marginTop: 10, color: '#e5e5e5' }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} style={{ marginTop: 2 }} />
                <span>Publicité et mesure des campagnes (Meta, Google)</span>
              </label>
              <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} style={{ marginTop: 2 }} />
                <span>Statistiques et amélioration (Amplitude, PostHog)</span>
              </label>
              <p style={{ margin: 0, fontSize: 12, color: '#8a8a8a' }}>Les cookies nécessaires au fonctionnement et à la mémorisation de ton choix restent actifs. Choix conservé 6 mois sur le site et l’application Empire.</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {details ? (
              <button type="button" style={primary} onClick={() => choose(marketing, analytics)}>Enregistrer mes choix</button>
            ) : (
              <>
                <button type="button" style={primary} onClick={() => choose(true, true)}>Tout accepter</button>
                <button type="button" style={secondary} onClick={() => choose(false, false)}>Tout refuser</button>
              </>
            )}
          </div>
        </div>
      </section>
    )}
  </>
}
