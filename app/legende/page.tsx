import type { Metadata } from 'next'
import { Instrument_Serif } from 'next/font/google'
import LegendePageContent from '@/components/sections/legende/LegendePageContent'

const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' })

export const metadata: Metadata = {
  title: 'Travailler en 1-to-1 avec Kevin | Empire Internet',
  description: 'Travailler en 1-to-1 avec Kevin : il t’interviewe une heure par semaine, maximum, en live depuis ton iPhone, et une équipe fait tout le reste. 4 497 € par mois, 10 places par an, sur candidature.',
}

export default function LegendePage() {
  return <div className={serif.variable}><LegendePageContent /></div>
}
