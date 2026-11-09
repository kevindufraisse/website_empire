'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { PLAN_LABELS } from '@/lib/plans'
import { ORDER_CTA } from '@/lib/orderStyles'
import glass from './pricing.module.css'
import { nbsp } from './typo'
import type { TrialCart } from './useTrialCart'

/**
 * Barre du bas, sur téléphone et tablette : la formule choisie et le bouton
 * d'essai restent à portée de pouce pendant qu'on fait défiler. Elle n'apparaît
 * qu'une fois le premier bouton d'essai de la page (`data-trial-cta`) passé
 * au-dessus de l'écran, et disparaît dès qu'un de ces boutons est à l'écran,
 * pour ne jamais en montrer deux ni couvrir le haut de la page. Sur ordinateur,
 * les cartes et les boutons suffisent : pas de barre.
 */
export default function StickyTrialBar({ cart }: { cart: TrialCart }) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const locale = fr ? 'fr-FR' : 'en-US'
  const { plan, billing, liveDeal, bootcamp, expert, today, perMonth, cycleTotal, opening, checkout } = cart
  // Cachée au chargement : le premier bouton est encore devant le visiteur.
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const ctas = Array.from(document.querySelectorAll('[data-trial-cta]'))
      if (ctas.length === 0) { setHidden(true); return }
      const vh = window.innerHeight
      const passedFirst = ctas[0].getBoundingClientRect().bottom < 0
      const oneOnScreen = ctas.some((el) => {
        const r = el.getBoundingClientRect()
        return r.bottom > 0 && r.top < vh
      })
      setHidden(!passedFirst || oneOnScreen)
    }
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [liveDeal])

  const label = PLAN_LABELS[plan][fr ? 'fr' : 'en']
  const then = liveDeal || billing.months === 1
    ? (fr ? `puis ${perMonth} €/mois` : `then €${perMonth}/mo`)
    : billing.months === 12
      ? (fr ? `puis ${cycleTotal.toLocaleString(locale)} € par an` : `then €${cycleTotal.toLocaleString(locale)} a year`)
      : (fr ? `puis ${cycleTotal.toLocaleString(locale)} € par trimestre` : `then €${cycleTotal.toLocaleString(locale)} a quarter`)

  const name = liveDeal
    ? `${label}${fr ? ' · offre du live' : ' · live offer'}`
    : `${label}${bootcamp ? ' + Bootcamp' : ''}${expert ? ' + Expert' : ''}`
  const todayText = fr ? `${today.toLocaleString(locale)} € aujourd’hui,` : `€${today.toLocaleString(locale)} today,`

  return (
    <div
      aria-hidden={hidden}
      className={`fixed inset-x-0 bottom-3 z-40 mx-auto w-[min(560px,calc(100%-1.5rem))] transition-all duration-200 lg:hidden ${hidden ? 'pointer-events-none translate-y-4 opacity-0' : 'opacity-100'}`}
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className={`flex items-center gap-3 p-2 pl-3.5 min-[380px]:pl-4 ${glass.stickyBar}`}>
        <div className="min-w-0 flex-1 py-0.5">
          <p className="text-[13px] font-semibold leading-tight text-white min-[380px]:text-sm">{name}</p>
          <p className="mt-0.5 text-xs leading-snug text-neutral-300">
            <span className="whitespace-nowrap">{fr ? nbsp(todayText) : todayText}</span>{' '}
            <span className="whitespace-nowrap">{fr ? nbsp(then) : then}</span>
          </p>
        </div>
        <button type="button" onClick={checkout} disabled={opening} tabIndex={hidden ? -1 : 0} className={`!w-auto shrink-0 !px-4 min-[380px]:!px-5 ${ORDER_CTA}`}>
          {opening ? (fr ? 'Ouverture…' : 'Opening…') : liveDeal ? (fr ? 'Continuer' : 'Continue') : (fr ? 'Essai gratuit' : 'Free trial')}
        </button>
      </div>
    </div>
  )
}
