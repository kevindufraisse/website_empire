import './globals.css'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ClientWrappers from '@/components/ClientWrappers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Empire Internet — The Content Machine',
  description: 'Speak 15 minutes. Become omnipresent. Empire Internet.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <Header />
          <ClientWrappers />
          <div className="pt-16">
            {children}
          </div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
