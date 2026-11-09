'use client'

import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { TRIAL_CREDITS } from '@/lib/startTrial'
import { contentsFor } from '@/lib/plans'
import { ORDER_CTA } from '@/lib/orderStyles'
import { nbsp, rich } from './typo'
import type { TrialCart } from './useTrialCart'

/**
 * Le bouton d'essai de /tarifs et ce qui l'entoure : la ligne d'essai (une
 * seule fois, sous les cartes), le bouton, ce qui est prélevé aujourd'hui et
 * le lien vers l'appel. Même `checkout` partout (`useTrialCart`).
 */

/** « de quoi faire jusqu'à 2 reels, ou 5 posts LinkedIn, ou 4 newsletters », calculé sur les coûts en crédits. */
export function trialContents(fr: boolean): string {
  const c = contentsFor(TRIAL_CREDITS)
  return fr
    ? `jusqu’à ${c.reels} reels, ou ${c.posts} posts LinkedIn, ou ${c.newsletters} newsletters`
    : `up to ${c.reels} reels, or ${c.posts} LinkedIn posts, or ${c.newsletters} newsletters`
}

export function CallLink({ className = '' }: { className?: string }) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  return (
    <p className={`text-center text-sm leading-relaxed text-neutral-400 ${className}`}>
      {fr ? nbsp('Tu veux en parler avant ? ') : 'Want to talk first? '}
      <a href="/decouverte" className="inline-flex min-h-11 items-center font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
        {fr ? nbsp('Réserver un appel gratuit de 15 min') : 'Book a free 15-min call'}
      </a>
    </p>
  )
}

type Props = {
  cart: TrialCart
  /** La ligne « Essai gratuit de 7 jours… » au-dessus du bouton (sous les cartes seulement). */
  withTrialLine?: boolean
  /** Le lien vers l'appel (deux fois dans la page : sous les cartes et en bas). */
  withCall?: boolean
  /** Le texte sous le bouton ; par défaut, ce qui est prélevé aujourd'hui. */
  note?: 'today' | 'cancel'
  className?: string
}

export default function TrialCta({ cart, withTrialLine = false, withCall = false, note = 'today', className = '' }: Props) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const { liveDeal, bootcamp, bootcampEuros, opening, checkout, billing } = cart
  const monthly = billing.months === 1

  const today = bootcamp
    ? (fr
      ? `Aujourd’hui : ${bootcampEuros} € pour le Bootcamp Academy, 0 € pour ta formule. À l’étape suivante, tu ajoutes une carte ou un IBAN. Le premier prélèvement de ta formule part le 8ᵉ jour, ou avant si tu dépasses les ${TRIAL_CREDITS} crédits.`
      : `Today: €${bootcampEuros} for the Academy bootcamp, €0 for your plan. On the next step, you add a card or an IBAN. The first charge for your plan is taken on day 8, or earlier if you go past ${TRIAL_CREDITS} credits.`)
    : (fr
      ? `0 € aujourd’hui pour ta formule. À l’étape suivante, tu ajoutes une carte ou un IBAN. Le premier prélèvement part le 8ᵉ jour, ou avant si tu dépasses les ${TRIAL_CREDITS} crédits.`
      : `€0 today for your plan. On the next step, you add a card or an IBAN. The first charge is taken on day 8, or earlier if you go past ${TRIAL_CREDITS} credits.`)
  const cancel = fr
    ? `Si tu annules l’essai depuis l’app avant le premier prélèvement, ta formule ne te coûte rien.${monthly ? ' Ensuite, tu arrêtes quand tu veux.' : ''}`
    : `If you cancel the trial from the app before the first charge, your plan costs you nothing.${monthly ? ' After that, you stop whenever you want.' : ''}`
  const liveNote = fr ? 'Sans engagement : tu arrêtes quand tu veux depuis l’app.' : 'No commitment: stop anytime from the app.'
  const text = liveDeal ? liveNote : note === 'cancel' ? cancel : today

  return (
    <div className={className}>
      {withTrialLine && !liveDeal && (
        <p className="mb-4 text-center text-[15px] leading-relaxed text-neutral-200">
          {fr
            ? <><span className="font-semibold text-white">{nbsp(`Essai gratuit de 7 jours, avec ${TRIAL_CREDITS} crédits`)}</span>{nbsp(` : de quoi faire ${trialContents(true)}.`)}</>
            : <><span className="font-semibold text-white">{`7-day free trial, with ${TRIAL_CREDITS} credits`}</span>{`: enough for ${trialContents(false)}.`}</>}
        </p>
      )}
      <button type="button" data-trial-cta onClick={checkout} disabled={opening} className={`!min-h-[54px] !text-base ${ORDER_CTA}`}>
        {opening ? (fr ? 'Ouverture…' : 'Opening…') : (
          <>
            {liveDeal ? (fr ? 'Continuer' : 'Continue') : (fr ? 'Démarrer mon essai gratuit' : 'Start my free trial')}
            <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
          </>
        )}
      </button>
      <p className="mx-auto mt-3 max-w-md text-center text-[13px] leading-relaxed text-neutral-400">{fr ? rich(nbsp(text)) : text}</p>
      {withCall && <CallLink className="mt-3" />}
    </div>
  )
}
