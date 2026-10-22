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
  const hit = document.cookie.split('; ').find((c) => c.startsWith(`${name}=`))
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : undefined
}

function writeCookie(name: string, value: string, days: number) {
  // Partagé avec app.empire-internet.com : le paiement relit l'attribution.
  const domain = location.hostname.endsWith('empire-internet.com') ? '; domain=.empire-internet.com' : ''
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${days * 86400}; path=/; SameSite=Lax${domain}${secure}`
}

export function readAttribution(): Attribution {
  let attr: Attribution = {}
  try {
    attr = JSON.parse(readCookie(ATTR_COOKIE) || '{}')
  } catch {
    attr = {}
  }
  const fbc = readCookie('_fbc')
  const fbp = readCookie('_fbp')
  if (fbc) attr.fbc = fbc
  if (fbp) attr.fbp = fbp
  return attr
}

/** À chaque arrivée : fbclid → _fbc (format Meta), _fbp et utm_* dans `empire_attr`. */
export function captureAttribution() {
  const params = new URLSearchParams(location.search)
  const attr = readAttribution()

  const fbclid = params.get('fbclid')
  if (fbclid && !attr.fbc?.endsWith(`.${fbclid}`)) {
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
  const eventId = newEventId(name)
  whenFbq((fbq) => fbq(STANDARD_EVENTS.has(name) ? 'track' : 'trackCustom', name, params, { eventID: eventId }))

  fetch('/api/meta/event', {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: name,
      event_id: eventId,
      event_source_url: location.href,
      custom_data: params,
      attribution: readAttribution(),
      ...(opts.email ? { email: opts.email } : {}),
    }),
  }).catch(() => {})

  return eventId
}
