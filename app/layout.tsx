import './globals.css'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ClientWrappers from '@/components/ClientWrappers'
import CommunityStickyBar from '@/components/CommunityStickyBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Empire Internet — The Content Machine',
  description: 'Speak 15 minutes. Become omnipresent. Empire Internet.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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
        
        <script async type="text/javascript" src="https://widget.senja.io/widget/9f0da066-1eac-4c00-9d72-9c47d95d094a/platform.js"></script>
        <script async type="text/javascript" src="https://widget.senja.io/widget/a7bf7e4a-0f3b-4751-8190-849f83d16306/platform.js"></script>
      </head>
      <body className={inter.className}>
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
          <Header />
          <ClientWrappers />
          <CommunityStickyBar />
          <div>
            {children}
          </div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
