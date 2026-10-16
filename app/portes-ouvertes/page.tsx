import PortesOuvertesClient from './PortesOuvertesClient'

export const metadata = {
  title: 'Portes ouvertes - Kevin Dufraisse | Empire Internet',
  description: 'Regarde la vidéo, puis réserve ta place aux portes ouvertes Empire. Gratuit.',
  robots: { index: false, follow: false },
}

export default function PortesOuvertesPage() {
  return <PortesOuvertesClient />
}
