import TarifsClient from './TarifsClient'

export const metadata = {
  title: 'Tarifs Empire : formules et comparatif | Empire Internet',
  description:
    'Débutant 199 €, Intermédiaire 499 €, Expert 799 € par mois, ou à la consommation. Reels, posts LinkedIn et newsletters publiés sur 7 réseaux. Essai 7 jours gratuit.',
  robots: { index: true, follow: true },
}

export default function TarifsPage() {
  return <TarifsClient />
}
