import type { Metadata } from 'next'
import LegendePageContent from '@/components/sections/legende/LegendePageContent'

export const metadata: Metadata = {
  title: 'Légende - Ton équipe média dédiée | Empire Internet',
  description:
    'Tu diriges ton entreprise. Nous dirigeons ton image. Une équipe dédiée pour la stratégie, la production et la publication. 10 places, sur sélection.',
}

export default function LegendePage() {
  return <LegendePageContent />
}
