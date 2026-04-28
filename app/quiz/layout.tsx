import { ReactNode } from 'react'

export const metadata = {
  title: 'Découvre ton archétype de Creator - Empire',
  description:
    "7 questions, 90 secondes : ton archétype de Creator, ton plan d'action et l'offre Empire qui te correspond. Test gratuit.",
}

export default function QuizLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        [data-chrome] { display: none !important; }
      `}</style>
      {children}
    </>
  )
}
