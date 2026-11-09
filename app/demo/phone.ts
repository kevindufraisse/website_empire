/**
 * Indicatif + numéro tapé → numéro international sans espace.
 * "+33" et "06 12 34 56 78" donnent "+33612345678". Rend null si le numéro
 * ne tient pas debout.
 */
export function toInternational(dial: string, typed: string): string | null {
  const raw = typed.trim()
  const digits = raw.replace(/\D/g, '')
  let full: string
  if (raw.startsWith('+')) {
    // La personne a tapé son indicatif elle-même : on le garde.
    full = digits
  } else if (raw.startsWith('00')) {
    full = digits.slice(2)
  } else {
    // Le 0 devant un numéro national ne se compose pas depuis l'étranger.
    // Exception : la Côte d'Ivoire (+225), où il fait partie du numéro.
    const national = dial === '+225' ? digits : digits.replace(/^0+/, '')
    // Un numéro français fait 9 chiffres sans le 0.
    if (dial === '+33' && national.length !== 9) return null
    full = dial.replace(/\D/g, '') + national
  }
  return full.length >= 8 && full.length <= 15 ? `+${full}` : null
}
