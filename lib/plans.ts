// Source unique des packs Empire. Importé par la section pricing et par le quiz
// d'orientation pour qu'un changement de prix ou de rythme ne dérive jamais
// entre les deux.

export const APP_ONBOARDING_URL = 'https://app.empire-internet.com/onboarding'

export type PlanId = 'starter' | 'growth' | 'scale'
export type BillingId = 'monthly' | 'quarterly' | 'yearly'

// Le volume vendu, c'est la présence sur les 7 réseaux, pas un compteur de
// formats. Starter : tous les 2 jours. Growth : tous les jours. Scale : 2 fois
// par jour. Le mix (Reels / LinkedIn / newsletter) est au choix du client.
export type Plan = {
  id: PlanId
  price: number
  credits: number
  rhythmFr: string
  rhythmEn: string
  highlighted?: boolean
}

export const PLAN_LABELS: Record<PlanId, { fr: string; en: string }> = {
  starter: { fr: 'Starter', en: 'Starter' },
  growth: { fr: 'Growth', en: 'Growth' },
  scale: { fr: 'Scale', en: 'Scale' },
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    price: 199,
    credits: 2200,
    rhythmFr: 'Tu postes tous les 2 jours',
    rhythmEn: 'You post every other day',
  },
  {
    id: 'growth',
    price: 499,
    credits: 6600,
    rhythmFr: 'Tu postes tous les jours',
    rhythmEn: 'You post every day',
    highlighted: true,
  },
  {
    id: 'scale',
    price: 799,
    credits: 12000,
    rhythmFr: 'Tu postes 2 fois par jour',
    rhythmEn: 'You post twice a day',
  },
]

// Coût en crédits d'un contenu dans l'app (`CREDIT_COSTS` de server.cjs) :
// un reel de la rafale = coupe 15 + sous-titres Submagic 150 + accroche 30.
export const CONTENT_CREDITS = { reel: 195, post: 85, newsletter: 115 }

// Ce que les crédits du mois permettent, format par format : « jusqu'à 11 reels
// OU 25 posts », jamais additionnés (15 reels + 15 posts + 2 newsletters
// demandaient 4 430 crédits sur une formule qui en verse 2 200).
export const PLAN_DELIVERABLES: Record<PlanId, { reels: number; posts: number; newsletters: number }> =
  Object.fromEntries(
    PLANS.map((p) => [p.id, {
      reels: Math.floor(p.credits / CONTENT_CREDITS.reel),
      posts: Math.floor(p.credits / CONTENT_CREDITS.post),
      newsletters: Math.floor(p.credits / CONTENT_CREDITS.newsletter),
    }]),
  ) as Record<PlanId, { reels: number; posts: number; newsletters: number }>

// Le mélange montré sur /tarifs (le reçu, la bande « Chez des freelances »,
// « Empire contre… ») : la moitié des crédits du mois en reels, l'autre moitié
// en posts. Growth : 16 reels + 38 posts. C'est un exemple ; le client change
// la répartition quand il veut.
export function planMix(id: PlanId): { reels: number; posts: number; newsletters: number } {
  const plan = getPlan(id)
  const half = plan.credits / 2
  return {
    reels: Math.floor(half / CONTENT_CREDITS.reel),
    posts: Math.floor(half / CONTENT_CREDITS.post),
    // Avec tous les crédits en newsletters (jamais ajouté au total).
    newsletters: Math.floor(plan.credits / CONTENT_CREDITS.newsletter),
  }
}

// Ce que coûterait le même travail chez des freelances, affiché sur /tarifs
// (cartes, reçu, « Empire contre… »). Un seul objet de prix, avec deux modes :
//  - 'moyen' (par défaut, choix de Kevin le 10 novembre 2026) : le milieu des
//    fourchettes publiées, total arrondi à la centaine (« ≈ 8 300 €/mois ») ;
//  - 'bas' : le bas des fourchettes, total arrondi à la centaine inférieure
//    (« plus de 5 600 €/mois »).
// Les sources et leurs dates sont dans FREELANCE_SOURCES, juste dessous.
export type FreelanceMode = 'moyen' | 'bas'
export const FREELANCE_MODE: FreelanceMode = 'moyen'

/** Cours BCE du 9 novembre 2026 : 1 € = 1,1193 $ (outils vendus en dollars). */
export const USD_PER_EUR = 1.1193

export type ReplacedTool = { name: string; fr: string; en: string; eur?: number; usd?: number }

export const FREELANCE_PRICES = {
  /** Reel monté, sous-titres inclus (Le Cut : 50 à 120 €). */
  reel: { bas: 50, moyen: 85 },
  /** Post écrit dans ta voix (Copylinker, rédacteur confirmé : 100 à 200 €). */
  post: { bas: 100, moyen: 150 },
  /** Miniature, une par reel (ComeUp : à partir de 15 €). */
  thumbnail: { bas: 15, moyen: 15 },
  /** Publication, commentaires et DM, par mois : community manager « standard »,
   *  sans la vidéo, pour ne pas compter les reels deux fois (mission-freelances :
   *  500 à 900 € HT/mois). */
  communityManager: { bas: 500, moyen: 700 },
  /** Newsletter (Digitiz : 60 à 150 €) : échange possible, jamais ajouté au total. */
  newsletter: { low: 60, high: 150 },
  /** Les outils que l'abonné ne paie plus, au prix mensuel des éditeurs. */
  tools: [
    { name: 'Metricool Starter', fr: 'planification et stats', en: 'scheduling and stats', eur: 20 },
    { name: 'Dub Business', fr: 'liens trackés', en: 'tracked links', usd: 90 },
    { name: 'BuzzSumo Content Creation', fr: 'veille de niche', en: 'niche monitoring', usd: 239 },
  ] as ReplacedTool[],
}

/** Prix d'un outil en euros : le prix en euros de l'éditeur, sinon ses dollars convertis. */
export function toolEuros(tool: ReplacedTool): number {
  return tool.eur ?? Math.round((tool.usd ?? 0) / USD_PER_EUR)
}

export const TOOLS_EUROS = FREELANCE_PRICES.tools.reduce((sum, t) => sum + toolEuros(t), 0)

/** Le détail ligne par ligne et le total affiché pour une formule. */
export function freelanceValue(id: PlanId, mode: FreelanceMode = FREELANCE_MODE) {
  const mix = planMix(id)
  const p = FREELANCE_PRICES
  const reels = mix.reels * p.reel[mode]
  const posts = mix.posts * p.post[mode]
  const thumbnails = mix.reels * p.thumbnail[mode]
  const communityManager = p.communityManager[mode]
  const tools = TOOLS_EUROS
  const total = reels + posts + thumbnails + communityManager + tools
  const shown = mode === 'moyen' ? Math.round(total / 100) * 100 : Math.floor(total / 100) * 100
  return { mode, mix, reels, posts, thumbnails, communityManager, tools, total, shown }
}

/** Le chiffre affiché partout (Growth, mode moyen : ≈ 8 300 €/mois). */
export function freelanceMonthly(id: PlanId, mode: FreelanceMode = FREELANCE_MODE): number {
  return freelanceValue(id, mode).shown
}

export const FREELANCE_SOURCES: { name: string; href: string; fr: string; en: string }[] = [
  {
    name: 'Le Cut',
    href: 'https://www.lecut.fr/blog/tarifs-monteur-video-freelance',
    fr: 'tarifs monteur vidéo freelance, mai–juin 2026 : reel simple 50 à 120 €',
    en: 'freelance video editor rates, May–June 2026: simple reel €50 to €120',
  },
  {
    name: 'Copylinker',
    href: 'https://copylinker.fr/tarif-ghostwriter-linkedin/',
    fr: 'tarif ghostwriter LinkedIn, novembre 2026 : rédacteur confirmé 100 à 200 € le post',
    en: 'LinkedIn ghostwriter rates, November 2026: experienced writer €100 to €200 per post',
  },
  {
    name: 'ComeUp',
    href: 'https://comeup.com/fr/projects/creer-mes-miniatures-youtube',
    fr: 'miniatures YouTube, consulté en novembre 2026 : à partir de 15 € la miniature',
    en: 'YouTube thumbnails, checked November 2026: from €15 a thumbnail',
  },
  {
    name: 'mission-freelances',
    href: 'https://www.mission-freelances.fr/blog/barometre/tjm-freelance-communication-2026/',
    fr: 'baromètre communication 2026 (mis à jour en juillet 2026) : community manager, gestion standard (2 réseaux, 2 à 3 posts par semaine, sans vidéo) 500 à 900 € HT par mois',
    en: '2026 communication barometer (updated July 2026): community manager, standard plan (2 networks, 2 to 3 posts a week, no video) €500 to €900 excl. VAT a month',
  },
  {
    name: 'Metricool',
    href: 'https://metricool.com/pricing/',
    fr: 'tarifs, consulté en novembre 2026 : Starter 20 € par mois en mensuel',
    en: 'pricing, checked November 2026: Starter €20 a month, billed monthly',
  },
  {
    name: 'Dub',
    href: 'https://dub.co/pricing/links',
    fr: 'tarifs, consulté en novembre 2026 : Business 90 $ par mois en mensuel (81 $ à l’année), suivi des conversions inclus',
    en: 'pricing, checked November 2026: Business $90 a month billed monthly ($81 yearly), conversion tracking included',
  },
  {
    name: 'BuzzSumo',
    href: 'https://buzzsumo.com/pricing',
    fr: 'tarifs, consulté en novembre 2026 : Content Creation 199 $ par mois à l’année, « save $478/yr », soit 239 $ par mois en mensuel',
    en: 'pricing, checked November 2026: Content Creation $199 a month billed yearly, “save $478/yr”, i.e. $239 a month billed monthly',
  },
  {
    name: 'Digitiz',
    href: 'https://digitiz.fr/blog/tarifs-redaction-web/',
    fr: 'tarifs rédaction web, juin 2026 : newsletter 60 à 150 € HT',
    en: 'web copywriting rates, June 2026: newsletter €60 to €150 excl. VAT',
  },
]

// Ce qu'un nombre de crédits permet, format par format (« jusqu'à 2 reels OU
// 5 posts OU 4 newsletters » pour les 500 crédits de l'essai). Valeur
// d'affichage dérivée de CONTENT_CREDITS, jamais saisie à la main.
export function contentsFor(credits: number): { reels: number; posts: number; newsletters: number } {
  return {
    reels: Math.floor(credits / CONTENT_CREDITS.reel),
    posts: Math.floor(credits / CONTENT_CREDITS.post),
    newsletters: Math.floor(credits / CONTENT_CREDITS.newsletter),
  }
}

// Recharge à la consommation de l'app (`src/lib/payg.ts`, `payg_25`).
export const PAYG_RECHARGE = { euros: 25, credits: 200 }

// Les recharges à la consommation de l'app (`src/lib/payg.ts`, PAYG_PACKS),
// ouvertes par /join/empire?plan=payg&pack=<id>.
export const PAYG_PACKS = [
  { id: 'payg_25', euros: 25, credits: 200 },
  { id: 'payg_50', euros: 50, credits: 420 },
  { id: 'payg_100', euros: 100, credits: 900 },
] as const

// Équipe : de 2 à 20 places sur /join/empire (`seats`) ; au-delà, l'offre
// agence et entreprise (crédits illimités) se fait sur devis.
export const MAX_SELF_SERVE_SEATS = 20

export const APP_JOIN_URL = 'https://app.empire-internet.com/join/empire'

export const BILLING_PERIODS: {
  id: BillingId
  discount: number
  months: number
  labelFr: string
  labelEn: string
}[] = [
  { id: 'monthly', discount: 0, months: 1, labelFr: 'Mensuel', labelEn: 'Monthly' },
  { id: 'quarterly', discount: 0.12, months: 3, labelFr: 'Trimestriel', labelEn: 'Quarterly' },
  { id: 'yearly', discount: 0.18, months: 12, labelFr: 'Annuel', labelEn: 'Yearly' },
]

export function getPlan(id: PlanId): Plan {
  return PLANS.find(p => p.id === id) ?? PLANS[1]
}

export function volumeDiscount(seats: number): number {
  if (seats >= 10) return 0.20
  if (seats >= 5) return 0.15
  if (seats >= 3) return 0.10
  return 0
}

export function combinedDiscount(billing: BillingId, seats: number): number {
  const billingD = BILLING_PERIODS.find(b => b.id === billing)?.discount ?? 0
  const volumeD = volumeDiscount(seats)
  return 1 - (1 - billingD) * (1 - volumeD)
}

export function finalPrice(base: number, billing: BillingId, seats: number): number {
  return Math.round(base * (1 - combinedDiscount(billing, seats)))
}
