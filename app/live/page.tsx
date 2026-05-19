import LiveClient from './LiveClient'

export const metadata = {
  title: 'Live - La Méthode Gourou | Empire Internet',
  description: 'Le live de La Méthode Gourou.',
  robots: { index: false, follow: false },
}

export default function LivePage() {
  return <LiveClient />
}
