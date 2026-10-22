import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { hashEmail, hashPhone, sendCapiEvent } from '@/lib/metaCapi'

export const runtime = 'nodejs'

/**
 * Purchase Meta (serveur uniquement) depuis Stripe. Endpoint Stripe dédié,
 * distinct du webhook de facturation de l'app : il ne fait qu'envoyer la
 * conversion. Les metadata `meta_*` et `utm_*` sont posées par academy-pay.
 */
const PRODUCTS: Record<string, { content_name: string; content_category: string }> = {
  partner: { content_name: 'academy_partner', content_category: 'academy_partner' },
  bootcamp: { content_name: 'bootcamp_49', content_category: 'academy_bootcamp' },
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_META_WEBHOOK_SECRET?.trim()
  if (!secret) {
    console.error('[meta-stripe] STRIPE_META_WEBHOOK_SECRET manquant')
    return NextResponse.json({ error: 'not_configured' }, { status: 500 })
  }

  const raw = await req.text()
  let event: Stripe.Event
  try {
    event = Stripe.webhooks.constructEvent(raw, req.headers.get('stripe-signature') || '', secret)
  } catch (err) {
    console.error('[meta-stripe] signature invalide:', err)
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed' && event.type !== 'checkout.session.async_payment_succeeded') {
    return NextResponse.json({ ignored: event.type })
  }

  const session = event.data.object as Stripe.Checkout.Session
  if (session.payment_status !== 'paid') return NextResponse.json({ ignored: 'unpaid' })

  const meta = session.metadata || {}
  const product = PRODUCTS[meta.pack || '']
  if (!product) return NextResponse.json({ ignored: meta.pack || 'no_pack' })

  const result = await sendCapiEvent({
    event_name: 'Purchase',
    event_id: `Purchase.${session.id}`,
    event_time: event.created,
    event_source_url: meta.meta_source_url || 'https://app.empire-internet.com/join/academy',
    user_data: {
      em: hashEmail(session.customer_details?.email),
      ph: hashPhone(session.customer_details?.phone || meta.wa_phone),
      fbc: meta.meta_fbc,
      fbp: meta.meta_fbp,
      client_ip_address: meta.meta_ip,
      client_user_agent: meta.meta_ua,
    },
    custom_data: {
      value: (session.amount_total ?? 0) / 100,
      currency: (session.currency || 'eur').toUpperCase(),
      content_name: product.content_name,
      content_category: product.content_category,
      order_id: session.id,
      ...Object.fromEntries(UTM_KEYS.map((k) => [k, meta[k]])),
    },
  })

  // Stripe rejoue en cas d'échec ; l'event_id fixe évite un double Purchase.
  if (!result.ok && !result.skipped) return NextResponse.json({ error: 'capi_failed' }, { status: 502 })
  return NextResponse.json({ ok: true })
}
