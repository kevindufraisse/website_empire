// Les termes de la formule et leur résultat, partagés entre le teaser du
// hero, la pilule de progression et la révélation finale. `key` est la
// valeur de data-formula-term posée sur la section qui démontre le terme.
export const FORMULA_TERMS = [
  { key: 'message', fr: 'Message', en: 'Message' },
  { key: 'format', fr: 'Format', en: 'Format' },
  { key: 'diffusion', fr: 'Diffusion', en: 'Distribution' },
  { key: 'temps', fr: 'Temps', en: 'Time' },
  { key: 'cout', fr: 'Coût', en: 'Cost' },
] as const

export type FormulaTermKey = (typeof FORMULA_TERMS)[number]['key']

export const FORMULA_RESULT = {
  fr: 'Confiance + Ventes + Recommandation',
  en: 'Trust + Sales + Referrals',
} as const
