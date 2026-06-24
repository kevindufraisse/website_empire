import CreditsClient from './CreditsClient'

export const metadata = {
  title: 'Comment fonctionnent les crédits Empire',
  description:
    'Les crédits Empire te permettent de créer du contenu sur tous tes réseaux. Découvre comment les utiliser.',
  robots: 'noindex, nofollow',
}

export default function CreditsPage() {
  return <CreditsClient />
}
