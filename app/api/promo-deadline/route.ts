import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const DEADLINE_HOURS = 23
const DEADLINE_EXTRA_MIN_RANGE = [12, 47] as const

function generateDeadline(): string {
  const extra =
    DEADLINE_EXTRA_MIN_RANGE[0] +
    Math.floor(Math.random() * (DEADLINE_EXTRA_MIN_RANGE[1] - DEADLINE_EXTRA_MIN_RANGE[0] + 1))
  return new Date(Date.now() + DEADLINE_HOURS * 3600_000 + extra * 60_000).toISOString()
}

function clientIp(request: Request): string {
  const headers = new Headers(request.headers)
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { promoId, fingerprint, email } = body as {
      promoId: string
      fingerprint: string
      email?: string
    }

    if (!promoId || !fingerprint) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 })
    }

    const ip = clientIp(request)
    const now = new Date().toISOString()

    // 1. Look up by fingerprint
    const { data: byFp } = await supabaseAdmin
      .from('promo_deadlines')
      .select('deadline')
      .eq('promo_id', promoId)
      .eq('fingerprint', fingerprint)
      .maybeSingle()

    if (byFp) {
      if (new Date(byFp.deadline) < new Date(now)) {
        return NextResponse.json({ expired: true })
      }
      return NextResponse.json({ deadline: byFp.deadline })
    }

    // 2. Look up by IP
    if (ip !== 'unknown') {
      const { data: byIp } = await supabaseAdmin
        .from('promo_deadlines')
        .select('deadline')
        .eq('promo_id', promoId)
        .eq('ip_address', ip)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (byIp) {
        await supabaseAdmin.from('promo_deadlines').upsert(
          { promo_id: promoId, fingerprint, ip_address: ip, deadline: byIp.deadline, email: email || null },
          { onConflict: 'promo_id,fingerprint' },
        )
        if (new Date(byIp.deadline) < new Date(now)) {
          return NextResponse.json({ expired: true })
        }
        return NextResponse.json({ deadline: byIp.deadline })
      }
    }

    // 3. Look up by email
    if (email) {
      const { data: byEmail } = await supabaseAdmin
        .from('promo_deadlines')
        .select('deadline')
        .eq('promo_id', promoId)
        .eq('email', email)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (byEmail) {
        await supabaseAdmin.from('promo_deadlines').upsert(
          { promo_id: promoId, fingerprint, ip_address: ip, deadline: byEmail.deadline, email },
          { onConflict: 'promo_id,fingerprint' },
        )
        if (new Date(byEmail.deadline) < new Date(now)) {
          return NextResponse.json({ expired: true })
        }
        return NextResponse.json({ deadline: byEmail.deadline })
      }
    }

    // 4. No match → create new deadline
    const deadline = generateDeadline()
    await supabaseAdmin.from('promo_deadlines').insert({
      promo_id: promoId,
      fingerprint,
      ip_address: ip,
      email: email || null,
      deadline,
    })

    return NextResponse.json({ deadline })
  } catch (err) {
    console.error('[promo-deadline]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
