import { withAmplitudeDeviceId } from '@/lib/amplitude'

// Essai gratuit Empire depuis le site : Growth mensuel, 7 jours, 500 crédits.
// L'abonnement démarre au 8e jour, ou dès le premier crédit au-delà des 500. On envoie sur /onboarding (inscription) avec
// l'intent essai : après le compte, l'app ouvre le checkout sur /pricing.
// Ne jamais pointer /pricing directement — c'est derrière le login et un
// prospect qui veut payer atterrissait sur « se connecter ».
export const TRIAL_PLAN = 'growth'
export const TRIAL_BILLING = 'monthly'
export const TRIAL_CREDITS = 500

/** La promesse de l'essai, mot pour mot partout sur le site. */
export const TRIAL_TERMS_FR = `7 jours gratuits avec ${TRIAL_CREDITS} crédits. L’abonnement démarre au 8e jour, ou dès que tu dépasses les ${TRIAL_CREDITS} crédits. Annule avant : 0 €.`
export const TRIAL_TERMS_EN = `7 days free with ${TRIAL_CREDITS} credits. Your plan starts on day 8, or as soon as you go past ${TRIAL_CREDITS} credits. Cancel before: €0.`

export async function startFreeTrial(plan: 'starter' | 'growth' | 'scale' = TRIAL_PLAN): Promise<void> {
  const url = new URL('https://app.empire-internet.com/onboarding')
  url.searchParams.set('plan', plan)
  url.searchParams.set('intent', 'trial')
  url.searchParams.set('billing', TRIAL_BILLING)
  window.location.href = withAmplitudeDeviceId(url.toString())
}
