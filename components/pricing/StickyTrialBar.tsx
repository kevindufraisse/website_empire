'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { PLAN_LABELS } from '@/lib/plans'
import { ORDER_CTA } from '@/lib/orderStyles'
import glass from './pricing.module.css'
import { nbsp } from './typo'
import type { TrialCart } from './useTrialCart'

/**
 * Barre du bas : la formule choisie et le bouton d'essai restent à portée de
 * pouce pendant qu'on fait défiler. Elle disparaît dès qu'un bouton d'essai de
 * la page (`data-trial-cta`) est à l'écran, pour ne jamais en montrer deux.
 */
export default function StickyTrialBar({ cart }: { cart: TrialCart }) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const locale = fr ? 'fr-FR' : 'en-US'
  const { plan, billing, liveDeal, bootcamp, expert, today, perMonth, cycleTotal, opening, checkout } = cart
  // Cachée tant qu'on ne sait pas si un bouton est à l'écran (pas de flash au chargement).
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') { setHidden(false); return }
    const visible = new Set<Element>()
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target)
        else visible.delete(e.target)
      }
      setHidden(visible.size > 0)
    }, { threshold: 0.5 })
    document.querySelectorAll('[data-trial-cta]').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [liveDeal])

  const label = PLAN_LABELS[plan][fr ? 'fr' : 'en']
  const then = liveDeal || billing.months === 1
    ? (fr ? `puis ${perMonth} €/mois` : `then €${perMonth}/mo`)
    : billing.months === 12
      ? (fr ? `puis ${cycleTotal.toLocaleString(locale)} € par an` : `then €${cycleTotal.toLocaleString(locale)} a year`)
      : (fr ? `puis ${cycleTotal.toLocaleString(locale)} € par trimestre` : `then €${cycleTotal.toLocaleString(locale)} a quarter`)

  return (
    <div
      aria-hidden={hidden}
      className={`fixed inset-x-0 bottom-3 z-40 mx-auto w-[min(640px,calc(100%-1.5rem))] transition-all duration-200 ${hidden ? 'pointer-events-none translate-y-4 opacity-0' : 'opacity-100'}`}
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className={`flex items-center gap-3 p-2 pl-4 ${glass.stickyBar}`}>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {label}{liveDeal ? (fr ? ' · offre du live' : ' · live offer') : `${bootcamp ? ' + bootcamp' : ''}${expert ? ' + expert' : ''}`}
          </p>
          <p className="truncate text-xs text-neutral-300">
            {fr ? nbsp(`${today.toLocaleString(locale)} € aujourd’hui, ${then}`) : `€${today.toLocaleString(locale)} today, ${then}`}
          </p>
        </div>
        <button type="button" onClick={checkout} disabled={opening} tabIndex={hidden ? -1 : 0} className={`!w-auto shrink-0 !px-5 ${ORDER_CTA}`}>
          {opening ? (fr ? 'Ouverture…' : 'Opening…') : liveDeal ? (fr ? 'Continuer' : 'Continue') : (fr ? 'Essai gratuit' : 'Free trial')}
        </button>
      </div>
    </div>
  )
}
