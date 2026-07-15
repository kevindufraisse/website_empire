import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Pay-first enterprise flow: the visitor configures seats + plan + billing on the
// marketing site and goes straight to Stripe. After signup the app claims the
// session via claim-marketing-enterprise-checkout, which creates the org.

const APP_URL = 'https://app.empire-internet.com'

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

const BILLING_MONTHS: Record<string, number> = { monthly: 1, quarterly: 3, yearly: 12 }

function volumeDiscountPercent(seats: number): number {
  if (seats >= 10) return 20
  if (seats >= 5) return 15
  if (seats >= 3) return 10
  return 0
}

async function ensureVolumeCoupon(
  stripe: Stripe,
  percent: number,
  productId: string,
  unitAmountCents: number,
  seats: number,
  cycleMonths: number,
): Promise<string> {
  const monthlyEuros = unitAmountCents / 100 / cycleMonths
  const discountedMonthlyEuros = Math.round(monthlyEuros * (1 - percent / 100))
  const discountedPerSeatCents = discountedMonthlyEuros * cycleMonths * 100
  const amountOffCents = (unitAmountCents - discountedPerSeatCents) * seats
  const couponId = `ENT_AMT_${amountOffCents}_${productId}`
  try {
    await stripe.coupons.retrieve(couponId)
  } catch {
    await stripe.coupons.create({
      id: couponId,
      amount_off: amountOffCents,
      currency: 'eur',
      duration: 'forever',
      name: `Remise volume -${percent}% (${seats} sièges)`,
      applies_to: { products: [productId] },
    })
  }
  return couponId
}

export async function POST(request: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      return NextResponse.json({ error: 'stripe_not_configured' }, { status: 501 })
    }

    const body = (await request.json()) as {
      plan?: string
      billing?: string
      seats?: number
      lang?: string
      ampDeviceId?: string
    }
    const plan = body.plan ?? ''
    const billing = body.billing ?? 'monthly'
    const seats = Math.max(1, Math.min(20, Number(body.seats) || 3))

    const config = PLAN_CONFIG[plan]?.[billing]
    if (!config) {
      return NextResponse.json({ error: 'invalid plan or billing' }, { status: 400 })
    }

    const priceId = process.env[config.envKey]
    if (!priceId) {
      return NextResponse.json({ error: 'stripe_not_configured' }, { status: 501 })
    }

    const stripe = new Stripe(stripeKey)
    const cycleMonths = BILLING_MONTHS[billing] || 1
    const origin = new URL(request.url).origin
    const ampParam = body.ampDeviceId ? `&amp_device_id=${encodeURIComponent(body.ampDeviceId)}` : ''

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      { price: priceId, quantity: seats },
    ]

    const volPercent = volumeDiscountPercent(seats)
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined
    if (volPercent > 0) {
      const price = await stripe.prices.retrieve(priceId)
      const productId = typeof price.product === 'string' ? price.product : price.product?.id
      if (productId && price.unit_amount) {
        const couponId = await ensureVolumeCoupon(stripe, volPercent, productId, price.unit_amount, seats, cycleMonths)
        discounts = [{ coupon: couponId }]
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: lineItems,
      ...(discounts ? { discounts } : {}),
      subscription_data: {
        metadata: {
          plan,
          billing,
          seats: String(seats),
          checkout_type: 'enterprise',
          source: 'marketing_site',
        },
      },
      metadata: {
        plan,
        billing,
        seats: String(seats),
        credits: String(config.credits),
        checkout_type: 'enterprise',
        source: 'marketing_site',
      },
      success_url: `${APP_URL}/onboarding?claim_enterprise_session={CHECKOUT_SESSION_ID}${ampParam}`,
      cancel_url: `${origin}/?checkout=canceled#pricing`,
      locale: body.lang === 'en' ? 'en' : 'fr',
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout-enterprise]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
