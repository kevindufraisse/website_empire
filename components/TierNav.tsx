'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import type { CSSProperties } from 'react'

type TierId = 'academy' | 'copilot' | 'autopilot'

interface Tier {
  id: TierId
  href: string
  label: string
  sublabel: string
  color: string
}

export default function TierNav({ instance = 'main' }: { instance?: string }) {
  const pathname = usePathname()
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const activeTier: TierId =
    pathname === '/academy' || pathname === '/candidature'
      ? 'academy'
      : pathname === '/legende'
        ? 'autopilot'
        : 'copilot'

  const tiers: Tier[] = [
    {
      id: 'academy',
      href: '/academy',
      label: 'Academy',
      sublabel: fr ? 'Maîtriser le système' : 'Master the system',
      color: '#fca5a5',
    },
    {
      id: 'copilot',
      href: '/',
      label: 'Empire',
      sublabel: fr ? 'Installer le système' : 'Install the system',
      color: '#DAFC68',
    },
    {
      id: 'autopilot',
      href: '/legende',
      label: 'Légende',
      sublabel: fr ? 'Confiez-nous le système' : 'Hand us the system',
      color: '#d4a574',
    },
  ]

  return (
    <nav
      aria-label={fr ? 'Choisir une offre' : 'Choose an offer'}
      className="flex items-center gap-0.5 p-0.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shrink-0"
    >
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
          <a
            key={tier.id}
            href={tier.href}
            aria-current={isActive ? 'page' : undefined}
            className={`relative px-3 md:px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              isActive ? '' : 'text-neutral-400 hover:text-white'
            }`}
            style={activeStyle}
          >
            {isActive && (
              <motion.div
                layoutId={`tier-active-dot-${instance}`}
                className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ backgroundColor: tier.color }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center gap-0 leading-tight">
              <span className="text-[11px] md:text-xs whitespace-nowrap">{tier.label}</span>
              <span
                className={`text-[8px] md:text-[9px] font-medium whitespace-nowrap ${
                  isActive ? 'opacity-70' : 'text-neutral-400'
                }`}
              >
                {tier.sublabel}
              </span>
            </div>
          </a>
        )
      })}
    </nav>
  )
}
