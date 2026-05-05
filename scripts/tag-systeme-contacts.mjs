#!/usr/bin/env node
/**
 * Ajoute un tag Systeme.io à une liste de contacts (recherche par email).
 *
 * Usage:
 *   node --env-file=.env.local scripts/tag-systeme-contacts.mjs <tagId> email1 email2 ...
 *
 * Exemple:
 *   node --env-file=.env.local scripts/tag-systeme-contacts.mjs 1995030 a@x.com b@y.com
 */

const API_BASE = 'https://api.systeme.io/api'

const API_KEY = process.env.SYSTEMEIO_API_KEY
if (!API_KEY) {
  console.error('❌ SYSTEMEIO_API_KEY manquant. Ex: node --env-file=.env.local scripts/tag-systeme-contacts.mjs …')
  process.exit(1)
}

const args = process.argv.slice(2)
const tagId = Number(args[0])
const emails = args.slice(1).map((e) => e.trim().toLowerCase()).filter(Boolean)

if (!tagId || emails.length === 0) {
  console.error('Usage: node scripts/tag-systeme-contacts.mjs <tagId> <email> [email …]')
  process.exit(1)
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function findContactByEmail(email) {
  const params = new URLSearchParams({ email })
  const res = await fetch(`${API_BASE}/contacts?${params}`, {
    headers: { 'X-API-Key': API_KEY, 'Content-Type': 'application/json' },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`GET /contacts ${res.status}: ${text}`)
  const data = JSON.parse(text)
  return data.items?.[0] ?? null
}

async function addTag(contactId, tag) {
  const res = await fetch(`${API_BASE}/contacts/${contactId}/tags`, {
    method: 'POST',
    headers: { 'X-API-Key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ tagId: tag }),
  })
  const text = await res.text()
  if (res.ok || res.status === 204) return { ok: true }
  return { ok: false, status: res.status, text }
}

;(async () => {
  console.log(`→ Tag ${tagId} pour ${emails.length} email(s)\n`)
  const results = { tagged: [], missing: [], failed: [] }

  for (const email of emails) {
    try {
      const contact = await findContactByEmail(email)
      if (!contact) {
        results.missing.push(email)
        console.log(`⚠️  introuvable : ${email}`)
        continue
      }
      const out = await addTag(contact.id, tagId)
      if (out.ok) {
        results.tagged.push(email)
        console.log(`✓  ${email} (id ${contact.id})`)
      } else {
        results.failed.push({ email, ...out })
        console.log(`✗  ${email} — ${out.status} ${out.text?.slice(0, 120)}`)
      }
    } catch (e) {
      results.failed.push({ email, err: e.message })
      console.log(`✗  ${email} — ${e.message}`)
    }
    await sleep(200)
  }

  console.log('\n── Résumé ──')
  console.log(`Taggés : ${results.tagged.length}`)
  console.log(`Contacts inexistants : ${results.missing.length}`)
  console.log(`Erreurs : ${results.failed.length}`)
  if (results.missing.length) console.log('Emails introuvables :', results.missing.join(', '))
  process.exit(results.failed.length ? 1 : 0)
})().catch((err) => {
  console.error('❌', err)
  process.exit(1)
})
