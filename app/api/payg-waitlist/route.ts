import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// ── PAYG credit packs (single source of truth, server-side) ──────────────────
// Mirror this in app/pay-as-you-go/PaygClient.tsx (PAYG_TIERS).
// "credits: -1" means unlimited (Empire Illimité tier).
const TIER_PACKS: Record<string, { price: number; credits: number }> = {
  starter: { price: 199, credits: 2200 },
  growth: { price: 499, credits: 6000 },
  scale: { price: 799, credits: 10400 },
  illimite: { price: 999, credits: -1 },
}

const ALLOWED_PLATFORMS = new Set([
  'linkedin',
  'instagram',
  'tiktok',
  'youtube',
  'newsletter',
  'x',
  'threads',
])

const ALLOWED_CONTENT_TYPES = new Set([
  'youtube',
  'reels',
  'posts',
  'newsletters',
  'carrousels',
])

const ALLOWED_SITUATIONS = new Set([
  'rien',
  'solo',
  'freelance',
  'agence',
  'in_house',
])

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      firstName,
      email,
      phone,
      platforms,
      contentTypes,
      packId,
      currentSituation,
      emp,
    } = body ?? {}

    if (!firstName || !email || !phone) {
      return NextResponse.json(
        { error: 'Prénom, email et téléphone requis.' },
        { status: 400 },
      )
    }

    if (!Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Sélectionne au moins une plateforme.' },
        { status: 400 },
      )
    }

    const cleanPlatforms = platforms
      .map((p: unknown) => String(p).toLowerCase().trim())
      .filter((p: string) => ALLOWED_PLATFORMS.has(p))

    if (cleanPlatforms.length === 0) {
      return NextResponse.json(
        { error: 'Plateformes invalides.' },
        { status: 400 },
      )
    }

    const rawContentTypes = Array.isArray(contentTypes) ? contentTypes : []
    const cleanContentTypes = rawContentTypes
      .map((c: unknown) => String(c).toLowerCase().trim())
      .filter((c: string) => ALLOWED_CONTENT_TYPES.has(c))

    const tierPack = TIER_PACKS[packId]
    if (!tierPack) {
      return NextResponse.json(
        { error: 'Pack invalide.' },
        { status: 400 },
      )
    }

    const cleanSituation =
      typeof currentSituation === 'string' && ALLOWED_SITUATIONS.has(currentSituation)
        ? currentSituation
        : null

    // Price + credits computed server-side from the packId (never trust the client).
    const estimatedMonthlyPrice = tierPack.price
    const creditsPerMonth = tierPack.credits
    const isUnlimited = packId === 'illimite'

    const normalizedEmail = String(email).toLowerCase().trim()

    const userAgent = req.headers.get('user-agent') ?? null
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      null

    const { data, error } = await supabaseAdmin
      .from('payg_waitlist')
      .upsert(
        {
          first_name: String(firstName).trim(),
          email: normalizedEmail,
          phone: String(phone).trim(),
          platforms: cleanPlatforms,
          content_types: cleanContentTypes,
          pack_id: packId,
          credits_per_month: creditsPerMonth,
          estimated_monthly_price: estimatedMonthlyPrice,
          current_situation: cleanSituation,
          source: 'payg_beta',
          emp: emp ?? null,
          user_agent: userAgent,
          ip,
        },
        { onConflict: 'email' },
      )
      .select('id, created_at')
      .single()

    if (error) throw error

    const { count } = await supabaseAdmin
      .from('payg_waitlist')
      .select('id', { count: 'exact', head: true })

    const position = count ?? 1

    const webhookUrl = process.env.PAYG_WEBHOOK_URL
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          email: normalizedEmail,
          phone,
          platforms: cleanPlatforms,
          contentTypes: cleanContentTypes,
          packId,
          creditsPerMonth,
          estimatedMonthlyPrice,
          currentSituation: cleanSituation,
          position,
          emp,
          source: 'payg_beta',
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {})
    }

    const wahaUrl = process.env.WAHA_API_URL
    const wahaSession = process.env.WAHA_SESSION || 'default'
    const notifyPhone = process.env.NOTIFY_PHONE_NUMBER
    // Notify on every Growth+ pack OR Illimité (these are real intent leads).
    const isHotLead = isUnlimited || estimatedMonthlyPrice >= 499

    if (wahaUrl && notifyPhone && isHotLead) {
      const header = isUnlimited
        ? `🚀 PAYG → ILLIMITÉ (999€/mois · a vu Cal)`
        : `🔥 PAYG ${packId.toUpperCase()} (${estimatedMonthlyPrice}€/mois · ${creditsPerMonth} crédits)`
      const message =
        `${header}\n\n` +
        `👤 ${firstName}\n` +
        `📧 ${normalizedEmail}\n` +
        `📱 ${phone}\n` +
        `📡 ${cleanPlatforms.join(', ')}\n` +
        `🎬 ${cleanContentTypes.join(', ') || '—'}\n` +
        `🪧 #${position} sur la waitlist\n` +
        `🕐 ${new Date().toLocaleString('fr-FR')}`

      await fetch(`${wahaUrl}/api/sendText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: `${notifyPhone}@c.us`,
          text: message,
          session: wahaSession,
        }),
      }).catch(() => {})
    }

    return NextResponse.json(
      {
        success: true,
        id: data?.id,
        position,
        estimatedMonthlyPrice,
        creditsPerMonth,
        packId,
      },
      { status: 201 },
    )
  } catch (err) {
    console.error('[POST /api/payg-waitlist]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
