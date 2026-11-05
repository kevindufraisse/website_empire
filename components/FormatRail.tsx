'use client'
import { Check } from 'lucide-react'
import s from './FormatJourney.module.css'

export const FORMAT_NAMES = ['Réaction', 'Tier list', 'FAQ', 'Devine', 'Clonage', 'Lead magnet', 'YouTube long'] as const
const IMAGES = ['/demo/hormozi-reaction-v10.jpg', '/formats/tierlist.webp', '/app-illustrations/bd-faq.webp', '/app-illustrations/bd-blur.webp', '/formats/clone-avant-apres.jpg', '/demo/leadmagnet-result-20261104.jpg', '/demo/youtube-tierlist-v18.webp']

/** An indicator, never a carousel: native page scroll advances the seven formats. */
export default function FormatRail({ active, floating = false }: { active: number; floating?: boolean }) {
  return <aside className={`${s.rail} ${floating ? s.floatingRail : ''}`} data-format-list data-active-format={FORMAT_NAMES[active]} aria-label="Formats découverts au scroll">
    <ol>{FORMAT_NAMES.map((label, index) => <li key={label} aria-current={index === active ? 'step' : undefined} data-format-index={index}>
      <img src={IMAGES[index]} alt="" loading="lazy"/>
      <span>{label}</span>{index < active ? <Check size={11} aria-hidden="true"/> : index === active ? <i aria-hidden="true"/> : null}
    </li>)}</ol>
  </aside>
}
