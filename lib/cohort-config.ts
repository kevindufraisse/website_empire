/**
 * Cohort configuration — add new cohorts here, everything else updates automatically.
 * Each entry: [startDate, endDate] as ISO strings (dates at midnight Paris time).
 */
const COHORTS: [string, string][] = [
  ['2026-04-25', '2026-05-17'],
  ['2026-05-18', '2026-06-07'],
  // Add future cohorts below:
  // ['2026-07-01', '2026-07-21'],
]

const MONTHS_SHORT: Record<string, string> = {
  '01': 'jan', '02': 'fév', '03': 'mars', '04': 'avr',
  '05': 'mai', '06': 'juin', '07': 'juil', '08': 'août',
  '09': 'sept', '10': 'oct', '11': 'nov', '12': 'déc',
}

const MONTHS_LONG: Record<string, string> = {
  '01': 'janvier', '02': 'février', '03': 'mars', '04': 'avril',
  '05': 'mai', '06': 'juin', '07': 'juillet', '08': 'août',
  '09': 'septembre', '10': 'octobre', '11': 'novembre', '12': 'décembre',
}

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function getCurrentCohortIndex(): number {
  // Always promote the last cohort in the list.
  // To switch to a new cohort, just add it at the end of COHORTS.
  return COHORTS.length - 1
}

function getCohort() {
  const idx = getCurrentCohortIndex()
  const [startIso, endIso] = COHORTS[idx]
  return { start: parseDate(startIso), end: parseDate(endIso), startIso, endIso }
}

function fmtShort(date: Date): string {
  const d = date.getDate()
  const m = MONTHS_SHORT[pad(date.getMonth() + 1)]
  return `${d} ${m}`
}

function fmtLong(date: Date): string {
  const d = date.getDate()
  const m = MONTHS_LONG[pad(date.getMonth() + 1)]
  return `${d} ${m}`
}

function fmtLongYear(date: Date): string {
  const d = date.getDate()
  const m = MONTHS_LONG[pad(date.getMonth() + 1)]
  return `${d} ${m} ${date.getFullYear()}`
}

const cohort = getCohort()

/** "18 mai → 7 juin" */
export const COHORT_RANGE_SHORT = `${fmtShort(cohort.start)} → ${fmtShort(cohort.end)}`

/** "18 mai → 7 juin 2026" */
export const COHORT_RANGE_LONG = `${fmtLong(cohort.start)} → ${fmtLongYear(cohort.end)}`

/** "Démarrage le 18 mai." */
export const COHORT_START_TEXT = `Démarrage le ${fmtLong(cohort.start)}.`

/** Raw Date objects for custom formatting */
export const COHORT_START = cohort.start
export const COHORT_END = cohort.end
