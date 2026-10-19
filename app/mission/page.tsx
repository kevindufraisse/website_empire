import MissionClient from './MissionClient'

export const metadata = {
  title: 'Ma mission : pourquoi j’ai créé Empire | Empire Internet',
  description:
    'Kevin Dufraisse, fondateur d’Empire Internet : l’échec scolaire, les obsessions, tout donner à 4 000 personnes, et pourquoi le format fait voir un message.',
  robots: { index: true, follow: true },
}

export default function MissionPage() {
  return <MissionClient />
}
