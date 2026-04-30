'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function WhyEmpireSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const cards = fr
    ? [
        {
          direction: 'down' as const,
          color: '#9CA3AF',
          label: 'Métiers remplacés par l\'IA',
          phrase: 'Copywriting, montage, design, SEO - l\'IA sait déjà tout faire. La compétence seule ne vaut plus rien.',
          stat: '90%',
          statLabel: 'd\'ici 2030',
        },
        {
          direction: 'up' as const,
          color: '#ef4444',
          label: 'Nombre de créateurs',
          phrase: 'La barrière à l\'entrée n\'existe plus. Chaque mois qui passe, c\'est des milliers de concurrents en plus.',
          stat: '×100',
          statLabel: 'en 2028',
        },
      ]
    : [
        {
          direction: 'down' as const,
          color: '#9CA3AF',
          label: 'Jobs replaced by AI',
          phrase: 'Copywriting, editing, design, SEO - AI already does it all. Skill alone is worthless.',
          stat: '90%',
          statLabel: 'by 2030',
        },
        {
          direction: 'up' as const,
          color: '#ef4444',
          label: 'Number of creators',
          phrase: 'The barrier to entry no longer exists. Every month that passes means thousands more competitors.',
          stat: '×100',
          statLabel: 'by 2028',
        },
      ]

  return (
    <section className="relative w-full py-16 md:py-28 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.06),transparent)]" />

      <div ref={ref} className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <div className="inline-block px-4 py-2 rounded-full bg-empire/10 border border-empire/30">
            <p className="text-sm font-bold text-empire">
              {fr ? 'POURQUOI MAINTENANT' : 'WHY NOW'}
            </p>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl md:text-4xl font-bold text-white leading-tight text-center max-w-3xl mx-auto mb-14"
        >
            {fr ? (
              <>
                Ce que l&apos;IA ne pourra jamais copier : <span className="text-empire">votre personnalité.</span>
              </>
            ) : (
              <>
                What AI will never be able to copy: <span className="text-empire">your personality.</span>
              </>
            )}
        </motion.h2>

        {/* Two cards side by side — timeline is wider */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 md:gap-6 max-w-5xl mx-auto mb-12">
          {/* Card 1 — skills commoditized (narrower, 2/5) — text on top, chart below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 overflow-hidden flex flex-col"
          >
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-black" style={{ color: cards[0].color }}>
                {cards[0].stat}
              </span>
              <span className="text-xs text-neutral-500 font-semibold">
                {cards[0].statLabel}
              </span>
            </div>
            <p className="text-sm sm:text-base font-bold text-white mb-1">{cards[0].label}</p>
            <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed mb-4">{cards[0].phrase}</p>
            <div className="flex-1 min-h-[80px] flex items-end">
              <MiniChart direction={cards[0].direction} color={cards[0].color} isInView={isInView} delay={0.6} />
            </div>
          </motion.div>

          {/* Card 2 — competition exploding (wider, 3/5) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="md:col-span-3 relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 overflow-hidden"
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl sm:text-4xl font-black text-[#ef4444]">{cards[1].stat}</span>
              <span className="text-sm text-neutral-500 font-semibold">{cards[1].statLabel}</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-white mb-1">{cards[1].label}</p>
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">{cards[1].phrase}</p>
            <CompetitionTimeline isInView={isInView} fr={fr} />
          </motion.div>
        </div>

        {/* Closing + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center"
        >
          <p className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-6">
            {fr ? (
              <>
                Empire = <span className="text-white font-semibold">18 mois de R&amp;D marketing</span> déjà injectés dans le système.
                <br />
                Ne perdez pas 1 an à tester seul - ce sera trop tard.
              </>
            ) : (
              <>
                Empire = <span className="text-white font-semibold">18 months of marketing R&amp;D</span> already baked into the system.
                <br />
                Don&apos;t spend 1 year testing alone - it&apos;ll be too late.
              </>
            )}
          </p>
          <a
            href="/join-us"
            className="inline-flex flex-col items-center px-8 py-4 rounded-2xl bg-empire text-black font-bold text-base md:text-lg hover:scale-[1.03] active:scale-100 transition-all shadow-[0_0_40px_rgb(var(--empire-rgb)_/_0.4)]"
          >
            <span className="flex items-center gap-2">
              {fr ? 'Je veux profiter de cette opportunité' : 'I want to seize this opportunity'}
              <span className="text-xl">→</span>
            </span>
            <span className="text-[11px] font-semibold opacity-70">{fr ? '300 000 vues/mois garanties · 45 min' : '300,000 views/month guaranteed · 45 min'}</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Mini chart (line + area, drawn on scroll) ───────────────────────────────

function MiniChart({
  direction,
  color,
  isInView,
  delay,
}: {
  direction: 'up' | 'down'
  color: string
  isInView: boolean
  delay: number
}) {
  const pathUp = 'M 0 90 C 40 88, 80 70, 130 55 C 180 40, 220 20, 280 5'
  const areaUp = 'M 0 90 C 40 88, 80 70, 130 55 C 180 40, 220 20, 280 5 L 280 100 L 0 100 Z'

  const pathDown = 'M 0 10 C 40 15, 80 30, 130 50 C 180 70, 220 85, 280 92'
  const areaDown = 'M 0 10 C 40 15, 80 30, 130 50 C 180 70, 220 85, 280 92 L 280 100 L 0 100 Z'

  const path = direction === 'up' ? pathUp : pathDown
  const area = direction === 'up' ? areaUp : areaDown
  const endY = direction === 'up' ? 5 : 92

  return (
    <svg viewBox="0 0 280 100" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`area-${direction}-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <motion.path
        d={area}
        fill={`url(#area-${direction}-${color.replace('#', '')})`}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
      />

      {/* Line */}
      <motion.path
        d={path}
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      />

    </svg>
  )
}

// ─── Timeline competition chart ─────────────────────────────────────────────
// Shows exponential growth of creators over time with "Vous?" marker and
// a "trop tard" zone after 3 months.

function CompetitionTimeline({ isInView, fr }: { isInView: boolean; fr: boolean }) {
  const markers = fr
    ? [
        { x: 30, label: 'Maintenant', color: '#DAFC68' },
        { x: 190, label: '1 mois', color: '#fbbf24' },
        { x: 350, label: '3 mois', color: '#f97316' },
        { x: 510, label: '6 mois', color: '#ef4444' },
        { x: 670, label: '1 an', color: '#dc2626' },
      ]
    : [
        { x: 30, label: 'Now', color: '#DAFC68' },
        { x: 190, label: '1 month', color: '#fbbf24' },
        { x: 350, label: '3 months', color: '#f97316' },
        { x: 510, label: '6 months', color: '#ef4444' },
        { x: 670, label: '1 year', color: '#dc2626' },
      ]

  return (
    <div className="relative">
      <svg viewBox="0 0 700 200" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Gradient that goes from green (now) to red (too late) */}
          <linearGradient id="comp-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DAFC68" />
            <stop offset="25%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="75%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="comp-area-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DAFC68" stopOpacity="0.15" />
            <stop offset="25%" stopColor="#fbbf24" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#f97316" stopOpacity="0.1" />
            <stop offset="75%" stopColor="#ef4444" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Area under curve — gradient green to red */}
        <motion.path
          d="M 30 175 C 100 172, 200 160, 300 135 C 400 100, 500 50, 600 18 C 640 8, 660 4, 670 3 L 670 180 L 30 180 Z"
          fill="url(#comp-area-grad)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
        />

        {/* Exponential curve — gradient stroke green → red */}
        <motion.path
          d="M 30 175 C 100 172, 200 160, 300 135 C 400 100, 500 50, 600 18 C 640 8, 660 4, 670 3"
          stroke="url(#comp-line-grad)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 2.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Time markers */}
        {markers.map((m, i) => (
          <motion.g
            key={m.x}
            initial={{ opacity: 0, y: 6 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.8 + i * 0.12 }}
          >
            <line x1={m.x} y1="180" x2={m.x} y2="187" stroke={m.color} strokeOpacity="0.6" strokeWidth="2" />
            <text x={m.x} y="196" fontSize="13" fill={m.color} fontWeight="700" textAnchor="middle">
              {m.label}
            </text>
          </motion.g>
        ))}

        {/* "Vous" pill — on the curve at the start (NOW) */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 2.2, type: 'spring', stiffness: 200 }}
        >
          <rect x="8" y="155" width="48" height="22" rx="11" fill="#0a0a0a" stroke="#DAFC68" strokeWidth="1.5" />
          <text x="32" y="170" fontSize="11" fill="#DAFC68" fontWeight="800" textAnchor="middle">
            {fr ? 'Vous' : 'You'}
          </text>
        </motion.g>

      </svg>
    </div>
  )
}
