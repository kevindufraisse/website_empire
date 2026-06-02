import PaygClient from './PaygClient'

export const metadata = {
  title: 'Empire PAYG (Beta) - Le contenu à la carte, sans abonnement',
  description:
    "Beta privée : payez à la création, pas au mois. 50 places ouvertes. Rejoignez la liste d'attente.",
  robots: 'noindex, nofollow',
}

export default function PaygPage() {
  return <PaygClient />
}
