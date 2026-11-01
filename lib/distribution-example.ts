/** Existing case from RepurposingSection. Figures recorded 8 September 2026.
 * LinkedIn: Kevin's screenshot; Threads and Instagram: social_publications.
 * These are historical observations, not a forecast for the illustrated formats.
 */
export const DISTRIBUTION_RESULTS = [
  { network: 'linkedin', label: 'LinkedIn', views: 39546, unitFr: 'impressions', unitEn: 'impressions' },
  { network: 'threads', label: 'Threads', views: 304535, unitFr: 'vues', unitEn: 'views' },
  { network: 'instagram', label: 'Instagram', views: 69785, unitFr: 'vues', unitEn: 'views' },
] as const
export const DISTRIBUTION_TOTAL = DISTRIBUTION_RESULTS.reduce((total, item) => total + item.views, 0)
