'use client'

import { useState } from 'react'
import { ArrowRight, Check, Minus } from 'lucide-react'
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
const ROW_ORDER: RowId[] = ['volume', 'price', 'time', 'commitment', 'editing', 'publishing', 'tracking']

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
        price: { fr: freelance, en: freelanceEn, noteFr: moyen ? 'Même volume, au prix moyen d’un freelance' : 'Même volume, au bas des tarifs', noteEn: moyen ? 'Same volume, at an average freelancer’s price' : 'Same volume, at the low end of rates' },
        volume: { fr: 'Le même volume, avec 3 prestataires', en: 'The same volume, with 3 contractors' },
        time: { fr: 'Tu trouves les sujets, tu briefes un monteur, un rédacteur et un community manager, et tu valides', en: 'You find the topics, brief an editor, a writer and a community manager, and approve' },
        commitment: { fr: 'Selon chaque prestataire', en: 'Depends on each contractor' },
        editing: { fr: `Oui, chez un monteur : ${moyen ? '≈ ' : 'dès '}${reel} € le reel`, en: `Yes, with an editor: ${moyen ? '≈ ' : 'from '}€${reel} a reel`, ok: true },
        publishing: { fr: `Un community manager, ${cm} €/mois : 2 réseaux dans un forfait standard`, en: `A community manager, €${cm}/mo: 2 networks in a standard plan` },
        tracking: { fr: 'Un outil de liens trackés en plus, à brancher toi-même', en: 'An extra tracked-links tool, to set up yourself' },
      }
    case 'agency':
      return {
        volume: { fr: 'Le même volume, avec une agence LinkedIn et une agence vidéo', en: 'The same volume, with a LinkedIn agency and a video agency' },
        price: { fr: `≈ ${agencyTotal.toLocaleString('fr-FR')} €/mois pour le même volume`, en: `≈ €${agencyTotal.toLocaleString('en-US')}/mo for the same volume`, noteFr: `${m.posts} posts × 150 € (prix par post chez Kodo et Linker) + ${m.reels} reels × 150 € (bas du prix agence pour une vidéo courte, 150 à 400 €, cutlab.io). Seule, une agence LinkedIn démarre à 600 € pour 4 posts, sans vidéo.`, noteEn: `${m.posts} posts × €150 (per-post price at Kodo and Linker) + ${m.reels} reels × €150 (low end of agency price for a short video, €150–400, cutlab.io). On its own, a LinkedIn agency starts at €600 for 4 posts, no video.` },
        time: { fr: 'Tu passes des entretiens avec l’agence et tu valides chaque post', en: 'You do interviews with the agency and approve each post' },
        commitment: { fr: '4 à 6 mois minimum chez certaines', en: '4 to 6 months minimum at some', noteFr: 'E. Petiau : 4 mois minimum ; Linker : 6 mois renouvelables', noteEn: 'E. Petiau: 4 months minimum; Linker: 6 months renewable' },
        editing: { fr: 'Oui, chez une deuxième agence', en: 'Yes, at a second agency', ok: true },
        publishing: { fr: 'Souvent LinkedIn seulement : les autres réseaux en plus', en: 'Often LinkedIn only: other networks cost extra', ok: false },
        tracking: { fr: 'Rarement inclus', en: 'Rarely included', ok: false },
      }
    case 'diy':
      return {
        volume: { fr: 'Ce que tu arrives à tenir', en: 'Whatever you can keep up with' },
        price: { fr: '0 € de prestataire', en: '€0 in contractors', noteFr: 'Plus les outils de montage et de planification', noteEn: 'Plus editing and scheduling tools' },
        time: { fr: `≈ ${lo} à ${hi} h par semaine pour le même volume`, en: `≈ ${lo} to ${hi} hours a week for the same volume`, noteFr: 'Estimation : montage 40 min à 3 h par reel, écriture 15 min à 1 h par post', noteEn: 'Estimate: editing 40 min to 3 h per reel, writing 15 min to 1 h per post' },
        commitment: { fr: 'Aucun, sauf envers toi-même', en: 'None, except to yourself' },
        editing: { fr: 'C’est toi qui montes', en: 'You edit it', ok: false },
        publishing: { fr: 'Tu publies réseau par réseau', en: 'You publish network by network', ok: false },
        tracking: { fr: 'À mettre en place toi-même', en: 'Up to you to set up', ok: false },
      }
    case 'chatgpt':
      return {
        volume: { fr: 'Des textes, à reprendre et à publier', en: 'Texts, to rework and publish' },
        price: { fr: 'Gratuit, ou ton abonnement ChatGPT', en: 'Free, or your ChatGPT plan' },
        time: { fr: `Écrit un texte. Le reste, c’est toi : ≈ ${elo} à ${ehi} h de montage par semaine, plus la publication`, en: `Writes a text. The rest is on you: ≈ ${elo} to ${ehi} hours of editing a week, plus publishing`, noteFr: 'Estimation : montage 40 min à 3 h par reel ; tu publies sur chaque réseau toi-même', noteEn: 'Estimate: editing 40 min to 3 h per reel; you publish on each network yourself' },
        commitment: { fr: 'Aucun', en: 'None' },
        editing: { fr: 'Ne monte pas la vidéo', en: 'Doesn’t edit the video', ok: false },
        publishing: { fr: 'Ne publie pas', en: 'Doesn’t publish', ok: false },
        tracking: { fr: 'Ne te dit pas quel contenu t’amène des clients', en: 'Doesn’t tell you which content brings clients', ok: false },
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

  const empire: Record<RowId, Cell> = {
    volume: { fr: `Par exemple ${mix.reels} reels et ${mix.posts} posts, sur 7 réseaux`, en: `For example ${mix.reels} reels and ${mix.posts} posts, on 7 networks`, noteFr: 'Tu changes la répartition quand tu veux', noteEn: 'Change the split whenever you like' },
    price: { fr: `${price} €/mois`, en: `€${price}/mo`, noteFr: `Formule ${label}`, noteEn: `${label} plan` },
    commitment: { fr: 'Aucun en mensuel', en: 'None on monthly', noteFr: 'Essai 7 jours, annulable depuis l’app', noteEn: '7-day trial, cancel from the app' },
    time: { fr: '1 h par semaine : tu filmes ou tu dictes', en: '1 hour a week: you film or dictate' },
    editing: { fr: 'Inclus, chaque reel vérifié par l’équipe', en: 'Included, every reel checked by the team', ok: true },
    publishing: { fr: 'Incluse, sans supplément', en: 'Included, no extra cost', ok: true },
    tracking: { fr: 'Liens trackés : quel contenu t’a amené quel client', en: 'Tracked links: which content brought which client', ok: true },
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

      <p className="mt-5 text-center text-sm">
        <span className="mb-3 block text-xs leading-relaxed text-neutral-500">{fr ? nbsp('Heures : estimation. Montage d’un reel : 42 min en moyenne selon une enquête Epidemic Sound (reprise par voxbooster.com), 2 à 3 h selon cutlab.io. Écriture d’un post : 15 min à 1 h, sans étude publiée. Prix d’agence : pages publiques de Kodo et Linker (environ 150 € le post), et fourchette agence vidéo de cutlab.io (150 à 400 € la vidéo courte), novembre 2026.') : 'Hours: estimate. Editing a reel: 42 min on average per an Epidemic Sound survey (quoted by voxbooster.com), 2 to 3 h per cutlab.io. Writing a post: 15 min to 1 h, no published study. Agency prices: public pages of Kodo and Linker (about €150 a post), and cutlab.io’s video agency range (€150–400 per short video), November 2026.'}</span>
        <a href="/comparatif" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
          {fr ? 'Le comparatif détaillé' : 'The detailed comparison'}
          <ArrowRight className="h-4 w-4" />
        </a>
      </p>
    </div>
  )
}
