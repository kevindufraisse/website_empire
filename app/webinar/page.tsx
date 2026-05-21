import WebinarClient from './WebinarClient'

export const metadata = {
  title: 'Créer une armée de fans qui achètent TOUS vos produits - Webinar gratuit | Empire Internet',
  description: 'On décortique les méthodes des plus grandes personnalités du web et comment les appliquer à ton business. Webinar gratuit le 18 juin à 19h.',
  robots: { index: true, follow: true },
}

export default function WebinarPage() {
  return <WebinarClient />
}
