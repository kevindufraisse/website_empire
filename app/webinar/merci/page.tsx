import WebinarMerciClient from './WebinarMerciClient'

export const metadata = {
  title: 'Place réservée - La Méthode Gourou | Empire Internet',
  description: 'Ta place pour le webinar La Méthode Gourou est confirmée. Rendez-vous le 10 juin à 19h en live.',
  robots: { index: false, follow: false },
}

export default function WebinarMerciPage() {
  return <WebinarMerciClient />
}
