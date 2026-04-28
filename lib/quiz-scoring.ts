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
  const stage = answers.stage
  const hours = answers.hours
  const revenueTarget = answers.revenue

  const wantsHighRevenue = revenueTarget === '10_30k' || revenueTarget === 'gt30k'
  const noTime = hours === 'lt2' || hours === 'done_for_me'
  const doneForMe = hours === 'done_for_me'
  const isTotalBeginner = stage === 'not_started'
  const isVeryEarly = stage === 'not_started' || stage === 'beginning'

  let recommendedOffer: RecommendedOffer
  if (doneForMe) {
    // Hard signal: they explicitly said "do it for me".
    recommendedOffer = 'autopilot'
  } else if (score >= 70 && (wantsHighRevenue || noTime)) {
    // Qualified + (ambitious OR no bandwidth) → push top tier.
    recommendedOffer = 'autopilot'
  } else if (score >= 55) {
    // Qualified but not premium-yet → coached growth tier.
    recommendedOffer = 'copilot'
  } else if (isVeryEarly || score >= 40) {
    // Early-stage or borderline → entry-level course.
    recommendedOffer = 'academy'
  } else {
    // Genuine cold lead — don't burn them with a hard pitch.
    recommendedOffer = 'nurture'
  }

  // Hard floor: a true total beginner is *never* sold autopilot or copilot —
  // they need foundations first, otherwise we over-promise and they churn.
  if (isTotalBeginner && (recommendedOffer === 'autopilot' || recommendedOffer === 'copilot')) {
    recommendedOffer = 'academy'
  }

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
  }
}

// ─── Tag mapping (env-driven) ─────────────────────────────────────────────────

export function tagsForResult(result: QuizResult): number[] {
  const ids: (number | undefined)[] = [
    parseTag(process.env.SYSTEMEIO_TAG_QUIZ_COMPLETED),
    parseTag(process.env[`SYSTEMEIO_TAG_ARCHETYPE_${result.archetype.toUpperCase()}`]),
    parseTag(process.env[`SYSTEMEIO_TAG_SCORE_${result.scoreBand.toUpperCase()}`]),
    parseTag(process.env[`SYSTEMEIO_TAG_OFFER_${result.recommendedOffer.toUpperCase()}`]),
  ]
  return ids.filter((n): n is number => typeof n === 'number' && !Number.isNaN(n))
}

export function leadStartTag(): number | null {
  const v = parseTag(process.env.SYSTEMEIO_TAG_QUIZ_STARTED)
  return typeof v === 'number' ? v : null
}

function parseTag(v: string | undefined): number | undefined {
  if (!v) return undefined
  const n = parseInt(v, 10)
  return Number.isFinite(n) ? n : undefined
}
