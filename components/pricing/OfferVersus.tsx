'use client'

import { useState } from 'react'
import { ArrowRight, Check, ChevronDown, Minus } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { FREELANCE_MODE, FREELANCE_PRICES, PLAN_LABELS, freelanceMonthly, planMix, type PlanId } from '@/lib/plans'
import { freelanceAmount } from './freelanceCopy'
import glass from './pricing.module.css'
import { nbsp } from './typo'

/**
 * « Empire contre… » : une alternative à la fois (pastilles), deux colonnes
 * par ligne, sans défilement horizontal sur téléphone. Les valeurs sont des
 * faits : le total freelance est celui du reçu (même calcul, même mode), les
 * prix d'agence sont des prix publics, et les heures « toi seul » sont une
 * estimation sourcée (montage 40 min à 3 h par reel), dite comme telle.
 */

// Estimation du temps « toi seul », par contenu. Montage : 42 min en moyenne
// selon une enquête Epidemic Sound reprise par voxbooster.com, 2 à 3 h selon
// cutlab.io. Écriture d'un post : 15 min à 1 h (estimation, pas d'étude).
const DIY_HOURS = { reel: [0.7, 3], post: [0.25, 1] } as const
function diyWeekly(plan: PlanId): [number, number] {
  const m = planMix(plan)
  const lo = (m.reels * DIY_HOURS.reel[0] + m.posts * DIY_HOURS.post[0]) / 4.33
  const hi = (m.reels * DIY_HOURS.reel[1] + m.posts * DIY_HOURS.post[1]) / 4.33
  return [Math.max(1, Math.round(lo)), Math.round(hi)]
}
// Avec ChatGPT pour écrire, il reste au moins le montage.
function editingWeekly(plan: PlanId): [number, number] {
  const m = planMix(plan)
  return [Math.max(1, Math.round((m.reels * DIY_HOURS.reel[0]) / 4.33)), Math.round((m.reels * DIY_HOURS.reel[1]) / 4.33)]
}

type Alt = 'freelance' | 'agency' | 'diy' | 'chatgpt'
type Cell = { fr: string; en: string; noteFr?: string; noteEn?: string; ok?: boolean }
type RowId = 'volume' | 'price' | 'time' | 'commitment' | 'editing' | 'publishing' | 'tracking'

const ROW_LABELS: Record<RowId, { fr: string; en: string }> = {
  volume: { fr: 'Chaque mois', en: 'Every month' },
  commitment: { fr: 'Engagement', en: 'Commitment' },
  price: { fr: 'Prix par mois', en: 'Price per month' },
  time: { fr: 'Ton temps', en: 'Your time' },
  editing: { fr: 'Montage vidéo', en: 'Video editing' },
  publishing: { fr: 'Publication sur 7 réseaux', en: 'Publishing to 7 networks' },
  tracking: { fr: 'Suivi des clients', en: 'Client tracking' },
}
const ROW_ORDER: RowId[] = ['price', 'time', 'commitment', 'editing', 'publishing', 'tracking']

const ALTS: { id: Alt; chipFr: string; chipEn: string; colFr: string; colEn: string }[] = [
  { id: 'freelance', chipFr: 'Des freelances', chipEn: 'Freelancers', colFr: 'Freelances', colEn: 'Freelancers' },
  { id: 'agency', chipFr: 'Une agence', chipEn: 'An agency', colFr: 'Agence', colEn: 'Agency' },
  { id: 'diy', chipFr: 'Tout faire toi-même', chipEn: 'Doing it all yourself', colFr: 'Toi seul', colEn: 'On your own' },
  { id: 'chatgpt', chipFr: 'ChatGPT', chipEn: 'ChatGPT', colFr: 'ChatGPT', colEn: 'ChatGPT' },
]

function altCells(alt: Alt, freelance: string, freelanceEn: string, plan: PlanId): Record<RowId, Cell> {
  const [lo, hi] = diyWeekly(plan)
  const [elo, ehi] = editingWeekly(plan)
  const m = planMix(plan)
  const agencyTotal = Math.round((m.posts * 150 + m.reels * 150) / 100) * 100
  const reel = FREELANCE_PRICES.reel[FREELANCE_MODE]
  const cm = FREELANCE_PRICES.communityManager[FREELANCE_MODE]
  const moyen = FREELANCE_MODE === 'moyen'
  switch (alt) {
    case 'freelance':
      return {
        price: { fr: freelance, en: freelanceEn, noteFr: moyen ? 'Même volume, prix moyen d’un freelance' : 'Même volume, bas des tarifs', noteEn: moyen ? 'Same volume, average freelance price' : 'Same volume, low end of rates' },
        volume: { fr: 'Le même volume de contenus, avec 3 prestataires', en: 'The same content volume, with 3 contractors' },
        time: { fr: '3 à 5 h par semaine', en: '3 to 5 hours a week', noteFr: 'Tu briefes 3 prestataires et tu valides chaque livrable', noteEn: 'You brief 3 contractors and approve each deliverable' },
        commitment: { fr: 'Selon chaque prestataire', en: 'Depends on each contractor' },
        editing: { fr: `${moyen ? '≈ ' : 'Dès '}${reel} € le reel`, en: `${moyen ? '≈ ' : 'From '}€${reel} a reel`, ok: true },
        publishing: { fr: `2 réseaux (CM, ${cm} €/mois)`, en: `2 networks (CM, €${cm}/mo)`, ok: false },
        tracking: { fr: 'Outil en plus, à brancher', en: 'Extra tool, to set up', ok: false },
      }
    case 'agency':
      return {
        volume: { fr: 'Le même volume de contenus, avec une agence LinkedIn et une agence vidéo', en: 'The same content volume, with a LinkedIn agency and a video agency' },
        price: { fr: `≈ ${agencyTotal.toLocaleString('fr-FR')} €/mois`, en: `≈ €${agencyTotal.toLocaleString('en-US')}/mo`, noteFr: `Pour le même volume : ${m.posts} posts × 150 € (Kodo, Linker) + ${m.reels} vidéos courtes × 150 € (cutlab.io, bas du prix agence). Seule, une agence LinkedIn démarre à 600 € pour 4 posts, sans vidéo.`, noteEn: `For the same volume: ${m.posts} posts × €150 (Kodo, Linker) + ${m.reels} short videos × €150 (cutlab.io, low end of agency price). On its own, a LinkedIn agency starts at €600 for 4 posts, no video.` },
        time: { fr: 'Entretiens + validation', en: 'Interviews + approvals' },
        commitment: { fr: '4 à 6 mois minimum', en: '4 to 6 months minimum', noteFr: 'E. Petiau : 4 mois ; Linker : 6 mois renouvelables', noteEn: 'E. Petiau: 4 months; Linker: 6 months renewable' },
        editing: { fr: 'Chez une 2ᵉ agence', en: 'At a 2nd agency', ok: true },
        publishing: { fr: 'LinkedIn seulement', en: 'LinkedIn only', ok: false },
        tracking: { fr: 'Non inclus', en: 'Not included', ok: false },
      }
    case 'diy':
      return {
        volume: { fr: 'Ce que tu arrives à tenir', en: 'Whatever you can keep up with' },
        price: { fr: '0 €', en: '€0', noteFr: 'Plus les outils de montage et de planification', noteEn: 'Plus editing and scheduling tools' },
        time: { fr: `${lo} à ${hi} h par semaine`, en: `${lo} to ${hi} hours a week`, noteFr: 'Estimation : montage 40 min à 3 h par vidéo, écriture 15 min à 1 h par texte', noteEn: 'Estimate: editing 40 min to 3 h per video, writing 15 min to 1 h per text' },
        commitment: { fr: 'Aucun', en: 'None' },
        editing: { fr: 'À toi', en: 'On you', ok: false },
        publishing: { fr: 'Réseau par réseau', en: 'Network by network', ok: false },
        tracking: { fr: 'À toi', en: 'On you', ok: false },
      }
    case 'chatgpt':
      return {
        volume: { fr: 'Des textes, à reprendre et à publier', en: 'Texts, to rework and publish' },
        price: { fr: 'Gratuit', en: 'Free', noteFr: 'Ou ton abonnement ChatGPT', noteEn: 'Or your ChatGPT plan' },
        time: { fr: `${elo} à ${ehi} h par semaine`, en: `${elo} to ${ehi} hours a week`, noteFr: 'Écrit un texte. Le montage et la publication restent à ta charge.', noteEn: 'Writes a text. Editing and publishing are still on you.' },
        commitment: { fr: 'Aucun', en: 'None' },
        editing: { fr: 'Ne monte pas', en: 'Doesn’t edit', ok: false },
        publishing: { fr: 'Ne publie pas', en: 'Doesn’t publish', ok: false },
        tracking: { fr: 'Non', en: 'No', ok: false },
      }
  }
}

export default function OfferVersus({ plan, price }: { plan: PlanId; price: number }) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const locale = fr ? 'fr-FR' : 'en-US'
  const [alt, setAlt] = useState<Alt>('freelance')
  const t = (f: string, e: string) => (fr ? nbsp(f) : e)
  const freelance = freelanceMonthly(plan)
  const label = PLAN_LABELS[plan][fr ? 'fr' : 'en']
  const current = ALTS.find((a) => a.id === alt)!
  const cells = altCells(alt, freelanceAmount(freelance, true), freelanceAmount(freelance, false), plan)
  const mix = planMix(plan)

  const empireTotal = mix.reels + mix.posts
  const empire: Record<RowId, Cell> = {
    volume: { fr: `Jusqu’à ${empireTotal} contenus par mois (LinkedIn, Instagram, YouTube, TikTok, Threads, X, Facebook) + ta newsletter`, en: `Up to ${empireTotal} pieces of content a month (LinkedIn, Instagram, YouTube, TikTok, Threads, X, Facebook) + your newsletter`, noteFr: 'Vidéos, posts ou newsletters : tu changes la répartition quand tu veux', noteEn: 'Videos, posts or newsletters: change the split whenever you like' },
    price: { fr: `${price} €/mois`, en: `€${price}/mo`, noteFr: `Formule ${label}`, noteEn: `${label} plan` },
    commitment: { fr: 'Aucun', en: 'None', noteFr: 'Essai 7 jours, annulable depuis l’app', noteEn: '7-day trial, cancel from the app' },
    time: { fr: '1 h par semaine', en: '1 hour a week', noteFr: 'Tu filmes ou tu dictes', noteEn: 'You film or dictate' },
    editing: { fr: 'Inclus', en: 'Included', ok: true },
    publishing: { fr: 'Incluse sur 7 réseaux', en: 'Included, 7 networks', ok: true },
    tracking: { fr: 'Liens trackés inclus', en: 'Tracked links included', ok: true },
  }

  const cell = (c: Cell, side: 'empire' | 'alt') => (
    <div className={`flex min-w-0 items-start gap-2 ${side === 'empire' ? 'text-white' : 'text-neutral-400'}`}>
      {c.ok === true && <Check className={`mt-[3px] h-3.5 w-3.5 shrink-0 ${side === 'empire' ? 'text-empire' : 'text-neutral-400'}`} strokeWidth={3} />}
      {c.ok === false && <Minus className="mt-[3px] h-3.5 w-3.5 shrink-0 text-neutral-600" strokeWidth={3} />}
      <div className="min-w-0">
        <p className={`text-[14px] leading-snug [overflow-wrap:anywhere] md:text-[15px] ${side === 'empire' ? 'font-medium' : ''}`}>{t(c.fr, c.en)}</p>
        {(c.noteFr || c.noteEn) && <p className="mt-1 text-xs leading-snug text-neutral-500">{t(c.noteFr ?? '', c.noteEn ?? '')}</p>}
      </div>
    </div>
  )

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label={fr ? 'Comparer avec' : 'Compare with'}>
        {ALTS.map((a) => (
          <button
            key={a.id}
            type="button"
            role="tab"
            aria-selected={a.id === alt}
            aria-controls="empire-contre"
            onClick={() => setAlt(a.id)}
            className={`min-h-11 cursor-pointer rounded-full border px-4 text-[14px] font-semibold transition ${a.id === alt ? 'border-white/25 bg-white text-black' : 'border-white/10 bg-[#111] text-neutral-300 hover:border-white/25 hover:text-white'}`}
          >
            {fr ? a.chipFr : a.chipEn}
          </button>
        ))}
      </div>

      <div id="empire-contre" role="tabpanel" className={`mt-6 overflow-hidden ${glass.panel}`}>
        <div className="grid grid-cols-2 gap-4 border-b border-white/10 px-4 py-4 sm:px-6 md:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)]">
          <span className="hidden md:block" />
          <p className="text-[15px] font-bold text-empire">Empire</p>
          <p className="text-[15px] font-bold text-neutral-300">{fr ? current.colFr : current.colEn}</p>
        </div>
        {ROW_ORDER.map((id) => (
          <div key={id} className="border-b border-white/10 px-4 py-3.5 last:border-0 sm:px-6 md:grid md:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)] md:gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 md:pt-1 md:text-xs md:normal-case md:tracking-normal md:text-neutral-400">{fr ? ROW_LABELS[id].fr : ROW_LABELS[id].en}</p>
            <div className="mt-2 grid grid-cols-2 gap-4 md:contents">
              {cell(empire[id], 'empire')}
              {cell(cells[id], 'alt')}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 text-center text-sm">
        <details className="group mx-auto mb-4 max-w-xl text-left">
          <summary className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-neutral-400 underline decoration-white/15 decoration-dotted underline-offset-[3px] hover:text-white hover:decoration-white/40">
            {fr ? 'Sources' : 'Sources'}
            <ChevronDown className="h-3 w-3 transition group-open:rotate-180" />
          </summary>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500">{fr ? nbsp('Heures : estimation. Montage d’un reel : 42 min en moyenne selon une enquête Epidemic Sound (reprise par voxbooster.com), 2 à 3 h selon cutlab.io. Écriture d’un post : 15 min à 1 h, sans étude publiée. Prix d’agence : pages publiques de Kodo et Linker (environ 150 € le post), et fourchette agence vidéo de cutlab.io (150 à 400 € la vidéo courte), novembre 2026.') : 'Hours: estimate. Editing a reel: 42 min on average per an Epidemic Sound survey (quoted by voxbooster.com), 2 to 3 h per cutlab.io. Writing a post: 15 min to 1 h, no published study. Agency prices: public pages of Kodo and Linker (about €150 a post), and cutlab.io’s video agency range (€150–400 per short video), November 2026.'}</p>
        </details>
        <a href="/comparatif" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
          {fr ? 'Le comparatif détaillé' : 'The detailed comparison'}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}
