'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

/**
 * Condensed version of the old "Pourquoi Empire" section: same proof points,
 * folded into the pricing section instead of taking a full screen.
 */
export default function WhyEmpireCompact() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [open, setOpen] = useState(false)

  const proof = fr
    ? [
        { stat: '1 an', label: 'de développement pour le système de cascade' },
        { stat: '8 mois', label: 'à former nos monteurs et rédacteurs aux formats viraux' },
        { stat: '+10 000', label: 'posts testés avant de figer les formats' },
        { stat: '+20 000€', label: 'investis en formation algorithmes' },
        { stat: 'En continu', label: 'nouveaux formats détectés et intégrés chaque mois' },
        { stat: '1h/semaine', label: 'c\u2019est tout ce qu\u2019on vous demande' },
      ]
    : [
        { stat: '1 year', label: 'of development for the cascade system' },
        { stat: '8 months', label: 'training our editors and writers on viral formats' },
        { stat: '10,000+', label: 'posts tested before locking the formats' },
        { stat: '€20,000+', label: 'invested in algorithm training' },
        { stat: 'Ongoing', label: 'new formats detected and integrated every month' },
        { stat: '1h/week', label: 'that\u2019s all we ask from you' },
      ]

  const team = 'Kevin (CEO) · Manon (COO) · Pierre (Content) · Chloé (Production) · Marc (Viralité) · Stan · Sébastien · Zahia'

  return (
    <div className="mt-10 max-w-4xl mx-auto rounded-2xl border border-white/8 bg-white/[0.015] px-5 py-4">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <p className="text-[13px] leading-relaxed text-neutral-400">
          {fr
            ? 'ChatGPT écrit un post en 30 secondes. Empire transforme 1h de parole en un mois de contenus sur 7 réseaux.'
            : 'ChatGPT writes a post in 30 seconds. Empire turns 1h of talking into a month of content across 7 platforms.'}
          <span className="ml-1.5 font-semibold text-empire">
            {fr ? 'Ce qu\u2019il a fallu construire' : 'What it took to build'}
          </span>
        </p>
        <ChevronDown
          size={16}
          className={`mt-0.5 shrink-0 text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid gap-x-6 gap-y-3 border-t border-white/8 pt-4 sm:grid-cols-2 lg:grid-cols-3">
              {proof.map((p) => (
                <div key={p.stat}>
                  <p className="text-sm font-bold text-empire">{p.stat}</p>
                  <p className="text-[12px] leading-snug text-neutral-500">{p.label}</p>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[12px] leading-relaxed text-neutral-500">
              <span className="font-semibold text-neutral-300">
                {fr ? 'Votre équipe dédiée : ' : 'Your dedicated team: '}
              </span>
              {team}.{' '}
              {fr
                ? 'Déjà formée, déjà rodée - elle travaille sur votre marque dès le premier jour.'
                : 'Already trained, already battle-tested - working on your brand from day one.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
