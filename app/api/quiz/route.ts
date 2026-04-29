import { NextRequest, NextResponse } from 'next/server'
import { computeQuizResult, tagsForResult, type QuizAnswers } from '@/lib/quiz-scoring'
import { addTagsToContact, createOrUpdateContact } from '@/lib/systemeio'

export const runtime = 'nodejs'

interface QuizSubmitBody {
  email?: string
  first_name?: string
  phone?: string
  answers?: QuizAnswers
  lang?: 'en' | 'fr'
  utm?: Record<string, string>
  referrer?: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

export async function POST(req: NextRequest) {
  let body: QuizSubmitBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = (body.email || '').trim().toLowerCase()
  const firstName = (body.first_name || '').trim()
  const answers = body.answers || {}
  const lang = body.lang === 'en' ? 'en' : 'fr'

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  }
  if (!answers || Object.keys(answers).length < 3) {
    return NextResponse.json({ error: 'Réponses manquantes' }, { status: 400 })
  }

  // Compute the result deterministically server-side so the client can't fake
  // the recommendation and we keep one source of truth.
  const result = computeQuizResult(answers)

  // Push to Systeme.io. We *do* await it here so we can tell the caller if
  // something went wrong, but with retries + 8s timeout already in place.
  // If it fails, we still return the result so the user gets their reveal.
  // Build optional custom fields list — only include slugs that are configured
  // via env vars. Systeme.io rejects requests with unknown field slugs, so we
  // can't blindly send them. Set SYSTEMEIO_FIELD_SLUG_* once you've created
  // the matching custom fields manually in Systeme.io → Contacts → Fields.
  const fields: Array<{ slug: string; value: string }> = []
  const slugArchetype = process.env.SYSTEMEIO_FIELD_SLUG_ARCHETYPE
  const slugScore = process.env.SYSTEMEIO_FIELD_SLUG_SCORE
  const slugOffer = process.env.SYSTEMEIO_FIELD_SLUG_OFFER
  if (slugArchetype) fields.push({ slug: slugArchetype, value: result.archetype })
  if (slugScore) fields.push({ slug: slugScore, value: String(result.score) })
  if (slugOffer) fields.push({ slug: slugOffer, value: result.recommendedOffer })

  let contactId: number | null = null
  try {
    const contact = await createOrUpdateContact({
      email,
      firstName: firstName || undefined,
      phoneNumber: body.phone || undefined,
      locale: lang,
      fields: fields.length ? fields : undefined,
    })
    contactId = contact.id

    const tagIds = tagsForResult(result, lang)
    if (tagIds.length) {
      await addTagsToContact(contact.id, tagIds)
    } else {
      console.warn('[quiz] No tag IDs configured — check SYSTEMEIO_TAG_* env vars')
    }
  } catch (err) {
    console.error('[POST /api/quiz] systemeio failed', err)
    // Do not block the user — we still return the result, but signal degraded.
  }

  return NextResponse.json({
    success: true,
    contactId,
    result: {
      archetype: result.archetype,
      score: result.score,
      scoreBand: result.scoreBand,
      recommendedOffer: result.recommendedOffer,
      secondaryOffer: result.secondaryOffer,
      archetypeRanking: result.archetypeRanking,
      premiumEligible: result.premiumEligible,
    },
  })
}
