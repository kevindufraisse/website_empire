import Script from 'next/script'
import JoinUsClient from './JoinUsClient'

export const metadata = {
  title: 'Réserver un appel - Empire Internet',
  description: "15 min pour voir si notre système de contenu s'adapte à votre activité. Gratuit, sans engagement.",
}

export default function JoinUsPage() {
  return (
    <>
      <Script
        src="https://widget.senja.io/widget/a7bf7e4a-0f3b-4751-8190-849f83d16306/platform.js"
        strategy="lazyOnload"
      />
      <JoinUsClient />
    </>
  )
}
