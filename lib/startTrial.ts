import { withAmplitudeDeviceId } from '@/lib/amplitude'

// Essai gratuit Empire depuis le site : Growth mensuel, 7 jours, 500 crédits,
// rien débité avant le 8e jour. Le pricing de l'app est la source de vérité :
// il conserve ces paramètres à travers la connexion / création de compte puis
// ouvre le checkout d'essai avec le plafond de 500 crédits.
export const TRIAL_PLAN = 'growth'
export const TRIAL_BILLING = 'monthly'

export async function startFreeTrial(): Promise<void> {
  const url = new URL('https://app.empire-internet.com/pricing')
  url.searchParams.set('trial_plan', TRIAL_PLAN)
  url.searchParams.set('trial_billing', TRIAL_BILLING)
  window.location.href = withAmplitudeDeviceId(url.toString())
}
