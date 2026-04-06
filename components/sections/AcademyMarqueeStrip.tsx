'use client'
import Marquee from '@/components/magicui/marquee'

const items = [
  { icon: '⚡', text: '21 jours pour tout maîtriser' },
  { icon: '🎯', text: '3 000€/mois - objectif atteignable' },
  { icon: '👁', text: '10M+ vues/mois générées' },
  { icon: '🔴', text: '6 lives experts inclus' },
  { icon: '🔒', text: 'Replays à vie' },
  { icon: '🤝', text: 'Groupe privé' },
  { icon: '🚀', text: 'Accès immédiat dès aujourd\'hui' },
  { icon: '🛡', text: 'Résistant à l\'IA' },
  { icon: '💼', text: 'Éligible réseau Empire' },
  { icon: '🏆', text: 'Certification LinkedIn incluse' },
]

export default function AcademyMarqueeStrip() {
  return (
    <div className="relative w-full py-3 bg-empire/5 border-y border-empire/15 overflow-hidden">
      <Marquee pauseOnHover className="gap-0">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 mx-6 whitespace-nowrap">
            <span className="text-sm">{item.icon}</span>
            <span className="text-xs font-semibold text-neutral-300">{item.text}</span>
            <span className="ml-6 text-empire/30">·</span>
          </div>
        ))}
      </Marquee>
    </div>
  )
}
