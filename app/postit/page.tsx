import PostitClient from './PostitClient'

export const metadata = {
  title: 'Post it like it’s hot — le live gratuit du lundi · Empire Internet',
  description:
    'Chaque lundi à 14 h, une heure en direct avec Kevin Dufraisse : ce qui fait des vues cette semaine, et comment le poster. Gratuit.',
}

export default function PostitPage() {
  return <PostitClient />
}
