import './globals.css'
import { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AutopilotProvider } from '@/contexts/AutopilotContext'
import { GiftCountdownProvider } from '@/components/GiftCountdownContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import IdleMount from '@/components/IdleMount'
import MetaAttribution from '@/components/MetaAttribution'
import MarketingConsent from '@/components/MarketingConsent'

const ClientWrappers = dynamic(() => import('@/components/ClientWrappers'), { ssr: false })
const CalStickyBar = dynamic(() => import('@/components/CalStickyBar'), { ssr: false })
const CalCtaRedirect = dynamic(() => import('@/components/CalCtaRedirect'), { ssr: false })
const PostHogInit = dynamic(() => import('@/components/PostHogInit'), { ssr: false })
const AmplitudeInit = dynamic(() => import('@/components/AmplitudeInit'), { ssr: false })

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
// The Google CSS response breaks Next 14's font URL parser; keep the same font locally.
const caveat = localFont({ src: '../public/fonts/caveat/Caveat-wght.ttf', weight: '400 700', variable: '--font-caveat', display: 'swap' })

export const metadata = {
  title: 'Empire Internet - The Content Machine',
  description: 'One hour of talking per week. Content published everywhere, every day. Empire Internet.',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable}`} suppressHydrationWarning>
      <head>
        {/* Tier from URL before first paint (no localStorage - it caused gold flashes on Empire). */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var p=location.pathname;var q=location.search||'';var legende=p==='/legende'||((p==='/join-us'||p==='/decouverte')&&q.indexOf('offer=legende')!==-1);var t=p==='/candidature'?'academy':(legende?'autopilot':'copilot');var r=document.documentElement;r.setAttribute('data-autopilot',legende?'true':'false');r.setAttribute('data-tier',t);try{localStorage.removeItem('empire-autopilot')}catch(e){}}catch(e){}})();`
        }} />

      </head>
      <body className={inter.className} style={{ fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif' }} suppressHydrationWarning>

        <LanguageProvider>
          <AutopilotProvider>
            <GiftCountdownProvider>
            <MarketingConsent />
            <MetaAttribution />
            <div data-chrome="cal-redirect"><CalCtaRedirect /></div>
            <div data-chrome="header"><Header /></div>
            <IdleMount>
              <PostHogInit />
              <AmplitudeInit />
              <div data-chrome="popups"><ClientWrappers /></div>
              <div data-chrome="sticky-bar"><CalStickyBar /></div>
            </IdleMount>
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

