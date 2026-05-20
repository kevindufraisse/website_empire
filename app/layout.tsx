import './globals.css'
import { ReactNode } from 'react'
import { Inter, Caveat } from 'next/font/google'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AutopilotProvider } from '@/contexts/AutopilotContext'
import { GiftCountdownProvider } from '@/components/GiftCountdownBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ClientWrappers from '@/components/ClientWrappers'
import CalStickyBar from '@/components/CalStickyBar'
import CalCtaRedirect from '@/components/CalCtaRedirect'
import WebinarBanner from '@/components/WebinarBanner'

const inter = Inter({ subsets: ['latin'] })
const caveat = Caveat({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-caveat' })

export const metadata = {
  title: 'Empire Internet - The Content Machine',
  description: 'One interview per week. Content published everywhere, every day. Empire Internet.',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={caveat.variable} suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MJCWGM8D');`
        }} />
        {/* End Google Tag Manager */}
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-MJCWGM8D"
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <LanguageProvider>
          <AutopilotProvider>
            <GiftCountdownProvider>
            <div data-chrome="cal-redirect"><CalCtaRedirect /></div>
            <div data-chrome="header"><Header /></div>
            <WebinarBanner />
            <div data-chrome="popups"><ClientWrappers /></div>
            <div data-chrome="sticky-bar"><CalStickyBar /></div>
            <div suppressHydrationWarning>
              {children}
            </div>
            <div data-chrome="footer"><Footer /></div>
            </GiftCountdownProvider>
          </AutopilotProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
