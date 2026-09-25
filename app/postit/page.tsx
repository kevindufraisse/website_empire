import PostitClient from './PostitClient'

export const metadata = {
  title: 'Post it like it’s hot — le live gratuit du mercredi · Empire Internet',
  description:
    'Chaque mercredi à midi, une heure en direct avec Kevin Dufraisse : ce qui fait des vues cette semaine, et comment le poster. Gratuit.',
}

export default function PostitPage() {
  return <PostitClient />
}
