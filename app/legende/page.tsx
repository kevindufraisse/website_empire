import type { Metadata } from 'next'
import LegendePageContent from '@/components/sections/legende/LegendePageContent'

export const metadata: Metadata = {
  title: 'Légende · Work with Kevin | Empire Internet',
  description: 'Toi, des écouteurs et un téléphone : des milliers de leads par an. Légende, l’accompagnement de Kevin, sur candidature uniquement.',
}

export default function LegendePage() {
  return <LegendePageContent />
}
