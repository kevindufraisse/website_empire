import VslClient from './VslClient'

export const metadata = {
  title: 'Workshop gratuit : la formule pour faire des vues et des clients en automatique | Empire Internet',
  description:
    'La formule pour faire des vues et des clients en automatique, expliquée en 1 h 26. Ensuite, teste Empire gratuitement (7 jours, 500 crédits) ou réserve un appel.',
  robots: { index: true, follow: true },
}

export default function VslPage() {
  return <VslClient />
}
