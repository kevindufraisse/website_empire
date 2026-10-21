import VslClient from './VslClient'

export const metadata = {
  title: 'Dans 30 jours, tout votre marché vous connaîtra après avoir regardé cette vidéo | Empire Internet',
  description:
    'Le système des entrepreneurs à 7 chiffres par an, en vidéo. Ensuite, teste Empire gratuitement pendant 7 jours ou réserve un appel.',
  robots: { index: true, follow: true },
}

export default function VslPage() {
  return <VslClient />
}
