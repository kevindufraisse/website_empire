import type { Metadata } from 'next'
import { Instrument_Serif } from 'next/font/google'
import LegendePageContent from '@/components/sections/legende/LegendePageContent'

const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' })

export const metadata: Metadata = {
  title: 'Travailler en 1-to-1 avec Kevin | Empire Internet',
  description: 'Done for you. Vous parlez une heure par semaine, nous écrivons, montons et publions votre contenu chaque jour sur 7 réseaux. Avec Kevin à 4 500 € par mois (7 places sur 10), ou avec un Head of Content de 1 000 à 3 000 € par mois. Sur candidature.',
}

export default function LegendePage() {
  return <div className={serif.variable}><LegendePageContent /></div>
}
