#!/usr/bin/env node
/**
 * Creates the "La Méthode Gourou" webinar event in AddCal.co,
 * then prints the env var block to paste in `.env.local`.
 *
 * Usage:
 *   ADDCAL_API_KEY=xxx node scripts/setup-addcal-webinar.mjs
 *
 * Note: AddCal.co's API doesn't expose a search-by-internal-name endpoint,
 * so this script will create a new event each time it's run. To avoid
 * duplicates, only run it once and store the resulting URL in `.env.local`.
 */

const API_KEY = process.env.ADDCAL_API_KEY
if (!API_KEY) {
  console.error('❌ ADDCAL_API_KEY is missing.')
  console.error('   Run: ADDCAL_API_KEY=xxx node scripts/setup-addcal-webinar.mjs')
  process.exit(1)
}

const API_BASE = 'https://addcal.co'

const LIVE_URL = 'https://empire-internet.com/live'

const EVENT_PAYLOAD = {
  title: 'La Méthode Gourou - Webinar Empire Internet',
  date_start: '2026-06-10 19:00:00',
  date_end: '2026-06-10 20:30:00',
  timezone: 'Europe/Paris',
  description:
    'Webinar gratuit avec Kevin & Marc Dufraisse.\n\n' +
    'Le décryptage des techniques que les personnalités les plus visibles utilisent pour dominer leur marché - et comment les appliquer à ton business.\n\n' +
    '90 min en live + 15 min de Q&A · Replay 48h pour les inscrits présents.\n\n' +
    `Lien du live : ${LIVE_URL}`,
  location: LIVE_URL,
  is_virtual: true,
  is_all_day: false,
  organiser_name: 'Kevin & Marc Dufraisse',
  organiser_email: 'kevin@empire-internet.com',
  reminder_before: 60,
  busy_type: 'busy',
  internal_name: 'webinar_methode_gourou_2026_06_10',
  calendar_name: 'Empire Internet',
}

async function api(path, init = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(init.headers || {}),
    },
  })
  const text = await res.text()
  let data
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} on ${path} - ${text}`)
  }
  return data
}

async function main() {
  console.log('➕ Creating webinar event in AddCal.co...\n')

  const response = await api('/api/events', {
    method: 'POST',
    body: JSON.stringify(EVENT_PAYLOAD),
  })

  const event = response.data
  const links = response.links || {}

  console.log(`✓ Event created (uid=${event.uid})\n`)

  console.log('━'.repeat(60))
  console.log('📋 Add these to your .env.local:')
  console.log('━'.repeat(60))
  console.log()
  console.log(`ADDCAL_API_KEY=${API_KEY}`)
  console.log(`NEXT_PUBLIC_ADDCAL_EVENT_URL=${event.public_url}`)
  console.log()
  console.log('━'.repeat(60))
  console.log()
  console.log('Event details:')
  console.log(`  Title:        ${event.title}`)
  console.log(`  Start:        ${event.date_start}`)
  console.log(`  End:          ${event.date_end}`)
  console.log(`  Public URL:   ${event.public_url}`)
  console.log()
  console.log('Direct calendar links:')
  console.log(`  Google:       ${links.google || '-'}`)
  console.log(`  Apple:        ${links.apple || '-'}`)
  console.log(`  Outlook:      ${links.outlook || '-'}`)
  console.log(`  Outlook web:  ${links.outlook_web || '-'}`)
  console.log(`  Yahoo:        ${links.yahoo || '-'}`)
  console.log(`  Office 365:   ${links.office365 || '-'}`)
  console.log(`  ICS:          ${links.ics || '-'}`)
  console.log()
}

main().catch(err => {
  console.error('\n❌ Setup failed:', err.message)
  process.exit(1)
})
