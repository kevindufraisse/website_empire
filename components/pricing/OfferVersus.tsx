'use client'

import { useState } from 'react'
import { ArrowRight, Check, Minus } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { FREELANCE_MODE, FREELANCE_PRICES, PLAN_LABELS, freelanceMonthly, type PlanId } from '@/lib/plans'
import { freelanceAmount } from './freelanceCopy'
import glass from './pricing.module.css'
import { nbsp } from './typo'

/**
 * « Empire contre… » : une alternative à la fois (pastilles), deux colonnes
 * par ligne, sans défilement horizontal sur téléphone. Les valeurs sont des
 * faits : le total freelance est celui du reçu (même calcul, même mode), le
 * prix agence est un prix public, et rien n'est inventé en heures.
 */

type Alt = 'freelance' | 'agency' | 'diy' | 'chatgpt'
type Cell = { fr: string; en: string; noteFr?: string; noteEn?: string; ok?: boolean }
type RowId = 'price' | 'time' | 'editing' | 'publishing' | 'tracking'

const ROW_LABELS: Record<RowId, { fr: string; en: string }> = {
  price: { fr: 'Prix par mois', en: 'Price per month' },
  time: { fr: 'Ton temps', en: 'Your time' },
  editing: { fr: 'Montage vidéo', en: 'Video editing' },
  publishing: { fr: 'Publication sur 7 réseaux', en: 'Publishing to 7 networks' },
  tracking: { fr: 'Suivi des clients', en: 'Client tracking' },
}
const ROW_ORDER: RowId[] = ['price', 'time', 'editing', 'publishing', 'tracking']

const ALTS: { id: Alt; chipFr: string; chipEn: string; colFr: string; colEn: string }[] = [
  { id: 'freelance', chipFr: 'Des freelances', chipEn: 'Freelancers', colFr: 'Freelances', colEn: 'Freelancers' },
  { id: 'agency', chipFr: 'Une agence', chipEn: 'An agency', colFr: 'Agence', colEn: 'Agency' },
  { id: 'diy', chipFr: 'Tout faire toi-même', chipEn: 'Doing it all yourself', colFr: 'Toi seul', colEn: 'On your own' },
  { id: 'chatgpt', chipFr: 'ChatGPT', chipEn: 'ChatGPT', colFr: 'ChatGPT', colEn: 'ChatGPT' },
]

function altCells(alt: Alt, freelance: string, freelanceEn: string): Record<RowId, Cell> {
  const reel = FREELANCE_PRICES.reel[FREELANCE_MODE]
  const cm = FREELANCE_PRICES.communityManager[FREELANCE_MODE]
  const moyen = FREELANCE_MODE === 'moyen'
  switch (alt) {
    case 'freelance':
      return {
        price: { fr: freelance, en: freelanceEn, noteFr: moyen ? 'Même volume, au prix moyen d’un freelance' : 'Même volume, au bas des tarifs', noteEn: moyen ? 'Same volume, at an average freelancer’s price' : 'Same volume, at the low end of rates' },
        time: { fr: 'Tu trouves les sujets, tu briefes et tu coordonnes', en: 'You find the topics, brief everyone and coordinate' },
        editing: { fr: `Oui, chez un monteur : ${moyen ? '≈ ' : 'dès '}${reel} € le reel`, en: `Yes, with an editor: ${moyen ? '≈ ' : 'from '}€${reel} a reel`, ok: true },
        publishing: { fr: `Un community manager, ${cm} €/mois : 2 réseaux dans un forfait standard`, en: `A community manager, €${cm}/mo: 2 networks in a standard plan` },
        tracking: { fr: 'Un outil de liens trackés en plus, à brancher toi-même', en: 'An extra tracked-links tool, to set up yourself' },
      }
    case 'agency':
      return {
        price: { fr: 'À partir de 600 €/mois pour 4 posts LinkedIn', en: 'From €600/mo for 4 LinkedIn posts', noteFr: 'Prix public d’une agence de ghostwriting LinkedIn (kodomedia.fr, novembre 2026)', noteEn: 'Public price of a LinkedIn ghostwriting agency (kodomedia.fr, November 2026)' },
        time: { fr: 'Tu briefes l’agence et tu valides', en: 'You brief the agency and approve' },
        editing: { fr: 'Pas dans ce prix', en: 'Not in that price', ok: false },
        publishing: { fr: 'LinkedIn seulement, dans ce prix', en: 'LinkedIn only, in that price', ok: false },
        tracking: { fr: 'Pas dans ce prix', en: 'Not in that price', ok: false },
      }
    case 'diy':
      return {
        price: { fr: '0 € de prestataire', en: '€0 in contractors' },
        time: { fr: 'Tu écris, tu montes et tu publies toi-même', en: 'You write, edit and publish yourself' },
        editing: { fr: 'C’est toi qui montes', en: 'You edit it', ok: false },
        publishing: { fr: 'Tu publies réseau par réseau', en: 'You publish network by network', ok: false },
        tracking: { fr: 'À mettre en place toi-même', en: 'Up to you to set up', ok: false },
      }
    case 'chatgpt':
      return {
        price: { fr: 'Gratuit, ou ton abonnement ChatGPT', en: 'Free, or your ChatGPT plan' },
        time: { fr: 'Écrit un texte. Le reste, c’est toi.', en: 'Writes a text. The rest is on you.' },
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
  const cells = altCells(alt, freelanceAmount(freelance, true), freelanceAmount(freelance, false))

  const empire: Record<RowId, Cell> = {
    price: { fr: `${price} €/mois`, en: `€${price}/mo`, noteFr: `Formule ${label}`, noteEn: `${label} plan` },
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
        <a href="/comparatif" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
          {fr ? 'Le comparatif détaillé' : 'The detailed comparison'}
          <ArrowRight className="h-4 w-4" />
        </a>
      </p>
    </div>
  )
}
