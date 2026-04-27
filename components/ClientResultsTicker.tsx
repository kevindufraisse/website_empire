'use client'

import { useState, useEffect } from 'react'
import { useAutopilot } from '@/contexts/AutopilotContext'

const COPILOT_RESULTS = [
  {
    stat: '847 000',
    unit: 'vues',
    context: 'générées en 30 jours',
    detail: 'Consultant RH · LinkedIn + Instagram',
  },
  {
    stat: '38',
    unit: 'RDV qualifiés',
    context: 'en un mois',
    detail: 'Coach business · Contenu organique uniquement',
  },
  {
    stat: '15 min',
    unit: 'par semaine',
    context: 'de temps investi',
    detail: 'Au lieu de 21h+ de rédaction/montage',
  },
  {
    stat: '32 000€',
    unit: 'de CA',
    context: 'généré dès le 1er mois',
    detail: 'Entrepreneur solo · Zéro audience au départ',
  },
  {
    stat: '2 099',
    unit: 'abonnés',
    context: 'gagnés en 21 jours',
    detail: 'Freelance marketing · 0 abonné au départ',
  },
]

const AUTOPILOT_RESULTS = [
  {
    stat: '+50',
    unit: 'Heads of Viralité',
    context: 'dans notre réseau',
    detail: 'Le plus grand réseau de créateurs viraux francophones',
  },
  {
    stat: '100K',
    unit: 'vues minimum',
    context: 'garanties par mois',
    detail: 'Objectif contractuel · On gère tout de A à Z',
  },
  {
    stat: '0 min',
    unit: 'de votre temps',
    context: 'investi dans le contenu',
    detail: 'Notre équipe s\'occupe de tout pour vous',
  },
  {
    stat: '3,2M',
    unit: 'vues',
    context: 'record client en 30 jours',
    detail: 'Dirigeant SaaS · LinkedIn + Instagram + TikTok',
  },
  {
    stat: '24/7',
    unit: 'production active',
    context: 'sur tous vos canaux',
    detail: 'Équipe dédiée · Stratégie + création + publication',
  },
]

export default function ClientResultsTicker() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)
  const { autopilot } = useAutopilot()
  const RESULTS = autopilot ? AUTOPILOT_RESULTS : COPILOT_RESULTS
  const statClass = autopilot ? 'text-autopilot' : 'text-empire'
  const dotActiveClass = autopilot ? 'bg-autopilot' : 'bg-empire'

  useEffect(() => {
    setCurrent(0)
  }, [autopilot])

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent((c) => (c + 1) % RESULTS.length)
        setVisible(true)
      }, 400)
    }, 3500)
    return () => clearInterval(interval)
  }, [RESULTS.length])

  const r = RESULTS[current % RESULTS.length]

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 overflow-hidden">
      <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-3">
        {autopilot ? 'Autopilot · Notre réseau en action' : 'Le saviez-vous · Résultats clients'}
      </p>
      <div
        className="transition-all duration-400"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(6px)' }}
      >
        <div className="flex items-baseline gap-2 mb-1">
          <span className={`text-2xl font-black ${statClass}`}>{r.stat}</span>
          <span className="text-sm font-semibold text-white">{r.unit}</span>
          <span className="text-xs text-neutral-400">{r.context}</span>
        </div>
        <p className="text-xs text-neutral-400">{r.detail}</p>
      </div>
      {/* Progress dots */}
      <div className="flex items-center gap-1 mt-3">
        {RESULTS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setVisible(false); setTimeout(() => { setCurrent(i); setVisible(true) }, 200) }}
            className={`h-0.5 rounded-full transition-all duration-300 ${i === current ? `w-5 ${dotActiveClass}` : 'w-1.5 bg-white/15'}`}
          />
        ))}
      </div>
    </div>
  )
}
