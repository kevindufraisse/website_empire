import type { Metadata } from 'next'
import { Instrument_Serif } from 'next/font/google'
import LegendePageContent from '@/components/sections/legende/LegendePageContent'

const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' })

export const metadata: Metadata = {
  title: 'Travailler en 1-to-1 avec Kevin | Empire Internet',
  description: 'Sur candidature uniquement. Tu parles une heure par semaine avec Kevin ou un Head of Content formé par Kevin, on fait tout le reste : tes sujets, ton contenu publié chaque jour sur 7 réseaux, tes leads. Pour les entreprises à partir de 300 000 € de chiffre d’affaires.',
}

export default function LegendePage() {
  return <div className={serif.variable}><LegendePageContent /></div>
}
