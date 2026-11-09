import glass from './pricing.module.css'

/**
 * Les médias et écoles qui ont mis Kevin en avant, sur une seule rangée qui
 * défile (au lieu de la grille de 12 logos qui prenait un écran de téléphone).
 * Mêmes logos que `FeaturedInSection` (`/press`). Plusieurs sont des PNG sur
 * fond blanc : chacun est posé sur une petite tuile blanche, pour un rendu net.
 */
const OUTLETS: { name: string; file: string | null }[] = [
  { name: 'The Family', file: 'the-family.png' },
  { name: 'Scalezia', file: 'scalezia.svg' },
  { name: 'BFM Business', file: 'bfm-business.png' },
  { name: 'Entrepreneurs.com', file: 'entrepreneurs-com.png' },
  { name: 'Business Insider', file: 'business-insider.png' },
  { name: 'Waalaxy', file: null },
  { name: 'Little Big Things', file: 'little-big-things.png' },
  { name: 'Le Déclic', file: 'le-declic.png' },
  { name: 'lempire', file: 'lempire.svg' },
  { name: 'Nouvel Obs', file: 'nouvel-obs.png' },
  { name: 'BiG media', file: 'big-media.svg' },
  { name: 'ICONOCLASS', file: 'iconoclass.png' },
]

export default function PressRow({ title, className = '' }: { title: string; className?: string }) {
  const tile = (o: (typeof OUTLETS)[number], copy: boolean) => (
    <li key={`${o.name}${copy ? '-2' : ''}`} aria-hidden={copy || undefined} className="flex h-10 w-[104px] shrink-0 items-center justify-center rounded-lg bg-white px-3">
      {o.file ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/press/${o.file}`} alt={copy ? '' : o.name} loading="lazy" className="max-h-6 max-w-full object-contain" />
      ) : (
        <span className="text-[13px] font-bold tracking-tight text-neutral-900">{o.name}</span>
      )}
    </li>
  )
  return (
    <div className={className}>
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">{title}</p>
      <div className={`mt-3 ${glass.marquee} ${glass.noScrollbar}`}>
        <ul className={glass.marqueeTrack}>
          {OUTLETS.map((o) => tile(o, false))}
          {OUTLETS.map((o) => tile(o, true))}
        </ul>
      </div>
    </div>
  )
}
