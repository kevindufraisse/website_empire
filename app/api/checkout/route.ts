import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Pay-first flow (hero_ab "pricing" variant): the visitor starts their 7-day
// trial straight from the home pricing, with no account. The Stripe session
// carries NO workspace_id, so the app's stripe-webhook ignores it; after
// signup the app claims it via the claim-marketing-checkout edge function.

const APP_URL = 'https://app.empire-internet.com'

// Same env var names as the app's create-credit-checkout edge function,
// so the values can be copied as-is from Supabase secrets to Vercel.
const PLAN_CONFIG: Record<string, Record<string, { envKey: string; credits: number }>> = {
  starter: {
    monthly: { envKey: 'STRIPE_PRICE_CREDIT_STARTER_MONTHLY', credits: 2200 },
    quarterly: { envKey: 'STRIPE_PRICE_CREDIT_STARTER_QUARTERLY', credits: 2200 },
    yearly: { envKey: 'STRIPE_PRICE_CREDIT_STARTER_YEARLY', credits: 2200 },
  },
  growth: {
    monthly: { envKey: 'STRIPE_PRICE_CREDIT_GROWTH_MONTHLY', credits: 6600 },
    quarterly: { envKey: 'STRIPE_PRICE_CREDIT_GROWTH_QUARTERLY', credits: 6600 },
    yearly: { envKey: 'STRIPE_PRICE_CREDIT_GROWTH_YEARLY', credits: 6600 },
  },
  scale: {
    monthly: { envKey: 'STRIPE_PRICE_CREDIT_SCALE_MONTHLY', credits: 12000 },
    quarterly: { envKey: 'STRIPE_PRICE_CREDIT_SCALE_QUARTERLY', credits: 12000 },
    yearly: { envKey: 'STRIPE_PRICE_CREDIT_SCALE_YEARLY', credits: 12000 },
  },
}

// Prepaid cycles must grant the full cycle of credits (mirrors create-credit-checkout)
const CYCLE_MONTHS: Record<string, number> = { monthly: 1, quarterly: 3, yearly: 12 }

export async function POST(request: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      return NextResponse.json({ error: 'stripe_not_configured' }, { status: 501 })
    }

    const body = (await request.json()) as {
      plan?: string
      billing?: string
      lang?: string
      coaching?: boolean
      ampDeviceId?: string
    }
    const plan = body.plan ?? ''
    const billing = body.billing ?? 'monthly'

    const config = PLAN_CONFIG[plan]?.[billing]
    if (!config) {
      return NextResponse.json({ error: 'invalid plan or billing' }, { status: 400 })
    }

    const priceId = process.env[config.envKey]
    if (!priceId) {
      return NextResponse.json({ error: 'stripe_not_configured' }, { status: 501 })
    }

    const stripe = new Stripe(stripeKey)
    const pack = `${plan}_${billing}`
    const credits = config.credits * CYCLE_MONTHS[billing]

    const ampParam = body.ampDeviceId ? `&amp_device_id=${encodeURIComponent(body.ampDeviceId)}` : ''
    const origin = new URL(request.url).origin

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      { price: priceId, quantity: 1 },
    ]

    // Coaching add-on: one-time item charged at checkout (same offer as the
    // app's trial flow, empire-tracking create-credit-checkout FORMATION_FULL_PRICES)
    if (body.coaching) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Coaching 4h – Expert en viralité' },
          unit_amount: 50000,
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: lineItems,
      subscription_data: {
        trial_period_days: 7,
        // No workspace_id yet: the claim step adds it after signup
        metadata: { pack, checkout_type: 'trial', source: 'marketing_site' },
      },
      metadata: {
        pack,
        credits: String(credits),
        checkout_type: 'trial',
        source: 'marketing_site',
        formations: body.coaching ? 'coaching' : '',
      },
      success_url: `${APP_URL}/onboarding?claim_session={CHECKOUT_SESSION_ID}${ampParam}`,
      cancel_url: `${origin}/?checkout=canceled#pricing`,
      locale: body.lang === 'en' ? 'en' : 'fr',
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
