'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'
import { BLACK_FRIDAY, formatBlackFridayLeft, useBlackFriday } from '@/lib/blackFriday'

/**
 * Black Friday 2026 (lib/blackFriday.ts). Deux formes :
 *  - `BlackFridayPill` : la pastille de l'en-tête, sur tout le site, qui mène
 *    à /tarifs ;
 *  - `BlackFridayStrip` : le bandeau de /tarifs, au-dessus des formules.
 * Les deux disparaissent seules à la fin (30 novembre 23 h 59, Paris).
 */

export function BlackFridayPill({ className = '' }: { className?: string }) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const { active } = useBlackFriday()
  if (!active) return null
  return (
    <a
      href="/tarifs"
      onClick={() => trackAmplitude('black_friday_pill_clicked', {})}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-black px-2.5 py-1 text-[11px] font-bold leading-none text-white ring-1 ring-[#DAFC68]/70 transition hover:ring-[#DAFC68] sm:text-xs ${className}`}
    >
      <span className="text-[#DAFC68]">Black Friday</span>
      <span className="hidden sm:inline">{fr ? `· Scale à ${BLACK_FRIDAY.promoMonthly} €` : `· Scale at €${BLACK_FRIDAY.promoMonthly}`}</span>
    </a>
  )
}

export function BlackFridayStrip({ className = '' }: { className?: string }) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const { active, left } = useBlackFriday()
  if (!active) return null
  const { promoMonthly, baseMonthly, durationMonths } = BLACK_FRIDAY
  return (
    <div className={`mx-auto max-w-3xl rounded-2xl border border-[#DAFC68]/40 bg-black px-4 py-3 text-center sm:px-6 ${className}`}>
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#DAFC68]">Black Friday</p>
      <p className="mt-1 text-[15px] font-semibold leading-snug text-white sm:text-base">
        {fr ? (
          <>Scale au prix de Growth&nbsp;: <span className="text-neutral-400 line-through decoration-neutral-500">{baseMonthly}&nbsp;€</span> {promoMonthly}&nbsp;€/mois pendant {durationMonths}&nbsp;mois</>
        ) : (
          <>Scale at Growth&apos;s price: <span className="text-neutral-400 line-through decoration-neutral-500">€{baseMonthly}</span> €{promoMonthly}/mo for {durationMonths} months</>
        )}
      </p>
      <p className="mt-1 text-xs text-neutral-400">
        {fr ? 'Tu publies 2 fois par jour au lieu d’une. ' : 'You publish twice a day instead of once. '}
        {left !== null && (
          <span className="whitespace-nowrap">
            {fr ? 'Fin dans ' : 'Ends in '}
            <span className="font-semibold tabular-nums text-white">{formatBlackFridayLeft(left, fr)}</span>
          </span>
        )}
      </p>
    </div>
  )
}
