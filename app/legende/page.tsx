import type { Metadata } from 'next'
import LegendePageContent from '@/components/sections/legende/LegendePageContent'

export const metadata: Metadata = {
  title: 'Travailler en one-to-one avec Kevin | Empire Internet',
  description: '1 heure par semaine en live avec Kevin ou un Head of Content Empire. On prépare tes sujets, on publie chaque jour sur 7 réseaux et on récupère tes leads. Sur candidature.',
}

export default function LegendePage() {
  return <LegendePageContent />
}
