'use client'
import { useEffect, useState } from 'react'

// ─── Configuration des paliers de prix ─────────────────────────────────────
const PRICE_TIERS = [
  { price: 497,  label: 'Early bird',    deadline: new Date('2026-04-10T23:59:59') },
  { price: 597,  label: 'Lancement',     deadline: new Date('2026-04-25T23:59:59') },
  { price: 697,  label: 'Prix définitif', deadline: null },
]
// ───────────────────────────────────────────────────────────────────────────

function getActiveTier() {
  const now = new Date()
  return PRICE_TIERS.findIndex(t => !t.deadline || t.deadline > now)
}

function getTimeLeft(deadline: Date | null) {
  if (!deadline) return null
  const diff = deadline.getTime() - Date.now()
  if (diff <= 0) return null
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { d, h, m, s }
}

type TimeLeft = { d: number; h: number; m: number; s: number } | null

export default function AcademyPriceCountdown() {
  const [activeIdx, setActiveIdx] = useState<number>(-1)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(null)

  useEffect(() => {
    const update = () => {
      const idx = getActiveTier()
      setActiveIdx(idx)
      if (idx === -1) return
      setTimeLeft(getTimeLeft(PRICE_TIERS[idx]?.deadline ?? null))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const activeTier = PRICE_TIERS[activeIdx]

  // Don't render on server - only after client mount
  if (activeIdx === -1 || !activeTier) return null

  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">

      {/* Countdown banner */}
      {timeLeft && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-b border-white/8 bg-black/30">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-empire opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-empire" />
            </span>
            <p className="text-xs font-semibold text-white">
              Le prix passe à <span className="text-empire">{PRICE_TIERS[activeIdx + 1]?.price}€</span> dans
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[
              { val: timeLeft.d, unit: 'j' },
              { val: timeLeft.h, unit: 'h' },
              { val: timeLeft.m, unit: 'm' },
              { val: timeLeft.s, unit: 's' },
            ].map(({ val, unit }) => (
              <div key={unit} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-lg bg-black border border-empire/30 flex items-center justify-center">
                  <span className="text-empire font-black text-base tabular-nums leading-none">
                    {String(val).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[9px] text-neutral-600 mt-0.5 uppercase">{unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price roadmap */}
      <div className="flex divide-x divide-white/8">
        {PRICE_TIERS.map((tier, i) => {
          const isPast = i < activeIdx
          const isActive = i === activeIdx
          const isFuture = i > activeIdx
          return (
            <div
              key={i}
              className={`flex-1 px-3 py-3 text-center transition-all ${
                isActive ? 'bg-empire/8' : ''
              }`}
            >
              <p className={`text-xs mb-1 ${isActive ? 'text-empire font-bold' : 'text-neutral-600'}`}>
                {tier.deadline
                  ? tier.deadline.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                  : 'Après'}
              </p>
              <p className={`font-black text-base leading-none ${
                isPast    ? 'text-neutral-700 line-through' :
                isActive  ? 'text-empire' :
                            'text-neutral-500'
              }`}>
                {tier.price}€
              </p>
              <p className={`text-[10px] mt-0.5 ${isActive ? 'text-empire/70' : 'text-neutral-700'}`}>
                {tier.label}
              </p>
              {isActive && (
                <span className="inline-block mt-1 text-[9px] font-bold text-black bg-empire rounded-full px-1.5 py-0.5 leading-none">
                  MAINTENANT
                </span>
              )}
              {isFuture && (
                <span className="inline-block mt-1 text-[9px] text-neutral-700 leading-none">
                  +{tier.price - (PRICE_TIERS[activeIdx]?.price ?? 0)}€
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
