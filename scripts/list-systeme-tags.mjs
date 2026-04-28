#!/usr/bin/env node
/**
 * Lists all tags in your Systeme.io account and prints the matching env var
 * blocks ready to paste into `.env.local`.
 *
 * Usage:
 *   SYSTEMEIO_API_KEY=sk_xxx node scripts/list-systeme-tags.mjs
 *
 * Or with dotenv:
 *   node --env-file=.env.local scripts/list-systeme-tags.mjs
 */

const API_KEY = process.env.SYSTEMEIO_API_KEY
if (!API_KEY) {
  console.error('❌ SYSTEMEIO_API_KEY is missing. Run with:')
  console.error('   SYSTEMEIO_API_KEY=sk_xxx node scripts/list-systeme-tags.mjs')
  process.exit(1)
}

const API_BASE = 'https://api.systeme.io/api'

const EXPECTED = [
  ['quiz_completed', 'SYSTEMEIO_TAG_QUIZ_COMPLETED'],
  ['quiz_started', 'SYSTEMEIO_TAG_QUIZ_STARTED'],
  ['archetype_storyteller', 'SYSTEMEIO_TAG_ARCHETYPE_STORYTELLER'],
  ['archetype_builder', 'SYSTEMEIO_TAG_ARCHETYPE_BUILDER'],
  ['archetype_educator', 'SYSTEMEIO_TAG_ARCHETYPE_EDUCATOR'],
  ['archetype_provocateur', 'SYSTEMEIO_TAG_ARCHETYPE_PROVOCATEUR'],
  ['score_high', 'SYSTEMEIO_TAG_SCORE_HIGH'],
  ['score_medium', 'SYSTEMEIO_TAG_SCORE_MEDIUM'],
  ['score_low', 'SYSTEMEIO_TAG_SCORE_LOW'],
  ['offer_academy', 'SYSTEMEIO_TAG_OFFER_ACADEMY'],
  ['offer_autopilot', 'SYSTEMEIO_TAG_OFFER_AUTOPILOT'],
  ['offer_copilot', 'SYSTEMEIO_TAG_OFFER_COPILOT'],
  ['offer_nurture', 'SYSTEMEIO_TAG_OFFER_NURTURE'],
]

async function fetchAllTags() {
  const all = []
  let page = 1
  while (page <= 50) {
    const res = await fetch(`${API_BASE}/tags?page=${page}`, {
      headers: { 'X-API-Key': API_KEY, 'Content-Type': 'application/json' },
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`systeme.io ${res.status}: ${text}`)
    }
    const data = await res.json()
    const items = data.items ?? []
    if (!items.length) break
    all.push(...items)
    if (items.length < 25) break
    page++
  }
  return all
}

;(async () => {
  console.log('→ Fetching tags from Systeme.io...\n')
  const tags = await fetchAllTags()
  if (!tags.length) {
    console.log('No tags found. Create them first in Systeme.io → Contacts → Tags.')
    return
  }

  console.log(`Found ${tags.length} tag(s):\n`)
  for (const t of tags) {
    console.log(`  ${String(t.id).padEnd(8)}  ${t.name}`)
  }

  console.log('\n──────────────────────────────────────────────────────')
  console.log('Paste this into your .env.local:')
  console.log('──────────────────────────────────────────────────────\n')

  console.log(`SYSTEMEIO_API_KEY=${API_KEY.slice(0, 6)}…<keep your real key>\n`)

  for (const [tagName, envKey] of EXPECTED) {
    const found = tags.find(t => (t.name || '').toLowerCase() === tagName)
    if (found) {
      console.log(`${envKey}=${found.id}`)
    } else {
      console.log(`# ${envKey}=  ⚠️ tag "${tagName}" not found in Systeme.io`)
    }
  }

  console.log('')
})().catch(err => {
  console.error('❌', err.message || err)
  process.exit(1)
})
