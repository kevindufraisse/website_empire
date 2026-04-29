import {
  ARCHETYPES,
  QUESTIONS,
  type ArchetypeId,
  type ArchetypeProfile,
  type RecommendedOffer,
  type ScoreBand,
} from './quiz-data'

export type QuizAnswers = Record<string, string>

export interface QuizResult {
  archetype: ArchetypeId
  archetypeProfile: ArchetypeProfile
  /** 0–100 readiness score. */
  score: number
  scoreBand: ScoreBand
  /** Primary recommendation (highest CA the lead can credibly afford). */
  recommendedOffer: RecommendedOffer
  /** Secondary recommendation (the next-best alternative for soft cross-sell). */
  secondaryOffer: RecommendedOffer | null
  /** Order of archetypes from most to least likely. */
  archetypeRanking: { id: ArchetypeId; pct: number }[]
  /** Plain-text summary safe to ship to Systeme.io custom fields. */
  summary: string
  /** True when the lead qualifies for a fully-delegated (done-for-you) offer.
   *  We still recommend Copilot publicly, but unlock a "delegate everything" mention. */
  premiumEligible: boolean
}

const MAX_SCORE_RAW = QUESTIONS.reduce((sum, q) => {
  const max = Math.max(0, ...q.options.map(o => o.score ?? 0))
  return sum + max
}, 0)

// CA ranking, descending. Used to pick a secondary offer ("the next best thing").
const OFFER_LADDER: RecommendedOffer[] = ['autopilot', 'copilot', 'academy', 'nurture']

export function computeQuizResult(answers: QuizAnswers): QuizResult {
  const archetypePoints: Record<ArchetypeId, number> = {
    storyteller: 0,
    builder: 0,
    educator: 0,
    provocateur: 0,
  }
  let rawScore = 0

  for (const q of QUESTIONS) {
    const choice = answers[q.id]
    if (!choice) continue
    const opt = q.options.find(o => o.id === choice)
    if (!opt) continue

    rawScore += opt.score ?? 0
    if (opt.archetype) {
      for (const k of Object.keys(opt.archetype) as ArchetypeId[]) {
        archetypePoints[k] += opt.archetype[k] ?? 0
      }
    }
  }

  // Floor at 35 — this is a marketing quiz, nobody walks away thinking they're a lost cause.
  const normalized = MAX_SCORE_RAW > 0 ? rawScore / MAX_SCORE_RAW : 0
  const score = Math.round(35 + normalized * 65)

  const scoreBand: ScoreBand =
    score >= 75 ? 'high' : score >= 55 ? 'medium' : 'low'

  // Archetype: pick top with stable tie-break.
  const fallbackOrder: ArchetypeId[] = ['educator', 'builder', 'storyteller', 'provocateur']
  const sortedArchetypes = (Object.keys(archetypePoints) as ArchetypeId[]).sort((a, b) => {
    const diff = archetypePoints[b] - archetypePoints[a]
    if (diff !== 0) return diff
    return fallbackOrder.indexOf(a) - fallbackOrder.indexOf(b)
  })
  const archetype = sortedArchetypes[0]

  const totalArchetype = Object.values(archetypePoints).reduce((a, b) => a + b, 0) || 1
  const archetypeRanking = sortedArchetypes.map(id => ({
    id,
    pct: Math.round((archetypePoints[id] / totalArchetype) * 100),
  }))

  // ─── CA-FIRST OFFER ROUTING ────────────────────────────────────────────────
  //
  // Principle: push the highest-CA tier the lead can credibly afford. Downgrade
  // only when there's a clear disqualifier. The appointment call filters the
  // rest — that's its job.
  //
  // Ranking (high → low CA):
  //   Autopilot  →  €10k+ done-for-you
  //   Copilot    →  €1k/mo with coach
  //   Academy    →  €497 entry-level course
  //   Nurture    →  free content / nothing to sell
  //
  // ───────────────────────────────────────────────────────────────────────────
  // ─── Signaux extraits des 10 questions ────────────────────────────────────
  const business = answers.business           // pre_revenue | lt5k | 5_20k | 20_50k | gt50k
  const inactionCost = answers.inaction_cost  // never_thought | few | thousands | ten_plus | biggest
  const budget = answers.budget               // high_decider | mid_decider | low_test | need_partner | not_yet
  const timing = answers.timing               // now | month | quarter | six_months | no_pressure
  const situation = answers.situation         // zero | sometimes | regular_no_convert | works_scaling | system_optimize

  // Capacité à payer (basée sur CA business)
  const isHighRevenue = business === '20_50k' || business === 'gt50k'
  const isMidRevenue = business === '5_20k' || isHighRevenue
  const isPreRevenue = business === 'pre_revenue'

  // Décideur + budget
  const isHighBudgetDecider = budget === 'high_decider'  // 5k+ déjà investi, décide seul
  const isMidBudgetDecider = budget === 'mid_decider'    // jusqu'à 5k, décide seul
  const isAnyDecider = isHighBudgetDecider || isMidBudgetDecider || budget === 'low_test'
  const isHesitant = budget === 'not_yet' || budget === 'need_partner'

  // Coût d'inaction (urgence)
  const feelsHighCost = inactionCost === 'ten_plus' || inactionCost === 'biggest'
  const feelsCost = feelsHighCost || inactionCost === 'thousands'
  const noCostFeeling = inactionCost === 'never_thought'

  // Timing
  const isUrgentNow = timing === 'now' || timing === 'month'
  const isSlowTiming = timing === 'six_months' || timing === 'no_pressure'

  // Maturité contenu
  const hasContentMaturity = situation === 'works_scaling' || situation === 'system_optimize'
  const isContentBeginner = situation === 'zero'

  // ─── 3 PORTES : Academy / Copilot / Autopilot ──────────────────────────────
  //
  // Autopilot = riche + convaincu + besoin urgent (ou maturité contenu déjà élevée)
  // Copilot   = budget sérieux + décideur + convaincu (timing court)
  // Academy   = tout le reste (porte d'entrée pour convaincre)
  // ───────────────────────────────────────────────────────────────────────────

  // ─── 2 PORTES : Empire (Copilot) vs Academy ──────────────────────────────
  //
  // Empire = >= 5k€/mois ET pas hésitant (besoin réel + capacité de payer)
  // Academy = tout le reste (porte d'entrée, ticket bas)
  //
  // Note: On ne recommande JAMAIS Autopilot publiquement.
  // Les profils "premium" (CA élevé + budget + urgence) reçoivent Copilot
  // avec une mention "vous pouvez aussi tout déléguer si vous préférez".
  // ───────────────────────────────────────────────────────────────────────────

  let recommendedOffer: RecommendedOffer

  if (isPreRevenue || business === 'lt5k') {
    // Pas encore de CA récurrent ou < 5k€/mois → Academy (Empire trop cher).
    recommendedOffer = 'academy'
  } else if (isHesitant) {
    // Hésitant (need_partner ou not_yet) → Academy (besoin de convaincre d'abord).
    recommendedOffer = 'academy'
  } else if (noCostFeeling && !isHighBudgetDecider) {
    // Pas conscient du coût + pas gros budget → Academy.
    recommendedOffer = 'academy'
  } else if (isSlowTiming && !isHighBudgetDecider) {
    // Pas pressé + pas gros budget → Academy.
    recommendedOffer = 'academy'
  } else {
    // Tout le reste (5k+ avec un minimum de conviction) → Empire/Copilot.
    recommendedOffer = 'copilot'
  }

  // Premium flag : profil top-tier qui pourrait déléguer entièrement.
  // (Leur recommandation reste Copilot, on ajoute juste une mention DFY.)
  const premiumEligible =
    isHighBudgetDecider &&
    isHighRevenue &&
    feelsHighCost &&
    !isHesitant &&
    !isSlowTiming &&
    recommendedOffer === 'copilot'

  // Secondary offer = next tier down on the ladder, for soft cross-sell.
  const idx = OFFER_LADDER.indexOf(recommendedOffer)
  const secondaryOffer: RecommendedOffer | null =
    idx >= 0 && idx + 1 < OFFER_LADDER.length ? OFFER_LADDER[idx + 1] : null

  const profile = ARCHETYPES[archetype]
  const summary = `${profile.name} · ${score}/100 · ${recommendedOffer}`

  return {
    archetype,
    archetypeProfile: profile,
    score,
    scoreBand,
    recommendedOffer,
    secondaryOffer,
    archetypeRanking,
    summary,
    premiumEligible,
  }
}

// ─── Tag mapping (env-driven) ─────────────────────────────────────────────────
//
// When lang='en', we look for env vars with an _EN suffix first. If not set,
// we fall back to the base (FR) tag. This lets you create separate Systeme.io
// audiences for EN leads (e.g. SYSTEMEIO_TAG_QUIZ_COMPLETED_EN=456).
//
// To add EN tags: duplicate each tag in Systeme.io with a "_en" suffix name,
// then add the corresponding env vars (e.g. SYSTEMEIO_TAG_QUIZ_COMPLETED_EN=456).

function tagForLang(baseKey: string, lang: 'en' | 'fr'): number | undefined {
  if (lang === 'en') {
    const enVal = parseTag(process.env[`${baseKey}_EN`])
    if (enVal !== undefined) return enVal
  }
  return parseTag(process.env[baseKey])
}

export function tagsForResult(result: QuizResult, lang: 'en' | 'fr' = 'fr'): number[] {
  const ids: (number | undefined)[] = [
    tagForLang('SYSTEMEIO_TAG_QUIZ_COMPLETED', lang),
    tagForLang(`SYSTEMEIO_TAG_ARCHETYPE_${result.archetype.toUpperCase()}`, lang),
    tagForLang(`SYSTEMEIO_TAG_SCORE_${result.scoreBand.toUpperCase()}`, lang),
    tagForLang(`SYSTEMEIO_TAG_OFFER_${result.recommendedOffer.toUpperCase()}`, lang),
  ]
  // Also add a language-specific tag if configured (for global segmentation).
  if (lang === 'en') {
    const langTag = parseTag(process.env.SYSTEMEIO_TAG_LANG_EN)
    if (langTag !== undefined) ids.push(langTag)
  } else {
    const langTag = parseTag(process.env.SYSTEMEIO_TAG_LANG_FR)
    if (langTag !== undefined) ids.push(langTag)
  }
  return ids.filter((n): n is number => typeof n === 'number' && !Number.isNaN(n))
}

export function leadStartTag(lang: 'en' | 'fr' = 'fr'): number | null {
  const v = tagForLang('SYSTEMEIO_TAG_QUIZ_STARTED', lang)
  return typeof v === 'number' ? v : null
}

function parseTag(v: string | undefined): number | undefined {
  if (!v) return undefined
  const n = parseInt(v, 10)
  return Number.isFinite(n) ? n : undefined
}
