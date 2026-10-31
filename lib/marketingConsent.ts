export const CONSENT_COOKIE = 'empire_consent_v1'
export const CONSENT_EVENT = 'empire-consent-change'
/** Ouvre le panneau de choix (lien « Cookies » du pied de page). */
export const OPEN_PREFS_EVENT = 'empire-open-cookie-prefs'
export function openCookiePreferences() {
  try { window.dispatchEvent(new Event(OPEN_PREFS_EVENT)) } catch {}
}
export type Consent = { version: 1; marketing: boolean; analytics: boolean; at: number }
export function parseConsent(raw: string | undefined | null): Consent | null {
  try {
    const c = JSON.parse(raw || 'null')
    return c?.version === 1 && typeof c.marketing === 'boolean' && typeof c.analytics === 'boolean' &&
      Number.isFinite(c.at) && c.at <= Date.now() + 60000 && c.at > Date.now() - 180 * 86400000 ? c : null
  } catch { return null }
}
export function consentFromCookieHeader(header: string): Consent | null {
  try { const v = header.split(';').map(x => x.trim()).find(x => x.startsWith(`${CONSENT_COOKIE}=`)); return parseConsent(v ? decodeURIComponent(v.slice(CONSENT_COOKIE.length + 1)) : '') } catch { return null }
}
export function readConsent(): Consent | null {
  try { return consentFromCookieHeader(document.cookie) } catch { return null }
}
/** Règle depuis le 31 octobre 2026 : actif par défaut, seul un refus enregistré coupe.
 *  Avant, le pixel Meta partait déjà sans consentement (commit 066b29c) pendant que le
 *  bandeau gardait Amplitude et PostHog derrière un « oui » : 13 visiteurs vus par mois
 *  sur /academy. Le refus reste possible à tout moment (« Cookies », pied de page). */
export function marketingAllowed(): boolean { return readConsent()?.marketing !== false }
export function analyticsAllowed(): boolean { return readConsent()?.analytics !== false }
export function clearOptionalStorage(marketing = true, analytics = true) {
  if (typeof document === 'undefined') return
  try {
    const names = document.cookie.split(';').map(c => c.trim().split('=')[0]).filter(n => (marketing && /^(_fb[cp]|_ga|_gid|_gcl_|empire_attr|empire_meta_identity)/.test(n)) || (analytics && /^(AMP_|amp_|ph_)/.test(n)))
    for (const n of names) for (const domain of ['', '; domain=.empire-internet.com']) document.cookie = `${n}=; max-age=0; path=/${domain}; SameSite=Lax; Secure`
    for (const storage of [localStorage, sessionStorage]) for (const k of Object.keys(storage)) if (analytics && /^(AMP_|amp_|ph_)/.test(k)) storage.removeItem(k)
  } catch { /* A blocked store must never prevent an inscription or payment. */ }
}
export function saveConsent(marketing: boolean, analytics: boolean): Consent {
  const c: Consent = { version: 1, marketing, analytics, at: Date.now() }
  const domain = /(^|\.)empire-internet\.com$/.test(location.hostname) ? '; domain=.empire-internet.com' : ''
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  try { document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(c))}; max-age=15552000; path=/; SameSite=Lax${domain}${secure}` } catch {}
  window.dispatchEvent(new Event(CONSENT_EVENT))
  return c
}
