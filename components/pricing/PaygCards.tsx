'use client'

import { useState } from 'react'
import { ArrowRight, Check, Linkedin, Video } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { APP_JOIN_URL, CONTENT_CREDITS, PAYG_PACKS, PAYG_RECHARGE } from '@/lib/plans'
import { trackAmplitude, withAmplitudeDeviceId } from '@/lib/amplitude'
import {
  ORDER_CARD,
  ORDER_CARD_QUIET,
  ORDER_CHECK,
  ORDER_CTA,
  ORDER_CTA_SECONDARY,
  ORDER_LABEL,
  ORDER_PRICE,
  ORDER_TAG,
} from '@/lib/orderStyles'

/**
 * Onglet « À l'usage » de /tarifs (29 octobre 2026), sur le modèle de l'onglet
 * API de Claude : sans abonnement, on enregistre sa carte (0 € aujourd'hui) ou
 * on recharge. Mêmes recharges que l'app (`PAYG_PACKS`).
 */

const INCLUDED = {
  fr: ['Publication sur 7 réseaux et communauté Slack', 'Chaque action affiche son prix avant de partir', 'Les crédits n’expirent jamais', 'Un plafond mensuel que tu choisis'],
  en: ['Publishing to 7 networks and the Slack community', 'Every action shows its price before it runs', 'Credits never expire', 'A monthly cap you choose'],
}

type Choice = 'payg_start' | (typeof PAYG_PACKS)[number]['id']

export default function PaygCards() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [opening, setOpening] = useState<Choice | null>(null)
  const larger = PAYG_PACKS.filter((p) => p.euros > PAYG_RECHARGE.euros)

  const choose = (pack: Choice) => {
    if (opening) return
    setOpening(pack)
    trackAmplitude('pricing_page_plan_clicked', { plan: 'payg', pack, billing_period: 'payg', location: 'payg' })
    const url = new URL(APP_JOIN_URL)
    url.searchParams.set('plan', 'payg')
    url.searchParams.set('pack', pack)
    window.location.href = withAmplitudeDeviceId(url.toString())
  }

  const yields = (credits: number) => {
    const reels = Math.floor(credits / CONTENT_CREDITS.reel)
    const posts = Math.floor(credits / CONTENT_CREDITS.post)
    const s = (n: number) => (n > 1 ? 's' : '')
    return (
    <div className="space-y-1.5">
      <p className={ORDER_LABEL}>{fr ? 'Au choix, jusqu’à' : 'Your pick, up to'}</p>
      <p className="flex items-center gap-2 text-sm font-medium text-white">
        <Video className="h-4 w-4 shrink-0 text-neutral-300" />
        {fr ? `${reels} reel${s(reels)} monté${s(reels)}` : `${reels} edited reel${s(reels)}`}
      </p>
      <p className="flex items-center gap-2 text-sm font-medium text-white">
        <Linkedin className="h-4 w-4 shrink-0 text-neutral-300" />
        {fr ? `ou ${posts} post${s(posts)} LinkedIn` : `or ${posts} LinkedIn post${s(posts)}`}
      </p>
    </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
        <div className={`flex h-full flex-col ${ORDER_CARD}`}>
          <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-base font-semibold text-white">{fr ? 'Démarrer' : 'Start'}</p>
                <p className="text-sm text-neutral-300">{fr ? 'Tu enregistres ta carte' : 'Save your card'}</p>
              </div>
              <span className={`whitespace-nowrap ${ORDER_TAG}`}>{fr ? 'Sans abonnement' : 'No subscription'}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className={`text-[2.75rem] ${ORDER_PRICE}`}>0€</span>
                <span className="text-sm text-neutral-300">{fr ? 'aujourd’hui' : 'today'}</span>
              </div>
              <p className="pt-1.5 text-xs text-neutral-300">
                {fr
                  ? `Puis ${PAYG_RECHARGE.euros} € (${PAYG_RECHARGE.credits} crédits) à ta première action payante, et à chaque fois que ton solde ne suffit plus.`
                  : `Then €${PAYG_RECHARGE.euros} (${PAYG_RECHARGE.credits} credits) on your first paid action, and each time your balance runs low.`}
              </p>
            </div>
            {yields(PAYG_RECHARGE.credits)}
            <button type="button" onClick={() => choose('payg_start')} disabled={opening !== null} className={ORDER_CTA}>
              {opening === 'payg_start' ? (fr ? 'Ouverture…' : 'Opening…') : (
                <>
                  {fr ? 'Enregistrer ma carte' : 'Save my card'}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {larger.map((pack) => (
          <div key={pack.id} className={`flex h-full flex-col ${ORDER_CARD_QUIET}`}>
            <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
              <div>
                <p className="text-base font-semibold text-white">{fr ? `Recharge ${pack.euros} €` : `€${pack.euros} top-up`}</p>
                <p className="text-sm text-neutral-300">{fr ? `${pack.credits} crédits` : `${pack.credits} credits`}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className={`text-[2.75rem] ${ORDER_PRICE}`}>{pack.euros}€</span>
                  <span className="text-sm text-neutral-300">{fr ? 'une fois' : 'once'}</span>
                </div>
                <p className="pt-1.5 text-xs text-neutral-300">
                  {fr
                    ? `${Math.round(((pack.credits / pack.euros) / (PAYG_RECHARGE.credits / PAYG_RECHARGE.euros) - 1) * 100)} % de crédits en plus que la recharge de ${PAYG_RECHARGE.euros} €.`
                    : `${Math.round(((pack.credits / pack.euros) / (PAYG_RECHARGE.credits / PAYG_RECHARGE.euros) - 1) * 100)}% more credits than the €${PAYG_RECHARGE.euros} top-up.`}
                </p>
              </div>
              {yields(pack.credits)}
              <button type="button" onClick={() => choose(pack.id)} disabled={opening !== null} className={ORDER_CTA_SECONDARY}>
                {opening === pack.id ? (fr ? 'Ouverture…' : 'Opening…') : (
                  <>
                    {fr ? `Recharger ${pack.euros} €` : `Top up €${pack.euros}`}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
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
