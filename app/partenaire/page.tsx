import PartenaireClient from './PartenaireClient'

export const metadata = {
  title: 'Devenir partenaire Empire : le métier en vidéo | Empire Internet',
  description:
    'Accompagne des entrepreneurs sur leur personal branding pendant qu’Empire produit leurs contenus. Repère indicatif : 4 h par mois et par client. Vidéo gratuite.',
  robots: { index: true, follow: true },
}

export default function PartenairePage() {
  return <PartenaireClient />
}
