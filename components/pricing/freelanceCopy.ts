import { FREELANCE_MODE, type FreelanceMode } from '@/lib/plans'

/**
 * Les mots autour du chiffre freelance, selon le mode de `lib/plans.ts` :
 * « ≈ 8 300 €/mois » au prix moyen, « plus de 5 600 €/mois » au bas des
 * fourchettes. Mêmes mots dans les cartes et le reçu.
 */

export function freelanceAmount(n: number, fr: boolean, mode: FreelanceMode = FREELANCE_MODE): string {
  const num = n.toLocaleString(fr ? 'fr-FR' : 'en-US')
  if (mode === 'moyen') return fr ? `≈ ${num} €/mois` : `≈ €${num}/mo`
  return fr ? `plus de ${num} €/mois` : `over €${num}/mo`
}

/** Début de la ligne sous le prix, dans les cartes. */
export function freelanceCardLead(fr: boolean, mode: FreelanceMode = FREELANCE_MODE): string {
  if (mode === 'moyen') return fr ? 'Le même travail au prix moyen d’un freelance : ' : 'The same work at an average freelancer’s price: '
  return fr ? 'Le même travail chez des freelances : ' : 'The same work from freelancers: '
}

/** L'étiquette du total, dans le reçu. */
export function freelanceTotalLabel(fr: boolean, mode: FreelanceMode = FREELANCE_MODE): string {
  if (mode === 'moyen') return fr ? 'Au prix moyen d’un freelance' : 'At an average freelancer’s price'
  return fr ? 'Chez des freelances' : 'With freelancers'
}
