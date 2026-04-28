'use client'

import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import type { CSSProperties } from 'react'

type TierId = 'academy' | 'copilot' | 'autopilot'

interface Tier {
  id: TierId
  label: string
  sublabel: string
  color: string
}

export default function TierNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { lang } = useLanguage()
  const { autopilot, setAutopilot } = useAutopilot()

  const activeTier: TierId = pathname === '/academy'
    ? 'academy'
    : autopilot ? 'autopilot' : 'copilot'

  const tiers: Tier[] = [
    {
      id: 'academy',
      label: 'Academy',
      sublabel: lang === 'fr' ? 'Se former' : 'Learn',
      color: '#fca5a5',
    },
    {
      id: 'copilot',
      label: 'Copilot',
      sublabel: lang === 'fr' ? 'On écrit, tu publies' : 'We write, you publish',
      color: '#DAFC68',
    },
    {
      id: 'autopilot',
      label: 'Autopilot',
      sublabel: lang === 'fr' ? 'On gère tout' : 'We handle everything',
      color: '#d4a574',
    },
  ]

  const handleClick = (tier: TierId) => {
    if (tier === 'academy') {
      router.push('/academy')
    } else if (tier === 'copilot') {
      setAutopilot(false)
      if (pathname !== '/') router.push('/')
    } else if (tier === 'autopilot') {
      setAutopilot(true)
      if (pathname !== '/') router.push('/')
    }
  }

  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shrink-0">
      {tiers.map((tier) => {
        const isActive = activeTier === tier.id
        const activeStyle: CSSProperties = isActive
          ? {
              backgroundColor: `${tier.color}1F`,
              color: tier.color,
              boxShadow: `0 0 20px ${tier.color}26`,
            }
          : {}

        return (
          <button
            key={tier.id}
            type="button"
            onClick={() => handleClick(tier.id)}
            aria-pressed={isActive}
            className={`relative px-3 md:px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
              isActive
                ? ''
                : 'text-neutral-400 hover:text-white'
            }`}
            style={activeStyle}
          >
            {isActive && (
              <motion.div
                layoutId="tier-active-dot"
                className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ backgroundColor: tier.color }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center gap-0 leading-tight">
              <span className="text-[11px] md:text-xs whitespace-nowrap">{tier.label}</span>
              <span className={`text-[8px] md:text-[9px] font-medium whitespace-nowrap ${isActive ? 'opacity-70' : 'text-neutral-400'}`}>
                {tier.sublabel}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
