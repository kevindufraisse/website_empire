import { getAmplitudeDeviceId } from '@/lib/amplitude'

// Essai gratuit Empire depuis le site : Growth mensuel, 7 jours, 500 crédits,
// rien débité avant le 8e jour (plafond appliqué au claim côté app).
// La session Stripe est créée par /api/checkout ; si elle échoue, on retombe
// sur l'onboarding de l'app avec l'intention d'essai.
export const TRIAL_PLAN = 'growth'
export const TRIAL_BILLING = 'monthly'

export async function startFreeTrial(): Promise<void> {
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan: TRIAL_PLAN,
        billing: TRIAL_BILLING,
        lang: 'fr',
        ampDeviceId: getAmplitudeDeviceId(),
      }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
      return
    }
  } catch {
    // repli plus bas
  }
  window.location.href = `https://app.empire-internet.com/onboarding?plan=${TRIAL_PLAN}&billing=${TRIAL_BILLING}&intent=trial`
}
