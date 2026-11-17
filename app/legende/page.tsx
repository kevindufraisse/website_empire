import type { Metadata } from 'next'
import { Instrument_Serif } from 'next/font/google'
import LegendePageContent from '@/components/sections/legende/LegendePageContent'

const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' })

export const metadata: Metadata = {
  title: 'Travailler en 1-to-1 avec Kevin | Empire Internet',
  description: 'Sur candidature uniquement. De 1 000 à 4 000 € par mois avec un Head of Content, 4 000 € et plus avec Kevin et ses experts. On t’interviewe une heure par semaine, maximum, en live depuis ton iPhone. Une équipe fait tout le reste : tes sujets, ton contenu publié chaque jour sur 7 réseaux, tes leads. Pour les entreprises à partir de 300 000 € de chiffre d’affaires.',
}

export default function LegendePage() {
  return <div className={serif.variable}><LegendePageContent /></div>
}
