import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Pay-first flow (hero_ab "pricing" variant): the visitor starts their 7-day
// trial straight from the home pricing, with no account. The Stripe session
// carries NO workspace_id, so the app's stripe-webhook ignores it; after
// signup the app claims it via the claim-marketing-checkout edge function.

const APP_URL = 'https://app.empire-internet.com'

// Promo flash — la deadline par visiteur vit dans le projet Supabase de l'app
// (table promo_deadlines). On revalide ici côté serveur via promo-status :
// le front ne fait foi de rien. ⚠️ Garder synchronisé avec l'app
// (create-credit-checkout PROMOS + promo-status).
const PROMO_STATUS_URL = 'https://aaaaktbefgvyokfrzrmb.supabase.co/functions/v1/promo-status'
const PROMOS: Record<string, { plan: string; promoMonthly: number }> = {
  scale499: { plan: 'scale', promoMonthly: 499 },
}
const PERIOD_INFO: Record<string, { discount: number; months: number }> = {
  monthly: { discount: 0, months: 1 },
  quarterly: { discount: 0.12, months: 3 },
  yearly: { discount: 0.18, months: 12 },
}

async function promoIsActive(promoId: string, fingerprint: string): Promise<boolean> {
  try {
    const res = await fetch(PROMO_STATUS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promoId, fingerprint }),
    })
    if (!res.ok) return false
    const data = await res.json()
    return !!data.deadline && !data.expired
  } catch {
    return false
  }
}

// Coupon montant-fixe scoped au produit, durée forever : même logique que
// create-credit-checkout côté app (le prix promo survit aux renouvellements).
async function ensurePromoCoupon(
  stripe: Stripe,
  promoId: string,
  priceId: string,
  promoMonthly: number,
  billing: string,
): Promise<string | null> {
  const price = await stripe.prices.retrieve(priceId)
  const baseCents = price.unit_amount || 0
  const info = PERIOD_INFO[billing] || PERIOD_INFO.monthly
  const promoCycleCents = Math.round(promoMonthly * (1 - info.discount)) * info.months * 100
  const amountOff = baseCents - promoCycleCents
  if (amountOff <= 0) return null
  const productId = typeof price.product === 'string' ? price.product : price.product?.id
  if (!productId) return null
  const couponId = `PROMO_${promoId.toUpperCase()}_${amountOff}_${productId}`
  try {
    await stripe.coupons.retrieve(couponId)
  } catch {
    await stripe.coupons.create({
      id: couponId,
      amount_off: amountOff,
      currency: 'eur',
      duration: 'forever',
      name: `Promo flash ${promoMonthly}€/mois`,
      applies_to: { products: [productId] },
    })
  }
  return couponId
}

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
      promoId?: string
      fingerprint?: string
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
    // Crédits d'essai = 1 mois seulement (comme le flow trial de l'app).
    // Le cycle complet est crédité par le webhook à la 1re facture payée ;
    // multiplier ici ferait double compte sur les cycles prépayés.
    const credits = config.credits

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

    // Promo flash : revalidée côté serveur, coupon appliqué au checkout
    let promoDiscounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined
    const promoDef = body.promoId ? PROMOS[body.promoId] : undefined
    if (promoDef && promoDef.plan === plan && body.fingerprint) {
      const active = await promoIsActive(body.promoId!, body.fingerprint)
      if (active) {
        const couponId = await ensurePromoCoupon(stripe, body.promoId!, priceId, promoDef.promoMonthly, billing)
        if (couponId) promoDiscounts = [{ coupon: couponId }]
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: lineItems,
      ...(promoDiscounts ? { discounts: promoDiscounts } : {}),
      subscription_data: {
        trial_period_days: 7,
        // No workspace_id yet: the claim step adds it after signup
        metadata: { pack, checkout_type: 'trial', source: 'marketing_site', ...(promoDiscounts ? { promo_id: body.promoId! } : {}) },
      },
      metadata: {
        pack,
        credits: String(credits),
        checkout_type: 'trial',
        source: 'marketing_site',
        formations: body.coaching ? 'coaching' : '',
        ...(promoDiscounts ? { promo_id: body.promoId! } : {}),
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
