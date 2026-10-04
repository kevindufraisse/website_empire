import VslClient from './VslClient'

export const metadata = {
  title: '94 % des gens ont fait +1M de vues avec cette formule | Empire Internet',
  description:
    'La formule pour faire des vues, en vidéo. Ensuite, teste Empire gratuitement pendant 7 jours ou réserve un appel.',
  robots: { index: true, follow: true },
}

export default function VslPage() {
  return <VslClient />
}
