/**
 * ========================================
 * 🔥 LAUNCH OFFER — URGENCY / SCARCITY
 * ========================================
 *
 * ⚠️ IMPORTANT : SPOTS_LEFT doit refléter la VRAIE capacité d'onboarding
 * restante ce mois-ci (coachs/monteurs humains = capacité limitée).
 * Les faux compteurs de rareté sont interdits (directive Omnibus UE) et
 * détruisent la confiance. Mettez ce chiffre à jour manuellement.
 *
 * Le prix de l'offre de lancement (-33%) vit dans lib/pricing-config.ts
 * (LAUNCH_OFFER_ACTIVE). Ici : uniquement l'affichage urgence/deadline.
 */

// Affiche ou masque la mention de places partout d'un coup
export const SPOTS_ENABLED = true

// Mention volontairement vague (pas de faux compteur précis)
export const SPOTS_LABEL_FR = 'quelques places restantes'
export const SPOTS_LABEL_EN = 'a few spots left'

// Deadline de l'offre de lancement (affichage uniquement)
export const OFFER_DEADLINE_LABEL_FR = '31 juillet'
export const OFFER_DEADLINE_LABEL_EN = 'July 31'

// Remise de l'offre de lancement (1000€ vs 1500€ → -33%)
export const OFFER_DISCOUNT_LABEL = '-33%'
