import LiveClient from './LiveClient'

export const metadata = {
  title: 'Live - Webinar Empire Internet',
  description: 'Le live du webinar Empire Internet.',
  robots: { index: false, follow: false },
}

export default function LivePage() {
  return <LiveClient />
}
