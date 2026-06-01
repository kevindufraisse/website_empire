'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const SOLO_PIECES = 4
const EMPIRE_PIECES = 166
const GRID_TOTAL = 166

function CoinGrid({
  filled,
  activeColor,
  inactiveColor,
  isInView,
  delay,
}: {
  filled: number
  activeColor: string
  inactiveColor: string
  isInView: boolean
  delay: number
}) {
  return (
    <div className="flex flex-wrap gap-[3px] justify-center">
      {Array.from({ length: GRID_TOTAL }).map((_, i) => {
        const isActive = i < filled
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              duration: 0.15,
              delay: isActive ? delay + i * 0.008 : delay + 0.3,
              ease: 'easeOut',
            }}
            className="w-[6px] h-[6px] sm:w-[7px] sm:h-[7px] rounded-full"
            style={{
              backgroundColor: isActive ? activeColor : inactiveColor,
              boxShadow: isActive ? `0 0 6px ${activeColor}40` : 'none',
            }}
          />
        )
      })}
    </div>
  )
}

export default function VolumeSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgb(var(--empire-rgb)_/_0.05),transparent)]" />

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-bold tracking-widest uppercase text-empire/80 mb-4 text-center"
        >
          {fr ? 'La vraie raison pour laquelle ça marche' : 'The real reason it works'}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl md:text-3xl font-extrabold text-white text-center mb-3 leading-tight"
        >
          {fr
            ? <>Chaque contenu est une pièce dans la machine.</>
            : <>Every piece of content is a coin in the machine.</>}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-neutral-400 text-center text-sm md:text-base mb-12 max-w-xl mx-auto leading-relaxed"
        >
          {fr
            ? 'Ceux qui réussissent ne sont pas plus talentueux. Ils mettent juste plus de pièces.'
            : 'Those who succeed aren\'t more talented. They just insert more coins.'}
        </motion.p>

        {/* Side by side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Solo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-neutral-400">{fr ? 'Seul(e)' : 'Solo'}</span>
              <span className="text-2xl font-black text-neutral-600">{SOLO_PIECES}</span>
            </div>
            <p className="text-[11px] text-neutral-600 mb-5">
              {fr ? 'contenus / mois' : 'pieces / month'}
            </p>

            <CoinGrid
              filled={SOLO_PIECES}
              activeColor="#6b7280"
              inactiveColor="rgba(255,255,255,0.04)"
              isInView={isInView}
              delay={0.4}
            />

            <p className="text-xs text-neutral-600 mt-5 text-center italic">
              {fr
                ? '4 chances que quelque chose se passe. Par mois.'
                : '4 chances for something to happen. Per month.'}
            </p>
          </motion.div>

          {/* Empire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl border border-empire/20 bg-empire/[0.03] p-6"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-empire">Empire</span>
              <span className="text-2xl font-black text-empire">{EMPIRE_PIECES}</span>
            </div>
            <p className="text-[11px] text-empire/60 mb-5">
              {fr ? 'contenus / mois' : 'pieces / month'}
            </p>

            <CoinGrid
              filled={EMPIRE_PIECES}
              activeColor="rgb(var(--empire-rgb))"
              inactiveColor="rgba(255,255,255,0.04)"
              isInView={isInView}
              delay={0.6}
            />

            <p className="text-xs text-empire/70 mt-5 text-center font-semibold">
              {fr
                ? '41× plus de chances. Même vous. Juste plus de volume.'
                : '41× more chances. Same you. Just more volume.'}
            </p>
          </motion.div>
        </div>

        {/* Punchline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-10 text-center"
        >
          <p className="text-white/90 text-base md:text-lg font-bold leading-relaxed">
            {fr
              ? <>La question n&apos;est pas <span className="text-neutral-500 line-through">si</span> ça marche pour vous.<br />C&apos;est <span className="text-empire">combien de pièces</span> vous mettez dans la machine.</>
              : <>The question isn&apos;t <span className="text-neutral-500 line-through">whether</span> it works for you.<br />It&apos;s <span className="text-empire">how many coins</span> you put in the machine.</>}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
