import { Suspense } from 'react'
import AcademyRegisteredClient from './AcademyRegisteredClient'

export const metadata = {
  title: 'Place réservée - Portes ouvertes Empire Academy',
  description: 'Ton inscription aux portes ouvertes est confirmée. En attendant, lis la présentation Content Operator (5 min).',
  robots: { index: false, follow: false },
}

export default function AcademyRegisteredPage() {
  return (
    <Suspense>
      <AcademyRegisteredClient />
    </Suspense>
  )
}
