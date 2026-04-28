#!/usr/bin/env node
/**
 * Idempotently creates all required tags in Systeme.io for the Empire quiz,
 * then prints the env var block to paste in `.env.local`.
 *
 * Usage:
 *   SYSTEMEIO_API_KEY=xxx node scripts/setup-systeme-tags.mjs
 */

const API_KEY = process.env.SYSTEMEIO_API_KEY
if (!API_KEY) {
  console.error('❌ SYSTEMEIO_API_KEY is missing.')
  console.error('   Run: SYSTEMEIO_API_KEY=xxx node scripts/setup-systeme-tags.mjs')
  process.exit(1)
}

const API_BASE = 'https://api.systeme.io/api'

const TAGS = [
  { name: 'quiz_completed', envKey: 'SYSTEMEIO_TAG_QUIZ_COMPLETED' },
  { name: 'quiz_started', envKey: 'SYSTEMEIO_TAG_QUIZ_STARTED' },
  { name: 'archetype_storyteller', envKey: 'SYSTEMEIO_TAG_ARCHETYPE_STORYTELLER' },
  { name: 'archetype_builder', envKey: 'SYSTEMEIO_TAG_ARCHETYPE_BUILDER' },
  { name: 'archetype_educator', envKey: 'SYSTEMEIO_TAG_ARCHETYPE_EDUCATOR' },
  { name: 'archetype_provocateur', envKey: 'SYSTEMEIO_TAG_ARCHETYPE_PROVOCATEUR' },
  { name: 'score_high', envKey: 'SYSTEMEIO_TAG_SCORE_HIGH' },
  { name: 'score_medium', envKey: 'SYSTEMEIO_TAG_SCORE_MEDIUM' },
  { name: 'score_low', envKey: 'SYSTEMEIO_TAG_SCORE_LOW' },
  { name: 'offer_academy', envKey: 'SYSTEMEIO_TAG_OFFER_ACADEMY' },
  { name: 'offer_autopilot', envKey: 'SYSTEMEIO_TAG_OFFER_AUTOPILOT' },
  { name: 'offer_copilot', envKey: 'SYSTEMEIO_TAG_OFFER_COPILOT' },
  { name: 'offer_nurture', envKey: 'SYSTEMEIO_TAG_OFFER_NURTURE' },
]

async function api(path, init = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(init.headers || {}),
    },
  })
  const text = await res.text()
  let data
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  if (!res.ok && res.status !== 422) {
    throw new Error(`${res.status} ${res.statusText} on ${path} — ${text}`)
  }
  return { status: res.status, data }
}

async function fetchAllTags() {
  const all = []
  let page = 1
  while (page <= 50) {
    const { data } = await api(`/tags?itemsPerPage=100&page=${page}`)
    const items = data?.items ?? []
    if (!items.length) break
    all.push(...items)
    if (items.length < 100) break
    page++
  }
  return all
}

async function createTag(name) {
  const { status, data } = await api('/tags', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  return { status, data }
}

;(async () => {
  console.log('→ Connecting to Systeme.io API...\n')

  const existingTags = await fetchAllTags()
  const byName = new Map()
  for (const t of existingTags) {
    if (t?.name) byName.set(t.name.toLowerCase(), t)
  }
  console.log(`Found ${existingTags.length} existing tag(s).\n`)

  const resolved = []
  for (const t of TAGS) {
    const found = byName.get(t.name.toLowerCase())
    if (found?.id) {
      console.log(`  ✓ ${t.name.padEnd(28)} (id ${found.id}) — already exists`)
      resolved.push({ ...t, id: found.id })
      continue
    }

    try {
      const { status, data } = await createTag(t.name)
      // Some validation errors mean "already exists" by name.
      if (status === 422) {
        // Refetch to get the id.
        const all = await fetchAllTags()
        const refreshed = all.find(x => (x.name || '').toLowerCase() === t.name.toLowerCase())
        if (refreshed?.id) {
          console.log(`  ✓ ${t.name.padEnd(28)} (id ${refreshed.id}) — created (race-resolved)`)
          resolved.push({ ...t, id: refreshed.id })
          continue
        }
        console.log(`  ⚠ ${t.name.padEnd(28)} — 422: ${JSON.stringify(data)}`)
        continue
      }
      const id = data?.id ?? data?.tag?.id
      if (!id) {
        console.log(`  ⚠ ${t.name.padEnd(28)} — created but no id returned: ${JSON.stringify(data)}`)
        continue
      }
      console.log(`  + ${t.name.padEnd(28)} (id ${id}) — CREATED`)
      resolved.push({ ...t, id })
    } catch (err) {
      console.log(`  ✗ ${t.name.padEnd(28)} — ${err.message}`)
    }
  }

  console.log('\n──────────────────────────────────────────────────────')
  console.log('Paste this into your .env.local:')
  console.log('──────────────────────────────────────────────────────\n')
  console.log('SYSTEMEIO_API_KEY=' + API_KEY.slice(0, 6) + '…<keep your real key>\n')
  for (const t of resolved) {
    console.log(`${t.envKey}=${t.id}`)
  }
  console.log('')
})().catch(err => {
  console.error('\n❌', err.message || err)
  process.exit(1)
})
