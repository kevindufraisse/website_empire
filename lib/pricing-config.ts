/**
 * ========================================
 * 🔥 PRICING CONFIGURATION
 * ========================================
 * 
 * Centralized pricing configuration for Empire Internet
 * 
 * LAUNCH OFFER CONTROL:
 * Set LAUNCH_OFFER_ACTIVE to true/false to enable/disable launch pricing
 * 
 * When LAUNCH_OFFER_ACTIVE = true:
 *   - Monthly: €1,000/month (launch) → then €1,500/month
 *   - Quarterly: €1,400/month (launch)
 *   - Yearly: €1,250/month (launch)
 *   - Weekly: €250/week (launch)
 * 
 * When LAUNCH_OFFER_ACTIVE = false:
 *   - Normal prices apply (€1,500/month base)
 */

// ========================================
// 🔥 TOGGLE THIS TO ENABLE/DISABLE LAUNCH OFFER
// ========================================
export const LAUNCH_OFFER_ACTIVE = false

// ========================================
// BASE PRICES
// ========================================
// Prix public normal (1500€/mois de base)
const NORMAL_MONTHLY = 1500
const NORMAL_WEEKLY = 420      // 1500€ ÷ 4 = 375€ mais on charge un peu plus
const NORMAL_QUARTERLY = 1400  // Environ -6.7% vs 1500€
const NORMAL_YEARLY = 1250     // Environ -16.7% vs 1500€

// Prix offre de lancement (on garde les MÊMES prix qu'avant)
const LAUNCH_MONTHLY = 1000    // Ancien prix mensuel
const LAUNCH_WEEKLY = 280      // Ancien prix hebdo (on garde exactement pareil)
const LAUNCH_QUARTERLY = 933   // Ancien prix trimestriel (arrondi pour facile : 2800 / 3 ≈ 933)
const LAUNCH_YEARLY = 833      // Ancien prix annuel (arrondi pour facile : 10000 / 12 ≈ 833)

// ========================================
// PRE-CALCULATED PRICES (to avoid hydration issues)
// ========================================
const PRICES_LAUNCH = {
  // Prix affichés (offre de lancement - mêmes prix qu'avant)
  monthly: LAUNCH_MONTHLY,     // 1000€
  weekly: LAUNCH_WEEKLY,       // 280€
  quarterly: LAUNCH_QUARTERLY, // 933€
  yearly: LAUNCH_YEARLY,       // 833€
  
  // Prix normaux (barrés en mode lancement)
  monthlyNormal: NORMAL_MONTHLY,       // 1500€
  weeklyNormal: NORMAL_WEEKLY,         // 420€
  quarterlyNormal: NORMAL_QUARTERLY,   // 1400€
  yearlyNormal: NORMAL_YEARLY,         // 1250€
  
  // Totaux facturés (arrondis)
  quarterlyTotal: 2800,  // Arrondi pour clarté
  yearlyTotal: 10000,    // Arrondi pour clarté
  
  // Économies vs prix normal
  savingsMonthly: NORMAL_MONTHLY - LAUNCH_MONTHLY,              // 500€
  savingsWeekly: NORMAL_WEEKLY - LAUNCH_WEEKLY,                 // 140€
  savingsQuarterly: (NORMAL_MONTHLY * 3) - 2800,  // 1700€
  savingsYearly: (NORMAL_MONTHLY * 12) - 10000,   // 8000€
  
  // Comparaisons
  agencyMin: 5000,
  agencyMax: 15000,
  inHouse: 12000,
  percentOff: 92, // 1 - (1000/12000) ≈ 92%
}

const PRICES_NORMAL = {
  // Prix affichés (prix normaux)
  monthly: NORMAL_MONTHLY,
  weekly: NORMAL_WEEKLY,
  quarterly: NORMAL_QUARTERLY,
  yearly: NORMAL_YEARLY,
  
  // Prix normaux (pas de barré)
  monthlyNormal: NORMAL_MONTHLY,
  weeklyNormal: NORMAL_WEEKLY,
  quarterlyNormal: NORMAL_QUARTERLY,
  yearlyNormal: NORMAL_YEARLY,
  
  // Totaux facturés
  quarterlyTotal: NORMAL_QUARTERLY * 3,  // 4200€
  yearlyTotal: NORMAL_YEARLY * 12,       // 15000€
  
  // Économies vs mensuel normal
  savingsMonthly: 0,
  savingsWeekly: 0,
  savingsQuarterly: (NORMAL_MONTHLY * 3) - (NORMAL_QUARTERLY * 3),  // 300€
  savingsYearly: (NORMAL_MONTHLY * 12) - (NORMAL_YEARLY * 12),      // 3000€
  
  // Comparaisons
  agencyMin: 5000,
  agencyMax: 15000,
  inHouse: 12000,
  percentOff: 87, // 1 - (1500/12000) ≈ 87%
}

// ========================================
// EXPORTED PRICING OBJECT
// ========================================
export const PRICING = LAUNCH_OFFER_ACTIVE ? PRICES_LAUNCH : PRICES_NORMAL

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get formatted price string (with consistent formatting)
 */
export function formatPrice(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Check if launch offer is active
 */
export function isLaunchOfferActive(): boolean {
  return LAUNCH_OFFER_ACTIVE
}

/**
 * Get launch offer badge text
 */
export function getLaunchOfferBadge(lang: 'en' | 'fr' = 'en'): string {
  if (!LAUNCH_OFFER_ACTIVE) return ''
  return lang === 'fr' 
    ? `🔥 OFFRE DE LANCEMENT : ${LAUNCH_MONTHLY}€/mois au lieu de ${NORMAL_MONTHLY}€/mois`
    : `🔥 LAUNCH OFFER: €${LAUNCH_MONTHLY}/mo instead of €${NORMAL_MONTHLY}/mo`
}

