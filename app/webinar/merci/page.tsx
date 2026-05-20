import WebinarMerciClient from './WebinarMerciClient'

export const metadata = {
  title: 'Place réservée - Webinar Empire Internet',
  description: 'Ta place pour le webinar est confirmée. Rendez-vous le 18 juin à 19h en live.',
  robots: { index: false, follow: false },
}

export default function WebinarMerciPage() {
  return <WebinarMerciClient />
}
