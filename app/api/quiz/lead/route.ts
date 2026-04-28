import { NextRequest, NextResponse } from 'next/server'
import { addTagsToContact, createOrUpdateContact } from '@/lib/systemeio'
import { leadStartTag } from '@/lib/quiz-scoring'

export const runtime = 'nodejs'

interface LeadBody {
  email?: string
  first_name?: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

/**
 * Captures the email mid-quiz (right after the gate) so we never lose a lead
 * even if the user closes the tab before seeing the result.
 * The final POST /api/quiz upgrades the contact with the full result + tags.
 */
export async function POST(req: NextRequest) {
  let body: LeadBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = (body.email || '').trim().toLowerCase()
  const firstName = (body.first_name || '').trim()

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  }

  try {
    const contact = await createOrUpdateContact({
      email,
      firstName: firstName || undefined,
      locale: 'fr',
    })

    const startTag = leadStartTag()
    if (startTag) {
      await addTagsToContact(contact.id, [startTag])
    }

    return NextResponse.json({ success: true, contactId: contact.id })
  } catch (err) {
    console.error('[POST /api/quiz/lead] systemeio failed', err)
    // Still return success so the UX continues. We'll re-attempt at the final step.
    return NextResponse.json({ success: true, degraded: true })
  }
}
