'use client'

import { useState } from 'react'
import { ArrowRight, Check, Linkedin, Video } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { APP_ONBOARDING_URL, CONTENT_CREDITS, PAYG_PACKS } from '@/lib/plans'
import { trackAmplitude, withAmplitudeDeviceId } from '@/lib/amplitude'
import {
  ORDER_CARD,
  ORDER_CARD_QUIET,
  ORDER_CHECK,
  ORDER_CTA,
  ORDER_CTA_SECONDARY,
  ORDER_LABEL,
  ORDER_PRICE,
  ORDER_SEGMENT,
  ORDER_SEGMENTS,
  ORDER_TAG,
} from '@/lib/orderStyles'

/**
 * Onglet « À l'usage » de /tarifs (29 octobre 2026), sur le modèle de l'onglet
 * API de Claude : sans abonnement, on recharge 25, 50 ou 100 € (mêmes
 * recharges que l'app, `PAYG_PACKS`). Inscription d'abord, paiement ensuite :
 * le bouton mène à l'onboarding (?intent=payg&pack=…), qui ouvre le paiement
 * de la recharge juste après la création du compte.
 */

const INCLUDED = {
  fr: ['Publication sur 7 réseaux et communauté Slack', 'Chaque action affiche son prix avant de partir', 'Les crédits n’expirent jamais', 'Recharge automatique et plafond mensuel au choix'],
  en: ['Publishing to 7 networks and the Slack community', 'Every action shows its price before it runs', 'Credits never expire', 'Auto top-up and a monthly cap you choose'],
}

type PackId = (typeof PAYG_PACKS)[number]['id']

export default function PaygCards() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [opening, setOpening] = useState<PackId | null>(null)
  // Recharge automatique : le plafond du mois, choisi avant de payer (mêmes
  // choix que l'app, PAYG_MONTHLY_CAP_CHOICES_EUR).
  const [cap, setCap] = useState(100)
  const base = PAYG_PACKS[0]

  const choose = (pack: PackId) => {
    if (opening) return
    setOpening(pack)
    trackAmplitude('pricing_page_plan_clicked', { plan: 'payg', pack, billing_period: 'payg', location: 'payg' })
    const url = new URL(APP_ONBOARDING_URL)
    url.searchParams.set('intent', 'payg')
    url.searchParams.set('pack', pack)
    url.searchParams.set('cap', String(cap))
    window.location.href = withAmplitudeDeviceId(url.toString())
  }

  const plural = (n: number) => (n > 1 ? 's' : '')

  return (
    <div className="space-y-6">
      <div className={`mx-auto max-w-3xl p-4 sm:p-5 ${ORDER_CARD_QUIET}`}>
        <p className="text-sm font-semibold text-white">{fr ? 'Recharge automatique' : 'Auto top-up'}</p>
        <p className="mt-1 text-sm leading-relaxed text-neutral-300">
          {fr
            ? `Quand ton solde est bas, ta recharge repart toute seule. Jamais plus de ${cap} € par mois : tu choisis la limite, et tu la changes quand tu veux.`
            : `When your balance runs low, your top-up runs again on its own. Never more than €${cap} a month: you choose the limit and change it anytime.`}
        </p>
        <div className={`mt-3 grid-cols-4 ${ORDER_SEGMENTS}`} role="tablist">
          {[50, 100, 200, 500].map((c) => (
            <button key={c} type="button" role="tab" aria-selected={cap === c} onClick={() => setCap(c)} className={`text-xs font-semibold ${ORDER_SEGMENT}`}>
              {c} €{fr ? '/mois' : '/mo'}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
        {PAYG_PACKS.map((pack, i) => {
          const featured = i === 0
          const reels = Math.floor(pack.credits / CONTENT_CREDITS.reel)
          const posts = Math.floor(pack.credits / CONTENT_CREDITS.post)
          const bonus = Math.round(((pack.credits / pack.euros) / (base.credits / base.euros) - 1) * 100)
          return (
            <div key={pack.id} className={`flex h-full flex-col ${featured ? ORDER_CARD : ORDER_CARD_QUIET}`}>
              <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-base font-semibold text-white">{fr ? `Recharge ${pack.euros} €` : `€${pack.euros} top-up`}</p>
                    <p className="text-sm text-neutral-300">{fr ? `${pack.credits} crédits` : `${pack.credits} credits`}</p>
                  </div>
                  {featured
                    ? <span className={`whitespace-nowrap ${ORDER_TAG}`}>{fr ? 'Sans abonnement' : 'No subscription'}</span>
                    : bonus > 0 && <span className={`whitespace-nowrap ${ORDER_TAG}`}>+{bonus} %</span>}
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-[2.75rem] ${ORDER_PRICE}`}>{pack.euros}€</span>
                    <span className="text-sm text-neutral-300">{fr ? 'une fois' : 'once'}</span>
                  </div>
                  <p className="pt-1.5 text-xs text-neutral-300">
                    {featured
                      ? (fr ? 'Pour commencer. Tu rechargeras quand tu en auras besoin.' : 'To get started. Top up whenever you need.')
                      : (fr ? `${bonus} % de crédits en plus que la recharge de ${base.euros} €.` : `${bonus}% more credits than the €${base.euros} top-up.`)}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className={ORDER_LABEL}>{fr ? 'Au choix, jusqu’à' : 'Your pick, up to'}</p>
                  <p className="flex items-center gap-2 text-sm font-medium text-white">
                    <Video className="h-4 w-4 shrink-0 text-neutral-300" />
                    {fr ? `${reels} reel${plural(reels)} monté${plural(reels)}` : `${reels} edited reel${plural(reels)}`}
                  </p>
                  <p className="flex items-center gap-2 text-sm font-medium text-white">
                    <Linkedin className="h-4 w-4 shrink-0 text-neutral-300" />
                    {fr ? `ou ${posts} post${plural(posts)} LinkedIn` : `or ${posts} LinkedIn post${plural(posts)}`}
                  </p>
                </div>
                <button type="button" onClick={() => choose(pack.id)} disabled={opening !== null} className={`mt-auto ${featured ? ORDER_CTA : ORDER_CTA_SECONDARY}`}>
                  {opening === pack.id ? (fr ? 'Ouverture…' : 'Opening…') : (
                    <>
                      {fr ? `Recharger ${pack.euros} €` : `Top up €${pack.euros}`}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs">
        <span className="font-semibold text-white">{fr ? 'À l’usage :' : 'Pay as you go:'}</span>
        {INCLUDED[fr ? 'fr' : 'en'].map((item) => (
          <span key={item} className="inline-flex items-center gap-1 text-neutral-300">
            <Check className={ORDER_CHECK} />
            {item}
          </span>
        ))}
        <span className="text-neutral-300">{fr ? 'Le live et les replays restent réservés aux abonnés.' : 'The live and replays stay for subscribers.'}</span>
      </div>
    </div>
  )
}
