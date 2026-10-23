/**
 * Pixel Meta (chargé par GTM) + Conversions API, dédupliqués par event_id.
 * Chaque événement part deux fois : `fbq` dans le navigateur et
 * `/api/meta/event` côté serveur, avec le même identifiant.
 */

const ATTR_COOKIE = 'empire_attr'
const ATTR_DAYS = 90
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

export type Attribution = Partial<Record<'fbc' | 'fbp' | (typeof UTM_KEYS)[number], string>>

type Fbq = (...args: unknown[]) => void

const STANDARD_EVENTS = new Set(['PageView', 'ViewContent', 'Lead', 'CompleteRegistration', 'InitiateCheckout', 'Purchase'])

function readCookie(name: string): string | undefined {
  try {
    const hit = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith(`${name}=`))
    return hit ? decodeURIComponent(hit.slice(name.length + 1)) : undefined
  } catch { return undefined }
}

function writeCookie(name: string, value: string, days: number) {
  // Partagé avec app.empire-internet.com : le paiement relit l'attribution.
  const domain = /(^|\.)empire-internet\.com$/.test(location.hostname) ? '; domain=.empire-internet.com' : ''
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  try {
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${days * 86400}; path=/; SameSite=Lax${domain}${secure}`
  } catch { /* A browser blocking cookies must not interrupt signup. */ }
}

export function readAttribution(): Attribution {
  let attr: Attribution = {}
  try {
    const saved = JSON.parse(readCookie(ATTR_COOKIE) || '{}')
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      for (const key of [...UTM_KEYS, 'fbc', 'fbp'] as const) {
        if (typeof saved[key] === 'string') attr[key] = saved[key].slice(0, key.startsWith('utm_') ? 200 : 300)
      }
    }
  } catch {
    attr = {}
  }
  const fbc = readCookie('_fbc')
  const fbp = readCookie('_fbp')
  // The pixel's host-only cookie can lag behind the shared attribution cookie.
  if (fbc && (!attr.fbc || Number(fbc.split('.')[2]) >= Number(attr.fbc.split('.')[2]))) attr.fbc = fbc
  if (fbp) attr.fbp = fbp
  return attr
}

/** À chaque arrivée : fbclid → _fbc (format Meta), _fbp et utm_* dans `empire_attr`. */
export function captureAttribution() {
  const params = new URLSearchParams(location.search)
  const attr = readAttribution()

  const fbclid = params.get('fbclid')
  if (fbclid && /^[A-Za-z0-9_-]{1,200}$/.test(fbclid) && !attr.fbc?.endsWith(`.${fbclid}`)) {
    attr.fbc = `fb.1.${Date.now()}.${fbclid}`
    writeCookie('_fbc', attr.fbc, ATTR_DAYS)
  }

  // Une nouvelle campagne remplace l'ancienne en bloc, sans mélanger les utm.
  if (UTM_KEYS.some((k) => params.get(k))) {
    for (const k of UTM_KEYS) {
      const v = params.get(k)
      if (v) attr[k] = v.slice(0, 200)
      else delete attr[k]
    }
  }

  writeCookie(ATTR_COOKIE, JSON.stringify(attr), ATTR_DAYS)
}

function newEventId(name: string): string {
  const rand = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return `${name}.${rand}`
}

/** GTM charge le pixel après le premier paint : on attend `fbq` quelques secondes. */
function whenFbq(run: (fbq: Fbq) => void, tries = 20) {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq
  if (typeof fbq === 'function') return run(fbq)
  if (tries > 0) window.setTimeout(() => whenFbq(run, tries - 1), 250)
}

export function trackMeta(
  name: string,
  params: Record<string, string | number> = {},
  opts: { email?: string | null } = {},
): string {
  // Purchase is emitted exclusively by the signed Stripe webhook.
  if (name === 'Purchase') return ''
  const eventId = newEventId(name)
  whenFbq((fbq) => fbq(STANDARD_EVENTS.has(name) ? 'track' : 'trackCustom', name, params, { eventID: eventId }))

  fetch('/api/meta/event', {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: name,
      event_id: eventId,
      event_source_url: `${location.origin}${location.pathname}`,
      custom_data: params,
      attribution: readAttribution(),
      ...(opts.email ? { email: opts.email } : {}),
    }),
  }).catch(() => {})

  return eventId
}
