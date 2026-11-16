import type { Metadata } from 'next'
import LegendePageContent from '@/components/sections/legende/LegendePageContent'

export const metadata: Metadata = {
  title: 'Légende · Work with Kevin | Empire Internet',
  description: 'Délègue ta stratégie de contenu et ta production à Kevin et à son équipe. Découvre l’accompagnement Légende et dépose ta candidature.',
}

export default function LegendePage() {
  const id = process.env.LEGENDE_LOOM_ID?.trim()
  return <LegendePageContent loomId={id && /^[a-f0-9]{32}$/i.test(id) ? id : undefined} />
}
