import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const segments = []
  for (let s = 0; s < 2; s++) {
    let segment = ''
    for (let i = 0; i < 3; i++) {
      segment += chars[crypto.randomInt(chars.length)]
    }
    segments.push(segment)
  }
  return `EMP-${segments[0]}-${segments[1]}`
}

/** Remplit prénom/nom depuis la table academy `applications` (même email). */
async function namesFromApplications(email: string): Promise<{ first_name: string; last_name: string } | null> {
  const normalized = email.toLowerCase().trim()
  const { data } = await supabaseAdmin
    .from('applications')
    .select('first_name, last_name')
    .eq('email', normalized)
    .order('step_completed', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data) return null
  const fn = (data.first_name ?? '').trim()
  const ln = (data.last_name ?? '').trim()
  if (!fn && !ln) return null
  return { first_name: fn, last_name: ln }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const expected = process.env.CERTIFICATIONS_ADMIN_KEY
    if (!expected || authHeader !== `Bearer ${expected}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { certifications, promotion } = body as {
      certifications: {
        first_name?: string
        last_name?: string
        email: string
        tier: string
      }[]
      promotion: string
    }

    if (!certifications?.length || !promotion) {
      return NextResponse.json(
        { error: 'certifications[] and promotion are required' },
        { status: 400 }
      )
    }

    const validTiers = ['bronze', 'silver', 'gold']
    const results = []

    for (const cert of certifications) {
      if (!validTiers.includes(cert.tier)) {
        results.push({ email: cert.email, error: `Invalid tier: ${cert.tier}` })
        continue
      }

      let firstName = cert.first_name?.trim() || ''
      let lastName = cert.last_name?.trim() || ''
      if (!firstName || !lastName) {
        const fromApp = await namesFromApplications(cert.email)
        firstName = firstName || fromApp?.first_name || ''
        lastName = lastName || fromApp?.last_name || ''
      }
      if (!firstName || !lastName) {
        results.push({
          email: cert.email,
          error:
            'Prénom et nom requis, ou email introuvable dans les candidatures academy (applications).',
        })
        continue
      }

      const { data: existing } = await supabaseAdmin
        .from('certifications')
        .select('id, verification_code')
        .eq('email', cert.email.toLowerCase().trim())
        .eq('promotion', promotion)
        .limit(1)
        .single()

      if (existing) {
        await supabaseAdmin
          .from('certifications')
          .update({ tier: cert.tier, first_name: firstName, last_name: lastName })
          .eq('id', existing.id)

        results.push({
          email: cert.email,
          code: existing.verification_code,
          updated: true,
        })
        continue
      }

      let code = generateCode()
      let attempts = 0
      while (attempts < 10) {
        const { data: dup } = await supabaseAdmin
          .from('certifications')
          .select('id')
          .eq('verification_code', code)
          .limit(1)
          .single()
        if (!dup) break
        code = generateCode()
        attempts++
      }

      const { data, error } = await supabaseAdmin
        .from('certifications')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: cert.email.toLowerCase().trim(),
          tier: cert.tier,
          promotion,
          verification_code: code,
          issued_at: new Date().toISOString(),
        })
        .select('id, verification_code')
        .single()

      if (error) {
        results.push({ email: cert.email, error: error.message })
      } else {
        results.push({ email: cert.email, code: data.verification_code, created: true })
      }
    }

    return NextResponse.json({ results }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/certifications]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
