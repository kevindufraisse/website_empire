import './globals.css'
import { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { Inter, Caveat } from 'next/font/google'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AutopilotProvider } from '@/contexts/AutopilotContext'
import { GiftCountdownProvider } from '@/components/GiftCountdownBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const ClientWrappers = dynamic(() => import('@/components/ClientWrappers'), { ssr: false })
const CalStickyBar = dynamic(() => import('@/components/CalStickyBar'), { ssr: false })
const CalCtaRedirect = dynamic(() => import('@/components/CalCtaRedirect'), { ssr: false })
const WebinarBanner = dynamic(() => import('@/components/WebinarBanner'), { ssr: false })
const PostHogInit = dynamic(() => import('@/components/PostHogInit'), { ssr: false })
const AmplitudeInit = dynamic(() => import('@/components/AmplitudeInit'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })
const caveat = Caveat({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-caveat' })

export const metadata = {
  title: 'Empire Internet - The Content Machine',
  description: 'One hour of talking per month. Content published everywhere, every day. Empire Internet.',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={caveat.variable} suppressHydrationWarning>
      <head>
        {/* Apply the saved tier before first paint, otherwise Légende flashes copilot green. */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var a=localStorage.getItem('empire-autopilot')==='true';var p=location.pathname;var t=(p==='/academy'||p==='/candidature')?'academy':(a?'autopilot':'copilot');var r=document.documentElement;r.setAttribute('data-autopilot',a?'true':'false');r.setAttribute('data-tier',t);}catch(e){}})();`
        }} />
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MJCWGM8D');`
        }} />
        {/* End Google Tag Manager */}
        {/* Crisp Chat — deferred until first interaction or 5s idle to keep initial load fast */}
        <script dangerouslySetInnerHTML={{
          __html: `window.$crisp=[];window.CRISP_WEBSITE_ID="b7a31559-ed47-41ee-9362-cdab8ee696b8";(function(){var loaded=false;var evts=["mousemove","touchstart","scroll","keydown"];function load(){if(loaded)return;loaded=true;var d=document,s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);evts.forEach(function(e){window.removeEventListener(e,load)});}evts.forEach(function(e){window.addEventListener(e,load,{passive:true})});setTimeout(load,5000);})();`
        }} />
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
        <PostHogInit />
        <AmplitudeInit />
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
