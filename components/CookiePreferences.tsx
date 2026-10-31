"use client"
import { useEffect, useState, type CSSProperties } from 'react'
import { Consent, readConsent, saveConsent, clearOptionalStorage, CONSENT_EVENT, OPEN_PREFS_EVENT } from '../lib/marketingConsent'

/**
 * Panneau de choix des cookies. Il ne s'ouvre plus au chargement (31 octobre
 * 2026) : la mesure est active par défaut et le visiteur peut la refuser à
 * tout moment depuis « Cookies » en pied de page (`openCookiePreferences`).
 * Tant qu'aucun choix n'est enregistré, les cases reflètent l'état réel : cochées.
 */
export default function CookiePreferences({ onChange }: { onChange?: (consent: Consent | null) => void }) {
  const [open, setOpen] = useState(false)
  const [details, setDetails] = useState(false)
  const [marketing, setMarketing] = useState(true)
  const [analytics, setAnalytics] = useState(true)
  useEffect(() => {
    // Sans choix enregistré, la mesure est active : les cases le disent.
    const sync = () => { const c = readConsent(); setMarketing(c?.marketing !== false); setAnalytics(c?.analytics !== false); onChange?.(c) }
    const openPrefs = () => { setDetails(true); setOpen(true) }
    sync()
    window.addEventListener(CONSENT_EVENT, sync)
    window.addEventListener(OPEN_PREFS_EVENT, openPrefs)
    return () => { window.removeEventListener(CONSENT_EVENT, sync); window.removeEventListener(OPEN_PREFS_EVENT, openPrefs) }
  }, [onChange])
  function choose(m: boolean, a: boolean) {
    // Un refus coupe ce qui tournait par défaut : on nettoie puis on recharge
    // pour que les scripts déjà chargés ne repartent pas.
    const wasMarketing = readConsent()?.marketing !== false
    const wasAnalytics = readConsent()?.analytics !== false
    saveConsent(m, a); setOpen(false)
    if (!m || !a) clearOptionalStorage(!m, !a)
    if ((wasMarketing && !m) || (wasAnalytics && !a)) location.reload()
  }

  const base: CSSProperties = { borderRadius: 10, padding: '8px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 600, lineHeight: 1.2, flex: '1 1 0' }
  const primary: CSSProperties = { ...base, border: '1px solid #fff', background: '#fff', color: '#111' }
  const secondary: CSSProperties = { ...base, border: '1px solid #444', background: 'transparent', color: '#fff' }
  const link: CSSProperties = { background: 'none', border: 0, padding: 0, color: 'inherit', textDecoration: 'underline', cursor: 'pointer', font: 'inherit', lineHeight: 'inherit', display: 'inline', verticalAlign: 'baseline', minHeight: 0 }

  return <>
    {open && (
      <section
        role="dialog"
        aria-label="Vos choix de cookies"
        style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 9999, padding: '0 10px calc(10px + env(safe-area-inset-bottom, 0px))', pointerEvents: 'none' }}
      >
        <div style={{ pointerEvents: 'auto', maxWidth: 520, margin: '0 auto', background: '#171717', color: '#fff', border: '1px solid #2e2e2e', borderRadius: 14, padding: '10px 12px', boxShadow: '0 8px 30px #0008', fontSize: 12.5, lineHeight: 1.4 }}>
          <p style={{ margin: 0, color: '#c4c4c4' }}>
            <strong style={{ color: '#fff' }}>Cookies.</strong> Mesure d’audience et des campagnes, active par défaut pour améliorer ton expérience. Refuser ne bloque rien.{' '}
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
              <p style={{ margin: 0, fontSize: 12, color: '#8a8a8a' }}>Les cookies nécessaires au fonctionnement et à la mémorisation de ton choix restent actifs. Choix conservé 6 mois sur le site et l’application Empire, modifiable depuis « Cookies » en bas de page.</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {details ? (
              <>
                <button type="button" style={primary} onClick={() => choose(marketing, analytics)}>Enregistrer mes choix</button>
                <button type="button" style={secondary} onClick={() => setOpen(false)}>Fermer</button>
              </>
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
