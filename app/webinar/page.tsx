import WebinarClient from './WebinarClient'

export const metadata = {
  title: 'Les secrets des gourous du web - Webinar gratuit | Empire Internet',
  description: 'Découvrez les secrets psychologiques qu\'utilisent les gourous du web pour avoir une audience qui achète sans poser de questions. Webinar gratuit - Places limitées.',
  robots: { index: true, follow: true },
}

export default function WebinarPage() {
  return <WebinarClient />
}
