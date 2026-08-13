/**
 * Folk CRM - create people in a group (server-side only).
 * Docs: https://developer.folk.app
 */

const FOLK_API = 'https://api.folk.app/v1'

export type FolkPersonInput = {
  firstName: string
  lastName?: string
  email: string
  phone?: string
  description?: string
  /** Folk group id, e.g. grp_uuid */
  groupId?: string
  noteMarkdown?: string
}

export async function createFolkPerson(input: FolkPersonInput): Promise<{ id: string } | null> {
  const apiKey = process.env.FOLK_API_KEY
  if (!apiKey) {
    console.warn('[folk] FOLK_API_KEY missing - skip')
    return null
  }

  const groupId =
    input.groupId ||
    process.env.FOLK_GROUP_ID ||
    'grp_5824b4be-33eb-466f-8269-db25e8ca3050'

  const body: Record<string, unknown> = {
    firstName: input.firstName,
    emails: [input.email],
    groups: [{ id: groupId }],
  }
  if (input.lastName) body.lastName = input.lastName
  if (input.phone) body.phones = [input.phone]
  if (input.description) body.description = input.description

  const res = await fetch(`${FOLK_API}/people`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('[folk] create person failed', res.status, text)
    return null
  }

  const json = (await res.json()) as { data?: { id?: string } }
  const personId = json.data?.id
  if (!personId) return null

  if (input.noteMarkdown) {
    await fetch(`${FOLK_API}/notes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        content: input.noteMarkdown,
        visibility: 'public',
        entity: { id: personId, entityType: 'person' },
      }),
    }).catch((err) => console.warn('[folk] note failed', err))
  }

  return { id: personId }
}
