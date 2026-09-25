/**
 * « Post it like it's hot » : le live gratuit de Kevin, chaque mercredi à
 * midi (heure de Paris). Remplace la communauté Slack comme offre gratuite
 * du site (page `/postit`, popup de sortie, header, footer).
 *
 * L'inscription (prénom + email, séquence de rappels) se fait sur la page
 * Systeme.io `POSTIT_URL` : le site ne redemande jamais l'email, il y envoie.
 */

export const POSTIT_NAME = 'Post it like it\u2019s hot'
export const POSTIT_PATH = '/postit'
export const POSTIT_URL =
  process.env.NEXT_PUBLIC_POSTIT_URL || 'https://join.empire-internet.com/masterclass-empire-internet'

/** Lien d'inscription tagué par emplacement, pour lire les inscrits par source dans Systeme.io. */
export function postitJoinUrl(source: string): string {
  const url = new URL(POSTIT_URL)
  url.searchParams.set('utm_source', 'site')
  url.searchParams.set('utm_medium', source)
  url.searchParams.set('utm_campaign', 'postit')
  return url.toString()
}

const TZ = 'Europe/Paris'
/** Mercredi, en index `Date.getUTCDay()`. */
const WEEKDAY = 3
const HOUR = 12
export const POSTIT_DURATION_MIN = 60

const WEEKDAYS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

function parisParts(at: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    weekday: 'short',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(at)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '0'
  return {
    weekday: WEEKDAYS[get('weekday')] ?? 0,
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    hour: Number(get('hour')),
    minute: Number(get('minute')),
    second: Number(get('second')),
  }
}

/** Heure murale de Paris → instant réel, heure d'été comprise. */
function parisWallTime(year: number, month: number, day: number, hour: number): Date {
  const guess = Date.UTC(year, month - 1, day, hour)
  const p = parisParts(new Date(guess))
  const offset = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - guess
  return new Date(guess - offset)
}

export type PostitSession = {
  start: Date
  end: Date
  /** Le live est en cours en ce moment. */
  live: boolean
}

/** Le live en cours, sinon le prochain. */
export function nextPostitSession(now: Date = new Date()): PostitSession {
  const p = parisParts(now)
  const daysAhead = (WEEKDAY - p.weekday + 7) % 7
  let start = parisWallTime(p.year, p.month, p.day + daysAhead, HOUR)
  let end = new Date(start.getTime() + POSTIT_DURATION_MIN * 60_000)
  if (now >= end) {
    start = parisWallTime(p.year, p.month, p.day + daysAhead + 7, HOUR)
    end = new Date(start.getTime() + POSTIT_DURATION_MIN * 60_000)
  }
  return { start, end, live: now >= start && now < end }
}

/** Invitation Google Agenda récurrente (chaque mercredi) à partir de `start`. */
export function postitCalendarUrl(start: Date, fr: boolean): string {
  const p = parisParts(start)
  const pad = (n: number) => String(n).padStart(2, '0')
  const day = `${p.year}${pad(p.month)}${pad(p.day)}`
  const endHour = HOUR + Math.floor(POSTIT_DURATION_MIN / 60)
  const endMin = POSTIT_DURATION_MIN % 60
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: POSTIT_NAME,
    dates: `${day}T${pad(HOUR)}0000/${day}T${pad(endHour)}${pad(endMin)}00`,
    ctz: TZ,
    recur: 'RRULE:FREQ=WEEKLY;BYDAY=WE',
    details: fr
      ? `Le live de Kevin Dufraisse, chaque mercredi à midi.${POSTIT_URL ? `\n\nRejoindre : ${POSTIT_URL}` : ''}`
      : `Kevin Dufraisse's live, every Wednesday at noon (Paris).${POSTIT_URL ? `\n\nJoin: ${POSTIT_URL}` : ''}`,
  })
  if (POSTIT_URL) params.set('location', POSTIT_URL)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function formatPostitDate(start: Date, fr: boolean): string {
  return new Intl.DateTimeFormat(fr ? 'fr-FR' : 'en-GB', {
    timeZone: TZ,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(start)
}
