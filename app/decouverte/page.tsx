import Script from 'next/script'
import DecouverteClient from './DecouverteClient'

export const metadata = {
  title: 'Découvrir Empire Internet - Appel Stratégique Gratuit',
  description: "15 min pour voir si notre système de contenu s'adapte à vous. Gratuit, sans engagement.",
  robots: 'noindex, nofollow',
}

export default function DecouvertePage() {
  return (
    <>
      <Script
        src="https://widget.senja.io/widget/a7bf7e4a-0f3b-4751-8190-849f83d16306/platform.js"
        strategy="lazyOnload"
      />
      <DecouverteClient />
    </>
  )
}
