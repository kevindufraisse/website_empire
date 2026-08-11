'use client'

import { useRef, useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import {
  Check, Scissors, Minus, Plus, ChevronDown, MessageCircle, GraduationCap,
  FileText, Video, Mail, ImageIcon, Palette, Globe, Bot, Share2, Users, Zap,
  UserPlus, CalendarPlus, Compass, Mic, Send, Sparkles, Code2, UserCheck,
  HeadphonesIcon, Handshake, type LucideIcon,
} from 'lucide-react'
import posthog from 'posthog-js'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { trackAmplitude, withAmplitudeDeviceId } from '@/lib/amplitude'
import { fetchFlashPromo, formatCountdown } from '@/lib/flash-promo'
import { useReveal } from '@/hooks/useReveal'
import {
  APP_ONBOARDING_URL, BILLING_PERIODS, PLANS, PLAN_LABELS,
  combinedDiscount, finalPrice, getPlan,
  type BillingId, type Plan, type PlanId,
} from '@/lib/plans'

import WhyEmpireCompact from '@/components/sections/WhyEmpireCompact'

type PlanFeature = { fr: string; en: string; on?: false }

// Identical whatever the pack. Les réseaux ne consomment rien : ce qui varie
// d'un pack à l'autre, c'est le nombre de sessions et donc de contenus.
const PLAN_BASE_FEATURES: PlanFeature[] = [
  { fr: 'Les 7 réseaux inclus, sans supplément', en: 'All 7 networks included, no extra cost' },
  { fr: 'Cadence modifiable : plus de Reels, moins de newsletters, comme vous voulez', en: 'Adjustable mix: more Reels, fewer newsletters, however you want' },
  { fr: 'Cerveau Empire : vos sujets trouvés et classés pour vous', en: 'Empire brain: your topics found and ranked for you' },
]

const SUPPORT: PlanFeature = { fr: 'Support prioritaire sous 4h', en: 'Priority support within 4h' }
const REPLAYS: PlanFeature = { fr: 'Replays masterclass (valeur 197€)', en: 'Masterclass replays (€197 value)' }
const LIVES: PlanFeature = { fr: 'Lives hebdomadaires avec nos experts', en: 'Weekly lives with our experts' }
const COMMUNITY: PlanFeature = { fr: 'Communauté privée Slack', en: 'Private Slack community' }
const REVIEW: PlanFeature = { fr: 'Revue stratégique mensuelle (retours Loom)', en: 'Monthly strategy review (Loom feedback)' }

// What actually changes from one pack to the next. `on: false` renders as excluded.
const PLAN_FEATURES: Record<PlanId, PlanFeature[]> = {
  starter: [...PLAN_BASE_FEATURES, { ...LIVES, on: false }, { ...COMMUNITY, on: false }, { ...SUPPORT, on: false }, { ...REPLAYS, on: false }, { ...REVIEW, on: false }],
  growth: [...PLAN_BASE_FEATURES, LIVES, COMMUNITY, SUPPORT, REPLAYS, { ...REVIEW, on: false }],
  scale: [...PLAN_BASE_FEATURES, LIVES, COMMUNITY, SUPPORT, REPLAYS, REVIEW],
}

type DetailFeature = { fr: string; en: string; descFr: string; descEn: string; icon: LucideIcon; badge?: string }
type Pillar = { id: string; labelFr: string; labelEn: string; icon: LucideIcon; features: DetailFeature[] }

// Every feature of the offer, grouped the way a buyer reads them. Lives here so
// the full list is one click from the price instead of a separate section.
const PILLARS: Pillar[] = [
  {
    id: 'contenu',
    labelFr: 'Contenu',
    labelEn: 'Content',
    icon: Sparkles,
    features: [
      { fr: 'Posts LinkedIn', en: 'LinkedIn posts', descFr: 'Rédigés, optimisés et planifiés. Ajout automatique de vos lead magnets.', descEn: 'Written, optimized, scheduled. Auto-embed your lead magnets.', icon: FileText },
      { fr: 'Reels & Shorts', en: 'Reels & Shorts', descFr: 'Hooks, sous-titres et transitions. Option sans caméra.', descEn: 'Hooks, subtitles and transitions. No-camera option.', icon: Video },
      { fr: 'Newsletters', en: 'Newsletters', descFr: 'Qui sonnent comme vous, en mieux.', descEn: 'Sound like you, but better.', icon: Mail },
      { fr: 'Carrousels', en: 'Carousels', descFr: 'Générés depuis vos posts pour LinkedIn + Instagram.', descEn: 'Generated from your posts for LinkedIn + Instagram.', icon: ImageIcon },
      { fr: 'Miniatures', en: 'Thumbnails', descFr: 'Créées pour Instagram, YouTube et LinkedIn.', descEn: 'Made for Instagram, YouTube and LinkedIn.', icon: ImageIcon },
      { fr: 'Personnalisation complète', en: 'Full customization', descFr: 'Sous-titres (45 styles), transitions, vos couleurs, vos b-rolls, votre branding.', descEn: 'Subtitles (45 styles), transitions, your colors, your b-rolls, your branding.', icon: Palette },
      { fr: 'Multilingue : FR, EN, ES', en: 'Multilingual: FR, EN, ES', descFr: 'Tous vos contenus dans 3 langues.', descEn: 'All your content in 3 languages.', icon: Globe },
      { fr: 'Cerveau Empire', en: 'Empire Brain', descFr: 'Nos agents IA trouvent les sujets les plus viraux de votre niche.', descEn: 'Our AI agents find the most viral topics in your niche.', icon: Bot },
      { fr: 'Montage humain', en: 'Human editing', descFr: 'De vrais monteurs découpent vos vidéos et relisent chaque contenu.', descEn: 'Real editors cut your videos and proofread every piece.', icon: Scissors },
    ],
  },
  {
    id: 'distribution',
    labelFr: 'Distribution',
    labelEn: 'Distribution',
    icon: Send,
    features: [
      { fr: '7 réseaux en même temps', en: '7 platforms at once', descFr: 'LinkedIn, Instagram, TikTok, YouTube, X, Threads, Facebook.', descEn: 'LinkedIn, Instagram, TikTok, YouTube, X, Threads, Facebook.', icon: Share2 },
      { fr: 'Publiez en 1 clic', en: 'Publish in 1 click', descFr: 'Tout est prêt dans votre calendrier, aux bons horaires.', descEn: 'Everything ready in your calendar, at the right times.', icon: CalendarPlus },
      { fr: 'Employee Advocacy', en: 'Employee advocacy', descFr: 'Faites publier vos employés automatiquement.', descEn: 'Get your employees publishing automatically.', icon: Users },
      { fr: 'Idées via Telegram', en: 'Ideas via Telegram', descFr: 'Envoyez une idée depuis Telegram, retrouvez-la dans Empire.', descEn: 'Send an idea from Telegram, find it in Empire.', icon: MessageCircle, badge: 'NEW' },
      { fr: 'Multi-comptes', en: 'Multi-account', descFr: 'Compte perso + entreprise, plusieurs marques sur la même plateforme.', descEn: 'Personal + business, multiple brands on the same platform.', icon: Users },
      { fr: '+10 tunnels de conversion', en: '10+ conversion funnels', descFr: 'N8N, Make, ManyChat - prêts à dupliquer.', descEn: 'N8N, Make, ManyChat - ready to duplicate.', icon: Zap },
      { fr: 'Substack & Skool automatiques', en: 'Auto Substack & Skool', descFr: 'Vos contenus publiés aussi sur Substack et dans votre communauté Skool.', descEn: 'Your content also published on Substack and in your Skool community.', icon: Mail },
      { fr: 'Analytics & CRM leads', en: 'Analytics & lead CRM', descFr: 'Liens trackés et suivi des leads générés par chaque contenu.', descEn: 'Tracked links and follow-up on the leads each piece generates.', icon: Zap },
      { fr: 'API & intégrations', en: 'API & integrations', descFr: 'Connectez Empire à Notion, Airtable, Google Drive.', descEn: 'Connect Empire to Notion, Airtable, Google Drive.', icon: Code2 },
    ],
  },
  {
    id: 'accompagnement',
    labelFr: 'Accompagnement',
    labelEn: 'Support',
    icon: HeadphonesIcon,
    features: [
      { fr: 'Sessions d\'enregistrement', en: 'Recording sessions', descFr: 'Une session produit jusqu\'à 7 posts, 7 newsletters, 7 Reels, 1 vidéo YouTube et 1 carrousel. Vous choisissez les formats.', descEn: 'One session produces up to 7 posts, 7 newsletters, 7 Reels, 1 YouTube video and 1 carousel. You pick the formats.', icon: Mic },
      { fr: 'Équipe humaine dédiée', en: 'Dedicated human team', descFr: 'De vrais humains créent et vérifient chaque contenu avant livraison.', descEn: 'Real humans create and check every piece before delivery.', icon: UserCheck },
      { fr: 'Support prioritaire sous 4h', en: 'Priority support within 4h', descFr: 'Une question, une correction : réponse le jour même.', descEn: 'A question, a fix: same-day answer.', icon: HeadphonesIcon, badge: 'DÈS INTERMÉDIAIRE' },
      { fr: 'Communauté privée Slack', en: 'Private Slack community', descFr: 'Des fondateurs et des créateurs qui publient déjà : un avis sur une accroche en quelques minutes.', descEn: 'Founders and creators who already publish: an opinion on a hook within minutes.', icon: Users, badge: 'DÈS INTERMÉDIAIRE' },
      { fr: 'Lives hebdomadaires', en: 'Weekly live sessions', descFr: 'Vous posez vos questions, on analyse vos contenus de la semaine et on cherche vos prochains angles ensemble.', descEn: 'You bring your questions, we review your week\'s content and work out your next angles together.', icon: Mic, badge: 'DÈS INTERMÉDIAIRE' },
      { fr: 'Replays masterclass', en: 'Masterclass replays', descFr: 'Tout le système Empire en vidéo (valeur 197€).', descEn: 'The whole Empire system on video (€197 value).', icon: GraduationCap, badge: 'DÈS INTERMÉDIAIRE' },
      { fr: 'Revue stratégique mensuelle', en: 'Monthly strategy review', descFr: 'Un expert reprend vos chiffres du mois en vidéo Loom et vous dit quoi changer.', descEn: 'An expert walks through your month\'s numbers on Loom and tells you what to change.', icon: Compass, badge: 'DÈS EXPERT' },
    ],
  },
]

const TOTAL_FEATURES = PILLARS.reduce((n, p) => n + p.features.length, 0)

function planUrl(planId: PlanId, billing: BillingId, seats: number): string {
  const base = `${APP_ONBOARDING_URL}?plan=${planId}&billing=${billing}&intent=${seats > 1 ? 'enterprise' : 'trial'}`
  const withSeats = seats > 1 ? `${base}&seats=${seats}` : base
  return withAmplitudeDeviceId(withSeats)
}

export default function HomePricingSection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  const [ref, isInView] = useReveal('-100px')
  const viewedRef = useRef(false)

  const [billing, setBilling] = useState<BillingId>('yearly')
  const [selectedTier, setSelectedTier] = useState<PlanId>('growth')
  const [seats, setSeats] = useState(1)
  const [showSeats, setShowSeats] = useState(false)

  useEffect(() => {
    if (!isInView || viewedRef.current) return
    viewedRef.current = true
    trackAmplitude('pricing_section_viewed', { location: 'home' })
    if (posthog.__loaded) {
      posthog.capture('pricing_section_viewed', { location: 'home' })
    }
  }, [isInView])

  // Promo flash
  const [flashPromo, setFlashPromo] = useState<{ deadline: number; plan: PlanId; promoMonthly: number; baseMonthly: number } | null>(null)
  const [flashPromoLeft, setFlashPromoLeft] = useState<string | null>(null)
  useEffect(() => {
    let cancelled = false
    fetchFlashPromo().then((status) => {
      if (cancelled || !status || status.expired) return
      setFlashPromo({
        deadline: new Date(status.deadline).getTime(),
        plan: status.promo.plan as PlanId,
        promoMonthly: status.promo.promoMonthly,
        baseMonthly: status.promo.baseMonthly,
      })
    })
    return () => { cancelled = true }
  }, [])
  useEffect(() => {
    if (!flashPromo) return
    const tick = () => {
      const remaining = flashPromo.deadline - Date.now()
      if (remaining <= 0) { setFlashPromo(null); setFlashPromoLeft(null); return }
      setFlashPromoLeft(formatCountdown(remaining))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [flashPromo])
  const promoOn = !!flashPromo && !!flashPromoLeft

  const promoAutoSelected = useRef(false)
  useEffect(() => {
    if (flashPromo && !promoAutoSelected.current) {
      promoAutoSelected.current = true
      setSelectedTier(flashPromo.plan as PlanId)
    }
  }, [flashPromo])

  const planBase = (p: Plan) => (promoOn && flashPromo && p.id === flashPromo.plan ? flashPromo.promoMonthly : p.price)

  // Dropdown
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Computed prices for card 2
  const plan = PLANS.find(p => p.id === selectedTier)!
  const isPromoPlan = promoOn && !!flashPromo && plan.id === flashPromo.plan
  const monthly = finalPrice(planBase(plan), billing, seats)
  const discount = combinedDiscount(billing, seats)
  const discountPct = Math.round(discount * 100)

  // Done-for-you is application-only: no self-serve pricing.
  if (autopilot) return null

  return (
    <section ref={ref} id="pricing" className="relative w-full py-20 md:py-28 bg-[#0a0a0a]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
            {fr ? 'Choisissez votre rythme' : 'Choose your pace'}
          </h2>
          <p className="mt-4 text-neutral-400">
            {fr
              ? 'Même système, trois volumes. Lives et communauté dès Intermédiaire.'
              : 'Same system, three volumes. Lives and community from Intermediate.'}
          </p>

          {/* Promo flash */}
          {promoOn && flashPromo && flashPromoLeft && (
            <div className="mt-8 flex justify-center">
              <div className="relative overflow-hidden rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-500/[0.12] via-orange-500/[0.08] to-red-500/[0.12] px-6 py-4 shadow-[0_0_30px_rgb(239_68_68_/_0.15)]">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvc3ZnPg==')] opacity-50" />
                <div className="relative flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
                  <span className="text-2xl">🔥</span>
                  <div className="text-center sm:text-left">
                    <p className="text-base font-bold text-white">
                      {fr
                        ? `Offre flash : ${flashPromo.promoMonthly}€/mois à vie au lieu de ${flashPromo.baseMonthly}€`
                        : `Flash deal: €${flashPromo.promoMonthly}/mo forever instead of €${flashPromo.baseMonthly}`}
                    </p>
                    <p className="text-sm text-neutral-300">
                      {fr
                        ? `Pack ${PLAN_LABELS[flashPromo.plan].fr} · ${getPlan(flashPromo.plan).sessions} sessions/mois`
                        : `${PLAN_LABELS[flashPromo.plan].en} pack · ${getPlan(flashPromo.plan).sessions} sessions/mo`}
                    </p>
                  </div>
                  <div className="flex flex-col items-center rounded-xl border border-red-500/30 bg-black/30 px-4 py-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-red-300">{fr ? 'Expire dans' : 'Expires in'}</span>
                    <span className="font-mono text-xl font-bold tabular-nums text-red-400">{flashPromoLeft}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <div className="mt-10 max-w-xl mx-auto">

          {/* ── Créez votre marque - the only self-serve offer ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className={`rounded-2xl p-6 lg:p-8 flex flex-col ${isPromoPlan ? 'border border-red-500/40 bg-white/[0.03]' : 'border border-empire/50 bg-white/[0.03]'}`}
          >
            {isPromoPlan && (
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-400">
                {fr ? 'Offre flash - prix à vie' : 'Flash deal - price locked forever'}
              </span>
            )}
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">{fr ? 'Créez votre marque' : 'Build your brand'}</h3>
              <span className="rounded-full bg-empire/15 border border-empire/30 px-2.5 py-0.5 text-[10px] font-bold text-empire uppercase tracking-wider">
                {fr ? 'Populaire' : 'Popular'}
              </span>
            </div>
            <p className="mt-1 text-sm text-neutral-400">
              {fr ? 'On le fait avec vous' : 'We do it with you'}
            </p>

            {/* Billing period */}
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
              {fr ? 'Facturation' : 'Billing'}
            </p>
            <div className="mt-2 flex rounded-xl border border-white/10 bg-neutral-900 p-1">
              {BILLING_PERIODS.map((p) => {
                const active = p.id === billing
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setBilling(p.id)}
                    aria-pressed={active}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[12px] font-semibold transition-colors ${
                      active ? 'bg-empire text-black' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {fr ? p.labelFr : p.labelEn}
                    {p.discount > 0 && (
                      <span className={active ? 'text-black/70' : 'text-empire'}>
                        -{Math.round(p.discount * 100)}%
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Volume dropdown */}
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
              {fr ? 'Votre niveau' : 'Your level'}
            </p>
            <div ref={dropRef} className="relative mt-2">
              <button
                type="button"
                onClick={() => setDropOpen(o => !o)}
                className={`flex w-full items-center justify-between rounded-xl border bg-neutral-900 px-4 py-3 text-left text-sm font-semibold text-white transition-colors hover:border-empire/40 ${isPromoPlan ? 'border-red-500/30' : 'border-white/10'}`}
              >
                <span className="truncate">
                  {fr
                    ? `${PLAN_LABELS[selectedTier].fr} · ${plan.sessions} sessions/mois`
                    : `${PLAN_LABELS[selectedTier].en} · ${plan.sessions} sessions/mo`}
                </span>
                <ChevronDown size={16} className={`shrink-0 ml-2 text-neutral-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropOpen && (
                <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-2xl">
                  {PLANS.map((p) => {
                    const active = p.id === selectedTier
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => { setSelectedTier(p.id); setDropOpen(false) }}
                        className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors ${active ? 'bg-empire/10 text-white' : 'text-neutral-300 hover:bg-white/5'}`}
                      >
                        <span className="font-semibold">
                          {fr
                            ? `${PLAN_LABELS[p.id].fr} · ${p.sessions} sessions/mois`
                            : `${PLAN_LABELS[p.id].en} · ${p.sessions} sessions/mo`}
                        </span>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="font-bold tabular-nums">{finalPrice(planBase(p), billing, seats)}€<span className="text-xs font-normal text-neutral-500">{fr ? '/mois' : '/mo'}</span></span>
                          {p.highlighted && <span className="rounded-full bg-empire/15 px-2 py-0.5 text-[10px] font-bold text-empire">{fr ? 'Populaire' : 'Popular'}</span>}
                          {active && <Check size={14} className="text-empire" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Multi-seat toggle */}
            {!showSeats ? (
              <button
                type="button"
                onClick={() => { setShowSeats(true); setSeats(2) }}
                className="mt-3 text-[12px] text-empire font-semibold hover:underline text-left"
              >
                {fr ? 'Besoin de plusieurs places ?' : 'Need multiple seats?'}
              </button>
            ) : (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  {fr ? 'Places' : 'Seats'}
                </span>
                <button
                  type="button"
                  onClick={() => { const n = Math.max(1, seats - 1); setSeats(n); if (n === 1) setShowSeats(false) }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition-colors hover:border-empire/50"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-lg font-bold tabular-nums">{seats}</span>
                <button
                  type="button"
                  onClick={() => setSeats(s => Math.min(20, s + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition-colors hover:border-empire/50"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}

            {/* Price */}
            <div className="mt-4 flex flex-wrap items-baseline gap-2">
              {(discountPct > 0 || isPromoPlan) && (
                <span className="text-lg text-neutral-600 line-through tabular-nums">{isPromoPlan ? flashPromo!.baseMonthly : plan.price}€</span>
              )}
              <span className="text-4xl font-extrabold tabular-nums">{monthly}€</span>
              <span className="text-sm text-neutral-400">{seats > 1 ? (fr ? '/place/mois' : '/seat/mo') : (fr ? '/mois' : '/mo')}</span>
              {discountPct > 0 && (
                <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-bold text-green-400">-{discountPct}%</span>
              )}
              {isPromoPlan && flashPromoLeft && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/15 px-3 py-1">
                  <span className="font-mono text-sm font-bold tabular-nums text-red-400">{flashPromoLeft}</span>
                </span>
              )}
            </div>
            {seats > 1 && (
              <p className="mt-1 text-[11px] text-neutral-500">
                {fr
                  ? `≈ ${(monthly * seats).toLocaleString('fr-FR')}€/mois au total pour ${seats} places`
                  : `≈ €${(monthly * seats).toLocaleString('en-US')}/mo total for ${seats} seats`}
              </p>
            )}
            {billing !== 'monthly' && seats <= 1 && (
              <p className="mt-1 text-[11px] text-neutral-500">
                {fr ? `Facturé ${(monthly * (billing === 'quarterly' ? 3 : 12)).toLocaleString('fr-FR')}€${billing === 'quarterly' ? '/trim' : '/an'}` : `Billed €${(monthly * (billing === 'quarterly' ? 3 : 12)).toLocaleString('en-US')}${billing === 'quarterly' ? '/qtr' : '/yr'}`}
              </p>
            )}

            <div className="my-5 h-px bg-white/10" />

            {/* What this pack gets you */}
            <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 mb-3">
              {fr ? 'Dans ce pack' : 'In this pack'}
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-[13px] text-neutral-300">
                <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                {fr
                  ? `${plan.sessions} sessions d'enregistrement par mois`
                  : `${plan.sessions} recording sessions per month`}
              </li>
              <li className="flex items-start gap-2 text-[13px] text-neutral-300">
                <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                {fr
                  ? `${plan.rhythmFr} - soit environ ${plan.contents} contenus par mois`
                  : `${plan.rhythmEn} - about ${plan.contents} pieces per month`}
              </li>
              {PLAN_FEATURES[selectedTier].map((f) => (
                <li
                  key={f.en}
                  className={`flex items-start gap-2 text-[13px] ${f.on === false ? 'text-neutral-600' : 'text-neutral-300'}`}
                >
                  {f.on === false
                    ? <Minus size={14} className="mt-0.5 shrink-0" />
                    : <Check size={14} className="mt-0.5 shrink-0 text-empire" />}
                  {fr ? f.fr : f.en}
                </li>
              ))}
              {seats > 1 && (
                <>
                  <li className="flex items-start gap-2 text-[13px] text-neutral-300">
                    <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                    {fr ? 'Chaque place : son calendrier et son volume de contenus' : 'Each seat: its own calendar and content volume'}
                  </li>
                  <li className="flex items-start gap-2 text-[13px] text-neutral-300">
                    <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                    {fr ? 'Account manager dédié' : 'Dedicated account manager'}
                  </li>
                  <li className="flex items-start gap-2 text-[13px] text-neutral-300">
                    <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                    {fr ? 'Onboarding personnalisé et facturation sur mesure' : 'Personalized onboarding and custom billing'}
                  </li>
                </>
              )}
            </ul>

            <a
              href={planUrl(plan.id, billing, seats)}
              onClick={() => {
                const props = { plan: plan.id, billing_period: billing, seats, price_monthly: monthly, location: 'home' }
                trackAmplitude('pricing_plan_click', props)
                if (posthog.__loaded) posthog.capture('pricing_plan_click', props, { transport: 'sendBeacon' })
              }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-empire px-4 py-3.5 text-center text-sm font-bold text-black transition-all hover:brightness-110"
            >
              {fr ? 'Démarrer l\u2019essai gratuit' : 'Start free trial'}
            </a>
            <p className="mt-2 text-center text-[11px] text-neutral-500">
              {fr ? '7 jours gratuits · Annulez en 1 clic' : '7 days free · Cancel in 1 click'}
            </p>
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
          className="mt-6"
        >
          <AllFeatures fr={fr} />
        </motion.div>

        <WhyEmpireCompact />

        <WhatHappensNext fr={fr} />

      </div>
    </section>
  )
}

/**
 * Full feature list, collapsed by default. Sits right under the price so the
 * buyer never has to leave the pricing section to know what they get.
 */
function AllFeatures({ fr }: { fr: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v)
          if (!open) trackAmplitude('pricing_features_expand', { location: 'home' })
        }}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-empire/15 text-empire">
          <Check size={16} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-white">
            {fr
              ? `Tout ce qui est inclus - ${TOTAL_FEATURES} fonctionnalités`
              : `Everything included - ${TOTAL_FEATURES} features`}
          </span>
          <span className="block text-[11px] text-neutral-500">
            {fr
              ? 'Seul le nombre de sessions change selon le pack : les 7 réseaux et tous les formats sont inclus partout. Les mentions « dès… » indiquent le pack minimum.'
              : 'Only the number of sessions changes between packs: all 7 networks and every format are included throughout. The “from…” tags mark the minimum pack.'}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 text-[12px] font-semibold text-empire">
          {open ? (fr ? 'Replier' : 'Collapse') : (fr ? 'Tout voir' : 'See all')}
          <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="features"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="grid gap-6 border-t border-white/10 p-5 md:grid-cols-3">
              {PILLARS.map((pillar) => (
                <div key={pillar.id}>
                  <div className="mb-3 flex items-center gap-2">
                    <pillar.icon size={14} className="text-empire" />
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      {fr ? pillar.labelFr : pillar.labelEn}
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {pillar.features.map((f) => (
                      <li key={f.en} className="flex items-start gap-2.5">
                        <f.icon size={14} className="mt-0.5 shrink-0 text-empire" />
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[13px] font-semibold text-white">{fr ? f.fr : f.en}</span>
                            {f.badge && (
                              <span className="rounded-full bg-empire/15 px-1.5 py-0.5 text-[9px] font-black uppercase leading-none tracking-wider text-empire">
                                {f.badge}
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 block text-[11px] leading-relaxed text-neutral-500">
                            {fr ? f.descFr : f.descEn}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Vertical timeline showing the first weeks after sign-up. */
function WhatHappensNext({ fr }: { fr: boolean }) {
  const steps = [
    { icon: UserPlus, fr: 'Créez votre compte', en: 'Create your account' },
    { icon: CalendarPlus, fr: 'Ajoutez le prochain live à votre calendrier', en: 'Add the next live to your calendar' },
    { icon: Compass, fr: 'Explorez la plateforme', en: 'Explore the platform' },
    { icon: Mic, fr: 'Enregistrez votre interview', en: 'Record your interview' },
    { icon: Send, fr: 'Publiez sur 7 réseaux et soyez omniprésent', en: 'Publish on 7 networks and be everywhere' },
    { icon: Handshake, fr: 'Recevez des RDVs et signez des clients', en: 'Get meetings and sign clients' },
  ]

  return (
    <div className="mt-12 max-w-2xl mx-auto">
      <h3 className="text-center text-xl md:text-2xl font-bold text-white">
        {fr ? 'Et ensuite, il se passe quoi ?' : 'So what happens next?'}
      </h3>

      <ol className="relative mt-8 ml-4 border-l border-empire/30 pl-0">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1
          return (
            <li key={step.en} className={`relative pl-8 ${isLast ? 'pb-0' : 'pb-6'}`}>
              {/* Dot on the timeline */}
              <span
                className={`absolute -left-[13px] top-0.5 flex h-[26px] w-[26px] items-center justify-center rounded-full ${
                  isLast
                    ? 'bg-empire text-black'
                    : 'border border-empire/40 bg-empire/15 text-empire'
                }`}
              >
                <step.icon size={13} />
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                {fr ? `Étape ${i + 1}` : `Step ${i + 1}`}
              </span>
              <span className={`block text-[14px] font-semibold ${isLast ? 'text-empire' : 'text-white'}`}>
                {fr ? step.fr : step.en}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
