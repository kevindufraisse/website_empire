'use client'

/**
 * FeaturedInSection — bandeau "Vu dans / Featured in" avec les logos des
 * médias/entreprises qui ont relayé Kevin. Port depuis
 * `empire-tracking/src/components/FeaturedInSection.tsx` : même liste, même
 * mapping slug → extension, mêmes tuiles blanches — pour qu'un prospect qui
 * enchaîne site vitrine → /join/empire voie exactement les mêmes logos et
 * ne se dise pas "c'est deux boîtes différentes".
 *
 * Waalaxy reste en fallback texte tant qu'on n'a pas récupéré son PNG.
 */

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

type Outlet = {
  slug: string
  name: string
  /**
   * Extension du fichier dans `/public/press/`. On stocke l'extension côté
   * outlet plutôt que d'essayer plusieurs URLs — un 404 dans la console
   * pollue Network et donne l'impression que la page est cassée.
   * `null` = pas d'asset encore, on affiche le nom en texte.
   */
  ext: 'png' | 'svg' | null
}

// Ordre repris du screenshot fourni par Kevin : les plus reconnus d'abord.
const OUTLETS: Outlet[] = [
  { slug: 'the-family', name: 'The Family', ext: 'png' },
  { slug: 'scalezia', name: 'Scalezia', ext: 'svg' },
  { slug: 'bfm-business', name: 'BFM Business', ext: 'png' },
  { slug: 'entrepreneurs-com', name: 'Entrepreneurs.com', ext: 'png' },
  { slug: 'business-insider', name: 'Business Insider', ext: 'png' },
  { slug: 'waalaxy', name: 'Waalaxy', ext: null },
  { slug: 'little-big-things', name: 'Little Big Things', ext: 'png' },
  { slug: 'le-declic', name: 'Le Déclic', ext: 'png' },
  { slug: 'lempire', name: 'lempire', ext: 'svg' },
  { slug: 'nouvel-obs', name: 'Nouvel Obs', ext: 'png' },
  { slug: 'big-media', name: 'BiG media', ext: 'svg' },
  { slug: 'iconoclass', name: 'ICONOCLASS', ext: 'png' },
]

function LogoTile({ outlet }: { outlet: Outlet }) {
  const [imgFailed, setImgFailed] = useState(false)
  const hasImage = outlet.ext !== null && !imgFailed
  const content = hasImage ? (
    // `max-w-full` (pas `max-w-[110px]`) sinon un logo panoramique comme
    // Entrepreneurs.com (1041×168) déborde de la largeur intérieure de la
    // tuile sur mobile et se fait rogner à droite.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/press/${outlet.slug}.${outlet.ext}`}
      alt={outlet.name}
      loading="lazy"
      onError={() => setImgFailed(true)}
      className="max-h-8 max-w-full object-contain opacity-90 transition-all duration-200 group-hover:opacity-100"
    />
  ) : (
    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
      {outlet.name}
    </span>
  )

  // Tuile blanche : les logos fournis sont majoritairement noirs sur fond
  // transparent (The Family, Entrepreneurs.com, Nouvel Obs, lempire...) et
  // deviennent invisibles sur le fond noir du site vitrine. Un fond clair
  // règle le problème sans écraser les logos déjà colorés.
  return (
    <div className="group flex h-16 w-full items-center justify-center rounded-md bg-white px-3 py-2 shadow-sm ring-1 ring-black/5">
      {content}
    </div>
  )
}

type Props = {
  /** Override du titre. Par défaut i18n : "Vu dans" / "Featured in". */
  title?: string
  className?: string
}

export default function FeaturedInSection({ title, className = '' }: Props) {
  const { lang } = useLanguage()
  const resolvedTitle = title ?? (lang === 'fr' ? 'Vu dans' : 'Featured in')

  return (
    <section aria-label={resolvedTitle} className={`w-full ${className}`}>
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
        {resolvedTitle}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {OUTLETS.map((outlet) => (
          <LogoTile key={outlet.slug} outlet={outlet} />
        ))}
      </div>
    </section>
  )
}
