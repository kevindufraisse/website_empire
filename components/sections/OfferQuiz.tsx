'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, GraduationCap, Sparkles, Crown, RotateCcw, X, Check, UserCheck, Users, type LucideIcon } from 'lucide-react'
import posthog from 'posthog-js'
import { trackAmplitude } from '@/lib/amplitude'
import { PLAN_LABELS, getPlan, type PlanId } from '@/lib/plans'

type OfferId = 'academy' | 'empire' | 'legende'
type AddonId = 'coaching' | 'seats'

type Answer = {
  fr: string
  en: string
  /** Undefined = la réponse ne compte pas dans le score (question add-on). */
  offer?: OfferId
  addon?: AddonId
  /** Pack Empire suggéré par cette réponse (question volume). */
  plan?: PlanId
  /** Nombre de places à pré-remplir dans l'onboarding. */
  seats?: number
  /** Fragment réutilisé pour justifier la reco quand cette offre gagne. */
  reasonFr?: string
  reasonEn?: string
}

type Question = {
  fr: string
  en: string
  answers: Answer[]
  /** Questions pack / add-ons : n'influencent pas le choix d'offre. */
  optional?: boolean
  optionalHintFr?: string
  optionalHintEn?: string
}

const QUESTIONS: Question[] = [
  {
    fr: 'Qu\u2019est-ce que vous voulez obtenir ?',
    en: 'What do you want to get?',
    answers: [
      {
        fr: 'Un nouveau métier et un revenu',
        en: 'A new career and an income',
        offer: 'academy',
        reasonFr: 'Vous cherchez une compétence qui devient un revenu.',
        reasonEn: 'You want a skill that turns into income.',
      },
      {
        fr: 'Des clients pour mon activité',
        en: 'Clients for my business',
        offer: 'empire',
        reasonFr: 'Votre objectif est d\u2019attirer des clients, pas de faire des vues.',
        reasonEn: 'Your goal is to attract clients, not just views.',
      },
      {
        fr: 'Une réputation, sans y passer de temps',
        en: 'A reputation, without spending time on it',
        offer: 'legende',
        reasonFr: 'Vous voulez une réputation sans y consacrer de temps.',
        reasonEn: 'You want a reputation without spending time on it.',
      },
    ],
  },
  {
    fr: 'Où en êtes-vous aujourd\u2019hui ?',
    en: 'Where are you today?',
    answers: [
      {
        fr: 'Je pars de zéro ou je me reconvertis',
        en: 'I\u2019m starting from zero or changing careers',
        offer: 'academy',
        reasonFr: 'Vous partez de zéro : l\u2019Academy ne demande aucun projet préalable.',
        reasonEn: 'You\u2019re starting from zero: the Academy requires no existing project.',
      },
      {
        fr: 'J\u2019ai une activité qui manque de visibilité',
        en: 'I have a business that lacks visibility',
        offer: 'empire',
        reasonFr: 'Vous avez déjà une activité à faire connaître.',
        reasonEn: 'You already have a business to make visible.',
      },
      {
        fr: 'Je dirige une entreprise qui tourne déjà',
        en: 'I run a company that already works',
        offer: 'legende',
        reasonFr: 'Votre entreprise tourne déjà : votre temps vaut plus cher que la production.',
        reasonEn: 'Your company already works: your time is worth more than production.',
      },
    ],
  },
  {
    fr: 'Combien de temps pouvez-vous y consacrer ?',
    en: 'How much time can you dedicate?',
    answers: [
      {
        fr: '5h et plus par semaine - je veux apprendre à le faire',
        en: '5h+ per week - I want to learn how to do it',
        offer: 'academy',
        reasonFr: 'Vous avez le temps et l\u2019envie d\u2019apprendre le métier vous-même.',
        reasonEn: 'You have the time and the drive to learn the craft yourself.',
      },
      {
        fr: 'Environ 1h par semaine - je parle, vous produisez',
        en: 'About 1h per week - I talk, you produce',
        offer: 'empire',
        reasonFr: '1h par semaine, c\u2019est exactement le format Empire.',
        reasonEn: '1h per week is exactly the Empire format.',
      },
      {
        fr: '1h par mois maximum',
        en: '1h per month max',
        offer: 'legende',
        reasonFr: '1h par mois, c\u2019est exactement le format Légende.',
        reasonEn: '1h per month is exactly the Legend format.',
      },
    ],
  },
  {
    fr: 'Face caméra, vous vous situez où ?',
    en: 'On camera, where do you stand?',
    answers: [
      {
        fr: 'Je veux apprendre à bien le faire',
        en: 'I want to learn to do it well',
        offer: 'academy',
        reasonFr: 'Vous voulez maîtriser la caméra, pas seulement l\u2019utiliser.',
        reasonEn: 'You want to master the camera, not just use it.',
      },
      {
        fr: 'Je le fais volontiers si on gère le reste',
        en: 'Happy to do it if you handle the rest',
        offer: 'empire',
        reasonFr: 'Vous acceptez d\u2019être devant la caméra si la production est prise en charge.',
        reasonEn: 'You\u2019re fine on camera as long as production is handled.',
      },
      {
        fr: 'Le moins possible',
        en: 'As little as possible',
        offer: 'legende',
        reasonFr: 'Vous voulez apparaître le moins possible : tout est délégué.',
        reasonEn: 'You want minimal exposure: everything is delegated.',
      },
    ],
  },
  {
    fr: 'Votre audience aujourd\u2019hui ?',
    en: 'Your audience today?',
    answers: [
      {
        fr: 'Moins de 500 abonnés',
        en: 'Under 500 followers',
        offer: 'academy',
        reasonFr: 'Avec une audience naissante, la priorité est d\u2019acquérir la méthode.',
        reasonEn: 'With a small audience, the priority is learning the method.',
      },
      {
        fr: 'Entre 500 et 10 000 abonnés',
        en: 'Between 500 and 10,000 followers',
        offer: 'empire',
        reasonFr: 'Votre audience existe déjà : il faut du volume régulier pour la convertir.',
        reasonEn: 'Your audience already exists: consistent volume will convert it.',
      },
      {
        fr: 'Plus de 10 000, ou une marque déjà connue',
        en: 'Over 10,000, or an established brand',
        offer: 'legende',
        reasonFr: 'À votre niveau d\u2019audience, l\u2019enjeu est la qualité d\u2019exécution, pas l\u2019apprentissage.',
        reasonEn: 'At your audience level, the stakes are execution quality, not learning.',
      },
    ],
  },
  {
    fr: 'À quel rythme voulez-vous publier ?',
    en: 'How often do you want to publish?',
    optional: true,
    optionalHintFr: 'Optionnel - sert à suggérer un pack Empire si c\u2019est l\u2019offre pour vous.',
    optionalHintEn: 'Optional - used to suggest an Empire pack if that\'s your offer.',
    answers: [
      {
        fr: '2 posts LinkedIn et 2 Reels par semaine, je démarre en douceur',
        en: '2 LinkedIn posts and 2 Reels a week, easing into it',
        plan: 'starter',
      },
      {
        fr: '5 posts LinkedIn et 5 Reels par semaine, je veux être régulier',
        en: '5 LinkedIn posts and 5 Reels a week, I want to be consistent',
        plan: 'growth',
      },
      {
        fr: '10 posts LinkedIn et 10 Reels par semaine, je veux saturer mon marché',
        en: '10 LinkedIn posts and 10 Reels a week, I want to saturate my market',
        plan: 'scale',
      },
    ],
  },
  {
    fr: 'Vous savez déjà quoi dire ?',
    en: 'Do you already know what to say?',
    optional: true,
    optionalHintFr: 'Optionnel - coaching disponible en add-on sur Empire.',
    optionalHintEn: 'Optional - coaching available as an Empire add-on.',
    answers: [
      {
        fr: 'Non, trouver mes sujets est mon vrai blocage',
        en: 'No, finding topics is my real blocker',
        addon: 'coaching',
      },
      {
        fr: 'J\u2019ai des idées mais aucune structure',
        en: 'I have ideas but no structure',
        addon: 'coaching',
      },
      {
        fr: 'Oui, ma ligne éditoriale est claire',
        en: 'Yes, my editorial line is clear',
      },
    ],
  },
  {
    fr: 'Vous êtes seul ou en équipe ?',
    en: 'Are you solo or in a team?',
    optional: true,
    optionalHintFr: 'Optionnel - places supplémentaires possibles sur Empire.',
    optionalHintEn: 'Optional - extra seats available on Empire.',
    answers: [
      {
        fr: 'Seul, c\u2019est ma marque personnelle',
        en: 'Solo, it\u2019s my personal brand',
      },
      {
        fr: '2 à 4 personnes à faire publier',
        en: '2 to 4 people to get publishing',
        addon: 'seats',
        seats: 3,
      },
      {
        fr: '5 personnes ou plus',
        en: '5 people or more',
        addon: 'seats',
        seats: 5,
      },
    ],
  },
]

// Classes statiques par offre (Tailwind ne génère pas les classes dynamiques)
const COLOR_CLASSES: Record<OfferId, { badge: string; cta: string; accent: string }> = {
  academy: { badge: 'bg-academy/15 border-academy/30 text-academy', cta: 'bg-academy', accent: 'text-academy' },
  empire: { badge: 'bg-empire/15 border-empire/30 text-empire', cta: 'bg-empire', accent: 'text-empire' },
  legende: { badge: 'bg-autopilot/15 border-autopilot/30 text-autopilot', cta: 'bg-autopilot', accent: 'text-autopilot' },
}

const RESULTS: Record<OfferId, {
  icon: LucideIcon
  labelFr: string
  labelEn: string
  titleFr: string
  titleEn: string
  descFr: string
  descEn: string
  ctaFr: string
  ctaEn: string
  href: string
}> = {
  academy: {
    icon: GraduationCap,
    labelFr: 'Academy',
    labelEn: 'Academy',
    titleFr: 'Devenez Head of Viralité en 21 jours.',
    titleEn: 'Become Head of Virality in 21 days.',
    descFr: 'Apprenez le métier, obtenez votre certification, et gagnez vos premiers 3 000€/mois. Même sans projet à vous. 20 places sur sélection.',
    descEn: 'Learn the craft, get certified, and earn your first €3,000/month. Even without your own project. 20 spots, by selection.',
    ctaFr: 'Découvrir l\u2019Academy',
    ctaEn: 'Discover the Academy',
    href: '/academy',
  },
  empire: {
    icon: Sparkles,
    labelFr: 'Empire',
    labelEn: 'Empire',
    titleFr: 'Parlez 1 heure. Nous créons un mois de contenus.',
    titleEn: 'Talk for 1 hour. We create a month of content.',
    descFr: 'Parlez 1 heure. Nous créons un mois de contenus. Demande un accès - sur sélection.',
    descEn: 'Talk for 1 hour. We create a month of content. Request access - by selection.',
    ctaFr: 'Demander un accès',
    ctaEn: 'Request access',
    href: '/postuler',
  },
  legende: {
    icon: Crown,
    labelFr: 'Légende',
    labelEn: 'Legend',
    titleFr: 'Vous dirigez votre entreprise. Nous dirigeons votre image.',
    titleEn: 'You run your business. We run your image.',
    descFr: 'Vous dirigez votre entreprise. Nous dirigeons votre image. 10 places, sur sélection.',
    descEn: 'You run your business. We run your image. 10 spots, application only.',
    ctaFr: 'Candidater',
    ctaEn: 'Apply',
    href: '/legende',
  },
}

// Options réellement disponibles au checkout Empire. Volontairement non
// proposées pour Academy (bootcamp) et Légende (tout est déjà inclus).
const ADDONS: Record<AddonId, {
  icon: LucideIcon
  labelFr: string
  labelEn: string
  priceFr: string
  priceEn: string
  descFr: string
  descEn: string
}> = {
  coaching: {
    icon: UserCheck,
    labelFr: 'Coaching 4h avec un expert en viralité',
    labelEn: '4h coaching with a virality expert',
    priceFr: 'proposé après candidature',
    priceEn: 'offered after you apply',
    descFr: 'Vous avez dit que trouver vos sujets vous bloque. Un expert prépare vos angles et votre ligne éditoriale - vous n\u2019avez plus qu\u2019à parler.',
    descEn: 'You said finding topics blocks you. An expert prepares your angles and editorial line - all you do is talk.',
  },
  seats: {
    icon: Users,
    labelFr: 'Places supplémentaires pour votre équipe',
    labelEn: 'Additional seats for your team',
    priceFr: 'selon la taille de l\u2019équipe',
    priceEn: 'based on team size',
    descFr: 'Vous avez plusieurs personnes à faire publier. Le prix par place baisse dès 3 places, et tout le monde publie depuis la même plateforme.',
    descEn: 'You have several people to get publishing. Price per seat drops from 3 seats up, and everyone publishes from the same platform.',
  },
}

function computeResult(picked: Answer[]): OfferId {
  const counts: Record<OfferId, number> = { academy: 0, empire: 0, legende: 0 }
  picked.forEach(a => { if (a.offer) counts[a.offer] += 1 })
  const max = Math.max(counts.academy, counts.empire, counts.legende)
  // Égalité → Empire : l'offre du milieu convient au plus grand nombre
  if (counts.empire === max) return 'empire'
  return counts.academy === max ? 'academy' : 'legende'
}

/**
 * Quiz "Quelle offre est faite pour vous ?" - monté globalement dans le layout.
 * S'ouvre uniquement sur l'événement `open-offer-quiz`, donc sur une intention
 * explicite : demander de choisir entre trois abonnements payants n'a de sens que
 * si le visiteur l'a demandé. L'exit intent appartient au quiz créateur, qui
 * donne un résultat avant de demander quoi que ce soit.
 */
export function OfferQuizGlobal({ fr }: { fr: boolean }) {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<Answer[]>([])
  const [result, setResult] = useState<OfferId | null>(null)

  useEffect(() => setMounted(true), [])

  const openQuiz = (source: string) => {
    setStep(0)
    setPicked([])
    setResult(null)
    setOpen(true)
    trackAmplitude('offer_quiz_opened', { source })
    if (posthog.__loaded) posthog.capture('offer_quiz_opened', { source })
  }

  useEffect(() => {
    const handler = () => openQuiz('header')
    window.addEventListener('open-offer-quiz', handler)
    return () => window.removeEventListener('open-offer-quiz', handler)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const crisp = (window as unknown as { $crisp?: { push: (cmd: unknown[]) => void } }).$crisp
    crisp?.push(['do', 'chat:hide'])
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      crisp?.push(['do', 'chat:show'])
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const answer = (a: Answer) => {
    const next = [...picked, a]
    if (next.length === QUESTIONS.length) {
      const res = computeResult(next)
      setPicked(next)
      setResult(res)
      const props = {
        result: res,
        addons: next.map(x => x.addon).filter(Boolean).join(','),
        answers: next.map(x => x.offer ?? '-').join(','),
      }
      trackAmplitude('offer_quiz_completed', props)
      if (posthog.__loaded) posthog.capture('offer_quiz_completed', props)
    } else {
      setPicked(next)
      setStep(step + 1)
    }
  }

  const back = () => {
    if (step === 0) return
    setPicked(picked.slice(0, -1))
    setStep(step - 1)
  }

  const reset = () => { setStep(0); setPicked([]); setResult(null) }

  const res = result ? RESULTS[result] : null
  // La justification reprend uniquement les réponses qui ont porté l'offre gagnante.
  const reasons = result
    ? picked.filter(a => a.offer === result).map(a => (fr ? a.reasonFr : a.reasonEn)).filter(Boolean)
    : []
  // Pack, places et options ne concernent qu'Empire : Academy est un bootcamp
  // à prix fixe et Légende inclut déjà tout.
  const isEmpire = result === 'empire'
  const addons = isEmpire
    ? Array.from(new Set(picked.map(a => a.addon).filter(Boolean) as AddonId[]))
    : []
  const planId: PlanId = picked.find(a => a.plan)?.plan ?? 'growth'
  const seats = picked.find(a => a.seats)?.seats ?? 1
  const plan = getPlan(planId)
  // Prix par place, hors remise de volume : la réponse "2 à 4 personnes" ne dit
  // pas le nombre exact, et la remise ne démarre qu'à 3 places. Mieux vaut
  // annoncer le tarif plein et laisser l'onboarding appliquer la remise.
  const empireHref = '/postuler'

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <p className="text-sm font-bold text-white">
                {fr ? 'Quelle offre est faite pour vous ?' : 'Which offer is right for you?'}
              </p>
              {!result && (
                <div className="hidden sm:flex items-center gap-1.5">
                  {QUESTIONS.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${i < step ? 'w-4 bg-empire' : i === step ? 'w-7 bg-empire/60' : 'w-4 bg-white/10'}`}
                    />
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={fr ? 'Fermer' : 'Close'}
              className="rounded-full border border-white/10 p-2 text-neutral-400 transition-colors hover:border-white/30 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center overflow-y-auto px-5">
            <div className="w-full max-w-2xl py-10">
              <AnimatePresence mode="wait" initial={false}>
                {res && result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="text-center"
                  >
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${COLOR_CLASSES[result].badge}`}>
                      <res.icon size={14} />
                      {fr ? `Recommandé pour vous : ${res.labelFr}` : `Recommended for you: ${res.labelEn}`}
                    </span>
                    <h2 className="mt-6 text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-white">
                      {fr ? res.titleFr : res.titleEn}
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-base text-neutral-400 leading-relaxed">
                      {fr ? res.descFr : res.descEn}
                    </p>

                    {reasons.length > 0 && (
                      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left sm:p-6">
                        <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                          {fr ? `Pourquoi ${res.labelFr} d\u2019après vos réponses` : `Why ${res.labelEn}, based on your answers`}
                        </p>
                        <ul className="mt-4 space-y-2.5">
                          {reasons.map((r, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <Check size={15} className={`mt-0.5 shrink-0 ${COLOR_CLASSES[result].accent}`} />
                              <span className="text-sm text-neutral-300 leading-relaxed">{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {isEmpire && (
                      <div className="mt-4 rounded-2xl border border-empire/25 bg-empire/[0.06] p-5 text-left sm:p-6">
                        <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                          {fr ? 'Niveau suggéré (validé si vous êtes pris)' : 'Suggested level (confirmed if you\'re selected)'}
                        </p>
                        <p className="mt-3 text-lg font-extrabold text-white">
                          {fr ? PLAN_LABELS[planId].fr : PLAN_LABELS[planId].en}
                          {seats > 1 && (
                            <span className="ml-2 text-[13px] font-semibold text-neutral-400">
                              {fr ? `· ${seats} places` : `· ${seats} seats`}
                            </span>
                          )}
                        </p>
                        <p className="mt-1.5 text-[13px] text-neutral-400 leading-relaxed">
                          {fr
                            ? `${plan.rhythmFr}${seats > 1 ? ', par personne' : ''}, publiés sur vos 7 plateformes. ${plan.sessions} sessions d’enregistrement par mois. Accès sur liste d’attente, profils les plus motivés.`
                            : `${plan.rhythmEn}${seats > 1 ? ', per person' : ''}, published across your 7 platforms. ${plan.sessions} recording sessions per month. Waitlist access - most motivated profiles.`}
                        </p>
                      </div>
                    )}

                    {addons.length > 0 && (
                      <div className="mt-4 text-left">
                        <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                          {fr ? 'En option (pas inclus)' : 'Optional (not included)'}
                        </p>
                        <div className="mt-3 space-y-3">
                          {addons.map((id) => {
                            const ad = ADDONS[id]
                            return (
                              <div key={id} className="rounded-2xl border border-empire/25 bg-empire/[0.06] p-5">
                                <div className="flex items-start gap-3">
                                  <ad.icon size={18} className="mt-0.5 shrink-0 text-empire" />
                                  <div className="min-w-0">
                                    <p className="text-sm font-bold text-white">
                                      {fr ? ad.labelFr : ad.labelEn}
                                      <span className="ml-2 rounded-full border border-empire/30 bg-empire/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-empire">
                                        {fr ? 'Option' : 'Optional'}
                                      </span>
                                      <span className="ml-2 font-semibold text-empire">{fr ? ad.priceFr : ad.priceEn}</span>
                                    </p>
                                    <p className="mt-1.5 text-[13px] text-neutral-400 leading-relaxed">
                                      {fr ? ad.descFr : ad.descEn}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    <div className="mt-8 flex flex-col items-center gap-4">
                      <a
                        href={isEmpire ? empireHref : res.href}
                        onClick={() => {
                          const props = isEmpire
                            ? { result, addons: addons.join(','), plan: planId, seats }
                            : { result, addons: addons.join(',') }
                          trackAmplitude('offer_quiz_cta_click', props)
                          if (posthog.__loaded) posthog.capture('offer_quiz_cta_click', props, { transport: 'sendBeacon' })
                        }}
                        className={`inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-black transition-all hover:brightness-110 hover:scale-[1.02] ${COLOR_CLASSES[result].cta}`}
                      >
                        {fr ? res.ctaFr : res.ctaEn}
                        <ArrowRight size={17} />
                      </a>
                      <div className="flex items-center gap-5">
                        <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-neutral-500 transition-colors hover:text-white">
                          <RotateCcw size={13} />
                          {fr ? 'Recommencer' : 'Start over'}
                        </button>
                        <button type="button" onClick={() => setOpen(false)} className="text-[13px] font-semibold text-neutral-500 transition-colors hover:text-white">
                          {fr ? 'Comparer les 3 offres' : 'Compare all 3 offers'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-center text-xs font-bold uppercase tracking-widest text-neutral-500">
                      {fr ? `Question ${step + 1} sur ${QUESTIONS.length}` : `Question ${step + 1} of ${QUESTIONS.length}`}
                      {QUESTIONS[step].optional && (
                        <span className="ml-2 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-bold tracking-wider text-neutral-400 normal-case">
                          {fr ? 'Optionnel' : 'Optional'}
                        </span>
                      )}
                    </p>
                    <h2 className="mt-3 text-center text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-white">
                      {fr ? QUESTIONS[step].fr : QUESTIONS[step].en}
                    </h2>
                    {QUESTIONS[step].optional && (
                      <p className="mt-2 text-center text-sm text-neutral-500">
                        {fr ? QUESTIONS[step].optionalHintFr : QUESTIONS[step].optionalHintEn}
                      </p>
                    )}
                    <div className="mt-8 space-y-3">
                      {QUESTIONS[step].answers.map((a) => (
                        <button
                          key={a.en}
                          type="button"
                          onClick={() => answer(a)}
                          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-left text-base sm:text-lg text-neutral-200 transition-all hover:border-empire/60 hover:bg-empire/5 hover:text-white"
                        >
                          {fr ? a.fr : a.en}
                        </button>
                      ))}
                    </div>
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={back}
                        className="mx-auto mt-6 block text-[13px] font-semibold text-neutral-500 transition-colors hover:text-white"
                      >
                        {fr ? '← Question précédente' : '← Previous question'}
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (!mounted) return null
  return createPortal(modal, document.body)
}
