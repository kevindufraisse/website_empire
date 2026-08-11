import type { Metadata } from 'next'
import LegendePageContent from '@/components/sections/legende/LegendePageContent'

export const metadata: Metadata = {
  title: 'Légende - Votre équipe média dédiée | Empire Internet',
  description:
    'Vous dirigez votre entreprise. Nous dirigeons votre image. Une équipe dédiée pour la stratégie, la production et la publication. 10 places, sur sélection.',
}

export default function LegendePage() {
  return <LegendePageContent />
}
