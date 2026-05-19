import WebinarClient from './WebinarClient'

export const metadata = {
  title: 'La Méthode Gourou - Webinar gratuit | Empire Internet',
  description: 'Comment les personnalités les plus visibles construisent une audience qui les adore, les déteste, et achète tout ce qu\'elles vendent. Webinar gratuit - Places limitées.',
  robots: { index: true, follow: true },
}

export default function WebinarPage() {
  return <WebinarClient />
}
