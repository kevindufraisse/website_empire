import { Fragment, type ReactNode } from 'react'

/**
 * Typographie française de la page tarifs : espace insécable avant « ? : ; ! % € »
 * et dans « 4 h », « 15 min », « 20 s », « 1 500 », « n° 1 », pour qu'un prix ou une question ne se
 * coupe jamais en fin de ligne sur téléphone.
 */
export function nbsp(text: string): string {
  return text
    .replace(/ (?=[?:;!%€»])/g, ' ')
    .replace(/« /g, '« ')
    .replace(/n° /g, 'n° ')
    .replace(/(\d) (?=\d{3}\b)/g, '$1 ')
    .replace(/(\d) (?=(?:h|min|s|crédits|jours|mois|reels|posts|newsletters|réseaux|vidéos|millions|étapes|places)\b)/g, '$1 ')
}

/** « 8ᵉ » rendu avec un vrai exposant (la police n'a pas toujours le caractère). */
export function rich(text: string): ReactNode {
  const parts = text.split('ᵉ')
  if (parts.length === 1) return text
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && <sup className="text-[0.65em] leading-none">e</sup>}
    </Fragment>
  ))
}
