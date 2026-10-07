import { withAmplitudeDeviceId } from '@/lib/amplitude'

// Essai gratuit Empire depuis le site : Growth mensuel, 7 jours, 500 crédits,
// rien débité avant le 8e jour. On envoie sur /onboarding (inscription) avec
// l'intent essai : après le compte, l'app ouvre le checkout sur /pricing.
// Ne jamais pointer /pricing directement — c'est derrière le login et un
// prospect qui veut payer atterrissait sur « se connecter ».
export const TRIAL_PLAN = 'growth'
export const TRIAL_BILLING = 'monthly'

export async function startFreeTrial(): Promise<void> {
  const url = new URL('https://app.empire-internet.com/onboarding')
  url.searchParams.set('plan', TRIAL_PLAN)
  url.searchParams.set('intent', 'trial')
  url.searchParams.set('billing', TRIAL_BILLING)
  window.location.href = withAmplitudeDeviceId(url.toString())
}
