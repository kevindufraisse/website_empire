'use client'
import { Check } from 'lucide-react'
import s from './FormatJourney.module.css'
import preview from './FormatRailPreview.module.css'

export const FORMAT_NAMES = ['Réaction', 'Tier list', 'FAQ', 'Devine', 'Clonage', 'Lead magnet', 'YouTube long'] as const
const FACE = '/demo/kevin-speaking-v11.jpg'
const CREATORS = ['/webinar/anthony-bourbon.jpg', '/webinar/yomi-denzel.jpg', '/webinar/oussama-ammar.jpg']

/** Still previews use the same photographic assets and composition as the demo.
 * No app illustrations and no extra video players in the scroll indicator. */
function FormatPreview({ index }: { index: number }) {
  if (index === 0) return <div className={`${preview.preview} ${preview.split}`} data-format-thumbnail="reaction" aria-hidden="true"><img src="/demo/hormozi-reaction-v10.jpg" alt="" loading="lazy"/><img src={FACE} alt="" loading="lazy"/></div>
  if (index === 1) return <div className={`${preview.preview} ${preview.tier}`} data-format-thumbnail="tierlist" aria-hidden="true"><div className={preview.board}>{['S', 'A', 'B', 'C', 'D', 'F'].map((rank, i) => <div key={rank}><b>{rank}</b>{i < 3 && <img src={CREATORS[i]} alt="" loading="lazy"/>}</div>)}</div><img className={preview.face} src={FACE} alt="" loading="lazy"/></div>
  if (index === 2) return <div className={preview.preview} data-format-thumbnail="faq" aria-hidden="true"><img className={preview.face} src={FACE} alt="" loading="lazy"/><div className={preview.question}><small>Pose-moi une question</small><b>Qui suivre en business ?</b></div></div>
  if (index === 3) return <div className={preview.preview} data-format-thumbnail="devine" aria-hidden="true"><img className={preview.face} src={FACE} alt="" loading="lazy"/><div className={preview.guess}>{CREATORS.map((src, i) => <div key={src}><img src={src} alt="" loading="lazy"/><b>{i === 0 ? '?' : '…'}</b></div>)}</div></div>
  const src = index === 4 ? '/formats/clone-avant-apres.jpg' : index === 5 ? '/demo/leadmagnet-result-20261104.jpg' : '/demo/youtube-tierlist-v18.webp'
  return <div className={`${preview.preview} ${index === 6 ? preview.landscape : ''}`} data-format-thumbnail={index === 4 ? 'clone' : index === 5 ? 'lead-magnet' : 'youtube'} aria-hidden="true"><img className={preview.face} src={src} alt="" loading="lazy"/></div>
}

/** An indicator, never a carousel: native page scroll advances the seven formats. */
export default function FormatRail({ active, floating = false }: { active: number; floating?: boolean }) {
  return <aside className={`${s.rail} ${floating ? s.floatingRail : ''}`} data-format-list data-active-format={FORMAT_NAMES[active]} aria-label="Formats découverts au scroll">
    <ol>{FORMAT_NAMES.map((label, index) => <li key={label} aria-current={index === active ? 'step' : undefined} data-format-index={index}>
      <FormatPreview index={index}/>
      <span>{label}</span>{index < active ? <Check size={11} aria-hidden="true"/> : index === active ? <i aria-hidden="true"/> : null}
    </li>)}</ol>
  </aside>
}
